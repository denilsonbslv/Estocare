"use client";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

type SortColumn = "name" | "createdAt" | "updatedAt" | null;

interface CategoriesTableProps {
    categories: Category[];
    sortColumn: SortColumn;
    sortDirection: "asc" | "desc";
    onSort: (column: SortColumn) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
  }

export default function CategoriesTable({
  categories,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
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
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">
                  {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2">
                  {new Date(category.updatedAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
                    <button
                    className="px-2 py-1 text-sm bg-secondary text-secondary-text rounded hover:opacity-90 text-white"
                    title="Editar categoria"
                    onClick={() => onEdit(category)}
                    >
                    Editar
                    </button>
                    <button
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:opacity-90"
                    title="Excluir categoria"
                    onClick={() => onDelete(category)}
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
                Nenhuma categoria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
