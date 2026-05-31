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

  /* sortedResults = (arr: Result[]) => {
    return arr.slice().sort((a, b) => Number(a[KEY]) - Number(b[KEY]));
  }; */

  async getTopResults() {
    if (this.activityId) {
      try {
        this.topResults = await getTop10ActivityResults(this.activityId);
      } catch (error) {
        console.error("Error fetching results", error);
      }
    }
  }
  /* async getTopResults() {
    await this.getAllResults();
    if (this.allResults) {
      return this.sortedResults(this.allResults).slice(0, 10);
    }
  } */

  /* async getAllResults() {
    if (this.activityId) {
      try {
        this.allResults = await getActivityResults(this.activityId);
      } catch (error) {
        console.error("Error fetching results", error);
      }
    }
  } */
}
