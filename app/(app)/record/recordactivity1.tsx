/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import Slider from "@react-native-community/slider";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Video, { VideoRef } from "react-native-video";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const colors = {
  background: "#121212",
  text: "#FFFFFF",
  primary: "#2196F3",
  success: "#4CAF50",
  accent: "#FF9800",
};

interface Coordinate {
  x: number;
  y: number;
}

export default function MeasureDropScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isRecordingMode, setIsRecordingMode] = useState(true);

  // Hardware Ref & Status Hooks
  const cameraRef = useRef<CameraView>(null);
  const videoRef = useRef<VideoRef>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  // Video Playback States
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Measurement States
  const [rulerTop, setRulerTop] = useState<Coordinate | null>(null);
  const [rulerBottom, setRulerBottom] = useState<Coordinate | null>(null);
  const [chuteStart, setChuteStart] = useState<Coordinate | null>(null);
  const [chuteEnd, setChuteEnd] = useState<Coordinate | null>(null);
  const [bounce, setBounce] = useState<Coordinate | null>(null);

  // Selection mode tracker
  const [activeMode, setActiveMode] = useState<
    "RULER_TOP" | "RULER_BOTTOM" | "CHUTE_START" | "CHUTE_END" | "CHUTE_BOUNCE"
  >("RULER_TOP");
  const PHYSICAL_RULER_CM = 30; // Your reference physical ruler size

  // Camera  Actions
  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 15,
        });
        if (video?.uri) {
          setVideoUri(video.uri);
          setIsRecordingMode(false);
        }
      } catch (err) {
        console.error("Video record failure:", err);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const handleRequestPermissions = async () => {
    await requestCameraPermission();
    await requestMicPermission();
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  // Capture the exact tap coordinates over the video display layer
  const handleVideoTap = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const coord = { x: locationX, y: locationY };

    if (activeMode === "RULER_TOP") {
      setRulerTop(coord);
      setActiveMode("RULER_BOTTOM");
    } else if (activeMode === "RULER_BOTTOM") {
      setRulerBottom(coord);
      setActiveMode("CHUTE_START");
    } else if (activeMode === "CHUTE_START") {
      setChuteStart(coord);
      setActiveMode("CHUTE_END");
    } else if (activeMode === "CHUTE_END") {
      setChuteEnd(coord);
      setActiveMode("CHUTE_BOUNCE");
    } else if (activeMode === "CHUTE_BOUNCE") {
      setBounce(coord);
    }
  };

  const calculateMetrics = () => {
    if (!rulerTop || !rulerBottom) {
      return { drop: "Awaiting calibration", bounce: "Awaiting calibration" };
    }

    //Calculate pixel delta of the ruler
    const rulerPixelLength = Math.sqrt(
      Math.pow(rulerBottom.x - rulerTop.x, 2) +
        Math.pow(rulerBottom.y - rulerTop.y, 2),
    );

    // Map scale factor: Physical units per single pixel
    const cmPerPixel = PHYSICAL_RULER_CM / rulerPixelLength;

    let dropStr = "Awaiting points...";
    let bounceStr = "Awaiting points...";

    // Calculate initial drop distance
    if (chuteStart && chuteEnd) {
      const chutePixelDelta = Math.sqrt(
        Math.pow(chuteEnd.x - chuteStart.x, 2) +
          Math.pow(chuteEnd.y - chuteStart.y, 2),
      );
      dropStr = `${(chutePixelDelta * cmPerPixel).toFixed(2)} cm`;
    }

    //calculate bounce.
    if (chuteEnd && bounce) {
      const bouncePixelDelta = Math.sqrt(
        Math.pow(chuteEnd.x - bounce.x, 2) + Math.pow(chuteEnd.y - bounce.y, 2),
      );
      bounceStr = `${(bouncePixelDelta * cmPerPixel).toFixed(2)} cm`;
    }

    return { drop: dropStr, bounce: bounceStr };
  };

  const metrics = calculateMetrics();

  const handleSliderValueChange = (value: number) => {
    setCurrentTime(value);
    videoRef.current?.seek(value);
  };

  const resetCoordinates = () => {
    setRulerTop(null);
    setRulerBottom(null);
    setChuteStart(null);
    setChuteEnd(null);
    setBounce(null);
    setActiveMode("RULER_TOP");
  };

  if (isRecordingMode) {
    if (!cameraPermission?.granted || !micPermission?.granted) {
      return (
        <View
          style={[
            styles.container,
            styles.centered,
            { backgroundColor: colors.background },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              marginBottom: 15,
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            Camera and Audio permissions are required
          </Text>
          <TouchableOpacity
            style={[
              styles.utilityBtn,
              {
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                flex: 0,
              },
            ]}
            onPress={handleRequestPermissions}
          >
            <Text style={styles.btnText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          mode="video"
        />

        {/* recording overlay */}

        <View style={styles.recordingControlsRow}>
          {videoUri && (
            <TouchableOpacity
              style={[styles.smallCircleBtn, { backgroundColor: "#333" }]}
              onPress={() => setIsRecordingMode(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.recordButtonCircle,
              isRecording && { borderColor: "#fff" },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <View
              style={
                isRecording ? styles.recordInnerSquare : styles.recordInnerDot
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render Canvas
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerInstructions}>
        <Text style={[styles.instructionText, { color: "white" }]}>
          Current Mode: {activeMode.replace("_", " ")}
        </Text>
        <Text style={styles.subText}>
          {activeMode === "RULER_TOP" &&
            "Tap the 0cm mark on the physical ruler"}
          {activeMode === "RULER_BOTTOM" &&
            "Tap the 30cm mark on the physical ruler"}
          {activeMode === "CHUTE_START" &&
            "Scrub video to release point, then tap bottom of toy Parachute"}
          {activeMode === "CHUTE_END" &&
            "Scrub video to impact point, then tap bottom of toy Parachute"}
          {activeMode === "CHUTE_BOUNCE" &&
            "Scrub video to peak rebound height, then tap same bottom of toy Parachute"}
        </Text>
      </View>

      <View style={styles.videoCanvas}>
        {videoUri && (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={isPaused}
            onLoad={(data) => setDuration(data.duration)}
            onProgress={(data) => setCurrentTime(data.currentTime)}
          />
        )}

        <TouchableOpacity
          activeOpacity={1}
          onPress={handleVideoTap}
          style={StyleSheet.absoluteFill}
        />

        {/* Anchors */}
        {rulerTop && (
          <View
            style={[
              styles.pin,
              {
                left: rulerTop.x - 6,
                top: rulerTop.y - 6,
                backgroundColor: "black",
              },
            ]}
            pointerEvents="none"
          />
        )}
        {rulerBottom && (
          <View
            style={[
              styles.pin,
              {
                left: rulerBottom.x - 6,
                top: rulerBottom.y - 6,
                backgroundColor: "white",
              },
            ]}
            pointerEvents="none"
          />
        )}
        {chuteStart && (
          <View
            style={[
              styles.pin,
              {
                left: chuteStart.x - 6,
                top: chuteStart.y - 6,
                backgroundColor: "red",
              },
            ]}
            pointerEvents="none"
          />
        )}
        {chuteEnd && (
          <View
            style={[
              styles.pin,
              {
                left: chuteEnd.x - 6,
                top: chuteEnd.y - 6,
                backgroundColor: "blue",
              },
            ]}
            pointerEvents="none"
          />
        )}
        {bounce && (
          <View
            style={[
              styles.pin,
              {
                left: bounce.x - 6,
                top: bounce.y - 6,
                backgroundColor: "green",
              },
            ]}
            pointerEvents="none"
          />
        )}
      </View>

      <View style={styles.controllerUi}>
        <View style={styles.timelineRow}>
          <Text style={{ color: colors.text }}>{currentTime.toFixed(1)}s</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={handleSliderValueChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.text}
            thumbTintColor={colors.primary}
          />
          <Text style={{ color: colors.text }}>{duration.toFixed(1)}s</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.utilityBtn, { backgroundColor: colors.primary }]}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Text style={styles.btnText}>{isPaused ? "Play" : "Pause"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilityBtn, { backgroundColor: "#444" }]}
            onPress={resetCoordinates}
          >
            <Text style={styles.btnText}>Clear Points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilityBtn, { backgroundColor: "#c62828" }]}
            onPress={() => setIsRecordingMode(true)}
          >
            <Text style={styles.btnText}>Retake</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultPanel}>
          <View style={styles.metricColumn}>
            <Text style={styles.resultLabel}>DROP DISTANCE</Text>
            <Text style={[styles.resultValue, { color: colors.success }]}>
              {metrics.drop}
            </Text>
          </View>
          <View style={styles.metricColumn}>
            <Text style={styles.resultLabel}>BOUNCE HEIGHT</Text>
            <Text style={[styles.resultValue, { color: colors.accent }]}>
              {metrics.bounce}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  headerInstructions: {
    padding: 16,
    alignItems: "center",
    paddingTop: 50,
    height: 130,
  },
  instructionText: { fontSize: 16, fontWeight: "bold" },
  subText: { color: "#aaa", fontSize: 12, marginTop: 4, textAlign: "center" },
  videoCanvas: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: "#000",
    position: "relative",
  },
  pin: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
    zIndex: 10,
  },
  controllerUi: { paddingHorizontal: 20, paddingTop: 15, flex: 1 },
  timelineRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  slider: { flex: 1, marginHorizontal: 10, height: 40 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  utilityBtn: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  resultPanel: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metricColumn: { alignItems: "center" },
  resultLabel: { color: "#888", fontSize: 11, letterSpacing: 1 },
  resultValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },

  // Recording View Layouts
  recordingControlsRow: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  recordButtonCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  recordInnerSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fff", // Pure white square
  },
  recordInnerDot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "red",
  },
  smallCircleBtn: {
    padding: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
});
