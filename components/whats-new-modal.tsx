import { Modal, Text, View, Button, StyleSheet } from "react-native";

import { Theme, useTheme } from "../utils/ThemeProvider";

export const WhatsNewModal = () => {
  const styles = getOnboardingStyles(useTheme());
  return (
    <Modal animationType="slide" transparent>
      <View style={styles.centered}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>What's New:</Text>
          <Text style={styles.modalBody}>Version 1.0: updated Expo!</Text>
          <Button title="Got it!" />
        </View>
      </View>
    </Modal>
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
      textAlign: "center",
    },
    modalBody: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
    },
  });
