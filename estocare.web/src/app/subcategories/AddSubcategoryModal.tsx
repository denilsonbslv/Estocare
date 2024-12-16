"use client";

interface AddSubcategoryModalProps {
  name: string;
  setName: (value: string) => void;
  categoryId: number;
  setCategoryId: (value: number) => void;
  errorMessage: string;
  onCancel: () => void;
  onSave: () => void;
  categories: { id: number; name: string }[]; // Lista de categorias para selecionar
}

export default function AddSubcategoryModal({
  name,
  setName,
  categoryId,
  setCategoryId,
  errorMessage,
  onCancel,
  onSave,
  categories
}: AddSubcategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-foreground p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Adicionar Subcategoria</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da subcategoria"
          className="border border-foreground rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary mb-2"
        />

        <select
          className="border border-foreground rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary mb-2"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value={0}>Selecione uma categoria...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

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
