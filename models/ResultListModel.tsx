import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";

export class ResultListModel {
  resultList: string[] = [];
  populatedList: ResultViewModel[] = [];

  constructor() {
    makeAutoObservable(this);
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
      return this.resultList;
    } catch (error) {
      console.error("Error loading result:", error);
    }
  };

  getResults = async () => {
    this.resultList.map(async (resultID) => {
      const result = new ResultViewModel();
      await result.handleRestore(resultID);
      this.populatedList.push(result);
    });
  };
}
