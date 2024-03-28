import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");

  const { width, height } = Dimensions.get("window");

  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (!camera) return;

    let photo = await camera.takePictureAsync();
    photo = await ImageManipulator.manipulateAsync(photo.uri, [], {
      compress: 0.5,
    });

    setCapturedImage(photo.uri);

    const apiKey = "API KEY"; // Replace with your API key
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const base64Image = await convertImageToBase64(photo.uri);

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
          setDetectedText(annotations[0].description);
          setOutput(parseHEBReceipt(annotations[0].description)); // Parse the detected text
        } else {
          setDetectedText("No text detected");
          setOutput("");
        }
      })
      .catch((error) => console.error("Error:", error));
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

  let camera: Camera | null = null;

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

  // Auto Focus code borrowed from: https://github.com/expo/expo/issues/26869#issuecomment-2001925877
  const [focus, setFocus] = useState<AutoFocus>(AutoFocus.on);

  const updateCameraFocus = () => setFocus(AutoFocus.off);

  // Switch autofocus back to "on" after 50ms, this refocuses the camera
  useEffect(() => {
    if (focus !== AutoFocus.off) return;
    const timeout = setTimeout(() => setFocus(AutoFocus.on), 50);
    return () => clearTimeout(timeout);
  }, [focus]);

  // Refocus camera every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => updateCameraFocus(), 2000);
    return () => clearInterval(interval);
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Camera
            autoFocus={focus}
            style={{ width: width, height: height * 0.8 }}
            type={CameraType.back}
            ref={(ref) => {
              camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                title="Take Picture"
                onPress={takePicture}
                style={{ marginBottom: 10 }}
              />
            </View>
          </Camera>
          {capturedImage && (
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: capturedImage }}
                style={{ width: 300, height: 300, marginBottom: 10 }}
              />
              {/* <Text style={{ marginBottom: 10 }}>Detected Text:</Text> */}
              {/* <Text>{detectedText}</Text> */}
              <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
                New Ingredients:
              </Text>
              <Text>{output}</Text>
              <Button
                title="Generate Recipes"
                onPress={generateRecipes}
                style={{ marginTop: 10 }}
              />
              <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
                Generated Recipe:
              </Text>
              <Text>{recipe}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
