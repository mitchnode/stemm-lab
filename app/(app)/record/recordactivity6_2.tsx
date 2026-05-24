import { useAuth } from "@/context/authContext";
import { BUTTON_RADIUS, usePathTracer } from "@/hooks/usePathTracer";
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Polyline } from "react-native-svg";

const result = new ResultViewModel();
const team = new TeamViewModel();

/* function useLiveMissTime(totalMissTime: number, isMissing: boolean): number {
  const [display, setDisplay] = useState(totalMissTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const missStartRef = useRef<number | null>(null);
  const baseRef = useRef(totalMissTime);

  useEffect(() => {
    baseRef.current = totalMissTime;
    if (!isMissing) {
      setDisplay(totalMissTime);
    }
  }, [totalMissTime, isMissing]);

  useEffect(() => {
    if (isMissing) {
      missStartRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        if (missStartRef.current !== null) {
          setDisplay(baseRef.current + (Date.now() - missStartRef.current));
        }
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      missStartRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMissing]);

  return display;
} */

export default function RecordActivity6_2() {
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
    PT_BUTTON_SIZE,
    motion,
    totalMissTime,
    bestTime,
    isMissing,
    buttonAnim,
    waypointCoords,
    start,
    gesture,
  } = usePathTracer();

  //const liveMissTime = useLiveMissTime(totalMissTime, isMissing);
  const { width, height } = Dimensions.get("window");

  const waypointPoints = waypointCoords
    .map((p) => `${p.x + BUTTON_RADIUS},${p.y + BUTTON_RADIUS}`)
    .join(" ");

  useEffect(() => {
    if (data) {
      // Get any processed result here before passing to the results page
      const dateTime = new Date().toLocaleString();
      const resultType = "Path Tracing - Time (ms)";
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
    if (bestTime !== null) {
      setData("No Data");
    }
  };

  return (
    <GestureHandlerRootView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <GestureDetector gesture={gesture}>
        <View style={[styles.field, { width, height }]}>
          {motion === "done" && waypointCoords.length > 1 && (
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              <Polyline
                points={waypointPoints}
                fill="none"
                stroke={colors.error}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 10"
              />
            </Svg>
          )}

          <View style={styles.header}>
            <Text style={{ ...styles.title, color: colors.text }}>
              PATH TRACING
            </Text>
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

          {motion === "idle" && (
            <View style={styles.centreOverlay}>
              <Text style={{ ...styles.text, color: colors.text }}>
                <ActivityIndicator size="large" />
              </Text>
            </View>
          )}

          {motion === "ready" && (
            <View style={styles.centreOverlay} pointerEvents="none">
              <Text style={{ ...styles.text, color: colors.text }}>
                PRESS & HOLD
              </Text>
              <Text style={{ ...styles.text, color: colors.text }}>
                Keep your finger on the button{"\n"}as it moves around the
                screen.
              </Text>
            </View>
          )}

          {(motion === "ready" || motion === "moving") && (
            <Animated.View
              style={[
                styles.buttonWrapper,
                { width: PT_BUTTON_SIZE, height: PT_BUTTON_SIZE },
                {
                  transform: [
                    { translateX: buttonAnim.x },
                    { translateY: buttonAnim.y },
                  ],
                },
              ]}
              pointerEvents="none"
            >
              <View
                style={[
                  styles.ptButton,
                  {
                    width: PT_BUTTON_SIZE,
                    height: PT_BUTTON_SIZE,
                    borderRadius: BUTTON_RADIUS,
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                  motion === "moving" &&
                    !isMissing && {
                      backgroundColor: colors.success,
                      shadowColor: colors.success,
                    },
                  motion === "moving" &&
                    isMissing && {
                      backgroundColor: colors.error,
                      shadowColor: colors.error,
                    },
                ]}
              >
                {/* <View
                    style={{
                      width: PT_BUTTON_SIZE * 0.4,
                      height: PT_BUTTON_SIZE * 0.4,
                      borderRadius: PT_BUTTON_SIZE * 0.2,
                      backgroundColor: colors.header,
                    }}
                  /> */}
              </View>
            </Animated.View>
          )}

          {motion === "done" && (
            <View style={styles.resultOverlay}>
              <Text style={{ ...styles.text, color: colors.text }}>
                TOTAL TIME OFF PATH
              </Text>
              <Text style={{ ...styles.text, color: colors.text }}>
                {totalMissTime}
              </Text>
              <Text style={{ ...styles.text, color: colors.text }}>
                milliseconds
              </Text>
              {bestTime !== null && totalMissTime === bestTime && (
                <Text style={{ ...styles.text, color: colors.text }}>
                  High Score!
                </Text>
              )}
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
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  field: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
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
  centreOverlay: {
    alignItems: "center",
    paddingTop: 80,
  },
  buttonWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  ptButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 10,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
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
