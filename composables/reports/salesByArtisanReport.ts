import type { SalesByArtisanReport } from '../useReportData'

type ReportOptions = {
    periodo?: string
}

export const generateSalesByArtisanReport = async (data: SalesByArtisanReport, format = 'pdf', options: ReportOptions = {}) => {
    if (format === 'pdf') {
        return await generateSalesByArtisanPDF(data, options)
    }
    throw new Error(`Formato ${format} não implementado`)
}

const generateSalesByArtisanPDF = async (reportData: SalesByArtisanReport, options: ReportOptions) => {
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
    doc.text('VENDAS POR ARTESÃO', 14, 20)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('ARTES E SABORES', 14, 28)

    doc.setFontSize(10)
    const periodoText = reportData.dateRange.start && reportData.dateRange.end
        ? `Período: ${formatDate(reportData.dateRange.start)} - ${formatDate(reportData.dateRange.end)}`
        : 'Período: Todos'
    doc.text(periodoText, 195, 20, { align: 'right' })
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 28, { align: 'right' })

    let currentY = 50

    // Totalizar geral
    const totaisGerais = reportData.artisans.reduce((acc, artisan) => ({
        vendas: acc.vendas + artisan.totals.total_sales,
        itens: acc.itens + artisan.totals.total_items,
        receita: acc.receita + artisan.totals.total_revenue,
    }), { vendas: 0, itens: 0, receita: 0 })

    // Para cada artesão
    reportData.artisans.forEach((artisanData, index) => {
        // Verificar se precisa de nova página
        if (currentY > 250) {
            doc.addPage()
            currentY = 20
        }

        // Cabeçalho do artesão
        doc.setFillColor(240, 240, 240)
        doc.rect(14, currentY, 182, 12, 'F')

        doc.setFontSize(11)
        doc.setTextColor(...primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text(`${artisanData.artisan.name} (${artisanData.artisan.municipal_seal})`, 16, currentY + 8)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(
            `Vendas: ${artisanData.totals.total_sales} | Itens: ${artisanData.totals.total_items} | Total: ${formatCurrency(artisanData.totals.total_revenue)}`,
            195,
            currentY + 8,
            { align: 'right' },
        )

        currentY += 15

        // Tabela de vendas do artesão
        const tableColumn = ['Data', 'Produto', 'Qtd', 'Valor', 'Pagamento']
        const tableRows: any[] = []

        artisanData.sales.forEach((sale) => {
            tableRows.push([
                formatDate(sale.date),
                `${sale.product_code} - ${sale.product_name}`,
                sale.quantity,
                formatCurrency(sale.subtotal),
                sale.payment_methods,
            ])
        })

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: currentY,
            theme: 'grid',
            styles: {
                fontSize: 8,
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
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 75, halign: 'left' },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 30, halign: 'right', textColor: [0, 100, 0] },
                4: { cellWidth: 35, halign: 'center' },
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

    drawSummaryBox(doc, 'TOTAL VENDAS', `${totaisGerais.vendas}`, 14, currentY + 15, primaryColor)
    drawSummaryBox(doc, 'TOTAL ITENS', `${totaisGerais.itens}`, 76, currentY + 15, primaryColor)

    doc.setFillColor(...accentColor)
    doc.roundedRect(138, currentY + 15, 58, 25, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('RECEITA TOTAL', 167, currentY + 15 + 8, { align: 'center' })
    doc.setFontSize(12)
    doc.text(formatCurrency(totaisGerais.receita), 167, currentY + 15 + 18, { align: 'center' })

    const periodoSanitizado = options.periodo?.replace(/\//g, '-') || 'geral'
    doc.save(`relatorio-artesaos-${periodoSanitizado}.pdf`)
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

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
}
