import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { router, useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const result = new ResultViewModel();

export default observer(() => {
  const { resultID } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    result.handleRestore(resultID.toString());
  }, []);

  const uploadResult = async () => {
    setLoading(true);
    await result.handleUpload();
    setLoading(false);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    );
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={{ ...styles.title, color: colors.text }}>RESULTS</Text>
      </View>
      <View style={styles.resultdisplay} />
      <View style={styles.results}>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultType}
        </Text>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultValue}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.error }}
          onPress={() => {
            router.dismiss();
          }}
        >
          <Text style={{ ...styles.buttonText }}>Cancel</Text>
        </Pressable>
        <Pressable
          style={{ ...styles.button, backgroundColor: colors.success }}
          onPress={uploadResult}
        >
          <Text style={{ ...styles.buttonText }}>Upload</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
  },
  resultdisplay: {},
  results: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 50,
  },
  buttonRow: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    gap: 20,
  },
  button: {
    width: 140,
    height: 70,
    borderWidth: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderColor: "transparent",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
