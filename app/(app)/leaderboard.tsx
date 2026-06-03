import { ALL_LABS } from "@/labsData.js";
import { Result } from "@/services/firestoreService";
import { useTheme } from "@/theme";
import { LeaderboardViewModel } from "@/viewmodel/LeaderboardViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const leaderboard = new LeaderboardViewModel();
const team = new TeamViewModel();

export default function Leaderbaord() {
  const { activityId } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [topResults, setTopResults] = useState<Record<string, Result[]>>({});

  const activity = useMemo(() => {
    return activityId && activityId.toString() in ALL_LABS
      ? ALL_LABS[activityId as keyof typeof ALL_LABS]
      : null;
  }, [activityId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    leaderboard.setActivityId(activityId.toString());
    await leaderboard.handleTopResults();
    setTopResults(leaderboard.topResults);
    await team.handleTeamNames();
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
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
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <View style={styles.title}>
        <Text style={{ ...styles.titleText, color: colors.text }}>
          accessibilityRole="header"
          {activity?.title}
        </Text>
        <Text
          style={{ ...styles.titleText, color: colors.text }}
          accessibilityRole="header"
        >
          Leaderboard
        </Text>
      </View>
      <View style={styles.tableContainer}>
        {Object.entries(topResults).map(([key, results]) => (
          <View
            key={key}
            style={{ ...styles.table, borderColor: colors.border }}
            accessible={true}
            accessibilityLabel={`Results Category: ${key}`}
          >
            <View
              style={{ ...styles.tableRow, borderColor: colors.border }}
              importantForAccessibility="no-hide-descendants"
            >
              <View
                style={{
                  ...styles.headerCell,
                  borderColor: colors.border,
                  backgroundColor: colors.primary + 80,
                }}
              >
                <Text style={{ ...styles.headerText, color: colors.text }}>
                  {key}
                </Text>
              </View>
            </View>
            <View
              style={{ ...styles.tableRow, borderColor: colors.border }}
              importantForAccessibility="no-hide-descendants"
            >
              <View
                style={{
                  ...styles.rankCell,
                  borderColor: colors.border,
                  backgroundColor: colors.primary + 80,
                }}
              >
                <Text style={{ ...styles.headerText, color: colors.text }}>
                  Rank
                </Text>
              </View>
              <View
                style={{
                  ...styles.teamCell,
                  borderColor: colors.border,
                  backgroundColor: colors.primary + 80,
                }}
              >
                <Text style={{ ...styles.headerText, color: colors.text }}>
                  Team Name
                </Text>
              </View>
              <View
                style={{
                  ...styles.resultCell,
                  borderColor: colors.border,
                  backgroundColor: colors.primary + 80,
                }}
              >
                <Text style={{ ...styles.headerText, color: colors.text }}>
                  Result
                </Text>
              </View>
            </View>
            {results.map((result, index) => (
              <View
                key={index}
                style={{ ...styles.tableRow, borderColor: colors.border }}
              >
                <View
                  style={{ ...styles.rankCell, borderColor: colors.border }}
                  importantForAccessibility="no"
                >
                  <Text style={{ ...styles.cellText, color: colors.text }}>
                    {index + 1}
                  </Text>
                </View>
                <View
                  style={{ ...styles.teamCell, borderColor: colors.border }}
                  importantForAccessibility="no"
                >
                  <Text style={{ ...styles.cellText, color: colors.text }}>
                    {team.teamNames[result.teamID]}
                  </Text>
                </View>
                <View
                  style={{ ...styles.resultCell, borderColor: colors.border }}
                  importantForAccessibility="no"
                >
                  <Text style={{ ...styles.cellText, color: colors.text }}>
                    {result.resultValue}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    gap: 20,
  },
  title: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tableContainer: {
    padding: 20,
    flex: 1,
    gap: 20,
  },
  table: {
    borderWidth: 1,
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
  },
  rankCell: {
    flex: 1,
    paddingLeft: 20,
  },
  teamCell: {
    flex: 2,
  },
  resultCell: {
    flex: 1,
  },
  tableRow: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
  },
  cellText: {},
});
