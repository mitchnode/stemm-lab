import { useTheme } from "@/theme";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const team = new TeamViewModel();

const TeamView = observer(() => {
  const { colors } = useTheme();

  // Load team data
  const loadTeam = async () => {
    await team.handleRestore();
  };

  // call loadTeam to retrieve the team data for displaying in the card
  useEffect(() => {
    loadTeam();
  }, []);

  return (
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <Text style={{ ...styles.heading, color: colors.text }}>
        Team Information
      </Text>
      <View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Team ID:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.teamID}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Team name:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.teamName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Year:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.year}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Members:
            </Text>
            <View style={{ ...styles.members }}>
              {team.members.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    ...styles.large_font,
                    ...styles.members_text,
                    color: colors.text,
                  }}
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
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  box: {
    justifyContent: "center",
    alignItems: "stretch",
    borderWidth: 2,
    borderRadius: 20,
    padding: 30,
    minWidth: 400,
  },
  heading: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
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
    fontSize: 20,
  },
  members: {
    gap: 5,
  },
  members_text: {
    textAlign: "right",
  },
});

export default TeamView;
