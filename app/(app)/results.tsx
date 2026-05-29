import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { Image } from "expo-image";
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
  const [resultImage, setResultImage] = useState("");

  const loadImage = async (imageUri: string) => {
    setResultImage(imageUri);
  };

  useEffect(() => {
    result.handleRestore(resultID.toString());
    if (result.resultData.split(":").at(-1) == "jpg" || "png") {
      console.log("Data:", result.resultData);
      loadImage(result.resultData);
      console.log("Image:", resultImage);
    }
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

      {resultImage && <Image style={styles.image} source={resultImage} />}

      <View style={styles.results}>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultType}
        </Text>
        <Text style={{ ...styles.resultText, color: colors.text }}>
          {result.resultValue}
        </Text>
      </View>
      <View style={{ ...styles.buttonRow, borderColor: colors.border }}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
  },
  resultdisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    //flex: 1,
    height: "60%",
    width: "100%",
  },
  results: {
    flex: 1,
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
