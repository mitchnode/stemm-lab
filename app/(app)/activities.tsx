import { useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";



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

export default function activities() {
  const router = useRouter();
  const { colors, setScheme, isDark } = useTheme();

const [isVisible, setIsVisible] = useState(false);


const [ChangeTeam, setChangeTeam] = useState(false);




// Set up state for team
//copied and pasted
  let [team, setTeam] = useState({
    id: 0,
    team_name: "",
    year: "",
    members: [],
  });

  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
    // Reapply theme color to header *** Not needed at the moment due to heade being the same color for both themes***
    /* navigation.setOptions({
      headerStyle: { backgroundColor: colors.header },
    }); */
  };

   const theme = useRETheme();
    theme.colors.background = colors.background;
    theme.colors.primary = colors.primary;
    theme.colors.text = colors.text;
    theme.colors.border = colors.border;
  


// copied and pasted and adjusted from original team code
  // Load team data
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
  

  // call loadTeam to retrieve the team data for displaying in the card
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
<View style={{ ...styles.box, backgroundColor: colors.surface }}>
    <View style={styles.info}>
     <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 15, columnGap: 75, justifyContent: 'center' }}>
           
           
        <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 1:

         </Button>
    

       <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 2:

         </Button>
     
               
                  <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 3:

         </Button>
        

        <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 4:

         </Button>
               
     
                
         <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 5:

         </Button>
               

        <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 6:

         </Button>
               
        <Button 
         onPress={() => {
          router.push("/activities");
         }}>Activities 7:

         </Button>
                </View>
               
    </View>
    
    </View>
      
 <View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <View style={styles.info}>
     
              <Text style={{ color: colors.text }}>Welcome {team.team_name}</Text>
              <Button onPress={() => setIsVisible(!isVisible)}> View Team </Button>
              <Button onPress={() => setChangeTeam(!ChangeTeam)}> Change Team</Button>
     
              <Button onPress={changeTheme}>Switch theme</Button>
              {/* Switch theme button is just for testing, remove once setup in the menu. */}
            </View>
          
          </View>
    

{ChangeTeam && (


   <View style={{ ...styles.box, backgroundColor: colors.surface}}>

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















       {isVisible && (
     
         
      <View style={{ ...styles.box, backgroundColor: colors.surface }}>
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
