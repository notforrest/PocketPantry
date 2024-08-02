import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { IngredientsContext } from "../../../utils/IngredientsContext";
import { Theme, useTheme } from "../../../utils/ThemeProvider";

export default function Manual() {
  const styles = getStyles(useTheme());
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [ingredient, setIngredient] = useState<string>("");

  const {
    tempIngredients: ingredients,
    addNewIngredients,
    clearTempIngredients,
  } = useContext(IngredientsContext);

  const handleDelete = (index: number) => {
    const newConfirmedIngredients = [...confirmedIngredients];
    newConfirmedIngredients.splice(index, 1);
    setConfirmedIngredients(newConfirmedIngredients);
  };

  const handleEdit = (index: number, oldName: string) => {
    Alert.prompt(
      "Edit Ingredient",
      "Enter the new ingredient",
      (newIngredient) => {
        if (newIngredient) {
          const newConfirmedIngredients = [...confirmedIngredients];
          newConfirmedIngredients[index] = newIngredient;
          setConfirmedIngredients(newConfirmedIngredients);
        }
      },
      "plain-text",
      oldName,
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.input}>
        <Text style={styles.title}>Add Ingredients</Text>
        <TextInput
          autoFocus
          placeholder="Enter an ingredient"
          value={ingredient}
          onChangeText={(text) => setIngredient(text)}
          onSubmitEditing={() => {
            setConfirmedIngredients([...confirmedIngredients, ingredient]);
            setIngredient("");
          }}
          style={{ fontSize: 24 }}
        />
        <TouchableOpacity
          onPress={() => {
            if (ingredient !== "") {
              setConfirmedIngredients([...confirmedIngredients, ingredient]);
              setIngredient("");
            }
          }}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        {ingredients.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </View>
      <View style={styles.list}>
        <FlatList
          data={confirmedIngredients}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={{ fontSize: 20, width: "80%" }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity onPress={() => handleEdit(index, item)}>
                  <SymbolView name="pencil" size={20} tintColor="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <SymbolView name="trash.fill" size={20} tintColor="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => item + index}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          addNewIngredients(confirmedIngredients);
          clearTempIngredients();
          setConfirmedIngredients([]);
          router.navigate("/my-pantry");
        }}
      >
        <Text style={styles.doneButton}>Add All to Pantry</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: theme.background,
      flex: 1,
      paddingTop: 100,
    },
    input: {
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    list: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "center",
    },
    item: {
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addButton: {
      backgroundColor: theme.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 15,
    },
    addButtonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
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
