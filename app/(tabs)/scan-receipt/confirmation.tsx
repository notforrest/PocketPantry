import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IngredientsContext } from "../../../utils/IngredientsContext";
import { Theme, useTheme } from "../../../utils/ThemeProvider";

export default function ConfirmPage() {
  const styles = getStyles(useTheme());
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
                <TouchableOpacity
                  style={styles.rejectAcceptButton}
                  onPress={() => {
                    setRejectedIngredients([
                      ...rejectedIngredients,
                      ingredients[ingredientIndex],
                    ]);
                    setIngredientIndex(ingredientIndex + 1);
                  }}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectAcceptButton}
                  onPress={() => {
                    setConfirmedIngredients([
                      ...confirmedIngredients,
                      ingredients[ingredientIndex],
                    ]);
                    setIngredientIndex(ingredientIndex + 1);
                  }}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectAcceptButton}
                  onPress={() => {
                    setConfirmedIngredients([
                      ...confirmedIngredients,
                      ...ingredients.slice(ingredientIndex),
                    ]);
                    setIngredientIndex(ingredients.length);
                  }}
                >
                  <Text style={styles.buttonText}>Accept All</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
      <SectionList
        sections={[
          { title: "Accepted Ingredients", data: confirmedIngredients },
          { title: "Rejected Ingredients", data: rejectedIngredients },
        ]}
        renderItem={({ item, index, section }) => (
          <View style={styles.item}>
            <Text style={{ width: "80%" }}>{item}</Text>
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
        style={{ flex: 1 }}
      />
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {
          addNewIngredients(confirmedIngredients);
          clearTempIngredients();
          router.navigate("/my-pantry");
          router.dismissAll();
        }}
        disabled={ingredientIndex !== ingredients?.length}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      justifyContent: "space-around",
      marginVertical: 16,
    },
    rejectAcceptButton: {
      backgroundColor: theme.secondary,
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: "bold",
    },
    sectionHeader: {
      backgroundColor: theme.primarydark,
      color: theme.black,
      fontSize: 16,
      fontWeight: "bold",
      padding: 10,
      textAlign: "center",
    },
    item: {
      backgroundColor: theme.background,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    doneButton: {
      backgroundColor: theme.secondary,
      paddingVertical: 10,
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    doneButtonText: {
      color: theme.white,
      fontSize: 24,
      textAlign: "center",
    },
  });
