import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
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

import { IngredientsContext } from "../../../components/IngredientsContext";

type Section = {
  id: number;
  title: string;
  data: string[];
};

export default function MyPantry() {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: "Refrigerator", data: [] },
    { id: 2, title: "Kitchen Counter", data: [] },
  ]);
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    Array(sections.length).fill(false),
  );
  const [addLocationModalVisible, setAddLocationModalVisible] =
    useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [showDeletes, setShowDeletes] = useState<boolean>(false);
  const [showEdits, setShowEdits] = useState<boolean>(false);

  const { newIngredients, clearNewIngredients } =
    useContext(IngredientsContext);

  const handleDeleteSection = (index: number) => {
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

  const handleDeleteIngredient = (index: number) => {
    Alert.alert(
      "Delete Ingredient",
      "Are you sure you want to delete this ingredient?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSections((prevSections) =>
              prevSections.map((section) => ({
                ...section,
                data: section.data.filter((_, i) => i !== index),
              })),
            );
          },
        },
      ],
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

  const editItem = (sectionIndex: number, itemIndex: number) => {
    Alert.prompt(
      "Edit Item",
      "Enter the new name for this item:",
      (newName) => {
        if (newName) {
          setSections((prevSections) =>
            prevSections.map((section, i) =>
              i === sectionIndex
                ? {
                    ...section,
                    data: section.data.map((item, j) =>
                      j === itemIndex ? newName : item,
                    ),
                  }
                : section,
            ),
          );
        }
      },
      "plain-text",
      sections[sectionIndex].data[itemIndex],
    );
  };

  const editSection = (sectionIndex: number, oldName: string) => {
    Alert.prompt(
      "Edit Section",
      "Enter the new name for this section:",
      (newName) => {
        if (newName) {
          setSections((prevSections) =>
            prevSections.map((section) =>
              section.id === sectionIndex
                ? { ...section, title: newName }
                : section,
            ),
          );
        }
      },
      "plain-text",
      oldName,
    );
  };

  // Add new items to the "Unsorted" section
  useEffect(() => {
    if (newIngredients.length > 0) {
      setSections((prevSections) => {
        const unsortedSectionIndex = prevSections.findIndex(
          (section) => section.title === "Unsorted",
        );
        if (unsortedSectionIndex !== -1) {
          const unsortedSection = prevSections[unsortedSectionIndex];
          const updatedUnsortedSection = {
            ...unsortedSection,
            data: [...unsortedSection.data, ...newIngredients],
          };
          const updatedSections = [...prevSections];
          updatedSections[unsortedSectionIndex] = updatedUnsortedSection;
          return updatedSections;
        } else {
          return [
            {
              id: prevSections.length + 1,
              title: "Unsorted",
              data: newIngredients,
            },
            ...prevSections,
          ];
        }
      });

      clearNewIngredients();
    }
  }, [newIngredients]);

  useEffect(() => {
    setIsCollapsed([...isCollapsed, true]);

    if (sections[0].title === "Unsorted" && sections[0].data.length === 0) {
      setSections((prevSections) => prevSections.filter((_, i) => i !== 0));
    }
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
          <Ionicons
            name={showDeletes ? "trash-outline" : "trash"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        renderItem={({ item, index, section }) => (
          <Collapsible collapsed={isCollapsed[sections.indexOf(section)]}>
            <View style={styles.sectionItem}>
              <Text style={{ fontSize: 16, width: 290 }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity
                  style={{ display: showEdits ? "flex" : "none" }}
                  onPress={() => editItem(sections.indexOf(section), index)}
                >
                  <Ionicons name="pencil" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ display: showDeletes ? "flex" : "none" }}
                  onPress={() => handleDeleteIngredient(index)}
                >
                  <Ionicons name="trash" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    display:
                      section.title === sections[0].title ? "none" : "flex",
                  }}
                  onPress={() => {
                    const newSectionIndex = sections.indexOf(section) - 1;
                    const newSection = sections[newSectionIndex];
                    const updatedNewSection = {
                      ...newSection,
                      data: [...newSection.data, item],
                    };
                    const updatedSections = [...sections];
                    updatedSections[newSectionIndex] = updatedNewSection;
                    updatedSections[newSectionIndex + 1] = {
                      ...section,
                      data: section.data.filter((_, i) => i !== index),
                    };
                    setIsCollapsed(
                      isCollapsed.map((value, i) =>
                        i === newSectionIndex ? false : value,
                      ),
                    );
                    setSections(updatedSections);
                  }}
                >
                  <Ionicons name="caret-up" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    display:
                      section.title === sections[sections.length - 1].title
                        ? "none"
                        : "flex",
                  }}
                  onPress={() => {
                    const newSectionIndex = sections.indexOf(section) + 1;
                    const newSection = sections[newSectionIndex];
                    const updatedNewSection = {
                      ...newSection,
                      data: [...newSection.data, item],
                    };
                    const updatedSections = [...sections];
                    updatedSections[newSectionIndex] = updatedNewSection;
                    updatedSections[newSectionIndex - 1] = {
                      ...section,
                      data: section.data.filter((_, i) => i !== index),
                    };
                    setIsCollapsed(
                      isCollapsed.map((value, i) =>
                        i === newSectionIndex ? false : value,
                      ),
                    );
                    setSections(updatedSections);
                  }}
                >
                  <Ionicons name="caret-down" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Collapsible>
        )}
        renderSectionHeader={({ section }) => (
          <Pressable
            onPress={() => toggleCollapse(sections.indexOf(section))}
            style={[
              styles.sectionHeader,
              section.title === "Unsorted" && styles.sectionUnsorted,
            ]}
          >
            <Text
              style={[
                styles.sectionHeader,
                section.title === "Unsorted" && styles.sectionUnsorted,
              ]}
            >
              {section.title}
            </Text>
            <View style={styles.sectionHeaderButtons}>
              {section.title !== "Unsorted" && (
                <TouchableOpacity
                  style={{ display: showEdits ? "flex" : "none" }}
                  onPress={() => editSection(section.id, section.title)}
                >
                  <Ionicons name="pencil" size={18} color="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{ display: showDeletes ? "flex" : "none" }}
                onPress={() => handleDeleteSection(sections.indexOf(section))}
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
                if (!locationName || locationName === "Unsorted") {
                  Alert.alert("Please enter a valid location name.");
                } else {
                  addSection(locationName);
                  setAddLocationModalVisible(false);
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
  sectionUnsorted: {
    backgroundColor: "mistyrose",
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
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
