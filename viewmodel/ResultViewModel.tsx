import { ResultModel } from "@/models/ResultModel";
import { makeAutoObservable } from "mobx";

export class ResultViewModel {
  result = new ResultModel();
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

  // Setter methods
  setResultID(resultID: string) {
    this.resultID = resultID;
  }

  setActivityID(activityID: number) {
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

  setResultValue(resultValue: string) {
    this.resultValue = resultValue;
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

  handleRecord() {
    this.resultID =
      "result-" +
      this.activityID +
      "-" +
      Math.random().toString(36).substring(0, 11);
    this.result.setResultInfo(
      this.resultID,
      this.teamID,
      this.activityID,
      this.resultDateTime,
      this.resultType,
      this.resultValue,
      this.resultData,
    );
    return this.result.storeResult();
  }

  handleUpload() {
    this.result.uploadResults();
  }

  async handleRestore(resultID: string) {
    await this.result.loadResult(resultID);
    this.resultID = this.result.resultID;
    this.activityID = this.result.activityID;
    this.teamID = this.result.teamID;
    this.resultDateTime = this.result.resultDateTime;
    this.resultType = this.result.resultType;
    this.resultValue = this.result.resultValue;
    this.resultData = this.result.resultData;
  }
}
