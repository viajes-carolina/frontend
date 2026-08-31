/* ==========================================================================
   Kit de tabla del panel administrativo — API pública.

   Uso típico de una pantalla:

     const table = useDataTable({
       rows: promotions,
       getRowId: (p) => p.id,
       searchIn: (p) => [p.title, p.destination],
       filters: STATUS_FILTER,          // definido fuera del componente
       selectable: true,
     });

     <AdminDataTable
       controller={table}
       columns={columns}                 // definidas con useMemo o fuera
       caption="Catálogo de promociones"
       searchPlaceholder="Buscar por título o destino…"
       createAction={{ label: "Nueva promoción", onSelect: openCreateModal }}
       bulkActions={[…]}
       emptyState={{ title: "Aún no hay promociones", description: "…" }}
       getRowLabel={(p) => `«${p.title}»`}
       itemNoun="promociones"
     />

   Las cuatro tablas escritas a mano del panel (blog, reclamaciones, catálogo de
   promociones y los `*ItemsPanel`) se migran a esto en tandas siguientes.
   ========================================================================== */

/* Ensamblado completo y piezas sueltas. */
export { AdminDataTable, type AdminDataTableProps } from "./AdminDataTable";
export { DataTable, type DataTableProps } from "./DataTable";
export { TableToolbar, type TableToolbarProps } from "./TableToolbar";
export { TableFilterMenu, type TableFilterMenuProps } from "./TableFilterMenu";
export { TableBulkActions, type TableBulkActionsProps } from "./TableBulkActions";
export { TablePagination, type TablePaginationProps } from "./TablePagination";
export { TableEmptyState, type TableEmptyStateProps } from "./TableEmptyState";

/* Celdas compuestas y controles. */
export {
  TableThumbnail,
  TableTitle,
  TableText,
  TableEmptyCell,
  TableToggle,
  type TableThumbnailProps,
  type TableTitleProps,
  type TableTextProps,
  type TableEmptyCellProps,
  type TableToggleProps,
} from "./TableCells";
export { TableRowActions, type TableRowActionsProps } from "./TableRowActions";
export { SelectionCheckbox, type SelectionCheckboxProps } from "./SelectionCheckbox";
export { TableSearchIcon, TableEmptyIcon, type TableIconProps } from "./TableIcons";

/* Motor. Dos, con el mismo contrato de salida (`DataTableController<T>`):
   `useDataTable` cuando el navegador tiene todas las filas y `useServerDataTable`
   cuando busca, filtra y pagina el servidor. */
export { useDataTable, type UseDataTableOptions } from "./useDataTable";
export {
  useServerDataTable,
  type ServerDataTable,
  type ServerDataTableQuery,
  type UseServerDataTableOptions,
} from "./useServerDataTable";
export { usePopoverMenu, type PopoverMenu } from "./usePopoverMenu";
export { useAnchoredMenu, type AnchoredMenu } from "./useAnchoredMenu";

/* Utilidades y valores puros, expuestos para pruebas y para casos a medida.
   `DEFAULT_PAGE_SIZE` sale de aquí y NO de `useDataTable`: lo lee también un
   Server Component (`inicio/promociones/page.tsx`) para pedir la primera página,
   y a través de un módulo `"use client"` llegaría como referencia de cliente en
   vez de como número. */
export { DEFAULT_PAGE_SIZE } from "./tablePageSize";
export { buildPageItems } from "./tablePageItems";
export { normalizeSearchText } from "./dataTableFilters";

export type {
  DataTableAlign,
  DataTableBulkAction,
  DataTableColumn,
  DataTableController,
  DataTableEmptyCopy,
  DataTableEmptyReason,
  DataTableFilterDefinition,
  DataTableFilterOption,
  DataTableFilterState,
  DataTableHeaderCheckState,
  DataTableNoResultsCopy,
  DataTablePageItem,
  DataTablePaginationState,
  DataTableRowAction,
  DataTableSelectionState,
  DataTableServerFilterDefinition,
} from "./types";
