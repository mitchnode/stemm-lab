import {
  createTeam,
  getAllTeams,
  getTeam,
  Team,
} from "@/services/firestoreService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { makeAutoObservable } from "mobx";

export interface TeamName {
  teamID: string;
  teamName: string;
}

export class TeamModel {
  uid: string = "";
  teamID: string = "";
  teamName: string = "";
  year: string = "";
  members: string[] = [];
  teamNames: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  setTeam(
    uid: string,
    teamID: string,
    teamName: string,
    year: string,
    members: string[],
  ) {
    this.uid = uid;
    this.teamID = teamID;
    this.teamName = teamName;
    this.year = year;
    this.members = members;
  }

  objectifyTeam() {
    return {
      uid: this.uid,
      teamID: this.teamID,
      teamName: this.teamName,
      year: this.year,
      members: this.members,
    } as Team;
  }

  // Store the team data in local storage and in Firestore
  storeTeam = async () => {
    try {
      await AsyncStorage.setItem(
        `team-${this.uid}`,
        JSON.stringify(this.objectifyTeam()),
      );
      await createTeam(this.objectifyTeam());
      router.push("/");
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  // Load the team data from local storage or Firestore if there is no local data
  loadTeam = async (uid: string) => {
    try {
      let teamJSON;
      let storedTeam = await AsyncStorage.getItem(`team-${this.uid}`);
      if (!storedTeam) {
        storedTeam = JSON.stringify(await getTeam(uid));
      }
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

  loadAllTeamNames = async () => {
    try {
      const allTeams = await getAllTeams();
      if (allTeams) {
        allTeams.map((team) => {
          this.teamNames[team.teamID] = team.teamName;
        });
      }
    } catch (error) {
      console.error("Error loading team names", error);
    }
  };
}
