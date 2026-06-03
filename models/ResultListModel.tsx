import { getResultList } from "@/services/firestoreService";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";

export class ResultListModel {
  resultList: string[] = [];
  populatedList: ResultViewModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Store the list in AsyncStorage
  storeResultList = async () => {
    try {
      await AsyncStorage.setItem("resultList", JSON.stringify(this.resultList));
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Load the result list from AsyncStorage
  loadResultList = async (teamID: string) => {
    try {
      let resultListJSON;
      let resultListString = await AsyncStorage.getItem("resultList");
      if (!resultListString) {
        resultListString = JSON.stringify(await getResultList(teamID));
      }

      if (resultListString) {
        resultListJSON = await JSON.parse(resultListString);
      } else {
        resultListJSON = [];
      }
      this.resultList = resultListJSON;
      return this.resultList;
    } catch (error) {
      console.error("Error loading resultlist:", error);
    }
  };

  // Get the results for each resultID and populate the populatedList for use on the resultlist screen
  getResults = async () => {
    this.populatedList.length = 0;
    this.resultList.map(async (resultID) => {
      const result = new ResultViewModel();
      await result.handleRestore(resultID);
      runInAction(() => {
        this.populatedList.push(result);
      });
    });
    this.populatedList.sort(
      (a, b) =>
        new Date(a["resultDateTime"]).valueOf() -
        new Date(b["resultDateTime"]).valueOf(),
    );
  };
}
