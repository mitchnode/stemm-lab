import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { Button, Text } from "re-native-ui";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Team {
  id: number;
  team_name: string;
  members: string[];
}

export default function Index() {
  const navigation = useNavigation();
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

  const router = useRouter();
  let [team, setTeam] = useState({ team_name: null });

  const loadTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem("team");
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
        //console.log("Team loaded from storage", storedTeam);
      } else {
        //console.log("No Team created yet");
        router.push("/team");
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
  };

  const clearTeam = async () => {
    try {
      await AsyncStorage.removeItem("team", () => router.push("/team"));
    } catch (error) {
      console.error("Error clearing team:", error);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ ...styles.container, backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.text }}>Welcome {team.team_name}</Text>
        <Button onPress={clearTeam}>Clear</Button>
        <Button
          onPress={() => {
            router.push("/team-view");
          }}
        >
          View Team
        </Button>
        <Button onPress={changeTheme}>Switch theme</Button>
        {/* Switch theme button is just for testing, remove once setup in the menu. */}
        <Button
          onPress={() => {
            router.push("/record");
          }}
        >
          Record result
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
