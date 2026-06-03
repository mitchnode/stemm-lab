import { useAuth } from "@/context/authContext";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function RecordActivity6_1() {
  const { user } = useAuth();
  const ACTIVITY_ID = "6";
  const [data, setData] = useState("");

  const { colors } = useTheme();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    if (!team.teamID) {
      loadTeam();
    }
  }, []);

  const {
    R_BUTTON_SIZE,
    reactionTime,
    buttonPosition,
    bestTime,
    ready,
    start,
    handlePress,
  } = useReactionTimer();

  useEffect(() => {
    if (data) {
      // Get any processed result here before passing to the results page
      const dateTime = new Date().toISOString();
      const resultType = "Reaction Timer - Time (ms)";
      const resultValue = bestTime!.toString();
      result.setTeamID(team.teamID);
      result.setActivityID(ACTIVITY_ID);
      result.setResultDateTime(dateTime);
      result.setResultType(resultType);
      result.setResultValue(resultValue);
      const recordResult = async () => {
        const resultID = await result.handleRecord();
        router.push({
          pathname: "/results",
          params: { resultID: resultID },
        });
      };

      recordResult();
    }
    return () => {
      setData("");
    };
  });

  const record = async () => {
    if (bestTime) {
      setData("No Data");
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={{ ...styles.title, color: colors.text }}>
          REACTION TIMER
        </Text>
        {!reactionTime !== null && (
          <Text style={{ ...styles.text, color: colors.text }}>
            Press the button when it appears
          </Text>
        )}
        {bestTime !== null && (
          <View style={[styles.statsRow]}>
            <Text style={{ ...styles.statLabel, color: colors.text }}>
              High Score:
            </Text>
            <Text style={{ ...styles.statValue, color: colors.text }}>
              {bestTime}ms
            </Text>
          </View>
        )}
      </View>

      <>
        {ready && (
          <Animated.View
            style={[
              styles.targetWrapper,
              {
                position: "absolute",
                left: buttonPosition.x,
                top: buttonPosition.y,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handlePress}
              style={{
                ...styles.target,
                width: R_BUTTON_SIZE,
                height: R_BUTTON_SIZE,
                borderRadius: R_BUTTON_SIZE / 2,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ ...styles.text, color: colors.text }}>
                Press Me
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {!ready && reactionTime !== null && (
          <View style={styles.resultContainer}>
            <Text style={{ ...styles.text, color: colors.text }}>
              {reactionTime}
            </Text>
            <Text style={{ ...styles.text, color: colors.text }}>
              milliseconds
            </Text>

            {bestTime !== null && reactionTime === bestTime && (
              <Text style={{ ...styles.text, color: colors.text }}>
                High Score!
              </Text>
            )}
          </View>
        )}
      </>
      {reactionTime !== null && (
        <View style={{ ...styles.buttonRow, borderColor: colors.text }}>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
            }}
            onPress={start}
          >
            <Text style={{ ...styles.buttonText }}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.success,
            }}
            onPress={record}
          >
            <Text style={{ ...styles.buttonText }}>Record Result</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: "800",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  targetWrapper: {
    zIndex: 10,
  },
  target: {
    backgroundColor: "#FF2D55",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF2D55",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  buttonRow: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    justifyContent: "center",
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
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
