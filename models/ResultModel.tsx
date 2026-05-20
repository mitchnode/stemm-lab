import { ResultListViewModel } from "@/viewmodel/ResultListViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";

export class ResultModel {
  resultID = "";
  teamID = "";
  activityID: number = 0;
  resultDateTime = "";
  resultType = "";
  resultValue = "";
  resultData = "";

  constructor() {
    makeAutoObservable(this);
  }

  // Add result information to an initialized result
  setResultInfo(
    resultID: string,
    teamID: string,
    activityID: number,
    resultDateTime: string,
    resultType: string,
    resultValue: string,
    resultData: string,
  ) {
    this.resultID = resultID;
    this.teamID = teamID;
    this.activityID = activityID;
    this.resultDateTime = resultDateTime;
    this.resultType = resultType;
    this.resultValue = resultValue;
    this.resultData = resultData;
  }

  // Upload result, adding to the local result list
  uploadResults = async () => {
    // Save result to a local list in Async Storage
    const resultList = new ResultListViewModel();
    await resultList.handleRestore();
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
      this.setResultInfo(
        resultID,
        resultJSON.teamID,
        resultJSON.activityID,
        resultJSON.resultDateTime,
        resultJSON.resultType,
        resultJSON.resultValue,
        resultJSON.resultData,
      );
    } catch (error) {
      console.error("Error loading result:", error);
    }
  };
}
