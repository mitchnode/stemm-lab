import { getTop10ActivityResults, Result } from "@/services/firestoreService";
import { makeAutoObservable } from "mobx";

const KEY = "resultValue";

export class LeaderboardModel {
  activityId = "";
  //allResults: Result[] = [];
  topResults: Result[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  sortedResults = (arr: Result[]) => {
    return arr.slice().sort((a, b) => Number(a[KEY]) - Number(b[KEY]));
  };

  async getTopResults() {
    if (this.activityId) {
      try {
        const unsortedResults = await getTop10ActivityResults(this.activityId);
        this.topResults = this.sortedResults(unsortedResults);
      } catch (error) {
        console.error("Error fetching results", error);
      }
    }
  }
}
