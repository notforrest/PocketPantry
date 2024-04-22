import { createContext } from "react";

export interface IngredientsContextProps {
  ingredients: string[];
  tempIngredients: string[];
  newIngredients: string[];
  addIngredients: (ingredients: string[]) => void;
  removeIngredient: (ingredient: string) => void;
  addTempIngredients: (tempIngredient: string[]) => void;
  clearTempIngredients: () => void;
  addNewIngredients: (tempIngredients: string[]) => void;
  clearNewIngredients: () => void;
}

export const IngredientsContext = createContext<IngredientsContextProps>({
  ingredients: [],
  tempIngredients: [],
  newIngredients: [],
  addIngredients: () => {},
  removeIngredient: () => {},
  addTempIngredients: () => {},
  clearTempIngredients: () => {},
  addNewIngredients: () => {},
  clearNewIngredients: () => {},
});
