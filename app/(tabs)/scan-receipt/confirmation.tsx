import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { IngredientsContext } from "../../../components/IngredientsContext";

export default function ConfirmPage() {
  const [ingredientIndex, setIngredientIndex] = useState<number>(0);
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [rejectedIngredients, setRejectedIngredients] = useState<string[]>([]);
  const [itemsVisible, setItemsVisible] = useState<boolean>(true);

  const {
    tempIngredients: ingredients,
    addNewIngredients,
    clearTempIngredients,
  } = useContext(IngredientsContext);

  const handleDelete = (index: number) => {
    const newConfirmedIngredients = [...confirmedIngredients];
    setRejectedIngredients([
      ...rejectedIngredients,
      newConfirmedIngredients[index],
    ]);
    newConfirmedIngredients.splice(index, 1);
    setConfirmedIngredients(newConfirmedIngredients);
  };

  const handleUndo = (index: number) => {
    const newRejectedIngredients = [...rejectedIngredients];
    setConfirmedIngredients([
      ...confirmedIngredients,
      newRejectedIngredients[index],
    ]);
    newRejectedIngredients.splice(index, 1);
    setRejectedIngredients(newRejectedIngredients);
  };

  const handleEdit = (index: number, section: string, oldName: string) => {
    Alert.prompt(
      "Edit Ingredient",
      "Enter the new ingredient",
      (newIngredient) => {
        if (newIngredient) {
          if (section === "Accepted Ingredients") {
            const newConfirmedIngredients = [...confirmedIngredients];
            newConfirmedIngredients[index] = newIngredient;
            setConfirmedIngredients(newConfirmedIngredients);
          } else {
            const newRejectedIngredients = [...rejectedIngredients];
            newRejectedIngredients[index] = newIngredient;
            setRejectedIngredients(newRejectedIngredients);
          }
        }
      },
      "plain-text",
      oldName,
    );
  };

  useEffect(() => {
    if (ingredientIndex === ingredients?.length) {
      setItemsVisible(false);
    }
  });

  return (
    <View style={styles.container}>
      {ingredients && (
        <View>
          <Text style={styles.title}>Confirm Ingredients</Text>
          {itemsVisible && (
            <>
              <Text style={styles.body}>{ingredients[ingredientIndex]}</Text>

              <View style={styles.buttons}>
                <Button
                  title="Reject"
                  onPress={() => {
                    setRejectedIngredients([
                      ...rejectedIngredients,
                      ingredients[ingredientIndex],
                    ]);
                    setIngredientIndex(ingredientIndex + 1);
                  }}
                />
                <Button
                  title="Accept"
                  onPress={() => {
                    setConfirmedIngredients([
                      ...confirmedIngredients,
                      ingredients[ingredientIndex],
                    ]);
                    setIngredientIndex(ingredientIndex + 1);
                  }}
                />
                <Button
                  title="Accept All"
                  onPress={() => {
                    setConfirmedIngredients([
                      ...confirmedIngredients,
                      ...ingredients.slice(ingredientIndex),
                    ]);
                    setIngredientIndex(ingredients.length);
                  }}
                />
              </View>
            </>
          )}
        </View>
      )}
      <View style={styles.list}>
        <SectionList
          sections={[
            { title: "Accepted Ingredients", data: confirmedIngredients },
            { title: "Rejected Ingredients", data: rejectedIngredients },
          ]}
          renderItem={({ item, index, section }) => (
            <View style={styles.item}>
              <Text style={{ width: 290 }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity
                  onPress={() => handleEdit(index, section.title, item)}
                >
                  <Ionicons name="pencil" size={20} color="black" />
                </TouchableOpacity>
                {section.title === "Accepted Ingredients" ? (
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <Ionicons name="trash" size={20} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleUndo(index)}>
                    <Ionicons name="arrow-undo" size={20} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => item + index}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          addNewIngredients(confirmedIngredients);
          clearTempIngredients();
          router.navigate("/my-pantry");
          router.dismissAll();
        }}
        disabled={ingredientIndex !== ingredients?.length}
      >
        <Text style={styles.doneButton}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    marginTop: 45,
    bottom: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: "center",
  },
  body: {
    fontSize: 18,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 16,
    justifyContent: "center",
  },
  sectionHeader: {
    backgroundColor: "mintcream",
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    textAlign: "center",
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doneButton: {
    alignSelf: "center",
    backgroundColor: "mintcream",
    bottom: 0,
    fontSize: 24,
    paddingVertical: 10,
    position: "absolute",
    textAlign: "center",
    width: "100%",
  },
});
