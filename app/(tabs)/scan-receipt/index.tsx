import { Ionicons } from "@expo/vector-icons";
import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Link, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Pressable,
  StyleSheet,
} from "react-native";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);

  const { width, height } = Dimensions.get("window");

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

    const apiKey = "AIzaSyDFOfZ6SLPXEoDvF7RqdML5NXxOfySeKa4"; // Replace with your API key
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
            type={cameraType}
            ref={(ref) => {
              camera = ref;
            }}
          >
            <View style={styles.takePicCont}>
              <Pressable
                onPress={() =>
                  setCameraType(
                    cameraType === CameraType.back
                      ? CameraType.front
                      : CameraType.back,
                  )
                }
              >
                <Ionicons name="camera-reverse" size={30} color="white" />
              </Pressable>
              <Link
                push
                href={{
                  pathname: "/scan-receipt/parser",
                  params: { capturedImage, output },
                }}
                asChild
              >
                <Pressable
                  onPress={() => {
                    takePicture();
                  }}
                  style={styles.takePicButton}
                >
                  <Text style={styles.takePicText}>Take Picture</Text>
                </Pressable>
              </Link>
            </View>
          </Camera>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  takePicCont: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  takePicButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  takePicText: {
    color: "white",
    fontSize: 20,
  },
});
