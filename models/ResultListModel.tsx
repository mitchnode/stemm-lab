import AsyncStorage from "@react-native-async-storage/async-storage";

export class ResultListModel {
  resultList: string[] = [];

  constructor() {
    this.loadResultList();
  }

  addResult(resultID: string) {
    this.resultList.push(resultID);
    this.storeResultList();
  }

  storeResultList = async () => {
    try {
      await AsyncStorage.setItem("resultList", JSON.stringify(this.resultList));
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  loadResultList = async () => {
    try {
      let resultListJSON;
      const resultListString = await AsyncStorage.getItem("resultList");
      if (resultListString) {
        resultListJSON = await JSON.parse(resultListString);
      } else {
        resultListJSON = [];
      }
      this.resultList = resultListJSON;
    } catch (error) {
      console.error("Error loading result:", error);
    }
  };

  getResults = async () => {
    return this.resultList;
  };
}
