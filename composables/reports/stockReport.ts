import type { StockReport } from '../useReportData'

export const generateStockReport = async (data: StockReport, format = 'pdf') => {
    if (format === 'pdf') {
        return await generateStockPDF(data)
    }
    throw new Error(`Formato ${format} não implementado`)
}

const generateStockPDF = async (reportData: StockReport) => {
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()

    const primaryColor: [number, number, number] = [44, 62, 80]
    const accentColor: [number, number, number] = [0, 220, 130]

    // --- CABEÇALHO ---
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text('RELATÓRIO DE ESTOQUE', 14, 20)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('ARTES E SABORES', 14, 28)

    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 24, { align: 'right' })

    // --- TABELA ---
    const tableColumn = ['Código', 'Produto', 'Artesão', 'Categoria', 'Qtd', 'Preço', 'Total']
    const tableRows: any[] = []

    reportData.products.forEach((product) => {
        const row = [
            product.product_code,
            product.name,
            product.artisan.name,
            product.product_category.name,
            product.quant,
            formatCurrency(product.price),
            formatCurrency(product.price * product.quant),
        ]
        tableRows.push(row)
    })

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: {
            fontSize: 7,
            cellPadding: 2,
            lineColor: [220, 220, 220],
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 8,
        },
        columnStyles: {
            0: { cellWidth: 18, halign: 'center' }, // Código
            1: { cellWidth: 45, halign: 'left' }, // Produto
            2: { cellWidth: 35, halign: 'left' }, // Artesão
            3: { cellWidth: 30, halign: 'left' }, // Categoria
            4: { cellWidth: 12, halign: 'center' }, // Qtd
            5: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0] }, // Preço
            6: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0] }, // Total
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10

    // --- RESUMO ---
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(14, finalY, 196, finalY)

    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumo do Estoque', 14, finalY + 10)

    drawSummaryBox(doc, 'PRODUTOS', `${reportData.summary.total_products}`, 14, finalY + 15, primaryColor)
    drawSummaryBox(doc, 'QTDE TOTAL', `${reportData.summary.total_quantity}`, 76, finalY + 15, primaryColor)

    doc.setFillColor(...accentColor)
    doc.roundedRect(138, finalY + 15, 58, 25, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('VALOR TOTAL', 167, finalY + 15 + 8, { align: 'center' })
    doc.setFontSize(12)
    doc.text(formatCurrency(reportData.summary.total_value), 167, finalY + 15 + 18, { align: 'center' })

    const timestamp = new Date().toISOString().split('T')[0]
    doc.save(`relatorio-estoque-${timestamp}.pdf`)
}

function drawSummaryBox(
    doc: any,
    label: string,
    value: string,
    x: number,
    y: number,
    color: [number, number, number],
) {
    doc.setFillColor(250, 250, 250)
    doc.setDrawColor(200, 200, 200)
    doc.roundedRect(x, y, 55, 25, 3, 3, 'FD')

    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(label, x + 27.5, y + 8, { align: 'center' })

    doc.setFontSize(11)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'bold')
    doc.text(value, x + 27.5, y + 18, { align: 'center' })
}

function formatCurrency(value: number): string {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
