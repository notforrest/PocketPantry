import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useRef, useState } from "react";
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

import { PantryOnboarding } from "../../../components/pantry-onboarding";
import { IngredientsContext } from "../../../utils/IngredientsContext";
import { Theme, useTheme } from "../../../utils/ThemeProvider";

type Section = {
  id: number;
  title: string;
  data: string[];
};

export default function MyPantry() {
  const styles = getStyles(useTheme());
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
  const [step, setStep] = useState(0);

  const { newIngredients, clearNewIngredients } =
    useContext(IngredientsContext);

  const handleDeleteSection = (section: Section) => {
    Alert.alert(
      "Delete Section",
      `Are you sure you want to delete "${section.title}"?\n\nThis will delete all of your items in "${section.title}".`,
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
              prevSections.filter((s) => s.id !== section.id),
            ),
        },
      ],
    );
  };

  const handleDeleteIngredient = (
    section: Section,
    index: number,
    item: string,
  ) => {
    Alert.alert(
      "Delete Ingredient",
      `Are you sure you want to delete "${item}"?`,
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
              prevSections.map((s) =>
                s.id === section.id
                  ? { ...s, data: s.data.filter((_, i) => i !== index) }
                  : s,
              ),
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

  const [btnLayouts, setBtnLayouts] = useState([
    { x: 0, y: 0, width: 0, height: 0 },
    { x: 0, y: 0, width: 0, height: 0 },
    { x: 0, y: 0, width: 0, height: 0 },
    { x: 0, y: 0, width: 0, height: 0 },
    { x: 0, y: 0, width: 0, height: 0 },
  ]);

  const btnRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    const newLayouts = [...btnLayouts];

    setTimeout(() => {
      btnRefs.forEach((ref, i) => {
        if (ref.current) {
          (ref.current as any).measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number,
            ) => {
              newLayouts[i] = { x: pageX, y: pageY, width, height };
            },
          );
        }
      });
    }, 1000);

    setBtnLayouts(newLayouts);
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <PantryOnboarding btnLayouts={btnLayouts} step={step} setStep={setStep} />
      <TouchableOpacity
        onPress={() => setStep(0)}
        style={{ position: "absolute", right: "10%", top: "9%", zIndex: 1 }}
      >
        <SymbolView name="questionmark.circle.fill" tintColor="black" />
      </TouchableOpacity>
      <Text style={styles.title}>My Pantry</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => setIsCollapsed(Array(sections.length).fill(false))}
          ref={btnRefs[0]}
        >
          <SymbolView name="rectangle.expand.vertical" tintColor="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsCollapsed(Array(sections.length).fill(true))}
          ref={btnRefs[1]}
        >
          <SymbolView name="rectangle.compress.vertical" tintColor="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAddLocationModalVisible(true)}
          ref={btnRefs[2]}
        >
          <SymbolView name="rectangle.badge.plus" tintColor="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowEdits(!showEdits)}
          ref={btnRefs[3]}
        >
          <SymbolView
            name={showEdits ? "pencil.slash" : "pencil"}
            tintColor="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDeletes(!showDeletes)}
          ref={btnRefs[4]}
        >
          <SymbolView
            name={showDeletes ? "trash.slash" : "trash"}
            tintColor="black"
          />
        </TouchableOpacity>
      </View>
      <SectionList
        contentContainerStyle={{ paddingBottom: 10 }}
        style={{ flex: 1 }}
        sections={sections}
        renderItem={({ item, index, section }) => (
          <Collapsible collapsed={isCollapsed[sections.indexOf(section)]}>
            <View style={styles.sectionItem}>
              <Text style={{ fontSize: 16, width: "60%" }}>{item}</Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                  style={{ display: showEdits ? "flex" : "none" }}
                  onPress={() => editItem(sections.indexOf(section), index)}
                >
                  <SymbolView name="pencil" size={20} tintColor="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ display: showDeletes ? "flex" : "none" }}
                  onPress={() => handleDeleteIngredient(section, index, item)}
                >
                  <SymbolView name="trash.fill" size={20} tintColor="black" />
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
                  <SymbolView
                    name="chevron.up"
                    resizeMode="scaleAspectFit"
                    tintColor="black"
                  />
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
                  <SymbolView
                    name="chevron.down"
                    resizeMode="scaleAspectFit"
                    tintColor="black"
                  />
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
                  <SymbolView name="pencil" size={18} tintColor="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{ display: showDeletes ? "flex" : "none" }}
                onPress={() => handleDeleteSection(section)}
              >
                <SymbolView name="trash.fill" size={18} tintColor="black" />
              </TouchableOpacity>
              <SymbolView
                name={
                  isCollapsed[sections.indexOf(section)]
                    ? "chevron.down"
                    : "chevron.up"
                }
                resizeMode="scaleAspectFit"
                tintColor="black"
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
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
      backgroundColor: theme.white,
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
      marginVertical: 20,
    },
  });
