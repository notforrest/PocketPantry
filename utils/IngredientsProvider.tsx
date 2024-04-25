import { useState } from "react";

import {
  Ingredient,
  IngredientsContext,
  IngredientsContextProps,
} from "./IngredientsContext";

const IngredientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tempIngredients, setTempIngredients] = useState<Ingredient[]>([]);
  const [newIngredients, setNewIngredients] = useState<Ingredient[]>([]);

  // Add finalized ingredients to real list
  const addIngredients = (ingredients: Ingredient[]) => {
    setIngredients((prevIngredients) => [...prevIngredients, ...ingredients]);
  };

  // Remove ingredient from real list
  const removeIngredient = (ingredient: Ingredient) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((i) => i !== ingredient),
    );
  };

  // Add ingredients to temp list for Parser.tsx when parsing the receipt
  const addTempIngredients = (tempIngredients: Ingredient[]) => {
    setTempIngredients((prevTempIngredients) => [
      ...prevTempIngredients,
      ...tempIngredients,
    ]);
  };

  // Clear temp ingredients list
  const clearTempIngredients = () => {
    setTempIngredients([]);
  };

  // Add new ingredients to new list for Confirmation.tsx
  const addNewIngredients = (newIngredients: Ingredient[]) => {
    setNewIngredients((prevNewIngredients) => [
      ...prevNewIngredients,
      ...newIngredients,
    ]);
  };

  // Clear new ingredients list
  const clearNewIngredients = () => {
    setNewIngredients([]);
  };

  // Create the context value
  const contextValue: IngredientsContextProps = {
    ingredients,
    tempIngredients,
    newIngredients,
    addIngredients,
    removeIngredient,
    addTempIngredients,
    clearTempIngredients,
    addNewIngredients,
    clearNewIngredients,
  };

  return (
    <IngredientsContext.Provider value={contextValue}>
      {children}
    </IngredientsContext.Provider>
  );
};

export default IngredientsProvider;
