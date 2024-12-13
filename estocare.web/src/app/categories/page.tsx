import { getAllCategories } from "@/services/category";
import CategoriesList from "./CategoriesList";

export const metadata = {
  title: "Categorias | Estocare",
  description: "Gerencie suas categorias no sistema Estocare.",
};

export default async function CategoriesPage() {
  // Busca as categorias apenas uma vez no servidor
  const categories = await getAllCategories();

  // Passa as categorias iniciais para o componente cliente
  return <CategoriesList initialCategories={categories} />;
}
