import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { ALL_LABS } from '../labsData.js';

import {
  Button,
  ControlledInput,
  Text,
  useTheme as useRETheme,
} from "re-native-ui";

interface Team {
  id: number;
  team_name: string;
  members: string[];
}

export default function activities({  }) {


  const router = useRouter();
  const { colors, setScheme, isDark } = useTheme();

const [isVisible, setIsVisible] = useState(false);


const [ChangeTeam, setChangeTeam] = useState(false);





  let [team, setTeam] = useState({
    id: 0,
    team_name: "",
    year: "",
    members: [],
  });

  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
 
  };

   const theme = useRETheme();
    theme.colors.background = colors.background;
    theme.colors.primary = colors.primary;
    theme.colors.text = colors.text;
    theme.colors.border = colors.border;
  



  const loadTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem("team");
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
        //console.log("Team loaded from storage", storedTeam);
      } else {
        console.log("No Team created yet");
        router.push("/team");
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
  };

  const { control, handleSubmit } = useForm<any>({
    defaultValues: { team_name: "", year: "", members: [] },
  });
  

  useEffect(() => {
    loadTeam();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} 
      contentContainerStyle={{ flexGrow: 1 ,  paddingBottom: 60}}
      
    >
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <Text style={{ ...styles.heading, color: colors.text }}>
        Activities
      </Text>
        <View style={styles.info}>
          {/* Activities Selection Box */}
<View style={[styles.box, { backgroundColor: colors.surface }]}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 15, columnGap: 20, justifyContent: 'center' }}>
              
              {/* Dynamic Loop through your labsData registry mapping keys automatically */}
              {Object.keys(ALL_LABS).map((labKey) => {
                const lab = ALL_LABS[labKey as keyof typeof ALL_LABS];
                return (
                  <Button 
                    key={lab.id}
                    onPress={() => {
                      router.push({
                        pathname: "/activity_detail",
                        params: { id: labKey } // ✨ Passing the clean lookup key object directly
                      });
                    }}
                  >
                   <Text style={{color: '#fff'}}>{lab.title}</Text>
                  </Button>
                  );
                })
              }
            </View>
          </View>
    
      {/*/team welcome card*/}
 <View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <View style={styles.info}>
     
              <Text style={{ color: colors.text }}>Welcome {team.team_name}</Text>
              <Button onPress={() => setIsVisible(!isVisible)}> View Team </Button>
              <Button onPress={() => setChangeTeam(!ChangeTeam)}> Change Team</Button>
     
              <Button onPress={changeTheme}>Switch theme</Button>
              {/* Switch theme button is just for testing, remove once setup in the menu. */}
            </View>
          
          </View>
    
{/*update team layout*/}  
{ChangeTeam && (<View style={{ ...styles.box, backgroundColor: colors.surface}}>
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
       {isVisible && (<View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Team ID:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.id}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ ...styles.bold_text, color: colors.text }}>
              Team name:
            </Text>
            <Text style={{ ...styles.large_font, color: colors.text }}>
              {team.team_name}
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
       width: '95%', 
    minWidth: 400,
  },
  // second box added as i will need to add different parameters for the acvities box
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
