import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Box, Button, Container, Input, Select, Text } from "re-native-ui";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
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
      <SafeAreaView>
        <Container maxWidth={600} style={styles.container}>
          <Text style={styles.title} variant="heading">
            STEMM Lab Games
          </Text>
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

            <View style={styles.row}>
              <View style={styles.member_input}>
                <Input style={styles.input} placeholder="Enter Member Name" />
              </View>
              <View style={styles.add_member}>
                <Pressable
                  style={styles.add_member_button}
                  onPress={handleAddTeamMember}
                >
                  <Text style={{ color: "#fff" }}>+</Text>
                </Pressable>
              </View>
            </View>
          </Box>
          <Button onPress={storeTeam}>Create Team</Button>
        </Container>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "stretch",
    gap: 10,
    marginTop: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 20,
  },
  title: {
    textAlign: "center",
  },
  input: {
    flex: 1,
  },
  add_member: {
    marginBottom: 16,
  },
  member_input: {
    flex: 1,
    alignItems: "stretch",
  },
  add_member_button: {
    backgroundColor: "black",
    color: "white",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
});
