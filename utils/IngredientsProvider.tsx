import { useState } from "react";

import {
  IngredientsContext,
  IngredientsContextProps,
} from "./IngredientsContext";

const IngredientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);
  const [newIngredients, setNewIngredients] = useState<string[]>([]);

  // Add finalized ingredients to real list
  const addIngredients = (ingredients: string[]) => {
    setIngredients((prevIngredients) => [...prevIngredients, ...ingredients]);
  };

  // Remove ingredient from real list
  const removeIngredient = (ingredient: string) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((i) => i !== ingredient),
    );
  };

  // Add ingredients to temp list for Parser.tsx when parsing the receipt
  const addTempIngredients = (tempIngredients: string[]) => {
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
  const addNewIngredients = (newIngredients: string[]) => {
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
