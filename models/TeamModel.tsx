import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { makeAutoObservable } from "mobx";

export class TeamModel {
  teamID: number = 0;
  teamName: string = "";
  year: string = "";
  members: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTeam(teamID: number, teamName: string, year: string, members: string[]) {
    this.teamID = teamID;
    this.teamName = teamName;
    this.year = year;
    this.members = members;
  }

  objectifyTeam() {
    return {
      teamID: this.teamID,
      teamName: this.teamName,
      year: this.year,
      members: this.members,
    };
  }

  // Store the team data in local storage
  storeTeam = async () => {
    try {
      await AsyncStorage.setItem("team", JSON.stringify(this.objectifyTeam()));
      router.push("/");
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  loadTeam = async () => {
    try {
      let teamJSON;
      const storedTeam = await AsyncStorage.getItem("team");
      if (storedTeam) {
        teamJSON = JSON.parse(storedTeam);
        this.teamID = teamJSON.teamID;
        this.teamName = teamJSON.teamName;
        this.year = teamJSON.year;
        this.members = teamJSON.members;
      } else {
        console.log("No Team created yet");
        router.push("/team");
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
  };
}
