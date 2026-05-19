/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Record() {
  const ACTIVITY_ID = 4;
  const [isRecording, setRecording] = useState(false);
  const [recButtonColor, setRecButtonColor] = useState("green");
  const [recButtonShape, setRecButtonShape] = useState(50);
  const [teamID, setTeamID] = useState("");
  const [data, setData] = useState("");
  const [btnName, setBtnName] = useState("Start");
  const [result] = useState(() => new ResultViewModel());

  const { colors } = useTheme();

  const loadTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem("team");
      if (storedTeam) {
        setTeamID(JSON.parse(storedTeam).id);
      } else {
        console.log("No Team created yet");
        router.push("/team");
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
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
        const dateTime = new Date(Date.now()).toLocaleString();
        result.setTeamID(teamID);
        result.setActivityID(ACTIVITY_ID);
        result.setResultDateTime(dateTime);
        result.setResultType("Acceleration");
        result.setResultValue("10m/s^2");
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
