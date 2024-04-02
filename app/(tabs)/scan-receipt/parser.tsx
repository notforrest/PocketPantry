import { useLocalSearchParams } from "expo-router";
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
  const [text, setText] = useState("");
  const [recipe, setRecipe] = useState<string>("");
  const { selectedImage } = useLocalSearchParams();

  const parsePicture = async () => {
    if (selectedImage) {
      const apiKey = "API_KEY"; // Replace with your API key
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
        return `${index + 1}) ${name}`;
      })
      .join("\n");
    return items;
  };

  const generateRecipes = async () => {
    try {
      // Hardcoded Apple Pie recipe
      const applePieRecipe = `
        Apple Pie Recipe:
        Ingredients:
        - 6 cups sliced apples
        - 3/4 cup sugar
        - 1 tablespoon all-purpose flour
        - 1/2 teaspoon ground cinnamon
        - 1/4 teaspoon ground nutmeg
        - 1 tablespoon lemon juice
        - 1 package refrigerated pie crusts (2 crusts)
        - 1 tablespoon butter
        Instructions:
        1. Preheat oven to 425 degrees F (220 degrees C).
        2. Mix sugar, flour, cinnamon, nutmeg, and lemon juice in a bowl.
        3. Add apples to the mixture and toss until evenly coated.
        4. Fit 1 pie crust into a 9-inch pie dish. Spoon apple mixture into the crust.
        5. Cut butter into small pieces and dot the top of the apple mixture with butter.
        6. Place the second pie crust on top and crimp the edges to seal.
        7. Cut several slits in the top crust to vent steam.
        8. Bake in preheated oven for 45 to 50 minutes, or until crust is golden brown and filling is bubbly.
        9. Cool on a wire rack before serving. Enjoy!
      `;

      setRecipe(applePieRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {selectedImage ? (
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: selectedImage.toString() }}
              style={{ width: 300, height: 300, marginBottom: 10 }}
            />
            <Button title="Parse Image" onPress={parsePicture} />
            <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
              New Ingredients:
            </Text>
            <Text>{text}</Text>
            <Button title="Generate Recipes" onPress={generateRecipes} />
            <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
              Generated Recipe:
            </Text>
            <Text>{recipe}</Text>
          </View>
        ) : (
          <Text>No image detected.</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  text: {},
  output: {},
});
