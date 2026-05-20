import { useTheme } from "@/theme";
import { ResultListViewModel } from "@/viewmodel/ResultListViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const resultList = new ResultListViewModel();

export default observer(() => {
  const { activity } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  // Load the data into the resultList
  const loadResults = async () => {
    await resultList.handleRestore();
    await resultList.handlePopulate();
  };

  // Video Icon component
  const VideoIcon = () => {
    return (
      <View style={styles.icon}>
        <Ionicons name="play" size={70} color={colors.textSecondary} />
      </View>
    );
  };

  // Sensor Icon component
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
      {resultList.populatedList.map(
        (result, index) =>
          result.activityID.toString() == activity && (
            <View
              key={index}
              style={{ ...styles.box, backgroundColor: colors.surface }}
            >
              <Pressable
                style={styles.button}
                {...(result.activityID == 1 || result.activityID == 3
                  ? { disabled: false }
                  : { disabled: true })}
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
              </Pressable>
            </View>
          ),
      )}
    </View>
  );
});

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
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    gap: 20,
  },
});
