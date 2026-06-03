import { ResultModel } from "@/models/ResultModel";
import {
  getLastKnownPositionAsync,
  requestForegroundPermissionsAsync
} from "expo-location";
import { makeAutoObservable, runInAction } from "mobx";
import { StyleSheet, Text, View } from "react-native";

export class ResultViewModel {
  result = new ResultModel();
  resultID = "";
  teamID = "";
  activityID = "";
  resultDateTime = "";
  resultType = "";
  resultValue = 0;
  resultData = "";
  resultLocation = "";

  constructor() {
    makeAutoObservable(this);
  }

  // Setter methods
  setResultID(resultID: string) {
    this.resultID = resultID;
  }

  setActivityID(activityID: string) {
    this.activityID = activityID;
  }

  setTeamID(teamID: string) {
    this.teamID = teamID;
  }

  setResultDateTime(resultDateTime: string) {
    this.resultDateTime = resultDateTime;
  }

  setResultType(resultType: string) {
    this.resultType = resultType;
  }

  setResultValue(resultValue: number | string) {
    this.resultValue = Number(resultValue);
  }

  setResultData(resultData: string) {
    this.resultData = resultData;
  }

  // Getter methods
  getResultID() {
    return this.resultID;
  }

  getActivityID() {
    return this.activityID;
  }

  getTeamID() {
    return this.teamID;
  }

  getResultDateTime() {
    return this.resultDateTime;
  }

  getResultType() {
    return this.resultType;
  }

  getResultValue() {
    return this.resultValue;
  }

  getResultData() {
    return this.resultData;
  }

  async getCurrentLocation() {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return (
        <View style={StyleSheet.absoluteFill}>
          <Text>Permission to access location was denied</Text>
        </View>
      );
    }

    return await getLastKnownPositionAsync({});
  }

  getResultDataParsed(): { timestamp: number; magnitude: number }[] {
    try {
      return this.resultData ? JSON.parse(this.resultData) : [];
    } catch (error) {
      console.error("Failed to parse result data:", error);
      return [];
    }
  }

  // Record the result data, generating a new resultID
  async handleRecord() {
    this.resultID =
      "result-" +
      this.activityID +
      "-" +
      Math.random().toString(36).substring(0, 11);

    this.resultLocation = JSON.stringify(await this.getCurrentLocation());

    this.result.setResultInfo(
      this.resultID,
      this.teamID,
      this.activityID,
      this.resultDateTime,
      this.resultType,
      this.resultValue,
      this.resultData,
      this.resultLocation,
    );
    return this.result.storeResult();
  }

  // Upload the Result
  async handleUpload() {
    await this.result.uploadResult();
  }

  // Restore the Result data after instantiating a new Result
  async handleRestore(resultID: string) {
    await this.result.loadResult(resultID);
    runInAction(() => {
      this.resultID = this.result.resultID;
      this.activityID = this.result.activityID;
      this.teamID = this.result.teamID;
      this.resultDateTime = this.result.resultDateTime;
      this.resultType = this.result.resultType;
      this.resultValue = this.result.resultValue;
      this.resultData = this.result.resultData;
      this.resultLocation = this.result.resultLocation;
    });
  }

  async handleDelete() {
    await this.result.removeResult();
  }
}
