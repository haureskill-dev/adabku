import { Peer } from 'peerjs'
import { player } from '../game/playerState'
import { useGameStore } from '../store/gameStore'

/**
 * Konfigurasi PeerJS dengan Google STUN Server Publik.
 * Memastikan WebRTC P2P dapat menembus NAT / router Wi-Fi lokal antara HP dan Laptop.
 */
export const PEER_CONFIG = {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
}

const CLEANUP_INTERVAL = 1000
const STALE_TIMEOUT = 5000

class MultiplayerService {
  constructor() {
    this.myPeerId = 'adabku-p-' + Math.random().toString(36).substring(2, 8)
    this.roomCode = 'ADABKU123'
    this.isHost = false
    this.status = 'connecting' // 'connecting' | 'waiting' | 'connected'
    this.broadcastChannel = null
    this.peer = null
    this.peers = new Map() // peerId -> DataConnection
    this.hostConn = null // DataConnection ke Host (jika mode Client)
    this.remotePlayers = new Map() // peerId -> player object
    this.subscribers = new Set()
    this.statusSubscribers = new Set()
    this.isRunning = false
    this.cleanupTimer = null
    this.reconnectTimer = null
    this.unloadListenerAttached = false
  }

  init(rawRoomCode = 'ADABKU123') {
    const cleanRoom = (rawRoomCode || 'ADABKU123')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') || 'ADABKU123'

    if (this.isRunning && this.roomCode === cleanRoom) return
    if (this.isRunning) {
      this.destroy()
    }

    this.roomCode = cleanRoom
    this.isRunning = true
    this.updateStatus('connecting')

    if (typeof window !== 'undefined' && !this.unloadListenerAttached) {
      window.addEventListener('beforeunload', () => this.destroy())
      this.unloadListenerAttached = true
    }

    // 1. BroadcastChannel untuk multi-tab / multi-jendela instan pada satu perangkat
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(`adabku_room_${this.roomCode}`)
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingData(event.data, false)
        }
      } catch (err) {
        console.warn('BroadcastChannel error:', err)
      }
    }

    // 2. PeerJS WebRTC P2P Room (Laptop & HP lintas perangkat)
    if (typeof window !== 'undefined') {
      this.setupPeerAsHost()
    }

    // Timer pembersihan pemain yang stale / disconnect
    this.cleanupTimer = setInterval(() => {
      const now = Date.now()
      let changed = false
      for (const [id, playerObj] of this.remotePlayers.entries()) {
        if (now - playerObj.lastSeen > STALE_TIMEOUT) {
          this.remotePlayers.delete(id)
          changed = true
        }
      }
      if (changed) {
        this.notify()
        this.evaluateStatus()
      }
    }, CLEANUP_INTERVAL)
  }

  /** Tahap 1: Coba mendaftar sebagai Host Room dengan ID adabku-room-[KODE] */
  setupPeerAsHost() {
    if (!this.isRunning) return
    const hostId = `adabku-room-${this.roomCode}`

    try {
      const peer = new Peer(hostId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      })

      peer.on('open', (id) => {
        this.peer = peer
        this.isHost = true
        this.myPeerId = id
        console.info(`[Adabku Multiplayer] Berhasil menjadi Host Room: ${this.roomCode} (ID: ${id})`)
        this.evaluateStatus()

        // Dengarkan koneksi dari client (HP / laptop lain)
        peer.on('connection', (conn) => {
          conn.on('open', () => {
            this.attachConnection(conn)
            try {
              conn.send({
                type: 'handshake',
                senderId: this.myPeerId,
                role: 'host',
                room: this.roomCode,
              })
              this.sendCurrentStateTo(conn)
            } catch {}
            this.evaluateStatus()
          })
        })
      })

      peer.on('error', (err) => {
        // Jika ID Host sudah terdaftar (artinya perangkat lain sudah menjadi Host di room ini)
        if (err?.type === 'unavailable-id') {
          console.info(`[Adabku Multiplayer] Room ${this.roomCode} sudah memiliki Host. Menghubungkan sebagai Klien...`)
          try {
            peer.destroy()
          } catch {}
          this.setupPeerAsClient()
        } else {
          console.info('[Adabku Multiplayer] Broker info:', err?.type || err?.message)
        }
      })
    } catch {
      this.setupPeerAsClient()
    }
  }

  /** Tahap 2: Mendaftar sebagai Klien dengan Google STUN Server dan menghubungi Host */
  setupPeerAsClient() {
    if (!this.isRunning) return

    try {
      // Konfigurasi PeerJS menggunakan Google STUN Server sesuai spesifikasi
      const peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      })

      peer.on('open', (id) => {
        this.peer = peer
        this.isHost = false
        this.myPeerId = id
        console.info(`[Adabku Multiplayer] Terdaftar sebagai Klien (ID: ${id}). Menghubungi Host room ${this.roomCode}...`)
        this.updateStatus('connecting')

        this.connectToHost()

        peer.on('connection', (conn) => {
          conn.on('open', () => {
            this.attachConnection(conn)
            this.sendCurrentStateTo(conn)
            this.evaluateStatus()
          })
        })
      })

      peer.on('error', (err) => {
        console.info('[Adabku Multiplayer] Client info:', err?.type || err?.message)
      })
    } catch (err) {
      console.warn('[Adabku Multiplayer] Client create error:', err)
    }
  }

  connectToHost() {
    if (!this.peer || this.peer.destroyed || this.isHost) return
    const hostId = `adabku-room-${this.roomCode}`

    try {
      const conn = this.peer.connect(hostId)
      this.hostConn = conn

      const timeoutId = setTimeout(() => {
        if (!this.peers.has(hostId) && this.isRunning && !this.isHost) {
          console.info(`[Adabku Multiplayer] Host room ${this.roomCode} tidak merespons, mencoba inisialisasi sebagai Host...`)
          try { conn.close() } catch {}
          try { this.peer.destroy() } catch {}
          this.setupPeerAsHost()
        }
      }, 3500)

      conn.on('open', () => {
        clearTimeout(timeoutId)
        console.info(`[Adabku Multiplayer] Terhubung dengan Host Room ${this.roomCode}!`)
        this.attachConnection(conn)
        this.evaluateStatus()

        try {
          conn.send({
            type: 'join',
            senderId: this.myPeerId,
            room: this.roomCode,
          })
          this.sendCurrentStateTo(conn)
        } catch {}
      })

      conn.on('close', () => {
        clearTimeout(timeoutId)
        console.info('[Adabku Multiplayer] Koneksi ke Host terputus.')
        this.hostConn = null
        this.peers.delete(hostId)
        this.updateStatus('connecting')

        // Jika Host disconnect, coba ambil alih peran sebagai Host setelah 2 detik
        if (this.isRunning && !this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            if (this.isRunning) {
              this.setupPeerAsHost()
            }
          }, 2000)
        }
      })

      conn.on('error', () => {
        clearTimeout(timeoutId)
        this.peers.delete(hostId)
      })
    } catch {}
  }

  sendCurrentStateTo(conn) {
    if (!conn || !conn.open) return
    const store = useGameStore.getState()
    const isGirl =
      String(store.playerGender).toLowerCase().includes('girl') ||
      String(store.playerGender).toLowerCase().includes('perempuan')

    const packet = {
      type: 'update_pos',
      id: this.myPeerId,
      senderId: this.myPeerId,
      name: store.playerName || (isGirl ? 'Aisyah' : 'Ahmad'),
      gender: isGirl ? 'perempuan' : 'laki-laki',
      position: [player?.x ?? 0, player?.y ?? 0, player?.z ?? 0],
      rotation: player?.yaw ?? 0,
      yaw: player?.yaw ?? 0,
      x: player?.x ?? 0,
      y: player?.y ?? 0,
      z: player?.z ?? 0,
      level: store.currentLevel || 1,
      crouchT: player?.crouchT ?? 0,
      isJumping: Boolean((player?.y ?? 0) > 0.35),
      time: Date.now(),
    }
    try {
      conn.send(packet)
    } catch {}
  }

  attachConnection(conn) {
    conn.on('data', (data) => {
      this.handleIncomingData(data, true)
    })

    conn.on('close', () => {
      this.peers.delete(conn.peer)
      this.evaluateStatus()
    })

    conn.on('error', () => {
      this.peers.delete(conn.peer)
      this.evaluateStatus()
    })

    this.peers.set(conn.peer, conn)
    this.evaluateStatus()
  }

  handleIncomingData(data, fromPeer = false) {
    if (!data || typeof data !== 'object') return
    const senderId = data.id || data.senderId
    if (!senderId || senderId === this.myPeerId) return // Abaikan pesan dari diri sendiri

    if (data.type === 'join' || data.type === 'handshake') {
      if (fromPeer && senderId && this.peers.has(senderId)) {
        const conn = this.peers.get(senderId)
        this.sendCurrentStateTo(conn)
      }
      return
    }

    if (data.type === 'update_pos' || data.position) {
      // Normalisasi posisi dan rotasi
      const pos = Array.isArray(data.position)
        ? data.position
        : [data.x ?? 0, data.y ?? 0, data.z ?? 0]
      const yaw = data.rotation ?? data.yaw ?? 0

      // Normalisasi gender ('laki-laki' / 'perempuan' / 'boy' / 'girl')
      const gStr = String(data.gender || 'boy').toLowerCase()
      const isGirl = gStr.includes('perempuan') || gStr.includes('girl')
      const normalizedGender = isGirl ? 'perempuan' : 'laki-laki'

      this.remotePlayers.set(senderId, {
        id: senderId,
        name: data.name || 'Teman Adab',
        gender: normalizedGender,
        color: normalizedGender === 'perempuan' ? '#f43f5e' : '#0284c7',
        x: pos[0] ?? 0,
        y: pos[1] ?? 0,
        z: pos[2] ?? 0,
        yaw: yaw,
        level: data.level || 1,
        crouchT: data.crouchT || 0,
        isJumping: Boolean(data.isJumping),
        lastSeen: Date.now(),
      })

      this.notify()
      this.evaluateStatus()

      // Jika sebagai Host, teruskan paket ke klien lain di room yang sama (mesh relay)
      if (this.isHost && fromPeer) {
        for (const [peerId, conn] of this.peers.entries()) {
          if (peerId !== senderId && conn && conn.open) {
            try {
              conn.send({ ...data, _via: this.myPeerId })
            } catch {}
          }
        }
      }
    } else if (data.type === 'player_leave') {
      if (this.remotePlayers.has(senderId)) {
        this.remotePlayers.delete(senderId)
        this.notify()
        this.evaluateStatus()
      }
    }
  }

  /**
   * Broadcast interval data posisi 3D (15-20 FPS):
   * Mengirim data posisi, rotasi, nama, dan jenis kapsul ke seluruh peer yang terhubung.
   */
  broadcast(myState) {
    if (!this.isRunning) return

    const x = myState.position?.[0] ?? myState.x ?? 0
    const y = myState.position?.[1] ?? myState.y ?? 0
    const z = myState.position?.[2] ?? myState.z ?? 0
    const yaw = myState.rotation ?? myState.yaw ?? 0

    const gStr = String(myState.gender || 'boy').toLowerCase()
    const isGirl = gStr.includes('perempuan') || gStr.includes('girl')
    const gender = isGirl ? 'perempuan' : 'laki-laki'

    const packet = {
      type: 'update_pos',
      id: this.myPeerId,
      senderId: this.myPeerId,
      name: myState.name || (isGirl ? 'Aisyah' : 'Ahmad'),
      gender: gender,
      position: [x, y, z],
      rotation: yaw,
      x: x,
      y: y,
      z: z,
      yaw: yaw,
      level: myState.level ?? 1,
      crouchT: myState.crouchT ?? 0,
      isJumping: Boolean(myState.isJumping),
      time: Date.now(),
    }

    // 1. Kirim via BroadcastChannel (multi-tab lokal)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(packet)
      } catch {}
    }

    // 2. Kirim ke seluruh peer WebRTC yang terhubung
    for (const [, conn] of this.peers.entries()) {
      if (conn && conn.open) {
        try {
          conn.send(packet)
        } catch {}
      }
    }
  }

  evaluateStatus() {
    let newStatus = 'connecting'
    const hasPeers = this.remotePlayers.size > 0 || this.peers.size > 0

    if (hasPeers) {
      newStatus = 'connected'
    } else if (this.isHost) {
      newStatus = 'waiting'
    } else {
      newStatus = 'connecting'
    }

    this.updateStatus(newStatus)
  }

  updateStatus(status) {
    if (this.status === status) return
    this.status = status
    useGameStore.getState().setConnectionStatus(status)

    for (const cb of this.statusSubscribers) {
      try {
        cb(status)
      } catch {}
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    callback(Array.from(this.remotePlayers.values()))
    return () => this.subscribers.delete(callback)
  }

  subscribeStatus(callback) {
    this.statusSubscribers.add(callback)
    callback(this.status)
    return () => this.statusSubscribers.delete(callback)
  }

  notify() {
    const list = Array.from(this.remotePlayers.values())
    for (const cb of this.subscribers) {
      try {
        cb(list)
      } catch {}
    }
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'player_leave', senderId: this.myPeerId, id: this.myPeerId })
        this.broadcastChannel.close()
      } catch {}
      this.broadcastChannel = null
    }

    for (const [, conn] of this.peers.entries()) {
      try {
        conn.close()
      } catch {}
    }
    this.peers.clear()
    this.hostConn = null

    if (this.peer) {
      try {
        this.peer.destroy()
      } catch {}
      this.peer = null
    }

    this.remotePlayers.clear()
    this.subscribers.clear()
    this.statusSubscribers.clear()
    this.isRunning = false
    this.isHost = false
    this.updateStatus('connecting')
  }
}

export const multiplayerService = new MultiplayerService()
