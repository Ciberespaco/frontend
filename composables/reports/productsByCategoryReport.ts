import type { ProductsByCategoryReport } from '../useReportData'

export const generateProductsByCategoryReport = async (data: ProductsByCategoryReport, format = 'pdf') => {
    if (format === 'pdf') {
        return await generateProductsByCategoryPDF(data)
    }
    throw new Error(`Formato ${format} não implementado`)
}

const generateProductsByCategoryPDF = async (reportData: ProductsByCategoryReport) => {
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
    doc.text('PRODUTOS POR CATEGORIA', 14, 20)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('ARTES E SABORES', 14, 28)

    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 24, { align: 'right' })

    let currentY = 50

    // Para cada categoria
    reportData.categories.forEach((category) => {
        // Verificar se precisa de nova página
        if (currentY > 250) {
            doc.addPage()
            currentY = 20
        }

        // Cabeçalho da categoria
        doc.setFillColor(240, 240, 240)
        doc.rect(14, currentY, 182, 12, 'F')

        doc.setFontSize(11)
        doc.setTextColor(...primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text(category.name, 16, currentY + 8)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(
            `Produtos: ${category.stats.total_products} | Qtd Total: ${category.stats.total_quantity} | Valor: ${formatCurrency(category.stats.total_value)}`,
            195,
            currentY + 8,
            { align: 'right' },
        )

        currentY += 15

        // Tabela de produtos da categoria
        const tableColumn = ['Código', 'Produto', 'Artesão', 'Qtd', 'Preço Unit.', 'Total']
        const tableRows: any[] = []

        category.products.forEach((product) => {
            tableRows.push([
                product.product_code,
                product.name,
                product.artisan.name,
                product.quant,
                formatCurrency(product.price),
                formatCurrency(product.price * product.quant),
            ])
        })

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: currentY,
            theme: 'grid',
            styles: {
                fontSize: 7,
                cellPadding: 2,
                lineColor: [220, 220, 220],
            },
            headStyles: {
                fillColor: [100, 100, 100],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 8,
            },
            columnStyles: {
                0: { cellWidth: 20, halign: 'center' },
                1: { cellWidth: 55, halign: 'left' },
                2: { cellWidth: 40, halign: 'left' },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0] },
                5: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0] },
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250],
            },
            margin: { left: 14, right: 14 },
        })

        currentY = (doc as any).lastAutoTable.finalY + 10
    })

    // Resumo Geral
    if (currentY > 230) {
        doc.addPage()
        currentY = 20
    }

    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(14, currentY, 196, currentY)

    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumo Geral', 14, currentY + 10)

    const totalValue = reportData.categories.reduce((sum, c) => sum + c.stats.total_value, 0)
    const totalQty = reportData.categories.reduce((sum, c) => sum + c.stats.total_quantity, 0)

    drawSummaryBox(doc, 'CATEGORIAS', `${reportData.summary.total_categories}`, 14, currentY + 15, primaryColor)
    drawSummaryBox(doc, 'PRODUTOS', `${reportData.summary.total_products}`, 76, currentY + 15, primaryColor)

    doc.setFillColor(...accentColor)
    doc.roundedRect(138, currentY + 15, 58, 25, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('VALOR TOTAL', 167, currentY + 15 + 8, { align: 'center' })
    doc.setFontSize(12)
    doc.text(formatCurrency(totalValue), 167, currentY + 15 + 18, { align: 'center' })

    const timestamp = new Date().toISOString().split('T')[0]
    doc.save(`relatorio-categorias-${timestamp}.pdf`)
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
