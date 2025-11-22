<script lang="ts" setup generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { MoreVertical, Edit, Trash2 } from 'lucide-vue-next'

interface Props {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onView?: (item: TData) => void
  onEdit?: (item: TData) => void
  onDelete?: (item: TData) => void
}
const hasActions = computed(() =>
  Boolean(props.onView || props.onEdit || props.onDelete),
)

const props = defineProps<Props>()
const actionsColumn: ColumnDef<TData, TValue> = {
  id: 'actions',
  header: () => 'Ações',
  cell: () => null,
}

const allColumns = (() => {
  if (hasActions.value) {
    return [...props.columns, actionsColumn]
  }

  return props.columns
})()

const table = useVueTable({
  data: props.data,
  columns: allColumns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <template v-if="cell.column.id === 'actions' && hasActions">
                <div class="flex items-center gap-2">
                  <Button
                    v-if="props.onView"
                    variant="default"
                    size="icon"
                    class="h-8 w-8 rounded-full cursor-pointer"
                    @click="props.onView(row.original)"
                  >
                    <MoreVertical class="h-4 w-4" />
                  </Button>

                  <Button
                    v-if="props.onEdit"
                    variant="outline"
                    size="icon"
                    class="h-8 w-8 rounded-full cursor-pointer"
                    @click="props.onEdit(row.original)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    v-if="props.onDelete"
                    variant="destructive"
                    size="icon"
                    class="h-8 w-8 rounded-full cursor-pointer"
                    @click="props.onDelete(row.original)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </template>
              <template v-else-if="cell.column.id !== 'actions'">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell
              :col-span="allColumns.length"
              class="h-24 text-center"
            >
              Nenhum resultado.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
