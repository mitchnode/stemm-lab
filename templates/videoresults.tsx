import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const result = new ResultViewModel();

export const VideoResult = observer(() => {
  const { resultID } = useLocalSearchParams();
  const [videoUri, setVideoUri] = useState("");

  const { colors } = useTheme();

  useEffect(() => {
    result.handleRestore(resultID.toString());
    setVideoUri(result.getResultData());
  }, []);

  const player = useVideoPlayer(videoUri);

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} />
      <View style={styles.results}>
        <Text>{result.resultType}</Text>
        <Text>{result.resultValue}</Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.error }}
          onPress={() => {
            router.dismiss();
          }}
        >
          <Text style={{ ...styles.buttontext, color: colors.light }}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.success }}
          onPress={result.handleUpload}
        >
          <Text style={{ ...styles.buttontext, color: colors.dark }}>
            Upload
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

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
  buttonRow: {
    flexDirection: "row",
    gap: 70,
    justifyContent: "center",
  },
  button: {
    width: 150,
    height: 70,
    borderWidth: 1,
    borderRadius: 60,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttontext: {
    fontWeight: "bold",
  },
});
