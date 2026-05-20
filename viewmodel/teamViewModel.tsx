import { TeamModel } from "@/models/TeamModel";
import { makeAutoObservable, runInAction } from "mobx";

export class TeamViewModel {
  team = new TeamModel();
  teamID: number = 0;
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
  setID(teamID: number) {
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
    this.team.setTeam(this.teamID, this.teamName, this.year, this.members);
    this.team.storeTeam();
  }

  async handleRestore() {
    await this.team.loadTeam();
    runInAction(() => {
      this.teamID = this.team.teamID;
      this.teamName = this.team.teamName;
      this.year = this.team.year;
      this.members = this.team.members;
    });
  }
}
