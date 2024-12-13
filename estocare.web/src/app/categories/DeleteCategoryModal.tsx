"use client";

interface DeleteCategoryModalProps {
  categoryName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteCategoryModal({
  categoryName,
  onCancel,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-foreground p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Excluir Categoria</h2>
        <p className="mb-4">
          Tem certeza que deseja excluir a categoria <strong>{categoryName}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:opacity-90"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
