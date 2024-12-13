"use client";

interface EditCategoryModalProps {
  categoryName: string;
  newName: string;
  setNewName: (value: string) => void;
  errorMessage: string;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditCategoryModal({
  categoryName,
  newName,
  setNewName,
  errorMessage,
  onCancel,
  onSave,
}: EditCategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-foreground p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Editar Categoria</h2>
        <p className="mb-2">
          Deseja alterar a categoria <strong>{categoryName}</strong>?
        </p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Novo nome da categoria"
          className="border border-foreground rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary mb-2"
        />
        {errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:opacity-90"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
            onClick={onSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
