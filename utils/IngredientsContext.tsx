import { createContext } from "react";

export type Ingredient = {
  name: string;
  expiryDate?: string;
};

export interface IngredientsContextProps {
  ingredients: Ingredient[];
  tempIngredients: Ingredient[];
  newIngredients: Ingredient[];
  addIngredients: (ingredients: Ingredient[]) => void;
  removeIngredient: (ingredient: Ingredient) => void;
  addTempIngredients: (tempIngredient: Ingredient[]) => void;
  clearTempIngredients: () => void;
  addNewIngredients: (tempIngredients: Ingredient[]) => void;
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
