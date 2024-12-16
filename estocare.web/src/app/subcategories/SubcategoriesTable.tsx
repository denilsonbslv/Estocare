"use client";

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

type SortColumn = "name" | "createdAt" | "updatedAt" | null;

interface SubcategoriesTableProps {
  subcategories: Subcategory[];
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: SortColumn) => void;
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (subcategory: Subcategory) => void;
}

export default function SubcategoriesTable({
  subcategories,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: SubcategoriesTableProps) {
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="overflow-x-auto border border-foreground rounded-lg">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 cursor-pointer select-none" onClick={() => onSort("name")}>
              <div className="flex items-center justify-between w-full">
                <span>Nome</span>
                <span>{renderSortIcon("name")}</span>
              </div>
            </th>
            <th className="px-4 py-2 cursor-pointer select-none" onClick={() => onSort("createdAt")}>
              <div className="flex items-center justify-between w-full">
                <span>Data Criação</span>
                <span>{renderSortIcon("createdAt")}</span>
              </div>
            </th>
            <th className="px-4 py-2 cursor-pointer select-none" onClick={() => onSort("updatedAt")}>
              <div className="flex items-center justify-between w-full">
                <span>Data Atualização</span>
                <span>{renderSortIcon("updatedAt")}</span>
              </div>
            </th>
            <th className="font-medium text-center px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.length > 0 ? (
            subcategories.map((sc) => (
              <tr key={sc.id}>
                <td className="px-4 py-2">{sc.name}</td>
                <td className="px-4 py-2">
                  {new Date(sc.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2">
                  {new Date(sc.updatedAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="px-2 py-1 text-sm bg-secondary text-white rounded hover:opacity-90"
                      onClick={() => onEdit(sc)}
                      title="Editar subcategoria"
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:opacity-90"
                      onClick={() => onDelete(sc)}
                      title="Excluir subcategoria"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-text-secondary">
                Nenhuma subcategoria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
