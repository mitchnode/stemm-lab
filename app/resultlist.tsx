import { ResultListModel } from "@/models/ResultListModel";
import { Results, ResultsModel } from "@/models/ResultsModel";
import { useTheme } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ResultList() {
  const { activity } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const resultList = new ResultListModel();
  const [results, setResults] = useState<Results[]>([]);

  const addResults = async (result: ResultsModel) => {
    setResults((prevResults) => [...prevResults, result.getResult()]);
  };

  const loadResults = async () => {
    await resultList.loadResultList();

    resultList.resultList.forEach(async (resultID) => {
      const result = new ResultsModel();
      await result.loadResult(resultID);
      let match = false;
      results.map((r) => {
        if (r.resultID == result.resultID) {
          match = true;
          return;
        }
      });
      !match ? await addResults(result) : null;
    });
  };

  const VideoIcon = () => {
    return (
      <View style={styles.icon}>
        <Ionicons name="play" size={70} color={colors.textSecondary} />
      </View>
    );
  };

  const SensorIcon = () => {
    return (
      <View style={styles.icon}>
        <MaterialIcons name="sensors" size={70} color={colors.textSecondary} />
      </View>
    );
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <Text style={{ ...styles.heading, color: colors.text }}>Results</Text>
      {results.map(
        (result, index) =>
          result.activityID.toString() == activity && (
            <View
              key={index}
              style={{ ...styles.box, backgroundColor: colors.surface }}
            >
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/playback",
                    params: { resultID: result.resultID },
                  });
                }}
              >
                {result.activityID == 1 || result.activityID == 3 ? (
                  <VideoIcon />
                ) : (
                  <SensorIcon />
                )}
              </Pressable>
              <View style={styles.info}>
                <View style={styles.row}>
                  <Text style={{ ...styles.bold_text, color: colors.text }}>
                    Result ID:
                  </Text>
                  <Text style={{ ...styles.large_font, color: colors.text }}>
                    {result.resultID}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.bold_text, color: colors.text }}>
                    Activity ID:
                  </Text>
                  <Text style={{ ...styles.large_font, color: colors.text }}>
                    {result.activityID}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.bold_text, color: colors.text }}>
                    Date/Time:
                  </Text>
                  <Text style={{ ...styles.large_font, color: colors.text }}>
                    {result.resultDateTime}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.bold_text, color: colors.text }}>
                    Result Type:
                  </Text>
                  <Text style={{ ...styles.large_font, color: colors.text }}>
                    {result.resultType}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.bold_text, color: colors.text }}>
                    Result:
                  </Text>
                  <Text style={{ ...styles.large_font, color: colors.text }}>
                    {result.resultValue}
                  </Text>
                </View>
              </View>
            </View>
          ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  box: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    margin: 10,
    gap: 20,
  },
  heading: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {},
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  large_font: {},
  bold_text: {
    fontWeight: "bold",
  },
  icon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
