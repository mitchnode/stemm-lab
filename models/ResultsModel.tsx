import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { ResultListModel } from "./ResultListModel";

// Change to array if recieving multiple results
export interface Results {
  resultID?: string;
  teamID?: string;
  activityID: number;
  resultDateTime: string;
  resultType: string;
  resultValue: string;
  resultData: string;
}

export class ResultsModel {
  resultID = "";
  teamID = "";
  activityID: number = 0;
  resultDateTime = "";
  resultType = "";
  resultValue = "";
  resultData = "";

  constructor(teamID?: string) {
    teamID ? (this.teamID = teamID) : null;
  }

  // Add result information to an initialized result
  setResultInfo({
    activityID,
    resultDateTime,
    resultType,
    resultValue,
    resultData,
  }: Results) {
    this.activityID = activityID;
    this.resultDateTime = resultDateTime;
    this.resultType = resultType;
    this.resultValue = resultValue;
    this.resultData = resultData;
  }

  // Returns the result as a Results object
  getResult() {
    const results: Results = {
      resultID: this.resultID,
      teamID: this.teamID,
      activityID: this.activityID,
      resultDateTime: this.resultDateTime,
      resultType: this.resultType,
      resultValue: this.resultValue,
      resultData: this.resultData,
    };
    return results;
  }

  // Set the resultID for an initialized result
  setResultID(resultID: string) {
    this.resultID = resultID;
  }

  // Upload result, adding to the local result list
  uploadResults = async () => {
    // Save result to a local list in Async Storage
    const resultList = new ResultListModel();
    await resultList.loadResultList();
    resultList.addResult(this.resultID);
    // Upload results to Firebase???
    // include TeamID, Team name, Activity, result. (Video/sensor data stays local)
    // Compare result to existing leaderboard entry, update if better.
    // Give feedback to the user confirming upload complete.
    Alert.alert(
      "Result uploaded!",
      "Your result has been uploaded to the cloud",
    );
    router.push("/");
  };

  // Store the result in Async Storage
  storeResult = async () => {
    try {
      const resultID =
        "result-" +
        this.activityID +
        "-" +
        Math.random().toString(36).substring(0, 11);
      this.setResultID(resultID);
      await AsyncStorage.setItem(this.resultID, JSON.stringify(this));
      return this.resultID;
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Load the result from Async Storage
  loadResult = async (resultID: string) => {
    try {
      let resultJSON;
      const resultString = await AsyncStorage.getItem(resultID);
      if (resultString) {
        resultJSON = JSON.parse(resultString);
      } else {
        resultJSON = {
          resultID: this.resultID,
          teamID: this.teamID,
          activityID: this.activityID,
          resultDateTime: "No Result",
          resultType: "No Result",
          resultValue: "No Result",
          resultData: "No Result",
          resultThumbnail: "No Result",
        };
      }
      this.resultID = resultID;
      this.teamID = resultJSON.teamID;
      this.setResultInfo({
        resultID: resultID,
        teamID: resultJSON.teamID,
        activityID: resultJSON.activityID,
        resultDateTime: resultJSON.resultDateTime,
        resultType: resultJSON.resultType,
        resultValue: resultJSON.resultValue,
        resultData: resultJSON.resultData,
      });
    } catch (error) {
      console.error("Error loading result:", error);
    }
  };
}
