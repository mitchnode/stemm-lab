import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import Slider from "@react-native-community/slider";
import { CameraView } from "expo-camera";

import Video, { VideoRef } from "react-native-video";

//imported from record activity 1/////////////////
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const colors2 = {
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

export default observer(function PlaybackResults() {
  const { resultID } = useLocalSearchParams();
  const [result] = useState(() => new ResultViewModel());
  const [videoUri, setVideoUri] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const videoPlayer = useVideoPlayer(videoUri || "");
  const audioPlayer = useAudioPlayer(audioUri || "");
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer);

  /////***** ACTIVITY 1 HOOKS */
  // Video Playback States

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const cameraRef = useRef<CameraView>(null);
  const videoRef = useRef<VideoRef>(null);

  // Selection mode tracker
  const [activeMode, setActiveMode] = useState<
    "RULER_TOP" | "RULER_BOTTOM" | "CHUTE_START" | "CHUTE_END" | "CHUTE_BOUNCE"
  >("RULER_TOP");
  const PHYSICAL_RULER_CM = 30; // Your reference physical ruler size

  // Measurement States
  const [rulerTop, setRulerTop] = useState<Coordinate | null>(null);
  const [rulerBottom, setRulerBottom] = useState<Coordinate | null>(null);
  const [chuteStart, setChuteStart] = useState<Coordinate | null>(null);
  const [chuteEnd, setChuteEnd] = useState<Coordinate | null>(null);
  const [bounce, setBounce] = useState<Coordinate | null>(null);

  ///// END OF ACTIVITY 1 HOOKS /////////////////////////

  const loadImage = async (data: string) => {
    setImageUri(data);
  };

  const restoredResults = async () => {
    setLoading(true);
    try {
      await result.handleRestore(resultID.toString());

      console.log("Raw resultData from DB:", result.resultData);

      if (result.resultData) {
        const extension = result.resultData.split(".").at(-1);
        // Check for image data
        if (extension == "jpg") {
          loadImage(result.resultData);
        }
        // Check for video data
        else if (extension == "mp4") {
          setVideoUri(result.resultData);
        }
        // Check for audio data
        else if (extension == "m4a") {
          setAudioUri(result.resultData);
        }
        // Everything else (Graph data)
        else {
          const parsed = result.getResultDataParsed();
          console.log("Total points parsed:", parsed.length); // Should be > 1
          console.log("First point:", parsed[0]);
          // 2. Set it to state
          if (parsed.length > 0) {
            setGraphData(parsed);
          } else {
            console.warn("Parsed data is an empty array!");
          }
        }
      }
    } catch (e) {
      console.error("Critical error during restore:", e);
    } finally {
      setLoading(false);
    }
  };
  const chartData = {
    labels: graphData.map((_, i) => `${i + 1}`),
    datasets: [
      {
        data: graphData.length > 0 ? graphData.map((p) => p.magnitude) : [0],
      },
    ],
  };

  const { colors } = useTheme();

  useEffect(() => {
    if (resultID) {
      restoredResults();
    }
    return () => {
      setVideoUri("");
      setAudioUri("");
      setImageUri("");
    };
  }, []);

  ///////////// ************ ACTIVITY 1 LOGIC *****************///////////////////
  // this is the coordinates pin and measurement logic for activitiy 1 playback //

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

  function resetCoordinates() {
    setRulerTop(null);
    setRulerBottom(null);
    setChuteStart(null);
    setChuteEnd(null);
    setBounce(null);
    setActiveMode("RULER_TOP");
  }
  // END OF ACTIVITY 1 LOGIC //////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    );
  }

  if (result.activityID === "1") {
    return (
      <View
        style={[styles.container2, { backgroundColor: colors2.background }]}
      >
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
              onError={(e) => console.error("Native local playback error: ", e)}
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
            <Text style={{ color: colors2.text }}>
              {currentTime.toFixed(1)}s
            </Text>
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
            <Text style={{ color: colors2.text }}>{duration.toFixed(1)}s</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.utilityBtn, { backgroundColor: colors2.primary }]}
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
          </View>

          <View style={styles.resultPanel}>
            <View style={styles.metricColumn}>
              <Text style={styles.resultLabel}>DROP DISTANCE</Text>
              <Text style={[styles.resultValue, { color: colors2.success }]}>
                {metrics.drop}
              </Text>
            </View>
            <View style={styles.metricColumn}>
              <Text style={styles.resultLabel}>BOUNCE HEIGHT</Text>
              <Text style={[styles.resultValue, { color: colors2.accent }]}>
                {metrics.bounce}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
      }}
    >
      {resultID && (
        <>
          {videoUri && <VideoView player={videoPlayer} style={styles.video} />}
          {imageUri && <Image source={imageUri} style={styles.image} />}
          <View style={styles.resultData}>
            {audioUri &&
              (!audioPlayerStatus.playing ? (
                <TouchableOpacity onPress={() => audioPlayer.play()}>
                  <Ionicons
                    name="play"
                    size={100}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => audioPlayer.pause()}>
                  <Ionicons
                    name="pause"
                    size={100}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.results}>
            <Text style={{ color: colors.text }}>{result.resultType}</Text>
            <Text style={{ color: colors.text }}>{result.resultValue}</Text>
          </View>
        </>
      )}

      {(result.activityID === "5" ||
        result.activityID === "4" ||
        result.activityID === "7") &&
        graphData.length > 0 && (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.surface || colors.background,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => colors.text,
            }}
            style={styles.chart}
          />
        )}
      <ScrollView>
        <View style={styles.resultData}>
          {graphData.map((point, index) => (
            <Text key={index} style={{ color: colors.text }}>
              Point {index + 1}: {point.magnitude} mm/s² (Time:{" "}
              {point.timestamp})
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
  },
  video: {
    flex: 1,
  },
  image: {
    height: "60%",
    width: "100%",
  },
  results: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 50,
  },
  text: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  resultData: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
  },

  ////////// STYLES FOR ACTIVITY 1 MOVED FROM RECORDACTIVITY 1////////
  container2: { flex: 1 },
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
  //////// END OF ACTIVITY 1 MOVE //////////////////////////////
});
