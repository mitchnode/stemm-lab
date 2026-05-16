import AsyncStorage from "@react-native-async-storage/async-storage";

// Change to array if recieving multiple results
interface Results {
  resultID?: string;
  teamID?: string;
  resultDateTime: string;
  resultType: string;
  resultValue: string;
  resultData: string;
}

export class ResultsModel {
  resultID = "";
  teamID = "";
  resultDateTime = "";
  resultType = "";
  resultValue = "";
  resultData = "";

  constructor(teamID?: string) {
    teamID ? (this.teamID = teamID) : null;
  }

  setResultInfo({
    resultDateTime,
    resultType,
    resultValue,
    resultData,
  }: Results) {
    this.resultDateTime = resultDateTime;
    this.resultType = resultType;
    this.resultValue = resultValue;
    this.resultData = resultData;
  }

  setResultID(resultID: string) {
    this.resultID = resultID;
  }

  storeResult = async () => {
    try {
      const resultID = "result" + this.teamID.toString() + Date.now();
      this.setResultID(resultID);
      await AsyncStorage.setItem(this.resultID, JSON.stringify(this));
      return this.resultID;
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

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
          resultDateTime: "No Result",
          resultType: "No Result",
          resultValue: "No Result",
          resultData: "No Result",
        };
      }
      this.resultID = resultID;
      this.teamID = resultJSON.teamID;
      this.setResultInfo({
        resultID: resultID,
        teamID: resultJSON.teamID,
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
