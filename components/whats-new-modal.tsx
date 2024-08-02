import { Modal, Text, View, Button, StyleSheet } from "react-native";

import { Theme, useTheme } from "../utils/ThemeProvider";

type WhatsNewModalProps = {
  version: string;
  changes: string;
  onClose: () => void;
};

export const WhatsNewModal = (props: WhatsNewModalProps) => {
  const styles = getOnboardingStyles(useTheme());
  return (
    <Modal animationType="slide" transparent>
      <View style={styles.centered}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>What's New in v{props.version}:</Text>
          <Text style={styles.modalBody}>{props.changes}</Text>
          <Button title="Got it!" onPress={props.onClose} />
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
