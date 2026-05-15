import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Results {
  resultType: String;
  resultValue: String;
}

export default function VideoResults() {
  const { id, result } = useLocalSearchParams();
  const [videoUri, setVideoUri] = useState("");
  const [resultJSON, setResultJSON] = useState<Results>();

  const loadVideoUri = async () => {
    try {
      const video = await AsyncStorage.getItem(id.toString());
      if (video) {
        setVideoUri(video);
      }
    } catch (error) {
      console.error("Error loading video:", error);
    }
  };

  const loadResult = async () => {
    try {
      const resultString = await AsyncStorage.getItem(result.toString());
      if (resultString) {
        setResultJSON(JSON.parse(resultString));
      } else {
        setResultJSON({ resultType: "No Result", resultValue: "No Result" });
      }
    } catch (error) {
      console.error("Error loading result:", error);
    }
  };

  const { colors } = useTheme();

  useEffect(() => {
    loadVideoUri();
    loadResult();
  }, []);

  const player = useVideoPlayer(videoUri);

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} />
      <View style={styles.results}>
        <Text>{resultJSON?.resultType}</Text>
        <Text>{resultJSON?.resultValue}</Text>
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
          onPress={() => {}}
        >
          <Text style={{ ...styles.buttontext, color: colors.dark }}>
            Upload
          </Text>
        </Pressable>
      </View>
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
