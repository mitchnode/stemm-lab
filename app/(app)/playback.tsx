import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

export default observer(function PlaybackResults() {
  const { resultID } = useLocalSearchParams();
  const [result] = useState(() => new ResultViewModel());
  const [videoUri, setVideoUri] = useState("");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const player = useVideoPlayer(videoUri || "");

  const restoredResults = async () => {
    setLoading(true);
    try {
      await result.handleRestore(resultID.toString());

      console.log("Raw resultData from DB:", result.resultData);

      if (result.resultData) {
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
          {result.activityID == "1" || result.activityID == "3" ? (
            <VideoView player={player} style={styles.video} />
          ) : (
            <></>
          )}
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
    marginBottom: 20,
    alignItems: "center",
  },
  video: {
    flex: 1,
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
    marginTop: 20,
  },
});
