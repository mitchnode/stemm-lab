import { useTheme } from "@/theme";
import {
    CameraType,
    CameraView,
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const { colors } = useTheme();
  const [facing, setFacing] = useState<CameraType>("back");
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isRecording, setRecording] = useState(false);

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

  const toggleRecord = async () => {
    if (isRecording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log(video);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        mode="video"
        ref={ref}
      />
      {isRecording && (
        <View style={{ ...styles.record, backgroundColor: "red" }} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            ...styles.button,
            borderColor: "white",
            backgroundColor: "red",
          }}
          onPress={toggleRecord}
        />
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
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 64,
  },
  button: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 50,
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
