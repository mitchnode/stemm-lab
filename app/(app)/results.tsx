import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const result = new ResultViewModel();

export default observer(() => {
  const { resultID } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [graphData, setGraphData] = useState<any[]>([]);
  const videoPlayer = useVideoPlayer(videoUri || "");
  const audioPlayer = useAudioPlayer(audioUri || "");
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer);

  // Restore the result to the new ResultViewModel, loading the resultData as an image or video
  const restoreResult = async () => {
    setLoading(true);
    try {
      await result.handleRestore(resultID.toString());

      console.log("Raw resultData from DB:", result.resultData);

      if (result.resultData) {
        const extension = result.resultData.split(".").at(-1);
        // Check for image data
        if (extension == "jpg") {
          setImageUri(result.resultData);
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

  useEffect(() => {
    restoreResult();

    // Clean up resets the result data states
    return () => {
      setImageUri("");
      setVideoUri("");
      setAudioUri("");
      setGraphData([]);
    };
  }, []);

  // Uplaod the result to Firestore
  const uploadResult = async () => {
    setLoading(true);
    await result.handleUpload();
    setLoading(false);
  };

  // Delete the result and return to the record screen
  const cancelResult = async () => {
    await result.handleDelete();
    router.dismiss();
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    );
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={{ ...styles.title, color: colors.text }}>RESULTS</Text>
      </View>
      {resultID && (
        <>
          {videoUri && <VideoView player={videoPlayer} style={styles.video} />}
          {imageUri && <Image style={styles.image} source={imageUri} />}
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
          {graphData.length > 0 && (
            <>
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

              <View style={styles.resultData}>
                {graphData.map((point, index) => (
                  <Text key={index} style={{ color: colors.text }}>
                    Point {index + 1}: {point.magnitude} mm/s² (Time:{" "}
                    {point.timestamp})
                  </Text>
                ))}
              </View>
            </>
          )}
        </>
      )}
      <View style={styles.results}>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultType}
        </Text>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultValue}
        </Text>
      </View>
      <View style={{ ...styles.buttonRow, borderColor: colors.border }}>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.error }}
          onPress={cancelResult}
        >
          <Text style={{ ...styles.buttonText }}>Cancel</Text>
        </Pressable>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.success }}
          onPress={uploadResult}
        >
          <Text style={{ ...styles.buttonText }}>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
  },
  video: {
    flex: 1,
  },
  image: {
    height: "60%",
    width: "100%",
  },
  results: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 50,
  },
  buttonRow: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    gap: 20,
  },
  button: {
    width: 140,
    height: 70,
    borderWidth: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderColor: "transparent",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
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
});
