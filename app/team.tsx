import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Box, Button, Input, Select, Text } from "re-native-ui";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
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

  const handleAddTeamMember = () => {
    console.log("Add Team Member");
  };

  const [team_name, onChangeTeamName] = useState("");
  const [year, setYear] = useState("");
  const [members, setMembers] = useState([]);

  const yearData = [
    { label: "Year 4", value: "4" },
    { label: "Year 5", value: "5" },
    { label: "Year 6", value: "6" },
    { label: "Year 7", value: "7" },
    { label: "Year 8", value: "8" },
    { label: "Year 9", value: "9" },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text variant="heading">STEMM Lab Games</Text>
        <Box p="md" bg="background" style={{ borderRadius: 8 }}>
          <Input
            style={styles.input}
            onChangeText={onChangeTeamName}
            value={team_name}
            placeholder="Enter Team Name"
          />
          <Select
            placeholder="Select Year"
            value={year}
            onChange={setYear}
            options={yearData}
          />

          <View>
            <Input style={styles.input} placeholder="Enter Member Name" />
            <Button onPress={handleAddTeamMember}>Add Member</Button>
          </View>
        </Box>
        <Button onPress={storeTeam}>Create Team</Button>
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
  input: {
    minWidth: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});
