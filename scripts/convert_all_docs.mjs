import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const docsDir = path.join(rootDir, 'docs')

// List of docs to convert
const docsToConvert = [
  {
    input: 'PRD.md',
    outputPdf: 'PRD.pdf',
    title: 'PRODUCT REQUIREMENTS DOCUMENT (PRD)',
    subtitle: 'Adabku - Media Belajar Adab & Karakter Anak SD Berbasis 3D Web Interaktif',
  },
  {
    input: 'TECH_SPEC.md',
    outputPdf: 'TECH_SPEC.pdf',
    title: 'TECHNICAL SPECIFICATIONS (TECH_SPEC)',
    subtitle: 'Arsitektur Teknis, Sistem 3D, Multiplayer P2P WebRTC, dan Optimasi Performa',
  },
  {
    input: 'DESIGN_SYSTEM.md',
    outputPdf: 'DESIGN_SYSTEM.pdf',
    title: 'DESIGN SYSTEM & SHARI\'AH VISUAL GUIDE',
    subtitle: 'Pedoman Desain Antarmuka Ceria, Karakter Kapsul Faceless SD, dan Aturan Audio Syariat',
  },
  {
    input: 'USER_STORY.md',
    outputPdf: 'USER_STORY.pdf',
    title: 'USER STORY & REQUIREMENT MAPPING',
    subtitle: 'Persona Pengguna, Alur Pembelajaran Siswa SD, dan Kriteria Keberhasilan Fitur',
  },
  {
    input: 'JURNAL_PROMPT.md',
    outputPdf: 'JURNAL_PROMPT.pdf',
    title: 'JURNAL PROMPT PENGEMBANGAN GAME ADABKU',
    subtitle: 'Dokumentasi 5 Prompt Terkurasi Utama Pengembangan Media Belajar 3D Berbasis Vibe Coding',
  },
  {
    input: 'PROMPT_JOURNAL.md',
    outputPdf: 'PROMPT_JOURNAL.pdf',
    title: 'PROMPT JOURNAL - ADABKU 3D GAME',
    subtitle: 'Curated 5 Main Prompts & Raw Prompts Documentation for AI Agentic Development',
  },
]

function convertMarkdownToPdf(docConfig) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(docsDir, docConfig.input)
    const outputPath = path.join(docsDir, docConfig.outputPdf)

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ File not found: ${inputPath}`)
      return resolve()
    }

    console.log(`\n📄 Converting: ${docConfig.input} -> ${docConfig.outputPdf}`)
    const rawContent = fs.readFileSync(inputPath, 'utf-8')
    const lines = rawContent.split(/\r?\n/)

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, bottom: 48, left: 48, right: 48 },
      bufferPages: true,
    })

    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

    // --- Header Cover / Banner ---
    doc
      .rect(doc.page.margins.left, doc.y, contentWidth, 5)
      .fill('#047857') // Emerald top line
    doc.moveDown(0.4)

    doc
      .fontSize(18)
      .fillColor('#065f46')
      .font('Helvetica-Bold')
      .text(docConfig.title, { align: 'center' })
      .moveDown(0.2)

    doc
      .fontSize(10)
      .fillColor('#475569')
      .font('Helvetica-Oblique')
      .text(docConfig.subtitle, { align: 'center' })
      .moveDown(0.8)

    doc
      .strokeColor('#cbd5e1')
      .lineWidth(1)
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke()
      .moveDown(0.8)

    let inCodeBlock = false
    let codeBuffer = []
    let quoteBuffer = []

    const flushQuote = () => {
      if (quoteBuffer.length > 0) {
        const text = quoteBuffer.join(' ')
        const textHeight = doc.heightOfString(text, { width: contentWidth - 30 })

        // Check if fits on page
        if (doc.y + textHeight + 20 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage()
        }

        const startY = doc.y
        doc
          .rect(doc.page.margins.left, startY, 4, textHeight + 8)
          .fill('#10b981')

        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor('#1e293b')
          .text(text, doc.page.margins.left + 14, startY + 2, {
            width: contentWidth - 24,
            align: 'justify',
            lineGap: 2,
          })
          .moveDown(0.6)

        quoteBuffer = []
      }
    }

    const flushCode = () => {
      if (codeBuffer.length > 0) {
        const codeText = codeBuffer.join('\n')
        const boxHeight = doc.heightOfString(codeText, { width: contentWidth - 20 }) + 12

        if (doc.y + boxHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage()
        }

        const boxY = doc.y
        doc
          .rect(doc.page.margins.left, boxY, contentWidth, boxHeight)
          .fill('#f1f5f9')

        doc
          .fontSize(7.5)
          .font('Courier')
          .fillColor('#0f172a')
          .text(codeText, doc.page.margins.left + 10, boxY + 6, {
            width: contentWidth - 20,
            lineGap: 1.5,
          })
          .moveDown(0.6)

        codeBuffer = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Handle Code Blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false
          flushCode()
        } else {
          flushQuote()
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        continue
      }

      // Empty Line
      if (!trimmed) {
        flushQuote()
        continue
      }

      // Markdown H1 (Skip if it repeats title)
      if (trimmed.startsWith('# ')) {
        continue
      }

      // Markdown H2
      if (trimmed.startsWith('## ')) {
        flushQuote()
        const headingText = trimmed.replace('## ', '')
        if (doc.y + 40 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage()
        }
        doc.moveDown(0.6)
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .fillColor('#047857')
          .text(headingText)
          .moveDown(0.3)
        continue
      }

      // Markdown H3
      if (trimmed.startsWith('### ')) {
        flushQuote()
        const headingText = trimmed.replace('### ', '')
        if (doc.y + 30 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage()
        }
        doc.moveDown(0.4)
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#0284c7')
          .text(headingText)
          .moveDown(0.25)
        continue
      }

      // Markdown H4
      if (trimmed.startsWith('#### ')) {
        flushQuote()
        const headingText = trimmed.replace('#### ', '')
        if (doc.y + 25 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage()
        }
        doc.moveDown(0.3)
        doc
          .fontSize(9.5)
          .font('Helvetica-Bold')
          .fillColor('#334155')
          .text(headingText)
          .moveDown(0.2)
        continue
      }

      // Blockquotes
      if (trimmed.startsWith('>')) {
        const clean = trimmed
          .replace(/^>\s*\*?/, '')
          .replace(/\*?$/, '')
          .replace(/^"/, '')
          .replace(/"$/, '')
        quoteBuffer.push(clean)
        continue
      }

      // Horizontal Divider
      if (trimmed === '---') {
        flushQuote()
        doc.moveDown(0.3)
        doc
          .strokeColor('#e2e8f0')
          .lineWidth(0.8)
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke()
        doc.moveDown(0.4)
        continue
      }

      // Bullet List
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        flushQuote()
        const rawItem = trimmed.replace(/^[*-]\s+/, '')
        const match = rawItem.match(/^\*\*(.*?)\*\*(.*)$/)
        if (match) {
          doc
            .fontSize(9)
            .font('Helvetica-Bold')
            .fillColor('#0f172a')
            .text(`• ${match[1]}: `, { continued: true, indent: 8 })
            .font('Helvetica')
            .fillColor('#334155')
            .text(match[2].trim(), { align: 'justify', lineGap: 1.5 })
            .moveDown(0.15)
        } else {
          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#334155')
            .text(`• ${rawItem}`, { indent: 8, align: 'justify', lineGap: 1.5 })
            .moveDown(0.15)
        }
        continue
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        flushQuote()
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#334155')
          .text(trimmed, { indent: 8, align: 'justify', lineGap: 1.5 })
          .moveDown(0.15)
        continue
      }

      // Markdown Tables
      if (trimmed.startsWith('|')) {
        if (trimmed.includes('---')) continue
        flushQuote()
        const parts = trimmed.split('|').map((s) => s.trim()).filter(Boolean)
        doc
          .fontSize(8)
          .font('Courier')
          .fillColor('#475569')
          .text(parts.join('  │  '), { indent: 4 })
          .moveDown(0.1)
        continue
      }

      // Normal Paragraph
      flushQuote()
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#334155')
        .text(trimmed, { align: 'justify', lineGap: 2 })
        .moveDown(0.25)
    }

    flushQuote()
    if (inCodeBlock) flushCode()

    // Add Page Numbers in Footer
    const range = doc.bufferedPageRange()
    for (let p = range.start; p < range.start + range.count; p++) {
      doc.switchToPage(p)
      doc
        .fontSize(7.5)
        .font('Helvetica')
        .fillColor('#94a3b8')
        .text(
          `Adabku - Media Belajar Adab 3D | Halaman ${p + 1} dari ${range.count}`,
          doc.page.margins.left,
          doc.page.height - 30,
          { align: 'center', width: contentWidth }
        )
    }

    doc.end()
    stream.on('finish', () => {
      const stats = fs.statSync(outputPath)
      console.log(`✅ Sukses: ${docConfig.outputPdf} (${stats.size} bytes, ${range.count} halaman)`)
      resolve()
    })
    stream.on('error', reject)
  })
}

async function main() {
  console.log('🚀 Memulai Konversi Seluruh Dokumen Markdown ke PDF...')
  for (const docConfig of docsToConvert) {
    try {
      await convertMarkdownToPdf(docConfig)
    } catch (err) {
      console.error(`❌ Gagal konversi ${docConfig.input}:`, err)
    }
  }
  console.log('\n🎉 Seluruh file PDF dokumentasi berhasil dibuat di folder docs/!')
}

main()
