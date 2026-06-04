import { useTheme } from "@/theme";
import { useNavigation, useRouter } from "expo-router";

import { ALL_LABS } from "@/labsData.js";
import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { useAuth } from "@/context/authContext";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import { Text, useTheme as useRETheme } from "re-native-ui";

const team = new TeamViewModel();

export default function Activities({}) {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      // Prevent back gesture behaviour
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
      }
    });

    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);

  const { user } = useAuth();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
    if (!team.teamID) router.push("/(app)/team");
  };

  const theme = useRETheme();
  theme.colors.background = colors.background;
  theme.colors.primary = colors.primary;
  theme.colors.text = colors.text;
  theme.colors.border = colors.border;

  useEffect(() => {
    loadTeam();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
    >
      <View
        testID="b4"
        style={{ ...styles.screen, backgroundColor: colors.background }}
      >
        <Text testID="c4" style={{ ...styles.heading, color: colors.text }}>
          Activities
        </Text>
        <View style={styles.info}>
          {/* Activities Selection Box */}
          <View style={[styles.box, { backgroundColor: colors.surface }]}>
            <View
              testID="t1"
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 15,
                columnGap: 20,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {/* Dynamic Loop through labsData registry mapping keys automatically */}
              {Object.keys(ALL_LABS).map((labKey) => {
                const lab = ALL_LABS[labKey as keyof typeof ALL_LABS];
                return (
                  <Pressable
                    testID={`lab-button-${lab.id}`}
                    style={{
                      ...styles.button,
                      backgroundColor: colors.primary,
                    }}
                    key={lab.id}
                    onPress={() => {
                      router.push({
                        pathname: "/activity_detail",
                        params: { id: lab.id },
                      });
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{lab.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
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
  button: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
});
