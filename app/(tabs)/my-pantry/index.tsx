import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";

type Section = {
  title: string;
  data: string[];
};

export default function MyPantry() {
  const { newItems } = useLocalSearchParams<{ [key: string]: string[] }>();
  const [editable, setEditable] = useState<boolean>(false);
  const [sections, setSections] = useState<Section[]>([
    { title: "Refrigerator", data: [] },
    { title: "Kitchen Counter", data: [] },
  ]);
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    Array(sections.length).fill(true),
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");

  console.log(sections);

  // TODO: Implement handleDelete function
  const handleDelete = (index: number) => {
    //   const newPantryItems = [...pantryItems];
    //   newPantryItems.splice(index, 1);
    //   setPantryItems(newPantryItems);
  };

  const toggleCollapse = (index: number) => {
    setIsCollapsed(
      isCollapsed.map((value, i) => (i === index ? !value : value)),
    );
  };

  useEffect(() => {
    if (newItems) {
      setSections([{ title: "Refrigerator", data: [...newItems] }]);
    }

    // Placeholder
    setSections([
      { title: "Refrigerator", data: ["a", "b", "c", "d"] },
      {
        title: "Kitchen Counter",
        data: ["e", "f", "g", "h"],
      },
    ]);
  }, []);

  useEffect(() => {
    setIsCollapsed([...isCollapsed, true]);
  }, [sections]);

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.title}>My Pantry</Text>
      <SectionList
        sections={sections}
        renderItem={({ item, index, section }) => (
          <Collapsible collapsed={isCollapsed[sections.indexOf(section)]}>
            <View style={styles.sectionItem}>
              <TextInput>{item}</TextInput>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity onPress={() => setEditable(true)}>
                  <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Collapsible>
        )}
        renderSectionHeader={({ section }) => (
          <Pressable
            onPress={() => toggleCollapse(sections.indexOf(section))}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <Ionicons
              name={
                isCollapsed[sections.indexOf(section)]
                  ? "chevron-down"
                  : "chevron-up"
              }
              size={24}
              color="black"
            />
          </Pressable>
        )}
        keyExtractor={(item, index) => item + index}
      />
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.centered}>
          <View style={styles.modal}>
            <TextInput
              autoFocus
              onChangeText={setLocationName}
              onSubmitEditing={() => {
                setSections([...sections, { title: locationName, data: [] }]);
                setModalVisible(false);
              }}
              placeholder="Enter location"
              placeholderTextColor="gray"
              selectTextOnFocus
              style={styles.modalText}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title="Add"
                onPress={() => {
                  setSections([...sections, { title: locationName, data: [] }]);
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Button title="Add Location" onPress={() => setModalVisible(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 20,
    justifyContent: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  sectionHeader: {
    alignItems: "center",
    backgroundColor: "mintcream",
    flexDirection: "row",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 3,
    textAlign: "center",
  },
  sectionItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 25,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    borderColor: "gray",
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 18,
    marginBottom: 20,
    padding: 10,
    width: 300,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
});
