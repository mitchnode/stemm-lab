import { useAuth } from "@/context/authContext";
import { useTheme } from "@/theme";
import { ResultListViewModel } from "@/viewmodel/ResultListViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const resultList = new ResultListViewModel();
const team = new TeamViewModel();

export default observer(() => {
  const { user } = useAuth();
  const { activity } = useLocalSearchParams();

  console.log("Current Activity Filter:", activity);
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  // Load the data into the resultList
  const loadResults = async () => {
    //setLoading(true);
    try {
      if (user) await team.handleRestore(user.uid);
      if (team) {
        await resultList.handleRestore(team.teamID);
        await resultList.handlePopulate();
        console.log(
          "Full Result List Data:",
          JSON.stringify(resultList.populatedList, null, 2),
        );
      }
    } catch (error) {
      console.error("Could not load result:", error);
    } finally {
      setLoading(false);
    }
  };

  // Video Icon component
  const VideoIcon = () => {
    return (
      <View style={styles.icon}>
        <Ionicons name="play" size={70} color={colors.textSecondary} />
      </View>
    );
  };

  // Image Icon component
  const ImageIcon = () => {
    return (
      <View style={styles.icon}>
        <Ionicons name="image" size={70} color={colors.textSecondary} />
      </View>
    );
  };

  // Audio Icon component
  const AudioIcon = () => {
    return (
      <View style={styles.icon}>
        <Ionicons name="volume-medium" size={70} color={colors.textSecondary} />
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

  const isClickable = (res: any) => {
    const id = res.activityID.toString();
    return ["1", "2", "3", "4", "5", "7"].includes(id);
  };

  const allowedList = React.useMemo(() => {
    if (Array.isArray(activity)) return activity; // arrives as an array
    if (typeof activity === "string") return activity.split(","); // If it arrives as a string
    return []; // Default fallback
  }, [activity]);
  //debugging command
  useEffect(() => {
    console.log("Current Filter List:", allowedList);
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    );
  }

  return (
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <ScrollView>
        <Text
          style={{ ...styles.heading, color: colors.text }}
          accessibilityRole="header"
        >
          Results
        </Text>
        {resultList.populatedList.map((result, index) => {
          // We check if the result's ID is in allowed list
          const isinList = allowedList.includes(result.activityID.toString());
          return (
            isinList && (
              <View
                key={index}
                style={{ ...styles.box, backgroundColor: colors.surface }}
              >
                <Pressable
                  style={styles.button}
                  disabled={!isClickable(result)}
                  onPress={() => {
                    router.push({
                      pathname: "/playback",
                      params: { resultID: result.resultID },
                    });
                  }}
                  accessible={true}
                  accessibilityRole="none"
                  accessibilityLabel={`Result entry ${index + 1}. Type: Result ID: ${result.resultID}. Activity ID: ${result.activityID}. Timestamp: ${result.resultDateTime}. Outcome metric: ${result.resultValue || "No recorded value"}.`}
                  accessibilityHint="to review this activity in playback"
                >
                  <View
                    accessible={false}
                    importantForAccessibility="no-hide-descendants"
                  >
                    {result.activityID == "1" && <VideoIcon />}
                    {result.activityID == "2" && <AudioIcon />}
                    {result.activityID == "3" && <ImageIcon />}
                    {result.activityID != "1" &&
                      result.activityID != "2" &&
                      result.activityID != "3" && <SensorIcon />}
                  </View>
                  <View
                    style={styles.info}
                    accessible={false}
                    importantForAccessibility="no-hide-descendants"
                  >
                    <View style={styles.row}>
                      <Text style={{ ...styles.bold_text, color: colors.text }}>
                        Result ID:
                      </Text>
                      <Text
                        style={{ ...styles.large_font, color: colors.text }}
                      >
                        {result.resultID}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={{ ...styles.bold_text, color: colors.text }}>
                        Activity ID:
                      </Text>
                      <Text
                        style={{ ...styles.large_font, color: colors.text }}
                      >
                        {result.activityID}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={{ ...styles.bold_text, color: colors.text }}>
                        Date/Time:
                      </Text>
                      <Text
                        style={{ ...styles.large_font, color: colors.text }}
                      >
                        {result.resultDateTime}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={{ ...styles.bold_text, color: colors.text }}>
                        Result Type:
                      </Text>
                      <Text
                        style={{ ...styles.large_font, color: colors.text }}
                      >
                        {result.resultType}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={{ ...styles.bold_text, color: colors.text }}>
                        Result:
                      </Text>
                      <Text
                        style={{ ...styles.large_font, color: colors.text }}
                      >
                        {result.resultValue}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )
          );
        })}
      </ScrollView>
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
