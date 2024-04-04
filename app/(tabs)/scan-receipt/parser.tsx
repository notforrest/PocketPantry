import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Parser() {
  const { selectedImage } = useLocalSearchParams();
  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const parsePicture = async () => {
    if (selectedImage) {
      const apiKey = "AIzaSyDFOfZ6SLPXEoDvF7RqdML5NXxOfySeKa4"; // Replace with your API key
      const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64Image = await convertImageToBase64(selectedImage.toString());

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
          const annotations = data.responses[0].textAnnotations;
          if (annotations && annotations.length > 0) {
            // setText(annotations[0].description);
            setText(parseHEBReceipt(annotations[0].description)); // Parse the detected text
            setShowConfirmation(true);
          } else {
            // setText("No text detected");
            setText("");
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
        setIngredients((prev) => [...prev, name]);
        return `${index + 1}) ${name}`;
      })
      .join("\n");
    return items;
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {selectedImage ? (
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: selectedImage.toString() }}
              style={styles.image}
            />
            <View style={{ flexDirection: "row", gap: 40 }}>
              <Button title="Redo Image" onPress={() => router.back()} />
              <Button title="Accept Image" onPress={parsePicture} />
            </View>
            {showConfirmation && (
              <View>
                <Text style={styles.header}>Your Ingredients</Text>
                <Text style={styles.body}>{text}</Text>
                <Button
                  title="Confirm Ingredients"
                  onPress={() => {
                    router.push("/scan-receipt/confirmation");
                    router.setParams({ ingredients });
                  }}
                />
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
        {/* <View style={styles.container}>
          <Text style={styles.header}>Paste text from a receipt</Text>
          <TextInput
            multiline
            numberOfLines={4}
            onEndEditing={(e) => setText(e.nativeEvent.text)}
            placeholder="Enter text"
            returnKeyType="done"
            style={styles.text}
          />
          <Button
            title="Parse"
            onPress={() => setOutput(parseHEBReceipt(text))}
          />
          <Text style={styles.output}>{output}</Text>
        </View> */}
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 20,
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
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
