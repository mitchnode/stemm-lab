import { TeamModel } from "@/models/TeamModel";
import { makeAutoObservable, runInAction } from "mobx";

export class TeamViewModel {
  team = new TeamModel();
  uid: string = "";
  teamID: string = "";
  teamName: string = "";
  year: string = "";
  members: string[] = [];

  // Set the maximum members that are allowed in a team
  MAX_MEMBERS = 5;

  constructor() {
    makeAutoObservable(this);
  }

  // Create the list for storing the available years to select from
  yearData = [
    { label: "Year 4", value: "4" },
    { label: "Year 5", value: "5" },
    { label: "Year 6", value: "6" },
    { label: "Year 7", value: "7" },
    { label: "Year 8", value: "8" },
    { label: "Year 9", value: "9" },
  ];

  // Setter methods
  setUserID(uid: string) {
    this.uid = uid;
  }

  setTeamID(teamID: string) {
    this.teamID = teamID;
  }

  setTeamName(teamName: string) {
    this.teamName = teamName;
  }

  setYear(year: string) {
    this.year = year;
  }

  setMembers(members: string[]) {
    this.members = members;
  }

  // Getter methods
  getTeamID() {
    return this.teamID;
  }

  getTeamName() {
    return this.teamName;
  }

  getYear() {
    return this.year;
  }

  getMembers() {
    return this.members;
  }

  handleSave() {
    this.team.setTeam(
      this.uid,
      this.teamID,
      this.teamName,
      this.year,
      this.members,
    );
    this.team.storeTeam();
  }

  async handleRestore(uid: string) {
    await this.team.loadTeam(uid);
    runInAction(() => {
      this.teamID = this.team.teamID;
      this.teamName = this.team.teamName;
      this.year = this.team.year;
      this.members = this.team.members;
    });
  }
}
