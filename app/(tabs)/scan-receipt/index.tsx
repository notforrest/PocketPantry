import { Ionicons } from "@expo/vector-icons";
import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);

  let camera: Camera | null = null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Take a picture using Expo Image Manipulator
  const takePicture = async () => {
    if (!camera) return;

    let photo = await camera.takePictureAsync();
    photo = await ImageManipulator.manipulateAsync(photo.uri, [], {
      compress: 0.5,
    });

    setSelectedImage(photo.uri);
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
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
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <Camera
            autoFocus={focus}
            style={styles.camera}
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
                <Ionicons name="camera-reverse" size={40} color="white" />
              </Pressable>
              <Pressable
                onPress={() => {
                  takePicture();
                }}
                style={styles.takePicButton}
              >
                <Ionicons name="scan-circle" size={100} color="white" />
              </Pressable>
              <Pressable onPress={() => pickImageAsync()}>
                <Ionicons name="images" size={35} color="white" />
              </Pressable>
            </View>
          </Camera>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
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
    height: Dimensions.get("window").height * 0.8,
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
  },
});
