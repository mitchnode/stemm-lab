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
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function RecordActivity4() {
  // <---------------------------------------- Set to Activity number
  const { user } = useAuth();
  const ACTIVITY_ID = "4"; // <---------------------------------------- Set to Activity number
  const [recButtonColor, setRecButtonColor] = useState("green");
  const [recButtonShape, setRecButtonShape] = useState(50);
  const [data, setData] = useState("");
  const [btnName, setBtnName] = useState("Start");

  // Call hook for sensor <----------------------------------------------
  const {
    db,
    maxdb,
    percent,
    isSoundRecording,
    hasAudioPermission,
    start,
    stop,
  } = useSoundLevel();
  // <---------------------------------------------------------------- Add other required functions for updating the View
  if (hasAudioPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Microphone permission denied.</Text>
      </View>
    );
  }

  const animatedStyle = useAnimatedStyle(() => {
    if (db != undefined) {
      return {
        height: withSpring(percent),
      };
    }
    return {
      height: 100,
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
      const resultValue = maxdb.toString(); // <------------------------------------------- Modify resultValue
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
      await start(); // <-----------------------------------------------------------Call function to begin recording sensor data
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      {/* <--------------------------------------------------------------------------------------------Modify to suit sensor display */}
      <View style={styles.sensor}>
        <Animated.View
          style={[
            { ...styles.box, backgroundColor: colors.secondary },
            animatedStyle,
          ]}
        />
      </View>

      {isSoundRecording ? (
        <View style={styles.data}>
          <Text style={{ ...styles.text, color: colors.text }}>Recording</Text>
          <Text style={{ ...styles.text, color: colors.text }}>
            dB: {db?.toFixed(2)}
          </Text>
          <Text style={{ ...styles.text, color: colors.text }}>
            Max dB: {maxdb.toFixed(2)}
          </Text>
          <Text style={{ ...styles.text, color: colors.text }}>
            Percent: {percent}
          </Text>
        </View>
      ) : (
        <></>
      )}

      {isSoundRecording && (
        <View style={{ ...styles.record, backgroundColor: "red" }} />
      )}

      {/* <^--------------------^---------------------^--------------------------------^----------------------------^------------------------^ */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              ...styles.button,
              borderColor: "transparent",
              backgroundColor: recButtonColor,
              borderRadius: recButtonShape,
            }}
            onPress={toggleRecord}
          >
            <Text style={styles.text}>{btnName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sensor: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  data: {
    flexDirection: "row",
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
