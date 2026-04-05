import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Team {
  id: number;
  team_name: string;
  members: string[];
}

export default function TeamView() {
  const router = useRouter();
  const { colors } = useTheme();

  let [team, setTeam] = useState({ team_name: "", year: "", members: [] });

  const loadTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem("team");
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
        console.log("Team loaded from storage", storedTeam);
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

  return (
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Team name:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.team_name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Year:
            </Text>
            <Text style={{ color: colors.text }}>{team.year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Members:
            </Text>
            <View style={{ ...styles.members }}>
              {team.members.map((item, index) => (
                <Text
                  key={index}
                  style={{ ...styles.members_text, color: colors.text }}
                >
                  {item}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  box: {
    margin: 100,
    justifyContent: "center",
    alignItems: "stretch",
    borderWidth: 2,
    borderRadius: 20,
    padding: 30,
    gap: 15,
    minWidth: 400,
  },
  info: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  large_font: {
    fontSize: 20,
  },
  bold_text: {
    fontWeight: "bold",
  },
  members: {
    gap: 5,
  },
  members_text: {
    textAlign: "right",
  },
});
