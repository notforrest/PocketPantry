import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Button,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { IngredientsContext } from "../../../components/IngredientsContext";
import { FlatList } from "react-native-gesture-handler";

export default function ManualPage() {
  const [ingredientIndex, setIngredientIndex] = useState<number>(0);
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [ingredient, setIngredient] = useState<string>("");
  const textRef = useRef();

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
          style={{ fontSize: 20, marginTop: 10 }}
        />
        <Button
          title="Add"
          onPress={() => {
            if (ingredient !== "") {
              setConfirmedIngredients([...confirmedIngredients, ingredient]);
              setIngredient("");
            }
          }}
        />
        {ingredients.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </View>
      <View style={styles.list}>
        <FlatList
          data={confirmedIngredients}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={{ fontSize: 20, width: 290 }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity onPress={() => handleEdit(index, item)}>
                  <Ionicons name="pencil" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash" size={20} color="black" />
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
  page: {
    flex: 1,
    marginTop: 40,
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
    fontSize: 24,
    fontWeight: "bold",
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
