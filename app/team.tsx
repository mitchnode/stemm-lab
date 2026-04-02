import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  let [team, setTeam] = useState({});

  const storeTeam = async () => {
    try {
      const teamData = {
        id: 1,
        team_name: "Test Team",
        members: ["Adam", "Brad", "Chris"],
      };
      await AsyncStorage.setItem("team", JSON.stringify(teamData));
      setTeam(teamData);
      Alert.alert("Success", "Team saved locally");
      router.push("/");
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Text>STEMM Lab Games</Text>

      <Button title="Add Member" />
      <Button title="Create Team" onPress={storeTeam} />
    </View>
  );
}
