import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

export default function MyPantry() {
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const { newItems } = useLocalSearchParams<{ [key: string]: string[] }>();

  useEffect(() => {
    if (newItems) {
      setPantryItems([...pantryItems, ...newItems]);
    }
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Pantry</Text>
      <SectionList
        sections={[
          {
            title: "Food",
            data: pantryItems,
          },
          //   {
          //     title: "Vegetables",
          //     data: pantryItems.filter((item) => item === "Vegetable"),
          //   },
          //   {
          //     title: "Grains",
          //     data: pantryItems.filter((item) => item === "Grain"),
          //   },
          //   {
          //     title: "Proteins",
          //     data: pantryItems.filter((item) => item === "Protein"),
          //   },
          //   {
          //     title: "Dairy",
          //     data: pantryItems.filter((item) => item === "Dairy"),
          //   },
          //   {
          //     title: "Other",
          //     data: pantryItems.filter((item) => item === "Other"),
          //   },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.category}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 20,
    justifyContent: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  category: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    fontSize: 18,
    lineHeight: 36,
  },
});
