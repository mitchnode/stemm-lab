import { ALL_LABS } from "@/labsData.js";
import { Result } from "@/services/firestoreService";
import { LeaderboardViewModel } from "@/viewmodel/LeaderboardViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const leaderboard = new LeaderboardViewModel();
const team = new TeamViewModel();

export default function Leaderbaord() {
  const { activityId } = useLocalSearchParams();
  const [top10, setTop10] = useState<Result[]>([]);

  const getTeamNames = async () => {
    await team.handleTeamNames();
  };

  const activity = useMemo(() => {
    return activityId && activityId.toString() in ALL_LABS
      ? ALL_LABS[activityId as keyof typeof ALL_LABS]
      : null;
  }, [activityId]);

  const topResults = async () => {
    await leaderboard.handleTopResults();
  };

  useEffect(() => {
    leaderboard.setActivityId(activityId.toString());
    topResults();
    getTeamNames();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text>{activity?.title}</Text>
        <Text>Leaderboard</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeader}>
            <Text>Team Name</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text>Result</Text>
          </View>
        </View>
        {leaderboard.topResults.map((result, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableHeader}>
              <Text>{team.teamNames[result.teamID]}</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>{result.resultValue}</Text>
            </View>
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
    alignItems: "center",
    gap: 20,
  },
  title: {
    flexDirection: "column",
    gap: 10,
  },
  table: {
    flex: 1,
    borderWidth: 1,
  },
  tableHeader: {
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
  },
});
