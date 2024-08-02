import { router, useFocusEffect } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [rejectedIngredients, setRejectedIngredients] = useState<string[]>([]);

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
          if (section !== "Trash") {
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        clearTempIngredients();
      };

      return onBackPress;
    }, [clearTempIngredients]),
  );

  // Bring all ingredients from parser screen to confirm screen
  useEffect(() => {
    setConfirmedIngredients(ingredients);
  }, [ingredients]);

  return (
    <View style={styles.container}>
      {ingredients && (
        <View>
          <Text style={styles.title}>Confirm Ingredients</Text>
          <Text style={styles.titleDesc}>
            Click
            <SymbolView name="pencil" resizeMode="center" tintColor="black" />
            {"to edit\nClick"}
            <SymbolView
              name="trash.fill"
              resizeMode="center"
              tintColor="black"
            />
            to delete
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingBottom: 10 }}
          sections={[
            { title: "To Pantry", data: confirmedIngredients },
            { title: "Trash", data: rejectedIngredients },
          ]}
          renderItem={({ item, index, section }) => (
            <View style={styles.item}>
              <Text style={{ width: "80%" }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity
                  onPress={() => handleEdit(index, section.title, item)}
                >
                  <SymbolView name="pencil" tintColor="black" />
                </TouchableOpacity>
                {section.title === "Trash" ? (
                  <TouchableOpacity onPress={() => handleUndo(index)}>
                    <SymbolView name="arrow.uturn.backward" tintColor="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <SymbolView name="trash.fill" tintColor="black" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <Text
              style={
                section.title === "Trash"
                  ? styles.sectionHeaderTrash
                  : styles.sectionHeader
              }
            >
              {section.title}
            </Text>
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
        >
          <Text style={styles.doneButtonText}>Add to Pantry</Text>
        </TouchableOpacity>
      </View>
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
      marginTop: 24,
      textAlign: "center",
    },
    titleDesc: {
      fontSize: 16,
      marginVertical: 16,
      textAlign: "center",
      lineHeight: 30,
    },
    body: {
      fontSize: 18,
      textAlign: "center",
    },
    sectionHeader: {
      backgroundColor: theme.primarydark,
      color: theme.black,
      fontSize: 16,
      fontWeight: "bold",
      padding: 10,
      textAlign: "center",
    },
    sectionHeaderTrash: {
      backgroundColor: theme.gray,
      color: theme.black,
      fontSize: 16,
      fontWeight: "bold",
      padding: 10,
      textAlign: "center",
    },
    item: {
      alignItems: "center",
      backgroundColor: theme.background,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    doneButton: {
      backgroundColor: theme.secondary,
      flex: 0.06,
      justifyContent: "center",
      paddingVertical: 10,
    },
    doneButtonText: {
      color: theme.white,
      fontSize: 24,
      textAlign: "center",
    },
  });
