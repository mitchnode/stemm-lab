import { getTop10ActivityResults, Result } from "@/services/firestoreService";
import { makeAutoObservable } from "mobx";

export class LeaderboardModel {
  activityId = "";
  //allResults: Result[] = [];
  topResults: { [key: string]: Result[] } = {};

  constructor() {
    makeAutoObservable(this);
  }

  sortResults = (arr: Result[]) => {
    this.topResults = arr.reduce<Record<string, Result[]>>((acc, result) => {
      const key = result.resultType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(result);
      return acc;
    }, {});

    Object.keys(this.topResults).forEach((key) => {
      this.topResults[key] = this.topResults[key]
        .sort((a, b) => Number(a["resultValue"]) - Number(b["resultValue"]))
        .splice(0, 10);
    });
  };

  async getTopResults() {
    if (this.activityId) {
      try {
        const unsortedResults = await getTop10ActivityResults(this.activityId);
        this.sortResults(unsortedResults);
      } catch (error) {
        console.error("Error fetching results", error);
      }
    }
  }
}
