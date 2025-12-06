# Sistema de Relatórios

Este documento explica como funciona o sistema de relatórios implementado no projeto.

## 📁 Estrutura de Arquivos

```
composables/
├── useReports.ts              # Configuração de relatórios disponíveis
├── useReportData.ts           # Fetching de dados da API
└── reports/
    ├── salesReport.ts         # Gerador de relatório de vendas
    └── stockReport.ts         # Gerador de relatório de estoque

pages/
└── reports.vue                # Página principal de relatórios
```

## 🎯 Como Funciona

### 1. **Configuração de Relatórios** (`useReports.ts`)

Define todos os relatórios disponíveis no sistema:

```typescript
{
  id: 'vendas-mensal',
  name: 'Vendas Mensais',
  description: 'Relatório detalhado de vendas do mês',
  icon: '📊',
  formats: ['pdf'],              // Formatos disponíveis
  requiresDateRange: true,        // Requer seleção de período?
  category: 'sales'               // Categoria para organização
}
```

### 2. **Busca de Dados** (`useReportData.ts`)

Responsável por buscar os dados da API:

- `fetchSalesReport(startDate, endDate)` - Vendas por período
- `fetchProductStockReport()` - Produtos em estoque
- `fetchSalesByArtisan(startDate, endDate)` - Vendas por artesão

### 3. **Geradores de PDF** (`composables/reports/`)

Cada tipo de relatório tem seu próprio gerador:

#### **salesReport.ts**
- Gera PDF de vendas com tabela detalhada
- Mostra resumo com total de vendas, itens vendidos e faturamento
- Design moderno com cores e boxes informativos

#### **stockReport.ts**
- Lista produtos em estoque com detalhes
- Mostra código, nome, artesão, categoria, quantidade e preço
- Resumo com total de produtos, quantidade e valor

### 4. **Interface do Usuário** (`pages/reports.vue`)

Página com 3 passos:

1. **Seleção do Relatório** - Cards organizados por categoria
2. **Filtros** - Período de data (quando necessário)
3. **Exportação** - Escolha do formato e geração

## 🔧 Como Adicionar Novos Relatórios

### Passo 1: Adicionar Configuração

Em `composables/useReports.ts`:

```typescript
{
  id: 'novo-relatorio',
  name: 'Nome do Relatório',
  description: 'Descrição breve',
  icon: '📈',
  formats: ['pdf'],
  requiresDateRange: false,
  category: 'financial'  // ou 'sales', 'inventory', 'general'
}
```

### Passo 2: Criar Função de Busca de Dados (se necessário)

Em `composables/useReportData.ts`:

```typescript
const fetchNovoRelatorioData = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/endpoint')
    return data
  } catch (err) {
    error.value = formatError(err)
    throw err
  } finally {
    loading.value = false
  }
}

// Exportar a função
return {
  // ... funções existentes
  fetchNovoRelatorioData
}
```

### Passo 3: Criar Gerador de PDF

Crie `composables/reports/novoRelatorio.ts`:

```typescript
export const generateNovoRelatorio = async (data: any, format = 'pdf') => {
  if (format === 'pdf') {
    return await generateNovoRelatorioPDF(data)
  }
  throw new Error(`Formato ${format} não implementado`)
}

const generateNovoRelatorioPDF = async (data: any) => {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF()
  
  // Configurar cabeçalho, tabelas, etc.
  // Use os exemplos em salesReport.ts e stockReport.ts
  
  doc.save('nome-do-arquivo.pdf')
}
```

### Passo 4: Integrar na Página

Em `pages/reports.vue`, adicione o novo caso no switch:

```typescript
import { generateNovoRelatorio } from '~/composables/reports/novoRelatorio'
import { fetchNovoRelatorioData } from '~/composables/useReportData'

// Dentro de generateReport()
switch (selectedReport.value.id) {
  // ... casos existentes
  case 'novo-relatorio': {
    const data = await fetchNovoRelatorioData()
    await generateNovoRelatorio(data, selectedFormat.value)
    break
  }
}
```

## 🎨 Customização de Design

### Cores Padrão

```typescript
const primaryColor: [number, number, number] = [44, 62, 80]   // Azul Escuro
const accentColor: [number, number, number] = [0, 220, 130]   // Verde
```

### Estrutura de PDF

1. **Cabeçalho** (0-40mm) - Título, subtítulo, informações
2. **Tabela** (a partir de 50mm) - Dados principais
3. **Resumo** (após tabela) - Boxes com totalizadores

### Função Auxiliar: drawSummaryBox

```typescript
drawSummaryBox(doc, 'LABEL', 'Valor', x, y, color)
```

## 📊 Formatos Suportados

Atualmente:
- ✅ **PDF** - Totalmente implementado
- ⏳ **Excel** - Planejado
- ⏳ **CSV** - Planejado

## 🔍 Exemplo de Uso

1. Usuário acessa `/reports`
2. Seleciona "Vendas Mensais"
3. Define período (ex: 01/11/2025 - 30/11/2025)
4. Clica em "Gerar Relatório"
5. Sistema:
   - Busca dados via `fetchSalesReport()`
   - Gera PDF via `generateSalesReport()`
   - Download automático do arquivo

## 🚀 Melhorias Futuras

- [ ] Adicionar exportação para Excel
- [ ] Adicionar exportação para CSV
- [ ] Histórico de relatórios gerados
- [ ] Agendamento de relatórios recorrentes
- [ ] Templates personalizáveis
- [ ] Gráficos e visualizações
- [ ] Envio por e-mail
- [ ] Relatórios com múltiplos filtros

## 🐛 Troubleshooting

### Erro: "Cannot find module 'jspdf'"
**Solução:** Instalar dependências
```bash
npm install jspdf jspdf-autotable
```

### Relatório não gera
**Verificar:**
1. Dados estão sendo retornados da API?
2. Console do navegador mostra erros?
3. Formato está implementado?

### Datas não aparecem corretamente
**Solução:** Verificar formato de data no backend (ISO 8601)

## 📝 Notas Importantes

- PDFs são gerados no cliente (browser), não no servidor
- jspdf e jspdf-autotable são importados dinamicamente para otimizar bundle
- Notificações usam SweetAlert2 (padrão do projeto)
- Todos os relatórios seguem o mesmo design system
