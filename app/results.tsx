import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Need to get video file location routed ????
export default function Results() {
  const { id } = useLocalSearchParams();
  const [videoUri, setVideoUri] = useState("");

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

  const { colors } = useTheme();

  useEffect(() => {
    loadVideoUri();
  }, []);

  const player = useVideoPlayer(videoUri, (p) => {
    p.play();
  });

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} />
      <View style={styles.results}>
        <Text>Results</Text>
        <Text>Results</Text>
        <Text>Results</Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.error }}
          onPress={() => {
            router.dismiss();
          }}
        >
          <Text style={{ color: colors.header }}>Cancel</Text>
        </Pressable>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.success }}
          onPress={() => {}}
        >
          <Text style={{ color: colors.header }}>Upload</Text>
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
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 60,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
