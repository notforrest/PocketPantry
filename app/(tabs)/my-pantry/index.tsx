import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  id: number;
  title: string;
  data: string[];
};

export default function MyPantry() {
  const { newItems } = useLocalSearchParams<{ [key: string]: string[] }>();
  const [itemEditable, setItemEditable] = useState<boolean>(false);
  const [editableSectionId, setEditableSectionId] = useState<number>(0);
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: "Refrigerator", data: ["a", "b", "c", "d"] },
    { id: 2, title: "Kitchen Counter", data: ["e", "f", "g", "h"] },
    { id: 3, title: "Unsorted", data: [] },
  ]);
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    Array(sections.length).fill(false),
  );
  const [addLocationModalVisible, setAddLocationModalVisible] =
    useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [showDeletes, setShowDeletes] = useState<boolean>(false);
  const [showEdits, setShowEdits] = useState<boolean>(false);

  console.log(newItems);

  // TODO: Implement handleDelete function
  const handleDelete = (index: number) => {
    Alert.alert(
      "Delete Section",
      "Are you sure you want to delete this section?\n\nThis will delete all of your items in this section.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setSections((prevSections) =>
              prevSections.filter((section, i) => i !== index),
            ),
        },
      ],
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setSections(
      sections.map((section) =>
        section.id === editableSectionId
          ? { ...section, title: newTitle }
          : section,
      ),
    );
  };

  const addSection = (title: string, data: string[] = []) => {
    setSections((prevSections) => [
      ...prevSections,
      { id: prevSections.length + 1, title, data },
    ]);
  };

  const toggleCollapse = (index: number) => {
    setIsCollapsed(
      isCollapsed.map((value, i) => (i === index ? !value : value)),
    );
  };

  useEffect(() => {
    if (newItems) {
      setSections((prevSections) => {
        const unsortedSectionIndex = prevSections.findIndex(
          (section) => section.title === "Unsorted",
        );
        if (unsortedSectionIndex !== -1) {
          const unsortedSection = prevSections[unsortedSectionIndex];
          const updatedUnsortedSection = {
            ...unsortedSection,
            data: [...unsortedSection.data, ...newItems],
          };
          const updatedSections = [...prevSections];
          updatedSections[unsortedSectionIndex] = updatedUnsortedSection;
          return updatedSections;
        } else {
          addSection("Unsorted", newItems);
          return prevSections;
        }
      });
    }
  }, [JSON.stringify(newItems)]);

  useEffect(() => {
    setIsCollapsed([...isCollapsed, true]);
  }, [sections]);

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.title}>My Pantry</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => setIsCollapsed(Array(sections.length).fill(false))}
        >
          <Ionicons name="chevron-expand" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsCollapsed(Array(sections.length).fill(true))}
        >
          <Ionicons name="chevron-collapse" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAddLocationModalVisible(true)}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEdits(!showEdits)}>
          <Ionicons name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDeletes(!showDeletes)}>
          <Ionicons name="trash" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        renderItem={({ item, index, section }) => (
          <Collapsible collapsed={isCollapsed[sections.indexOf(section)]}>
            <View style={styles.sectionItem}>
              <TextInput style={{ fontSize: 16 }}>{item}</TextInput>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity
                  style={{ display: showEdits ? "flex" : "none" }}
                  onPress={() => setItemEditable(true)}
                >
                  <Ionicons name="pencil" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ display: showDeletes ? "flex" : "none" }}
                  onPress={() => handleDelete(index)}
                >
                  <Ionicons name="trash" size={18} color="black" />
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
            <TextInput
              editable={section.id === editableSectionId}
              onChangeText={handleTitleChange}
              onEndEditing={() => setEditableSectionId(0)}
              style={styles.sectionHeader}
              value={section.title}
            />
            <View style={styles.sectionHeaderButtons}>
              <TouchableOpacity
                style={{ display: showEdits ? "flex" : "none" }}
                onPress={() => setEditableSectionId(section.id)}
              >
                <Ionicons name="pencil" size={18} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ display: showDeletes ? "flex" : "none" }}
                onPress={() => handleDelete(sections.indexOf(section))}
              >
                <Ionicons name="trash" size={18} color="black" />
              </TouchableOpacity>
              <Ionicons
                name={
                  isCollapsed[sections.indexOf(section)]
                    ? "chevron-down"
                    : "chevron-up"
                }
                size={24}
                color="black"
              />
            </View>
          </Pressable>
        )}
        keyExtractor={(item, index) => item + index}
      />
      <Modal
        animationType="slide"
        transparent
        visible={addLocationModalVisible}
      >
        <View style={styles.centered}>
          <View style={styles.modal}>
            <TextInput
              autoFocus
              onChangeText={setLocationName}
              onSubmitEditing={() => {
                if (locationName) {
                  addSection(locationName);
                  setAddLocationModalVisible(false);
                } else {
                  Alert.alert("Please enter a location name.");
                }
              }}
              placeholder="Enter location"
              placeholderTextColor="gray"
              selectTextOnFocus
              style={styles.modalText}
            />
            <View style={styles.buttons}>
              <Button
                title="Cancel"
                onPress={() => setAddLocationModalVisible(false)}
              />
              <Button
                title="Add"
                onPress={() => {
                  if (locationName) {
                    addSection(locationName);
                    setAddLocationModalVisible(false);
                  } else {
                    Alert.alert("Please enter a location name.");
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    fontSize: 40,
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
  sectionHeaderButtons: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  sectionItem: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modal: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
  buttons: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 40,
  },
});
