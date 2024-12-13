"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/services/category";
import CategoriesTable from "./CategoriesTable";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import Alert from "@/components/UI/Alert";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

type SortColumn = "name" | "createdAt" | "updatedAt" | null;

export default function CategoriesList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Adicionar Categoria
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Editar Categoria
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [editNewName, setEditNewName] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  // Excluir Categoria
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  // Paginação
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleAddCategoryClick = () => {
    setNewCategoryName("");
    setErrorMessage("");
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    if (newCategoryName.trim().length < 5) {
      setErrorMessage("O nome da categoria deve ter pelo menos 5 caracteres.");
      return;
    }

    try {
      const newCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories((prev) => [...prev, newCategory]);
      setShowModal(false);
      setNewCategoryName("");
      setErrorMessage("");

      setAlertMessage("Categoria criada com sucesso!");
      setAlertType("success");
    } catch (error) {
      setErrorMessage((error as Error).message || "Erro ao criar categoria");
      setAlertMessage("Não foi possível criar a categoria.");
      setAlertType("error");
    }
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setEditNewName(category.name);
    setEditErrorMessage("");
    setShowEditModal(true);
  };

  const handleSaveEditCategory = async () => {
    if (editNewName.trim().length < 5) {
      setEditErrorMessage("O nome da categoria deve ter pelo menos 5 caracteres.");
      return;
    }

    if (!categoryToEdit) return;

    try {
      const updatedCat = await updateCategory(categoryToEdit.id, { name: editNewName.trim() });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryToEdit.id ? updatedCat : cat))
      );
      setShowEditModal(false);
      setEditNewName("");
      setEditErrorMessage("");

      setAlertMessage("Categoria atualizada com sucesso!");
      setAlertType("success");
    } catch (error) {
      setEditErrorMessage((error as Error).message || "Erro ao atualizar categoria");
      setAlertMessage("Não foi possível atualizar a categoria.");
      setAlertType("error");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      // Remove a categoria do estado
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setAlertMessage("Categoria excluída com sucesso!");
      setAlertType("success");
    } catch (error) {
      setEditErrorMessage((error as Error).message || "Não foi possível excluir a categoria.");
      setShowDeleteModal(false);
      setAlertMessage("Não foi possível excluir a categoria.");
      setAlertType("error");
    }
  };

  // Filtrar e ordenar
  let filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filteredCategories = filteredCategories.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortColumn) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Paginação
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 relative">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categorias</h1>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar categoria..."
            className="border border-foreground rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddCategoryClick}
          className="px-4 py-2 bg-primary text-primary-text rounded-lg font-medium hover:opacity-90 transition text-white"
        >
          Adicionar Categoria
        </button>
      </div>

      <CategoriesTable
        categories={paginatedCategories}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick} // Nova prop para exclusão
      />

      {/* Controles de Paginação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span>Itens por página:</span>
          <select
            className="border border-foreground rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border border-foreground rounded hover:opacity-90"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            className="px-2 py-1 border border-foreground rounded hover:opacity-90"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Próximo
          </button>
        </div>
      </div>

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          autoClose={3000}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {showModal && (
        <AddCategoryModal
          name={newCategoryName}
          setName={setNewCategoryName}
          errorMessage={errorMessage}
          onCancel={() => setShowModal(false)}
          onSave={handleSaveCategory}
        />
      )}

      {showEditModal && categoryToEdit && (
        <EditCategoryModal
          categoryName={categoryToEdit.name}
          newName={editNewName}
          setNewName={setEditNewName}
          errorMessage={editErrorMessage}
          onCancel={() => setShowEditModal(false)}
          onSave={handleSaveEditCategory}
        />
      )}

      {showDeleteModal && categoryToDelete && (
        <DeleteCategoryModal
          categoryName={categoryToDelete.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
