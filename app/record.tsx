import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const { colors } = useTheme();
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const ref = useRef<CameraView>(null);
  const [isRecording, setRecording] = useState(false);
  const [recButtonColor, setRecButtonColor] = useState("white");
  const [recButtonShape, setRecButtonShape] = useState(50);

  if (!camPermission || !micPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!camPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCamPermission} title="grant permission" />
      </View>
    );
  }

  if (!micPermission.granted) {
    // Microphone permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to record audio
        </Text>
        <Button onPress={requestMicPermission} title="grant permission" />
      </View>
    );
  }

  const storeVideoUri = async (videoUri: string) => {
    try {
      const id = "result" + Date.now();
      await AsyncStorage.setItem(id, videoUri);
      return id;
    } catch (error) {
      console.error("Error saving video uri:", error);
    }
  };

  const toggleRecord = async () => {
    if (isRecording) {
      setRecording(false);
      setRecButtonColor("white");
      setRecButtonShape(50);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    setRecButtonColor("red");
    setRecButtonShape(20);
    const video = await ref.current?.recordAsync();
    if (video) {
      const videoId = await storeVideoUri(video.uri);
      router.push({ pathname: "/results", params: { id: videoId } });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} mode="video" ref={ref} />
      {isRecording && (
        <View style={{ ...styles.record, backgroundColor: "red" }} />
      )}
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              ...styles.button,
              borderColor: "transparent",
              backgroundColor: recButtonColor,
              borderRadius: recButtonShape,
            }}
            onPress={toggleRecord}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonRow: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    padding: 20,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "white",
  },
  button: {
    width: 70,
    height: 70,
    borderWidth: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  record: {
    position: "absolute",
    top: 64,
    left: 32,
    width: 10,
    height: 10,
    borderRadius: 50,
  },
});
