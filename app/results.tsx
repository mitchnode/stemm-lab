import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { router, useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const result = new ResultViewModel();

export default observer(() => {
  const { resultID } = useLocalSearchParams();
  const { colors } = useTheme();

  useEffect(() => {
    result.handleRestore(resultID.toString());
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.resultdisplay} />
      <View style={styles.results}>
        <Text style={{ color: colors.text }}>{result.resultType}</Text>
        <Text style={{ color: colors.text }}>{result.resultValue}</Text>
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
          onPress={() => result.handleUpload()}
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
