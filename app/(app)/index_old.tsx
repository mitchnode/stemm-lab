import { useAuth } from "@/context/authContext";
import { useTheme } from "@/theme";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { Button, Text } from "re-native-ui";
import { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const team = new TeamViewModel();

export default function Index() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();

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

  const { colors, setScheme, isDark } = useTheme();
  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
    // Reapply theme color to header *** Not needed at the moment due to heade being the same color for both themes***
    /* navigation.setOptions({
      headerStyle: { backgroundColor: colors.header },
    }); */
  };

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
    if (team) {
      router.push("/(app)/activities_selection");
    } else {
      router.push("/(app)/team");
    }
  };

  const clearTeam = async () => {
    try {
      await AsyncStorage.removeItem("team", () => router.push("/team"));
    } catch (error) {
      console.error("Error clearing team:", error);
    }
  };

  const clearAll = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        Alert.alert(
          "Clear all Keys",
          "Are you sure you would like to clear all local storage keys?",
          [
            {
              text: "Yes",
              style: "destructive",
              onPress: async () => {
                await AsyncStorage.multiRemove(keys, () =>
                  router.push("/team"),
                );
              },
            },
            { text: "No", style: "cancel" },
          ],
        );
      } else {
        Alert.alert("No Keys", "No keys found!");
      }
    } catch (error) {
      console.error("Error clearing team:", error);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ ...styles.container, backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.text }}>Welcome {team.teamName}</Text>
        <Button onPress={clearTeam}>Clear Team</Button>
        <Button onPress={clearAll}>Clear All</Button>
        <Button
          onPress={() => {
            router.push("/(app)/team-view");
          }}
        >
          View Team
        </Button>

        <Button
          onPress={() => {
            router.push("/activities_selection");
          }}
        >
          Activities{" "}
        </Button>
        <Button onPress={changeTheme}>Switch theme</Button>
        {/* Switch theme button is just for testing, remove once setup in the menu. */}
        <Button
          onPress={() => {
            const activityArray = ["1", "2", "3", "4", "5", "6", "7"];
            router.push({
              pathname: "/(app)/resultlist",
              params: { activity: activityArray.join(",") },
            }); // Pass activity number to filter result list
          }}
        >
          Result List
        </Button>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
