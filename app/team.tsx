import { useTheme } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Box,
  Button,
  ControlledInput,
  ControlledSelect,
  Input,
  Text,
  useTheme as useRETheme,
} from "re-native-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

interface Member {
  id: number;
  name: string;
}

interface Team {
  id: number;
  team_name: string;
  year: string;
  members: string[];
}

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  // Override theme from re-native-ui
  const theme = useRETheme();
  theme.colors.background = colors.background;
  theme.colors.primary = colors.primary;
  theme.colors.text = colors.text;
  theme.colors.border = colors.border;

  // Set the maximum members that are allowed in a team
  const MAX_MEMBERS = 5;

  // Create the object for storing the available years to select fro the ControlledSelect component
  const yearData = [
    { label: "Year 4", value: "4" },
    { label: "Year 5", value: "5" },
    { label: "Year 6", value: "6" },
    { label: "Year 7", value: "7" },
    { label: "Year 8", value: "8" },
    { label: "Year 9", value: "9" },
  ];

  //Set up states for team, members and input errors.
  const [team, setTeam] = useState<Team | null>(null);
  const [members_text, setMembers] = useState<Member[]>([]);
  const [member_input, setMemberInput] = useState("");
  const [isMemberErrorVisible, setMemberError] = useState(false);
  const [isMemberMaxVisible, setMemberMax] = useState(false);
  const [isMemberEmptyVisible, setMemberEmpty] = useState(false);
  const { control, handleSubmit } = useForm<any>({
    defaultValues: { team_name: "", year: "", members: [] },
  });

  // Store the team data in local storage
  const storeTeam = async (teamData: Team) => {
    try {
      await AsyncStorage.setItem("team", JSON.stringify(teamData));
      //Alert.alert("Success", "Team saved locally");
      router.push("/");
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  // Update the member input value
  const memberInput = (value: string) => {
    setMemberEmpty(false);
    setMemberInput(value);
  };

  // Create the team data fro mthe inputs and call storeTeam
  const createTeam = (data: any) => {
    setMemberError(false);

    if (members_text.length > 0) {
      let id = 0;
      if (team == null) {
        id = Date.now();
      } else {
        id = team.id;
      }

      const members_array: string[] = [];
      members_text.map((items) => {
        members_array.push(items.name);
      });

      const teamData = {
        id: id,
        team_name: data.team_name,
        year: data.year,
        members: members_array,
      };
      console.log(teamData);
      setTeam(teamData);
      storeTeam(teamData);
    } else {
      console.log("Need members");
      setMemberError(true);
    }
  };

  // Add a team member to the team members list (members_text)
  const addTeamMember = () => {
    if (member_input != "") {
      setMemberEmpty(false);
      setMemberError(false);
      if (members_text.length < MAX_MEMBERS) {
        setMembers([...members_text, { id: Date.now(), name: member_input }]);
        setMemberInput("");
      } else {
        setMemberMax(true);
      }
    } else {
      setMemberEmpty(true);
    }
  };

  // Remove the memeber from the list
  const removeTeamMember = (item: Member) => {
    setMemberMax(false);
    const updatedMembers = members_text.filter((member) => member !== item);
    setMembers(updatedMembers);
  };

  return (
    <View
      style={{
        ...styles.screen,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ ...styles.title, color: colors.text }} variant="heading">
        STEMM Lab Games
      </Text>
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <Box p="md" style={{ ...styles.box, backgroundColor: colors.surface }}>
          <ControlledInput
            name="team_name"
            label="Team Name"
            control={control}
            rules={{ required: "Team Name is required" }}
            style={{ ...styles.input, backgroundColor: colors.background }}
            placeholder="Enter Team Name"
          />
          <ControlledSelect
            name="year"
            // @ts-ignore
            label="Year"
            options={yearData}
            control={control}
            rules={{ required: "Year is required" }}
            placeholder="Select Year"
          />
          <Text style={styles.label}>Member Names</Text>

          <View style={styles.row}>
            {isMemberEmptyVisible ? (
              <Input
                style={{
                  ...styles.member_input,
                  borderColor: colors.error,
                  backgroundColor: colors.background,
                }}
                placeholder="Enter Member Name"
                onChangeText={memberInput}
                value={member_input}
              />
            ) : (
              <Input
                style={{
                  ...styles.member_input,
                  backgroundColor: colors.background,
                }}
                placeholder="Enter Member Name"
                onChangeText={memberInput}
                value={member_input}
              />
            )}
            {isMemberEmptyVisible && (
              <Text style={{ ...styles.member_error, color: colors.error }}>
                Member name cannot be blank
              </Text>
            )}
            <View style={styles.member_button_view}>
              <Pressable
                style={{
                  ...styles.member_button,
                  backgroundColor: colors.primary,
                }}
                onPress={addTeamMember}
              >
                <Ionicons name="add-outline" size={32} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <View style={styles.members}>
            {members_text.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.member_text}>{item.name}</Text>
                <Pressable
                  id={item.id.toString()}
                  style={{
                    ...styles.member_button,
                    backgroundColor: colors.secondary,
                  }}
                  onPress={() => removeTeamMember(item)}
                >
                  <Ionicons
                    name="remove-outline"
                    size={32}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            ))}
            {isMemberErrorVisible && (
              <Text style={{ ...styles.member_error, color: colors.error }}>
                Need at least 1 team member
              </Text>
            )}
            {isMemberMaxVisible && (
              <Text style={{ ...styles.member_error, color: colors.error }}>
                {`Maximum team members is ${MAX_MEMBERS}`}
              </Text>
            )}
          </View>
        </Box>
        <Button onPress={handleSubmit(createTeam)}>Create Team</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    minWidth: 400,
    justifyContent: "center",
    alignItems: "stretch",
    gap: 100,
    flex: 1,
    padding: 20,
  },
  box: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "stretch",
  },
  row: {
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  title: {
    textAlign: "center",
    marginTop: 100,
  },
  label: {
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  member_input: {
    alignItems: "stretch",
  },
  member_buttons: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  member_button_view: {
    marginBottom: 16,
  },
  member_button: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  members: {
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 10,
  },
  member_text: {
    verticalAlign: "middle",
  },
  member_error: {
    fontSize: 14,
  },
});
