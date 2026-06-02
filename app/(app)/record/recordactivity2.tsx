/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import { useAuth } from "@/context/authContext";
import { useSoundLevel } from "@/hooks/useSoundLevel"; // <------------------------- Import hook for the sensor
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const result = new ResultViewModel();
const team = new TeamViewModel();

const RecordActivity2 = observer(() => {
  // <---------------------------------------- Set to Activity number
  const { user } = useAuth();
  const ACTIVITY_ID = "2"; // <---------------------------------------- Set to Activity number
  const [recButtonColor, setRecButtonColor] = useState("green");
  const [recButtonShape, setRecButtonShape] = useState(50);
  const [data, setData] = useState("");
  const [btnName, setBtnName] = useState("Start");

  // Call hook for sensor <----------------------------------------------
  const {
    db,
    realdb,
    maxdb,
    percent,
    isSoundRecording,
    hasAudioPermission,
    start,
    stop,
    reset,
  } = useSoundLevel();
  // <---------------------------------------------------------------- Add other required functions for updating the View
  if (hasAudioPermission === false) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center" }}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <Text>Microphone permission denied.</Text>
        <Text
          style={{
            color: "#666",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          Please enable microphone access in your system settings to measure
          experiment decibel levels.
        </Text>
      </View>
    );
  }

  const animatedStyle = useAnimatedStyle(() => {
    if (db != undefined) {
      return {
        height: withSpring(percent * 6),
      };
    }
    return {
      height: 0,
    };
  }, [db, percent]);
  // ^--------------^-----------^--------------^------------^----------^--------^

  const { colors } = useTheme();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    if (!team.teamID) {
      loadTeam();
    }
  }, []);

  useEffect(() => {
    if (data) {
      // Get any processed result here before passing to the results page
      const dateTime = new Date().toLocaleString();
      const resultType = "Volume"; // <---------------------------------------------------- Modifiy resultType to suit sensor
      const resultValue = maxdb.toFixed(2).toString(); // <------------------------------------------- Modify resultValue
      result.setTeamID(team.teamID);
      result.setActivityID(ACTIVITY_ID);
      result.setResultDateTime(dateTime);
      result.setResultType(resultType);
      result.setResultValue(resultValue);
      result.setResultData(data);

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

  const toggleRecord = async () => {
    if (isSoundRecording) {
      setBtnName("Start");
      setRecButtonColor(colors.success);
      setRecButtonShape(50);
      const returnedData = await stop(); // <---------------------------------------- Call stop function from the sensor hook -> Returned data is the sensor data, not the final value. e.g Audio file location.
      returnedData ? setData(returnedData) : setData("No Data");
    } else {
      setBtnName("Stop");
      setRecButtonColor(colors.error);
      setRecButtonShape(20);
      await reset(); // <-----------------------------------------------------------Call function to reset sensor max data
      await start(); // <-----------------------------------------------------------Call function to begin recording sensor data
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      {/* <--------------------------------------------------------------------------------------------Modify to suit sensor display */}
      <View
        style={styles.sensor}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <Animated.View
          style={[
            { ...styles.box, backgroundColor: colors.secondary },
            animatedStyle,
          ]}
        />
      </View>

      {isSoundRecording ? (
        <View
          style={styles.data}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Sound recording. Current intensity: ${realdb?.toFixed(1) || 0} decibels. Peak register: ${maxdb.toFixed(1)} decibels.`}
        >
          <Text
            style={{ ...styles.text, color: colors.text }}
            importantForAccessibility="no"
          >
            Recording
          </Text>
          <Text
            style={{ ...styles.text, color: colors.text }}
            importantForAccessibility="no"
          >
            dB: {realdb!.toFixed(2)}
          </Text>
          <Text
            style={{ ...styles.text, color: colors.text }}
            importantForAccessibility="no"
          >
            Max dB: {maxdb.toFixed(2)}
          </Text>
          <Text
            style={{ ...styles.text, color: colors.text }}
            importantForAccessibility="no"
          >
            Percent: {percent}
          </Text>
        </View>
      ) : (
        <></>
      )}

      {isSoundRecording && (
        <View
          style={{ ...styles.record, backgroundColor: "red" }}
          importantForAccessibility="no"
        />
      )}

      {/* <^--------------------^---------------------^--------------------------------^----------------------------^------------------------^ */}
      <View style={styles.buttonRow}>
        <View
          style={styles.buttonContainer}
          importantForAccessibility="no-hide-descendants"
        >
          <TouchableOpacity
            style={{
              ...styles.button,
              borderColor: "transparent",
              backgroundColor: recButtonColor,
              borderRadius: recButtonShape,
            }}
            onPress={toggleRecord}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: isSoundRecording }}
            accessibilityLabel={
              isSoundRecording
                ? "Stop decibel sound level collection"
                : "Start sound sensor recording"
            }
            accessibilityHint={
              isSoundRecording
                ? "Stops ongoing data tracking and builds report results"
                : "Clears cache tracking indices and starts recording"
            }
          >
            <Text style={styles.text}>{btnName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sensor: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  data: {
    flex: 1,
    position: "absolute",
    top: 100,
    flexDirection: "row",
    gap: 20,
  },
  box: {
    flex: 1,
    width: 100,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonRow: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    padding: 20,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "white",
  },
  button: {
    width: 70,
    height: 70,
    borderWidth: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  record: {
    position: "absolute",
    top: 64,
    left: 32,
    width: 10,
    height: 10,
    borderRadius: 50,
  },
});

export default RecordActivity2;
