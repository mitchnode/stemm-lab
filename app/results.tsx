import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// Change to array if recieving multiple results
interface Results {
  resultType: String;
  resultValue: String;
}

export default function Results() {
  const { result } = useLocalSearchParams();
  const [resultJSON, setResultJSON] = useState<Results>();

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

  const uploadResults = async () => {
    // Upload results to Firebase???
    // include TeamID, Team name, Activity, result. (Video/sensor data stays local)
    // Compare result to existing leaderboard entry, update if better.
    // Give feedback to the user confirming upload complete.
    Alert.alert(
      "Result uploaded!",
      "Your result has been uploaded to the cloud",
    );
    router.push("/");
  };

  const { colors } = useTheme();

  useEffect(() => {
    loadResult();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.resultdisplay} />
      <View style={styles.results}>
        <Text style={{ color: colors.text }}>{resultJSON?.resultType}</Text>
        <Text style={{ color: colors.text }}>{resultJSON?.resultValue}</Text>
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
          onPress={uploadResults}
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
  resultdisplay: {
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
