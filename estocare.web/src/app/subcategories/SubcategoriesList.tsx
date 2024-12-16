"use client";

import { useState, useEffect } from "react";
import { createSubcategory, updateSubcategory, deleteSubcategory } from "@/services/subcategories";
import { getAllCategories } from "@/services/category";
import SubcategoriesTable from "./SubcategoriesTable";
import AddSubcategoryModal from "./AddSubcategoryModal";
import EditSubcategoryModal from "./EditSubcategoryModal";
import DeleteSubcategoryModal from "./DeleteSubcategoryModal";
import Alert from "@/components/UI/Alert";

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

type SortColumn = "name" | "createdAt" | "updatedAt" | null;

export default function SubcategoriesList({ initialSubcategories }: { initialSubcategories: Subcategory[] }) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Adicionar Subcategoria
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCatId, setNewSubcategoryCatId] = useState(0);
  const [addErrorMessage, setAddErrorMessage] = useState("");

  // Editar Subcategoria
  const [showEditModal, setShowEditModal] = useState(false);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<Subcategory | null>(null);
  const [editNewName, setEditNewName] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  // Excluir Subcategoria
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);

  // Alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  // Paginação
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Carrega categorias para o modal de adicionar subcategoria
    getAllCategories().then(setCategories).catch((error) => console.error("Erro ao carregar categorias:", error));
  }, []);

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

  const handleAddSubcategoryClick = () => {
    setNewSubcategoryName("");
    setNewSubcategoryCatId(0);
    setAddErrorMessage("");
    setShowAddModal(true);
  };

  const handleSaveSubcategory = async () => {
    if (newSubcategoryName.trim().length < 5) {
      setAddErrorMessage("O nome da subcategoria deve ter pelo menos 5 caracteres.");
      return;
    }
    if (newSubcategoryCatId === 0) {
      setAddErrorMessage("Selecione uma categoria.");
      return;
    }

    try {
      const newSubcategory = await createSubcategory({ name: newSubcategoryName.trim(), categoryId: newSubcategoryCatId });
      setSubcategories((prev) => [...prev, newSubcategory]);
      setShowAddModal(false);
      setNewSubcategoryName("");
      setNewSubcategoryCatId(0);
      setAddErrorMessage("");

      setAlertMessage("Subcategoria criada com sucesso!");
      setAlertType("success");
    } catch ( error: unknown) {
        if (error instanceof Error) {
          setAddErrorMessage(error.message || "Erro ao criar subcategoria");
        } else {
            setAddErrorMessage("Erro ao criar subcategoria");
        }
        setAlertMessage("Não foi possível criar a subcategoria.");
        setAlertType("error");
    }
  };

  const handleEditClick = (sc: Subcategory) => {
    setSubcategoryToEdit(sc);
    setEditNewName(sc.name);
    setEditErrorMessage("");
    setShowEditModal(true);
  };

  const handleSaveEditSubcategory = async () => {
    if (editNewName.trim().length < 5) {
      setEditErrorMessage("O nome da subcategoria deve ter pelo menos 5 caracteres.");
      return;
    }

    if (!subcategoryToEdit) return;

    try {
      // Reutilizando Update DTO, assumindo que precisa passar { id, name }
      const updated = await updateSubcategory(subcategoryToEdit.id, { id: subcategoryToEdit.id, name: editNewName.trim() });
      setSubcategories((prev) =>
        prev.map((sc) => (sc.id === subcategoryToEdit.id ? updated : sc))
      );
      setShowEditModal(false);
      setEditNewName("");
      setEditErrorMessage("");

      setAlertMessage("Subcategoria atualizada com sucesso!");
      setAlertType("success");
    } catch (error: unknown) {
        if (error instanceof Error) {
            setEditErrorMessage(error.message || "Erro ao atualizar subcategoria");
            } else {
                setEditErrorMessage("Erro ao atualizar subcategoria");
        }
        setAlertMessage("Não foi possível atualizar a subcategoria.");
        setAlertType("error");
    }
  };

  const handleDeleteClick = (sc: Subcategory) => {
    setSubcategoryToDelete(sc);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!subcategoryToDelete) return;
    try {
      await deleteSubcategory(subcategoryToDelete.id);
      setSubcategories((prev) => prev.filter((s) => s.id !== subcategoryToDelete.id));
      setShowDeleteModal(false);
      setAlertMessage("Subcategoria excluída com sucesso!");
      setAlertType("success");
    } catch (error: unknown) {
        if (error instanceof Error) {
            setAlertMessage(error.message || "Erro ao excluir subcategoria");
        } else {
            setAlertMessage("Erro ao excluir subcategoria");
        }
      setShowDeleteModal(false);
      setAlertMessage("Não foi possível excluir a subcategoria.");
      setAlertType("error");
    }
  };

  console.log(initialSubcategories);
  // Filtrar e ordenar
  let filtered = subcategories.filter((sc) =>
    sc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filtered = filtered.sort((a, b) => {
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
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

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
        <h1 className="text-3xl font-bold">Subcategorias</h1>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar subcategoria..."
            className="border border-foreground rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddSubcategoryClick}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90"
        >
          Adicionar Subcategoria
        </button>
      </div>

      <SubcategoriesTable
        subcategories={paginated}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Paginação */}
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

      {showAddModal && (
        <AddSubcategoryModal
          name={newSubcategoryName}
          setName={setNewSubcategoryName}
          categoryId={newSubcategoryCatId}
          setCategoryId={setNewSubcategoryCatId}
          errorMessage={addErrorMessage}
          onCancel={() => setShowAddModal(false)}
          onSave={handleSaveSubcategory}
          categories={categories}
        />
      )}

      {showEditModal && subcategoryToEdit && (
        <EditSubcategoryModal
          currentName={subcategoryToEdit.name}
          newName={editNewName}
          setNewName={setEditNewName}
          errorMessage={editErrorMessage}
          onCancel={() => setShowEditModal(false)}
          onSave={handleSaveEditSubcategory}
        />
      )}

      {showDeleteModal && subcategoryToDelete && (
        <DeleteSubcategoryModal
          subcategoryName={subcategoryToDelete.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
