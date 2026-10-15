import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx'
import PDFDocument from 'pdfkit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const mdPath = path.join(rootDir, 'docs', 'JURNAL_PROMPT.md')
const docxPath = path.join(rootDir, 'docs', 'JURNAL_PROMPT.docx')
const pdfPath = path.join(rootDir, 'docs', 'JURNAL_PROMPT.pdf')

console.log('Reading:', mdPath)
const mdContent = fs.readFileSync(mdPath, 'utf-8')
const lines = mdContent.split(/\r?\n/)

// ==========================================
// 1. GENERATE DOCX USING 'docx'
// ==========================================
async function generateDocx() {
  const children = []

  // Title & Header
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'JURNAL PROMPT PENGEMBANGAN GAME ADABKU',
          bold: true,
          size: 36,
          color: '047857', // Emerald 700
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'Dokumentasi 5 Prompt Terkurasi Utama Pengembangan Media Belajar 3D Berbasis Vibe Coding',
          italics: true,
          size: 24,
          color: '475569',
          font: 'Arial',
        }),
      ],
    })
  )

  let currentBlockQuote = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      if (currentBlockQuote.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: currentBlockQuote.join(' '),
                italics: true,
                color: '0f172a',
                size: 22,
                font: 'Arial',
              }),
            ],
          })
        )
        currentBlockQuote = []
      }
      continue
    }

    if (line.startsWith('# ')) {
      // Skip top title as already added
      continue
    } else if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 140 },
          children: [
            new TextRun({
              text: line.replace('## ', ''),
              bold: true,
              size: 28,
              color: '065f46',
              font: 'Arial',
            }),
          ],
        })
      )
    } else if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: line.replace('### ', ''),
              bold: true,
              size: 24,
              color: '0369a1',
              font: 'Arial',
            }),
          ],
        })
      )
    } else if (line.startsWith('#### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: line.replace('#### ', ''),
              bold: true,
              size: 22,
              color: '1e293b',
              font: 'Arial',
            }),
          ],
        })
      )
    } else if (line.startsWith('> *"') || line.startsWith('>*"') || line.startsWith('> *')) {
      const clean = line.replace(/^>\s*\*/, '').replace(/\*$/, '').replace(/^"/, '').replace(/"$/, '')
      currentBlockQuote.push(clean)
    } else if (line.startsWith('>')) {
      const clean = line.replace(/^>\s*/, '')
      currentBlockQuote.push(clean)
    } else if (line.startsWith('* **') || line.startsWith('- **')) {
      // Bullet point with bold prefix
      const match = line.match(/^[\*\-]\s+\*\*(.*?)\*\*(.*)$/)
      if (match) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: match[1] + ':', bold: true, size: 22, font: 'Arial' }),
              new TextRun({ text: match[2], size: 22, font: 'Arial' }),
            ],
          })
        )
      } else {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: line.replace(/^[\*\-]\s+/, ''), size: 22, font: 'Arial' })],
          })
        )
      }
    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: 360 },
          children: [new TextRun({ text: line, size: 22, font: 'Arial' })],
        })
      )
    } else if (line.startsWith('|')) {
      // Table row (we can format table lines simply or as structured text)
      if (line.includes('---')) continue
      const parts = line.split('|').map((s) => s.trim()).filter(Boolean)
      if (parts.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: parts.join('  |  '),
                size: 20,
                color: '334155',
                font: 'Courier New',
              }),
            ],
          })
        )
      }
    } else if (line === '---') {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 160 },
          children: [
            new TextRun({
              text: '____________________________________________________________________',
              color: 'cbd5e1',
              size: 18,
            }),
          ],
        })
      )
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: line, size: 22, font: 'Arial' })],
        })
      )
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
          },
        },
        children,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(docxPath, buffer)
  console.log('✅ Generated DOCX:', docxPath, `(${buffer.length} bytes)`)
}

// ==========================================
// 2. GENERATE PDF USING 'pdfkit'
// ==========================================
function generatePdf() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    })

    const stream = fs.createWriteStream(pdfPath)
    doc.pipe(stream)

    // Document Header
    doc
      .fontSize(20)
      .fillColor('#047857')
      .font('Helvetica-Bold')
      .text('JURNAL PROMPT PENGEMBANGAN GAME ADABKU', { align: 'center' })
      .moveDown(0.3)

    doc
      .fontSize(11)
      .fillColor('#64748b')
      .font('Helvetica-Oblique')
      .text('Dokumentasi 5 Prompt Terkurasi Utama Pengembangan Media Belajar 3D Berbasis Vibe Coding', {
        align: 'center',
      })
      .moveDown(1.2)

    let inQuote = false
    let quoteBuffer = []

    const flushQuote = () => {
      if (quoteBuffer.length > 0) {
        doc
          .rect(doc.x, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 4)
          .fill('#10b981')
        doc.moveDown(0.2)

        doc
          .fontSize(9.5)
          .font('Helvetica-Oblique')
          .fillColor('#0f172a')
          .text(`"${quoteBuffer.join(' ')}"`, {
            indent: 15,
            align: 'justify',
            lineGap: 3,
          })
          .moveDown(0.8)
        quoteBuffer = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) {
        flushQuote()
        continue
      }

      if (line.startsWith('# ')) {
        continue
      } else if (line.startsWith('## ')) {
        flushQuote()
        doc.moveDown(0.6)
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#065f46')
          .text(line.replace('## ', ''))
          .moveDown(0.4)
      } else if (line.startsWith('### ')) {
        flushQuote()
        doc.moveDown(0.5)
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#0369a1')
          .text(line.replace('### ', ''))
          .moveDown(0.3)
      } else if (line.startsWith('#### ')) {
        flushQuote()
        doc.moveDown(0.4)
        doc
          .fontSize(10.5)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(line.replace('#### ', ''))
          .moveDown(0.2)
      } else if (line.startsWith('>')) {
        const clean = line.replace(/^>\s*\*?/, '').replace(/\*?$/, '').replace(/^"/, '').replace(/"$/, '')
        quoteBuffer.push(clean)
      } else if (line.startsWith('* **') || line.startsWith('- **')) {
        flushQuote()
        const match = line.match(/^[\*\-]\s+\*\*(.*?)\*\*(.*)$/)
        if (match) {
          doc
            .fontSize(9.5)
            .font('Helvetica-Bold')
            .fillColor('#0f172a')
            .text(`• ${match[1]}: `, { continued: true })
            .font('Helvetica')
            .fillColor('#334155')
            .text(match[2])
            .moveDown(0.2)
        } else {
          doc
            .fontSize(9.5)
            .font('Helvetica')
            .fillColor('#334155')
            .text(`• ${line.replace(/^[\*\-]\s+/, '')}`)
            .moveDown(0.2)
        }
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        flushQuote()
        doc
          .fontSize(9.5)
          .font('Helvetica')
          .fillColor('#334155')
          .text(line, { indent: 12 })
          .moveDown(0.2)
      } else if (line.startsWith('|')) {
        if (line.includes('---')) continue
        flushQuote()
        const parts = line.split('|').map((s) => s.trim()).filter(Boolean)
        doc
          .fontSize(8.5)
          .font('Courier')
          .fillColor('#475569')
          .text(parts.join('  |  '))
          .moveDown(0.15)
      } else if (line === '---') {
        flushQuote()
        doc.moveDown(0.3)
        doc
          .strokeColor('#e2e8f0')
          .lineWidth(1)
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke()
        doc.moveDown(0.5)
      } else {
        flushQuote()
        doc
          .fontSize(9.5)
          .font('Helvetica')
          .fillColor('#334155')
          .text(line, { align: 'justify', lineGap: 2 })
          .moveDown(0.3)
      }
    }

    flushQuote()

    // Add page numbers
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i)
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#94a3b8')
        .text(`Halaman ${i + 1} dari ${range.count} - Dokumen Kelayakan Adabku`, 50, doc.page.height - 35, {
          align: 'center',
        })
    }

    doc.end()
    stream.on('finish', () => {
      console.log('✅ Generated PDF:', pdfPath, `(${fs.statSync(pdfPath).size} bytes)`)
      resolve()
    })
    stream.on('error', reject)
  })
}

// Run conversions
async function main() {
  try {
    await generateDocx()
    await generatePdf()
    console.log('🎉 Selesai mengonversi JURNAL_PROMPT ke DOCX dan PDF!')
  } catch (err) {
    console.error('Error during conversion:', err)
    process.exit(1)
  }
}

main()
