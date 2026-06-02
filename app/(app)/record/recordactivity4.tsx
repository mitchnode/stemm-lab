/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import { useAuth } from "@/context/authContext";
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { useTheme as useRETheme } from "re-native-ui";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  SensorType,
  useAnimatedSensor,
  useReducedMotion,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  colors: any;
  styles: any;
}

const NumericStepper: React.FC<NumericStepperProps> = ({
  value,
  onChange,
  disabled,
  colors,
  styles,
}) => {
  const increment = () => onChange(Math.min(600, value + 5));
  const decrement = () => onChange(Math.max(5, value - 5));

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity
        style={[
          styles.stepperButton,
          { backgroundColor: colors.surface },
          disabled && { opacity: 0.5 },
        ]}
        onPress={decrement}
        disabled={disabled}
      >
        <Text style={{ color: colors.text }}>-</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.large_font,
          { color: colors.text, marginHorizontal: 20 },
        ]}
      >
        {value}s
      </Text>

      <TouchableOpacity
        style={[
          styles.stepperButton,
          { backgroundColor: colors.surface },
          disabled && { opacity: 0.3 },
        ]}
        onPress={increment}
        disabled={disabled}
      >
        <Text style={{ color: colors.text, fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

interface DataPoint {
  timestamp: number;
  magnitude: number;
}

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function RecordActivity5() {
  // <---------------------------------------- Set to Activity number
  const { user } = useAuth();
  const ACTIVITY_ID = "4"; // <---------------------------------------- Set to Activity number
  const tickRef = useRef(0);
  const [targetSeconds, setTargetSeconds] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { colors, setScheme, isDark } = useTheme();
  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
  };

  const theme = useRETheme();
  theme.colors.background = colors.background;
  theme.colors.primary = colors.primary;
  theme.colors.text = colors.text;
  theme.colors.border = colors.border;

  // Call hook for sensor <----------------------------------------------
  const dataPointsRef = useRef<DataPoint[]>([]);
  const [chartPoints, setChartPoints] = useState<DataPoint[]>([]); // Only for UI rendering

  const acceleromter = useAnimatedSensor(SensorType.ACCELEROMETER);

  const reduceMotion = useReducedMotion();
  const [acc, setAccData] = useState({ x: 0, y: 0, z: 0 });
  const gravityRef = useRef({ x: 0, y: 0, z: 0 });
  const velocityRef = useRef(0);
  const positionRef = useRef(0);

  const multiplier = reduceMotion ? 10 : 50;

  const appState = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);
  const config = {
    stiffness: 100,
    damping: 10,
    mass: 4,
  };

  const accLiveRef = useRef({ x: 0, y: 0, z: 0 });

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };
  useEffect(() => {
    Accelerometer.setUpdateInterval(20);
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setAccData(accelerometerData);
      accLiveRef.current = accelerometerData;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!team.teamID) {
      loadTeam();
    }
  }, []);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const startVibration = () => {
    Vibration.vibrate([0, 1000], true);
  };

  const stopRecording = async () => {
    setIsActive(false);
    isActiveRef.current = false;
    stopVibration();

    await handleToggleRecording();
  };
  const stopVibration = () => {
    Vibration.cancel();
  };
  const handleToggleRecording = async (forcedPoints?: DataPoint[]) => {
    if (isActive) {
      setIsActive(false);
      isActiveRef.current = false;
      // STOPPING

      console.log("DEBUG: Current TeamID is:", team.teamID);
      stopVibration();
      // Use the ref for the alert/upload
      const points = forcedPoints || dataPointsRef.current;
      if (points.length === 0) return;

      Alert.alert(
        "Upload Recording",
        "Would you like to save this recording to the database?",
        [
          { text: "Cancel", style: "cancel", onPress: cancelRecording },
          {
            text: "Upload",

            onPress: async () => {
              if (!team.teamID && user) {
                await team.handleRestore(user.uid);
              }

              if (!team.teamID) {
                alert("Error: Team ID not found. Please try again.");
                return;
              }
              const dateTime = new Date().toLocaleString();

              const stringifiedData = JSON.stringify(points);
              result.setTeamID(team.teamID);
              result.setActivityID(ACTIVITY_ID);
              const resultType = "mm/s2"; // <---------------------------------------------------- Modifiy resultType to suit sensor
              const resultValue =
                points.length > 0 ? points[points.length - 1].magnitude : 0; // <------------------------------------------- Modify resultValue
              result.setTeamID(team.teamID);
              result.setActivityID(ACTIVITY_ID);
              result.setResultDateTime(dateTime);
              result.setResultType(resultType);
              result.setResultValue(resultValue);
              result.setResultData(stringifiedData);

              try {
                console.log("Saving to Firestore...", result);

                const resultID = await result.handleRecord();

                router.push({
                  pathname: "/results",
                  params: { resultID: resultID },
                });
              } catch (err: unknown) {
                const errorMessage =
                  err instanceof Error ? err.message : String(err);
                console.error("CRITICAL ERROR during upload:", err);
                alert("Upload failed: " + errorMessage);
              }
            },
          },
        ],
      );
    } else {
      velocityRef.current = 0;
      positionRef.current = 0;
      gravityRef.current = { x: 0, y: 0, z: 0 };
      dataPointsRef.current = [];
      tickRef.current = 0;
      setChartPoints([]);
      setSeconds(0);
      setIsActive(true);
      startVibration();
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        const { x, y, z } = accLiveRef.current;

        const gravityAlpha = 0.8;
        gravityRef.current.x =
          gravityAlpha * gravityRef.current.x + (1 - gravityAlpha) * x;
        gravityRef.current.y =
          gravityAlpha * gravityRef.current.y + (1 - gravityAlpha) * y;
        gravityRef.current.z =
          gravityAlpha * gravityRef.current.z + (1 - gravityAlpha) * z;

        const linearX = x - gravityRef.current.x;
        const linearY = y - gravityRef.current.y;
        const linearZ = z - gravityRef.current.z;

        const magnitude = Math.sqrt(linearX ** 2 + linearY ** 2 + linearZ ** 2);

        dataPointsRef.current.push({
          timestamp: Date.now(),
          magnitude: magnitude,
        });

        if (dataPointsRef.current.length > 20) dataPointsRef.current.shift();

        tickRef.current += 1;
        const currentSeconds = tickRef.current;
        setSeconds(currentSeconds);
        setChartPoints([...dataPointsRef.current.slice(-50)]);

        if (currentSeconds >= targetSeconds) {
          stopRecording();
        }
      }, 1000);
      timerRef.current = interval;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetSeconds]);

  const cancelRecording = () => {
    setIsActive(false);
    setSeconds(0);
    setChartPoints([]);
  };

  const chartData = {
    labels:
      chartPoints.length > 0 ? chartPoints.map((_, i) => `${i + 1}`) : ["0"],
    datasets: [
      {
        data:
          chartPoints.length > 0 ? chartPoints.map((p) => p.magnitude) : [0],
      },
    ],
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          onPress={changeTheme}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ alignSelf: "flex-end" }}
        >
          <MaterialIcons
            name={isDark ? "wb-sunny" : "nights-stay"}
            size={28}
            color={isDark ? "#FFD700" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <NumericStepper
        value={targetSeconds}
        onChange={setTargetSeconds}
        disabled={isActive}
        colors={colors}
        styles={styles}
      />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.timerText, { color: colors.text }]}>
          Recording: {seconds}s
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isActive ? "#ff0000" : "#4cd964" },
          ]}
          onPress={() => handleToggleRecording()}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isActive ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        {isActive && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff9500" }]}
            onPress={cancelRecording}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {acc ? (
          <View
            style={[
              styles.dataContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.header, { color: colors.text }]}>
              Accelerometer Live Metrics
            </Text>

            <Text style={{ color: colors.text }}>
              X: {(acc.x * 9806.65).toFixed(2)} mm
            </Text>
            <Text style={{ color: colors.text }}>
              Y: {(acc.y * 9806.65).toFixed(2)} mm
            </Text>
            <Text style={{ color: colors.text }}>
              Z: {(acc.z * 9806.65).toFixed(2)}mm
            </Text>
          </View>
        ) : null}

        <Text style={[styles.graphHeader, { color: colors.text }]}>
          Total Magnitude (g) over Time
        </Text>
        {chartPoints.length > 0 && (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.surface || colors.background,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => colors.text,
            }}
            style={styles.chart}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },

  headerTitle: { fontSize: 22, fontWeight: "bold", flex: 1, marginRight: 10 },

  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dataContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
  },
  graphHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "black",
    margin: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  box2: {
    justifyContent: "center",
    alignItems: "stretch",
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,

    minWidth: 400,
  },
  heading: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    gap: 40,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  large_font: {
    fontSize: 20,
  },
  bold_text: {
    fontWeight: "bold",
    fontSize: 20,
  },
  members: {
    gap: 5,
  },
  members_text: {
    textAlign: "right",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  stepperButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
