import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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

  const [team_name, onChangeTeamName] = useState("");
  const [year, setYear] = useState(null);

  const yearData = [
    { label: "Year 4", value: 4 },
    { label: "Year 5", value: 5 },
    { label: "Year 6", value: 6 },
    { label: "Year 7", value: 7 },
    { label: "Year 8", value: 8 },
    { label: "Year 9", value: 9 },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>STEMM Lab Games</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTeamName}
          value={team_name}
          placeholder="Enter Team Name"
        />

        <View>
          <TextInput style={styles.input} placeholder="Enter Member Name" />
          <Button title="Add Member" />
        </View>
        <Button title="Create Team" onPress={storeTeam} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
