import { getAllSubcategories } from "@/services/subcategories";
import SubcategoriesList from "./SubcategoriesList";

export const metadata = {
  title: "Subcategorias | Estocare",
  description: "Gerencie suas subcategorias no sistema Estocare.",
};

export default async function SubcategoriesPage() {
  const subcategories = await getAllSubcategories();
  return <SubcategoriesList initialSubcategories={subcategories} />;
}
