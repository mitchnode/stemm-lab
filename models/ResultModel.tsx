import { createResult, getResult, Result } from "@/services/firestoreService";
import { ResultListViewModel } from "@/viewmodel/ResultListViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";

export class ResultModel {
  resultID = "";
  teamID = "";
  activityID = "";
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
    activityID: string,
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

  objectifyResult = () => {
    return {
      resultID: this.resultID,
      teamID: this.teamID,
      activityID: this.activityID,
      resultDateTime: this.resultDateTime,
      resultType: this.resultType,
      resultValue: this.resultValue,
      resultData: this.resultData,
    } as Result;
  };

  // Upload result, adding to the local result list
  uploadResult = async () => {
    // Save result to a local list in Async Storage
    const resultList = new ResultListViewModel();
    await resultList.handleRestore(this.teamID);
    resultList.addResult(this.resultID);
    // Upload results to Firebase
    await createResult(this.objectifyResult());
    // Compare result to existing leaderboard entry, update if better.
    // Give feedback to the user confirming upload complete. COnvert to a Toast later if we have time.
    Alert.alert(
      "Result uploaded!",
      "Your result has been uploaded to the cloud",
    );
    router.dismissTo({
      pathname: "/activity_detail",
      params: { id: this.activityID },
    });
  };

  // Store the result in local storage
  storeResult = async () => {
    try {
      await AsyncStorage.setItem(this.resultID, JSON.stringify(this));
      return this.resultID;
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Load the result from local storage or Firestore if there is no local data
  loadResult = async (resultID: string) => {
    try {
      let resultJSON;
      let resultString = await AsyncStorage.getItem(resultID);
      if (!resultString) {
        resultString = JSON.stringify(await getResult(resultID));
      }
      if (resultString) {
        resultJSON = await JSON.parse(resultString);
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
      console.error("Error loading result:", error, "resultID:", resultID);
    }
  };
}
