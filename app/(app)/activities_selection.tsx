import { useTheme } from "@/theme";
import { useRouter } from "expo-router";

import { ALL_LABS } from "@/labsData.js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { useAuth } from "@/context/authContext";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import {
  Button,
  ControlledInput,
  Text,
  useTheme as useRETheme,
} from "re-native-ui";

const team = new TeamViewModel();

export default function activities({}) {
  const router = useRouter();
  const { colors, setScheme, isDark } = useTheme();

  const [isVisible, setIsVisible] = useState(false);

  const [ChangeTeam, setChangeTeam] = useState(false);
  const { user } = useAuth();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
  };

  const theme = useRETheme();
  theme.colors.background = colors.background;
  theme.colors.primary = colors.primary;
  theme.colors.text = colors.text;
  theme.colors.border = colors.border;

  const { control, handleSubmit } = useForm<any>({
    defaultValues: { team_name: "", year: "", members: [] },
  });

  useEffect(() => {
    loadTeam();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
    >
      <View style={{ ...styles.screen, backgroundColor: colors.background }}>
        <Text
          style={{ ...styles.heading, color: colors.text }}
          accessibilityRole="header"
        >
          Activities
        </Text>
        <View style={styles.info}>
          {/* Activities Selection Box */}
          <View
            style={[styles.box, { backgroundColor: colors.surface }]}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Available Activities Directory Grid"
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 15,
                columnGap: 20,
                justifyContent: "center",
              }}
            >
              {/* Dynamic Loop through labsData registry mapping keys automatically */}
              {Object.keys(ALL_LABS).map((labKey) => {
                const lab = ALL_LABS[labKey as keyof typeof ALL_LABS];
                return (
                  <View
                    key={lab.id}
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel={`Activity: ${lab.title}`}
                    accessibilityHint="Navigates to the comprehensive details layout and recording tools for this lab option."
                  >
                    <Button
                      key={lab.id}
                      onPress={() => {
                        router.push({
                          pathname: "/activity_detail",
                          params: { id: lab.id },
                        });
                      }}
                    >
                      <Text style={{ color: "#fff" }}>{lab.title}</Text>
                    </Button>
                  </View>
                );
              })}
            </View>
          </View>

          {/*/team welcome card*/}
          <View style={{ ...styles.box, backgroundColor: colors.surface }}>
            <View style={styles.info}>
              <Text
                style={{ color: colors.text }}
                accessible={true}
                accessibilityRole="none"
                accessibilityLabel={`Welcome notification message greeting team: ${team.teamName || "Unassigned Name"}`}
              >
                Welcome {team.teamName}
              </Text>
              <View
                accessible={true}
                accessibilityRole="none"
                accessibilityState={{ checked: isVisible }}
                accessibilityLabel="View Team Profile Data Sheet Layout Dropdown"
                accessibilityHint="Toggles display visibility showing active enrollment IDs and group members details rows directly below."
              >
                <Button onPress={() => setIsVisible(!isVisible)}>
                  {" "}
                  View Team{" "}
                </Button>
              </View>
              <View
                accessible={true}
                accessibilityRole="none"
                accessibilityState={{ checked: ChangeTeam }}
                accessibilityLabel="Modify active lab team input configuration form field"
                accessibilityHint="Expands an inline input field layout below to reassign or rewrite active profile credentials identifiers."
              >
                <Button onPress={() => setChangeTeam(!ChangeTeam)}>
                  {" "}
                  Change Team
                </Button>
              </View>
              {/* Switch theme button is just for testing, remove once setup in the menu. */}
            </View>
          </View>

          {/*update team layout*/}
          {ChangeTeam && (
            <View style={{ ...styles.box, backgroundColor: colors.surface }}>
              <ControlledInput
                name="team_name"
                label="Team Name"
                control={control}
                rules={{ required: "Team Name is required" }}
                style={{ ...styles.input, backgroundColor: colors.background }}
                placeholder="Enter Team Name"
              />
              <Button onPress={handleSubmit((data) => console.log(data))}>
                Update Team
              </Button>
            </View>
          )}

          {/* --- TEAM PROFILE DRAWER DETAILS --- */}
          {isVisible && (
            <View
              style={{ ...styles.box, backgroundColor: colors.surface }}
              accessible={true}
              accessibilityRole="none"
              accessibilityLabel="Team Profile Information"
            >
              <View style={styles.info}>
                <View
                  style={styles.row}
                  accessible={true}
                  accessibilityLabel={`Team ID: ${team.teamID || "Not available"}`}
                >
                  <Text
                    style={{ ...styles.bold_text, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    Team ID:
                  </Text>
                  <Text
                    style={{ ...styles.large_font, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    {team.teamID}
                  </Text>
                </View>
                <View
                  style={styles.row}
                  accessible={true}
                  accessibilityLabel={`Team Name: ${team.teamName || "Not named"}`}
                >
                  <Text
                    style={{ ...styles.bold_text, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    Team name:
                  </Text>
                  <Text
                    style={{ ...styles.large_font, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    {team.teamName}
                  </Text>
                </View>
                <View
                  style={styles.row}
                  accessible={true}
                  accessibilityLabel={`Year: ${team.year || "Not set"}`}
                >
                  <Text
                    style={{ ...styles.bold_text, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    Year:
                  </Text>
                  <Text
                    style={{ ...styles.large_font, color: colors.text }}
                    importantForAccessibility="no"
                  >
                    {team.year}
                  </Text>
                </View>
                <View
                  style={styles.row}
                  accessible={true}
                  accessibilityLabel={`Members list. ${team.members ? team.members.length : 0} total members.`}
                >
                  <Text
                    style={{ ...styles.bold_text, color: colors.text }}
                    importantForAccessibility="no"
                  >
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
                        accessible={true}
                        accessibilityLabel={item}
                      >
                        {item}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

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
    padding: 20,
    width: "95%",
    minWidth: 400,
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
});
