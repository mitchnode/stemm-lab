import { ResultListModel } from "@/models/ResultListModel";
import { Results, ResultsModel } from "@/models/ResultsModel";
import { useTheme } from "@/theme";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ResultList() {
  //const router = useRouter();
  const { colors } = useTheme();
  const resultList = new ResultListModel();
  const [results, setResults] = useState<Results[]>([]);

  /* // Set up state for team
  let [team, setTeam] = useState({
    id: 0,
    team_name: "",
    year: "",
    members: [],
  });

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
  }; */

  const addResults = async (result: ResultsModel) => {
    setResults((prevResults) => [...prevResults, result.getResult()]);
  };

  const loadResults = async () => {
    await resultList.loadResultList();

    resultList.resultList.forEach(async (resultID) => {
      const result = new ResultsModel();
      await result.loadResult(resultID);
      let match = false;
      results.map((r) => {
        if (r.resultID == result.resultID) {
          match = true;
          return;
        }
      });
      !match ? await addResults(result) : null;
    });
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <View style={{ ...styles.screen, backgroundColor: colors.background }}>
      <Text style={{ ...styles.heading, color: colors.text }}>Results</Text>
      {results.map((result, index) => (
        <View
          key={index}
          style={{ ...styles.box, backgroundColor: colors.surface }}
        >
          <View style={styles.info}>
            <View style={styles.row}>
              <Text style={{ ...styles.bold_text, color: colors.text }}>
                Result ID:
              </Text>
              <Text style={{ ...styles.large_font, color: colors.text }}>
                {result.resultID}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
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
    padding: 30,
    minWidth: 400,
  },
  heading: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
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
