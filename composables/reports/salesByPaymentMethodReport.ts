import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { SalesMonthlyReport } from '../useReportData'

/**
 * Gera relatório PDF de vendas agrupadas por método de pagamento
 */
export function generateSalesByPaymentMethodReport(reportData: SalesMonthlyReport, options: { periodo?: string } = {}) {
    const doc = new jsPDF()

    // Cores do tema
    const primaryColor: [number, number, number] = [34, 139, 34]
    const accentColor: [number, number, number] = [255, 140, 0]

    // Helper para formatar moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
    }

    // Helper para formatar data
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // --- CABEÇALHO ---
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 35, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Relatorio de Vendas', 14, 15)
    doc.text('Por Metodo de Pagamento', 14, 25)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (options.periodo)
        doc.text(`Periodo: ${options.periodo}`, 14, 32)

    doc.setFontSize(8)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 28, { align: 'right' })

    // Agrupar vendas por método de pagamento
    const salesByMethod: Record<string, Array<{
        date: string
        artisan_code: string
        product_code: number
        product_name: string
        quantity: number
        value: number
    }>> = {}

    reportData.items.forEach((item) => {
        // Cada item pode ter múltiplos métodos
        const methods = item.payment_methods.split(', ')

        methods.forEach((method) => {
            if (!salesByMethod[method]) {
                salesByMethod[method] = []
            }

            // Calcular valor proporcional para este método
            const totalMethods = methods.length
            const valueForMethod = Math.round(item.subtotal / totalMethods)

            salesByMethod[method].push({
                date: item.date,
                artisan_code: item.artisan_code,
                product_code: item.product_code,
                product_name: item.product_name,
                quantity: item.quantity,
                value: valueForMethod,
            })
        })
    })

    let currentY = 45

    // Para cada método de pagamento
    Object.entries(salesByMethod).sort(([a], [b]) => a.localeCompare(b)).forEach(([method, sales], index) => {
        if (index > 0) {
            // Adicionar nova página se necessário
            if (currentY > 220) {
                doc.addPage()
                currentY = 20
            } else {
                currentY += 10
            }
        }

        // Calcular totais do método
        const totalSales = sales.length
        const totalValue = sales.reduce((sum, sale) => sum + sale.value, 0)
        const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0)

        // Cabeçalho do método de pagamento (SEM EMOJI)
        doc.setFillColor(...accentColor)
        doc.roundedRect(14, currentY, 182, 12, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(method.toUpperCase(), 18, currentY + 8)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`${totalSales} venda(s) - ${totalItems} item(ns) - ${formatCurrency(totalValue)}`, 192, currentY + 8, { align: 'right' })

        currentY += 15

        // Tabela de vendas deste método
        const tableColumn = ['Data', 'Cod. Artesao', 'Produto', 'Qtd', 'Valor']
        const tableRows = sales.map(sale => [
            formatDate(sale.date),
            sale.artisan_code,
            `${sale.product_code} - ${sale.product_name}`,
            sale.quantity,
            formatCurrency(sale.value),
        ])

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
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 7,
            },
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' }, // Data
                1: { cellWidth: 25, halign: 'center' }, // Cod. Artesao
                2: { cellWidth: 80, halign: 'left' },   // Produto
                3: { cellWidth: 15, halign: 'center' }, // Qtd
                4: { cellWidth: 25, halign: 'right', textColor: [0, 100, 0], fontStyle: 'bold' }, // Valor
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { left: 14, right: 14 },
        })

        currentY = (doc as any).lastAutoTable.finalY
    })

    // Nova página para resumo geral
    doc.addPage()

    // Cabeçalho da página de resumo
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 25, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumo Geral por Metodo de Pagamento', 14, 15)

    let summaryY = 35

    // Boxes de resumo para cada método
    Object.entries(salesByMethod).sort(([a], [b]) => a.localeCompare(b)).forEach(([method, sales]) => {
        const totalValue = sales.reduce((sum, sale) => sum + sale.value, 0)
        const totalSales = sales.length
        const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0)

        // Box para cada método
        doc.setFillColor(52, 152, 219) // Azul
        doc.roundedRect(14, summaryY, 182, 20, 3, 3, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(method.toUpperCase(), 18, summaryY + 8)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Vendas: ${totalSales}  -  Itens: ${totalItems}`, 18, summaryY + 15)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(formatCurrency(totalValue), 192, summaryY + 12, { align: 'right' })

        summaryY += 25
    })

    // Total geral
    summaryY += 10
    doc.setFillColor(...accentColor)
    doc.roundedRect(14, summaryY, 182, 25, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL GERAL', 18, summaryY + 10)
    doc.setFontSize(14)
    doc.text(formatCurrency(reportData.summary.total_revenue), 192, summaryY + 17, { align: 'right' })

    // Salvar
    const periodoSanitizado = options.periodo?.replace(/\//g, '-') || 'geral'
    const fileName = `relatorio-vendas-por-pagamento-${periodoSanitizado}.pdf`
    doc.save(fileName)
}
