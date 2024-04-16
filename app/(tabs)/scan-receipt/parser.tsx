import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import { IngredientsContext } from "../../../components/IngredientsContext";
import { API_KEY } from "../../../config";

export default function Parser() {
  const { selectedImage } = useLocalSearchParams();
  const [text, setText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addTempIngredient } = useContext(IngredientsContext);

  const parsePicture = async () => {
    if (selectedImage) {
      const apiKey = API_KEY;
      const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64Image = await convertImageToBase64(selectedImage.toString());

      setIsLoading(true);

      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                },
              ],
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);

          const annotations = data.responses[0].textAnnotations;

          if (annotations && annotations.length > 0) {
            // setText(annotations[0].description);
            setText(parseHEBReceipt(annotations[0].description)); // Parse the detected text
            setShowConfirmation(true);
          } else {
            Alert.alert("No Text Detected", "Please try again.", [
              { text: "OK" },
            ]);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const convertImageToBase64 = async (imageUri: string) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64String = await blobToBase64(blob);
    return base64String;
  };

  const blobToBase64 = async (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result: string | null = reader.result as string;
        if (result) {
          const [, base64Data] = result.split(",");
          resolve(base64Data);
        } else {
          reject(new Error("Failed to read file as base64."));
        }
      };

      reader.readAsDataURL(blob);
    });
  };

  // Parses HEB receipt text
  const parseHEBReceipt = (text: string) => {
    // RegExp to match 1-2 digits followed by whitespace followed by any characters except "Ea."
    const regex = /(^\d{1,2})\s+((?!Ea\.).*)/gm;
    const matches = [...text.matchAll(regex)];

    // Maps the matches to an array to print name
    const items = matches
      .map((item, index) => {
        const [, , name] = item;
        addTempIngredient(name);
        return `${index + 1}) ${name}`;
      })
      .join("\n");
    return items;
  };

  return (
    <ScrollView style={styles.scrollView}>
      {selectedImage ? (
        <View style={styles.container}>
          <Image
            source={{ uri: selectedImage.toString() }}
            style={styles.image}
          />
          {!showConfirmation && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Redo Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={parsePicture}>
                <Text style={styles.buttonText}>Accept Image</Text>
              </TouchableOpacity>
            </View>
          )}
          {isLoading ? (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : null}
          {showConfirmation && (
            <View>
              <Text style={styles.header}>Your Ingredients</Text>
              <Text style={styles.body}>{text}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/scan-receipt/confirmation")}
              >
                <Text style={styles.buttonText}>Confirm Ingredients</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.noImage}>
            No image detected. Go back and take a new picture!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#90d4cc",
  },
  container: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#006D77",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  noImage: {
    fontSize: 36,
    textAlign: "center",
    marginTop: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
  },
});
