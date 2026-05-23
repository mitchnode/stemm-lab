/* 
Generalized record screen
Use for creating screens for recording different activities sensor recording
 */

import { useTheme } from "@/theme";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const result = new ResultViewModel();
const team = new TeamViewModel();

export default function RecordActivity6() {
  const { colors } = useTheme();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ ...styles.title, color: colors.text }}>Select a task</Text>
      <View style={{ ...styles.buttonRow, borderColor: colors.text }}>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: colors.primary,
          }}
          onPress={() => router.push("/(app)/record/recordactivity6_1")}
        >
          <Text style={{ ...styles.buttonText, color: colors.text }}>
            Reaction Timer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: colors.success,
          }}
          onPress={() => router.push("/(app)/record/recordactivity6_2")}
        >
          <Text style={{ ...styles.buttonText, color: colors.text }}>
            Path Tracing
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});
