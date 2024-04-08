import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function ConfirmPage() {
  const { ingredients } = useLocalSearchParams<{ [key: string]: string[] }>();
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [rejectedIngredients, setRejectedIngredients] = useState<string[]>([]);
  const [ingredientIndex, setIngredientIndex] = useState<number>(0);
  const [editable, setEditable] = useState<boolean>(false);

  const handleDelete = (index: number) => {
    const newConfirmedIngredients = [...confirmedIngredients];
    newConfirmedIngredients.splice(index, 1);
    setConfirmedIngredients(newConfirmedIngredients);
  };

  return (
    <View style={styles.container}>
      {ingredients && (
        <View>
          <Text style={styles.title}>Confirm Ingredients</Text>
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
        </View>
      )}
      <View style={styles.list}>
        <SectionList
          sections={[
            { title: "Accepted Ingredients", data: confirmedIngredients },
            { title: "Rejected Ingredients", data: rejectedIngredients },
          ]}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <TextInput
                editable={editable}
                onSubmitEditing={(e) =>
                  (confirmedIngredients[index] = e.nativeEvent.text)
                }
              >
                {item}
              </TextInput>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity onPress={() => setEditable(true)}>
                  <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
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
          router.navigate("/my-pantry");
          router.setParams({ newItems: confirmedIngredients });
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
    marginTop: 16,
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
