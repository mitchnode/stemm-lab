/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import { useAuth } from "@/context/authContext";
import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function Record() {
  const { user } = useAuth();
  const ACTIVITY_ID = "6";
  const [isRecording, setRecording] = useState(false);
  const [recButtonColor, setRecButtonColor] = useState("green");
  const [recButtonShape, setRecButtonShape] = useState(50);
  const [data, setData] = useState("");
  const [btnName, setBtnName] = useState("Start");

  const { colors } = useTheme();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const toggleRecord = async () => {
    if (isRecording) {
      setBtnName("Start");
      setRecording(false);
      setRecButtonColor(colors.success);
      setRecButtonShape(50);
      // Call function to finish recording sensor data <<<<------------------------------
      if (data) {
        // Get any processed result here before passing to the results page
        // Dummy results for testing
        const dateTime = new Date().toLocaleString();
        const resultType = "Acceleration";
        const resultValue = "10m/s^2";
        result.setTeamID(team.teamID);
        result.setActivityID(ACTIVITY_ID);
        result.setResultDateTime(dateTime);
        result.setResultType(resultType);
        result.setResultValue(resultValue);
        result.setResultData(data);

        const resultID = await result.handleRecord();
        router.push({
          pathname: "/results",
          params: { resultID: resultID },
        });
      }
    } else {
      setBtnName("Stop");
      setRecording(true);
      setRecButtonColor(colors.error);
      setRecButtonShape(20);
      // Call function to begin recording sensor data <<<<---------------------------------
      setData("Dummy data");
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      {isRecording && (
        <View style={{ ...styles.record, backgroundColor: "red" }} />
      )}
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
    fontSize: 24,
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
