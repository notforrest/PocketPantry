import { Fragment } from "react";
import { Modal, Text, View, Button, Pressable, StyleSheet } from "react-native";

import { Theme, useTheme } from "../utils/ThemeProvider";

interface PantryOnboardingProps {
  btnLayouts: { x: number; y: number; width: number; height: number }[];
  step: number;
  setStep: (step: number) => void;
}

// Onboarding Element
export const PantryOnboarding = ({
  btnLayouts,
  step,
  setStep,
}: PantryOnboardingProps) => {
  const styles = getOnboardingStyles(useTheme());
  const onboardingText = [
    "This is used to expand all sections.",
    "This is used to collapse all sections.",
    "This is used to add a new location.",
    "This is used to edit items and locations.",
    "This is used to delete items and locations.",
  ];

  return (
    <>
      {step === 0 && (
        <Modal animationType="slide" transparent>
          <View style={styles.centered}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Welcome to your Pantry!</Text>
              <Text style={styles.modalBody}>
                To get started, add items to your pantry by scanning your
                receipt or manually adding ingredients!
              </Text>
              <Button
                title="Got it!"
                onPress={() => {
                  setStep(1);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {step > 0 && step < 6 && (
        <>
          <Pressable
            style={{
              position: "absolute",
              backgroundColor: "black",
              width: "100%",
              height: "110%",
              zIndex: 2,
              opacity: 0.4,
            }}
            onPress={() => setStep(step + 1)}
          />
          {btnLayouts.map((btnLayout, i) => (
            <Fragment key={i}>
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  left: btnLayout.x - 5,
                  top: btnLayout.y - 5,
                  width: btnLayout.width + 10,
                  height: btnLayout.height + 10,
                  borderRadius: 20,
                  opacity: i + 1 === step ? 1 : 0,
                }}
              />
              <Text
                style={{
                  color: "white",
                  position: "absolute",
                  justifyContent: "center",
                  alignSelf: "center",
                  top: "35%",
                  width: "80%",
                  textAlign: "center",
                  fontSize: 20,
                  zIndex: 4,
                  opacity: i + 1 === step ? 1 : 0,
                }}
              >
                {onboardingText[i]}
              </Text>
            </Fragment>
          ))}
        </>
      )}
    </>
  );
};

const getOnboardingStyles = (_theme: Theme) =>
  StyleSheet.create({
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
      marginHorizontal: 20,
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
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    modalBody: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
    },
  });
