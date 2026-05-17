import { ResultsModel } from "@/models/ResultsModel";
import { useTheme } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlaybackResults() {
  const { resultID } = useLocalSearchParams();
  const restoredResult = new ResultsModel();
  const [resultType, setResultType] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [videoUri, setVideoUri] = useState("");

  const restoredResults = async () => {
    await restoredResult.loadResult(resultID.toString());
    setResultType(restoredResult.resultType);
    setResultValue(restoredResult.resultValue);
    setVideoUri(restoredResult.resultData);
  };

  const { colors } = useTheme();

  useEffect(() => {
    if (resultID) {
      restoredResults();
    }
  }, []);

  const player = useVideoPlayer(videoUri);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
      }}
    >
      {resultID && (
        <>
          <VideoView player={player} style={styles.video} />
          <View style={styles.results}>
            <Text style={{ color: colors.text }}>{resultType}</Text>
            <Text style={{ color: colors.text }}>{resultValue}</Text>
          </View>
        </>
      )}
      <Text style={{ ...styles.text, color: colors.text }}>
        No Result Found!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
  results: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
