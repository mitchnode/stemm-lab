import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlaybackResults() {
  const { resultID } = useLocalSearchParams();
  const [result] = useState(() => new ResultViewModel());
  const [videoUri, setVideoUri] = useState("");

  const restoredResults = async () => {
    await result.handleRestore(resultID.toString());
    setVideoUri(result.resultData);
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
          {result.activityID == 1 || result.activityID == 3 ? (
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
