import { Modal, Text, View, Button, StyleSheet } from "react-native";

import React, { useState } from "react";
import { Theme, useTheme } from "../utils/ThemeProvider";

interface WhatsNewModalProps {
  version: string;
  changes: string;
}

export const WhatsNewModal = ({ version, changes }: WhatsNewModalProps) => {
  const styles = getOnboardingStyles(useTheme());
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <View style={styles.centered}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>What's New in v{version}:</Text>
          <Text style={styles.modalBody}>{changes}</Text>
          <Button title="Got it!" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

const getOnboardingStyles = (_theme: Theme) =>
  StyleSheet.create({
    centered: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
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
