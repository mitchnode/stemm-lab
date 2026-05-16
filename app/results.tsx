import { ResultsModel } from "@/models/ResultsModel";
import { useTheme } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Results() {
  const { resultID } = useLocalSearchParams();
  const restoredResult = new ResultsModel();
  const [resultType, setResultType] = useState("");
  const [resultValue, setResultValue] = useState("");

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

  const restoredResults = async () => {
    await restoredResult.loadResult(resultID.toString());
    setResultType(restoredResult.resultType);
    setResultValue(restoredResult.resultValue);
  };

  const { colors } = useTheme();

  useEffect(() => {
    restoredResults();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.resultdisplay} />
      <View style={styles.results}>
        <Text style={{ color: colors.text }}>{resultType}</Text>
        <Text style={{ color: colors.text }}>{resultValue}</Text>
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
