import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export default function MyPantry() {
  const { newItems } = useLocalSearchParams<{ [key: string]: string[] }>();
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [editable, setEditable] = useState<boolean>(false);

  console.log(pantryItems);

  const handleDelete = (index) => {
    const newPantryItems = [...pantryItems];
    newPantryItems.splice(index, 1);
    setPantryItems(newPantryItems);
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton onPress={() => close} style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

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
          { title: "Food", data: pantryItems },
          // {
          //   title: "Vegetables",
          //   data: pantryItems.filter((item) => item === "Vegetable"),
          // },
          // {
          //   title: "Grains",
          //   data: pantryItems.filter((item) => item === "Grain"),
          // },
          // {
          //   title: "Proteins",
          //   data: pantryItems.filter((item) => item === "Protein"),
          // },
          // {
          //   title: "Dairy",
          //   data: pantryItems.filter((item) => item === "Dairy"),
          // },
          // {
          //   title: "Other",
          //   data: pantryItems.filter((item) => item === "Other"),
          // },
        ]}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <TextInput
              editable={editable}
              onSubmitEditing={(e) => (pantryItems[index] = e.nativeEvent.text)}
            >
              {item}
            </TextInput>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    marginTop: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    textAlign: "center",
  },
  item: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    backgroundColor: "#497AFC",
    flex: 1,
    justifyContent: "center",
  },
});
