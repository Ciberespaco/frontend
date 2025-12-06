import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import type { SalesMonthlyReport } from '../useReportData'

/**
 * Gera arquivo Excel (.xlsx) no formato de recibo de pagamento para artesão
 */
export async function generateSalesReceiptExcel(
    reportData: SalesMonthlyReport,
    options: {
        periodo?: string
        artisanCode?: string
        artisanName?: string
    } = {}
) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Recibo de Vendas')

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
    // Mesclar células A1 até I1
    worksheet.mergeCells('A1:I1')
    const headerCell = worksheet.getCell('A1')
    headerCell.value = 'RECIBO MENSAL DE VENDAS'
    headerCell.font = { bold: true, size: 16 }
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' }
    headerCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }

    // Célula J1 com a data
    const dateCell = worksheet.getCell('J1')
    dateCell.value = options.periodo || new Date().toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    dateCell.font = { bold: true }
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' }
    dateCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }

    // Linha vazia
    worksheet.getRow(2).height = 5

    // --- TABELA DE DADOS ---
    // Cabeçalhos da tabela (linha 3)
    const headers = ['Data', 'Cod.Artesao', 'Produto', 'Quant', 'Forma Pagto', 'Valor', 'Desconto', 'Obs']
    const headerRow = worksheet.getRow(3)

    headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1)
        cell.value = header
        cell.font = { bold: true }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' },
        }
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
        }
    })

    // Dados da tabela (começando na linha 4)
    let currentRow = 4
    reportData.items.forEach((item) => {
        const row = worksheet.getRow(currentRow)

        row.getCell(1).value = formatDate(item.date)
        row.getCell(2).value = item.artisan_code
        row.getCell(3).value = `${item.product_code} - ${item.product_name}`
        row.getCell(4).value = item.quantity
        row.getCell(5).value = item.payment_methods
        row.getCell(6).value = formatCurrency(item.subtotal)
        row.getCell(7).value = 'R$ 0,00' // Desconto (ajustar conforme necessário)
        row.getCell(8).value = '' // Obs

        // Aplicar bordas
        for (let col = 1; col <= 8; col++) {
            row.getCell(col).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' },
            }
        }

        // Alinhar valores
        row.getCell(1).alignment = { horizontal: 'center' }
        row.getCell(2).alignment = { horizontal: 'center' }
        row.getCell(4).alignment = { horizontal: 'center' }
        row.getCell(5).alignment = { horizontal: 'center' }
        row.getCell(6).alignment = { horizontal: 'right' }
        row.getCell(7).alignment = { horizontal: 'right' }

        currentRow++
    })

    // --- RODAPÉ DE CÁLCULOS ---
    currentRow++ // Linha vazia

    // Total de Vendas
    const totalVendasRow = worksheet.getRow(currentRow)
    totalVendasRow.getCell(8).value = 'Total de Vendas:'
    totalVendasRow.getCell(8).alignment = { horizontal: 'right' }
    totalVendasRow.getCell(8).font = { bold: true }
    totalVendasRow.getCell(9).value = formatCurrency(reportData.summary.total_revenue)
    totalVendasRow.getCell(9).alignment = { horizontal: 'right' }
    totalVendasRow.getCell(9).font = { bold: true }
    currentRow++

    // 15% de Contribuição
    const contribuicao = Math.round(reportData.summary.total_revenue * 0.15)
    const contribuicaoRow = worksheet.getRow(currentRow)
    contribuicaoRow.getCell(8).value = '15% Contribuicao:'
    contribuicaoRow.getCell(8).alignment = { horizontal: 'right' }
    contribuicaoRow.getCell(9).value = formatCurrency(contribuicao)
    contribuicaoRow.getCell(9).alignment = { horizontal: 'right' }
    currentRow++

    // Valor a Pagar
    const valorAPagar = reportData.summary.total_revenue - contribuicao
    const valorAPagarRow = worksheet.getRow(currentRow)
    valorAPagarRow.getCell(8).value = 'Valor a Pagar:'
    valorAPagarRow.getCell(8).alignment = { horizontal: 'right' }
    valorAPagarRow.getCell(8).font = { bold: true }
    valorAPagarRow.getCell(9).value = formatCurrency(valorAPagar)
    valorAPagarRow.getCell(9).alignment = { horizontal: 'right' }
    valorAPagarRow.getCell(9).font = { bold: true }
    currentRow++

    // --- HISTÓRICO E DESCONTOS ---
    currentRow++ // Linha vazia

    // Histórico de Mensalidades
    worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
    const historicoCell = worksheet.getCell(`A${currentRow}`)
    historicoCell.value = 'Historico de Mensalidades'
    historicoCell.font = { bold: true }
    historicoCell.alignment = { horizontal: 'center' }
    historicoCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }
    currentRow++

    // Linhas vazias para histórico (3 linhas)
    for (let i = 0; i < 3; i++) {
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const cell = worksheet.getCell(`A${currentRow}`)
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
        }
        currentRow++
    }

    currentRow++ // Linha vazia

    // Outros Descontos
    worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
    const descontosCell = worksheet.getCell(`A${currentRow}`)
    descontosCell.value = 'Outros Descontos'
    descontosCell.font = { bold: true }
    descontosCell.alignment = { horizontal: 'center' }
    descontosCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }
    currentRow++

    // Linhas vazias para descontos (2 linhas)
    for (let i = 0; i < 2; i++) {
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const cell = worksheet.getCell(`A${currentRow}`)
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
        }
        currentRow++
    }

    // --- LINHA FINAL ---
    currentRow++ // Linha vazia

    // Mesclar A até H para o texto
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
    const finalTextCell = worksheet.getCell(`A${currentRow}`)
    finalTextCell.value = 'VALOR A PAGAR AO ARTESAO'
    finalTextCell.font = { bold: true }
    finalTextCell.alignment = { horizontal: 'right', vertical: 'middle' }
    finalTextCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF9BC2E6' }, // Azul claro
    }
    finalTextCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }

    // Célula I com valor final
    const finalValueCell = worksheet.getCell(`I${currentRow}`)
    finalValueCell.value = formatCurrency(valorAPagar)
    finalValueCell.font = { bold: true, size: 14 }
    finalValueCell.alignment = { horizontal: 'right', vertical: 'middle' }
    finalValueCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF9BC2E6' },
    }
    finalValueCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
    }

    // Ajustar larguras das colunas
    worksheet.getColumn(1).width = 12 // Data
    worksheet.getColumn(2).width = 15 // Cod.Artesao
    worksheet.getColumn(3).width = 30 // Produto
    worksheet.getColumn(4).width = 8  // Quant
    worksheet.getColumn(5).width = 15 // Forma Pagto
    worksheet.getColumn(6).width = 15 // Valor
    worksheet.getColumn(7).width = 12 // Desconto
    worksheet.getColumn(8).width = 20 // Obs
    worksheet.getColumn(9).width = 15 // Cálculos
    worksheet.getColumn(10).width = 10 // J1

    // Gerar e salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer()
    const periodoSanitizado = options.periodo?.replace(/\//g, '-') || 'geral'
    const fileName = `recibo-vendas-${periodoSanitizado}.xlsx`

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, fileName)
}
