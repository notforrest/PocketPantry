import { router } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { WhatsNewModal } from "../../components/whats-new-modal";
import { Theme, useTheme } from "../../utils/ThemeProvider";

export default function HomePage() {
  const styles = getStyles(useTheme());

  const handlePress = () => {
    // Navigate to the Scanner page
    router.navigate("./scan-receipt");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <WhatsNewModal
          version="1.0.0"
          changes="This is the first version of the app."
        />
      </View>

      <Text style={styles.title}>Welcome to Pocket Pantry!</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Scan to Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: 40,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 20,
      width: "80%",
    },
    button: {
      ...theme.button,
    },
    buttonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
    },
  });
