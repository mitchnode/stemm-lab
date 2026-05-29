import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

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

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
      />
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
      {result.activityID === "5" && graphData.length > 0 && (
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
      <View style={styles.resultData}>
        {graphData.map((point, index) => (
          <Text key={index} style={{ color: colors.text }}>
            Point {index + 1}: {point.magnitude} mm/s² (Time: {point.timestamp})
          </Text>
        ))}
      </View>
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
});
