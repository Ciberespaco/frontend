import type { SalesMonthlyReport } from '../useReportData'

type ReportOptions = {
    periodo?: string
}

export const generateSalesReport = async (data: SalesMonthlyReport, format = 'pdf', options: ReportOptions = {}) => {
    if (format === 'pdf') {
        return await generateSalesPDF(data, options)
    }
    throw new Error(`Formato ${format} não implementado`)
}

const generateSalesPDF = async (reportData: SalesMonthlyReport, options: ReportOptions) => {
    // Importação Dinâmica para funcionar no Nuxt (Client-side)
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()

    // --- CONFIGURAÇÕES DE ESTILO ---
    const primaryColor: [number, number, number] = [44, 62, 80] // Azul Escuro (Slate)
    const accentColor: [number, number, number] = [0, 220, 130] // Verde Nuxt (Moderno)

    // --- CABEÇALHO ---
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text('RELATÓRIO DE VENDAS', 14, 20)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('ARTES E SABORES', 14, 28)

    doc.setFontSize(10)
    const periodoText = reportData.dateRange.start && reportData.dateRange.end
        ? `Período: ${formatDate(reportData.dateRange.start)} - ${formatDate(reportData.dateRange.end)}`
        : 'Período: Todos'
    doc.text(periodoText, 195, 20, { align: 'right' })
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 28, { align: 'right' })

    // --- TABELA DE DADOS ---
    const tableColumn = ['Data', 'Cód. Artesão', 'Produto', 'Qtd', 'Forma Pagto', 'Valor']
    const tableRows: any[] = []

    reportData.items.forEach((item) => {
        const row = [
            formatDate(item.date),
            item.artisan_code,
            `${item.product_code} - ${item.product_name}`,
            item.quantity,
            item.payment_methods,
            formatCurrency(item.subtotal),
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
            0: { cellWidth: 25, halign: 'center' }, // Data
            1: { cellWidth: 25, halign: 'center' }, // Cód. Artesão
            2: { cellWidth: 60, halign: 'left' }, // Produto
            3: { cellWidth: 15, halign: 'center' }, // Qtd
            4: { cellWidth: 30, halign: 'center' }, // Forma Pagto
            5: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0] }, // Valor
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    })

    // Pega a posição final Y da tabela
    const finalY = (doc as any).lastAutoTable.finalY + 10

    // --- SEÇÃO DE TOTAIS ---
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(14, finalY, 196, finalY)

    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Fechamento do Período', 14, finalY + 10)

    // Boxes de resumo
    drawSummaryBox(
        doc,
        'TOTAL DE VENDAS',
        `${reportData.summary.total_sales}`,
        14,
        finalY + 15,
        primaryColor,
    )
    drawSummaryBox(
        doc,
        'ITENS VENDIDOS',
        `${reportData.summary.total_items}`,
        76,
        finalY + 15,
        primaryColor,
    )

    // Box de Total Geral (Destaque)
    doc.setFillColor(...accentColor)
    doc.roundedRect(138, finalY + 15, 58, 25, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('FATURAMENTO TOTAL', 167, finalY + 15 + 8, { align: 'center' })
    doc.setFontSize(12)
    doc.text(formatCurrency(reportData.summary.total_revenue), 167, finalY + 15 + 18, { align: 'center' })

    // Salvar
    const periodoSanitizado = options.periodo?.replace(/\//g, '-') || 'geral'
    const fileName = `relatorio-vendas-${periodoSanitizado}.pdf`
    doc.save(fileName)
}

// Função auxiliar para desenhar box de resumo
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

// Função para formatar moeda (valores vem em centavos do backend)
function formatCurrency(value: number): string {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Função para formatar data
function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
}
