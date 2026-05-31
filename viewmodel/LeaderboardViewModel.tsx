import { LeaderboardModel } from "@/models/LeaderboardModel";
import { Result } from "@/services/firestoreService";
import { makeAutoObservable } from "mobx";

export class LeaderboardViewModel {
  leaderboard = new LeaderboardModel();
  activityId = "";
  topResults: Result[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setActivityId(activityId: string) {
    this.activityId = activityId;
    this.leaderboard.activityId = activityId;
  }

  async handleTopResults() {
    await this.leaderboard.getTopResults();
    this.topResults = this.leaderboard.topResults;
  }
}
