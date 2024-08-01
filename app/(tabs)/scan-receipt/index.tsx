import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Pressable,
  StyleSheet,
} from "react-native";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [torch, setTorch] = useState<boolean>();

  let camera: CameraView | null = null;

  // Take a picture using Expo Image Manipulator
  const takePicture = async () => {
    if (!camera) return;

    let photo = await camera.takePictureAsync();

    if (photo) {
      photo = await ImageManipulator.manipulateAsync(photo.uri, [], {
        compress: 0.5,
      });

      setSelectedImage(photo.uri);
    }
  };

  // Auto Focus code borrowed from: https://github.com/expo/expo/issues/26869#issuecomment-2001925877
  // const [focus, setFocus] = useState<AutoFocus>(AutoFocus.on);

  // const updateCameraFocus = () => setFocus(AutoFocus.off);

  // Switch autofocus back to "on" after 50ms, this refocuses the camera
  // useEffect(() => {
  //   if (focus !== AutoFocus.off) return;
  //   const timeout = setTimeout(() => setFocus(AutoFocus.on), 50);
  //   return () => clearTimeout(timeout);
  // }, [focus]);

  // Refocus camera every 2 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => updateCameraFocus(), 2000);
  //   return () => clearInterval(interval);
  // }, []);

  // Routes to next step if an image is selected
  useEffect(() => {
    if (selectedImage) {
      router.push("/scan-receipt/parser");
      router.setParams({ selectedImage });
    }
  }, [selectedImage]);

  // Opens image library to select an image
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Camera permissions still loading
  if (!permission) {
    return <View />;
  }

  // If camera permission is not granted, show message to access the library
  if (!permission.granted) {
    return (
      <View style={styles.noCamScreen}>
        <Text>{"No access to camera\nClick to access Library"}</Text>
        <Pressable onPress={() => pickImageAsync()}>
          <Ionicons name="images" size={35} color="black" />
        </Pressable>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <CameraView
          autofocus="off"
          facing={cameraType}
          onCameraReady={() => requestPermission}
          style={styles.camera}
          ref={(ref) => {
            camera = ref;
          }}
        >
          {cameraType === "back" && (
            <Pressable
              onPress={() => setTorch(!torch)}
              style={({ pressed }) => ({
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
                marginBottom: 24,
              })}
            >
              <Ionicons
                name={torch ? "flash" : "flash-off"}
                size={30}
                color="white"
              />
            </Pressable>
          )}
          <View style={styles.takePicCont}>
            <Pressable
              onPress={() =>
                setCameraType(cameraType === "back" ? "front" : "back")
              }
              style={({ pressed }) =>
                pressed ? { opacity: 0.7 } : { opacity: 1 }
              }
            >
              <Ionicons name="camera-reverse" size={40} color="white" />
            </Pressable>
            <Pressable
              onPress={() => {
                takePicture();
              }}
              style={({ pressed }) =>
                pressed ? styles.takePicButtonPressed : styles.takePicButton
              }
            >
              <Ionicons name="scan-circle" size={100} color="white" />
            </Pressable>
            <Pressable
              onPress={() => pickImageAsync()}
              style={({ pressed }) =>
                pressed ? { opacity: 0.7 } : { opacity: 1 }
              }
            >
              <Ionicons name="images" size={35} color="white" />
            </Pressable>
          </View>
        </CameraView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {},
  noCamScreen: {
    alignItems: "center",
    flex: 1,
    gap: 20,
    justifyContent: "center",
  },
  camera: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.81,
    justifyContent: "flex-end",
  },
  takePicCont: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    gap: 40,
  },
  takePicButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 100,
    padding: 5,
    opacity: 1,
  },
  takePicButtonPressed: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 100,
    padding: 5,
    opacity: 0.7,
  },
});
