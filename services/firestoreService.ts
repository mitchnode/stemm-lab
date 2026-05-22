import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Team {
  uid: string;
  teamID: string;
  teamName: string;
  year: string;
  members: string[];
}

export interface Result {
  resultID: string;
  teamID: string;
  activityID: string;
  resultDateTime: string;
  resultType: string;
  resultValue: string;
  resultData: string;
}

let n = 0;

export const debug = async (tag: String, str: String) => {
  console.log(tag + "No. " + n.toString(), str);
  n++;
  try {
    const docRef = await addDoc(collection(db, "Debug"), {
      Tag: tag + "No. " + n.toString(),
      Str: str,
    });
  } catch (e) {
    console.error();
  }
};

export const createTeam = async (team: Team) => {
  const existingTeam = await getTeam(team.uid);
  if (existingTeam === null) {
    await setDoc(doc(db, "teams", team.uid), {
      ...team,
      createdAt: serverTimestamp(),
    });
  } else {
    updateTeam(team.uid, team);
  }
};

export const getTeam = async (uid: string) => {
  console.log("Fetching Team from Firestore");
  const team = await getDoc(doc(db, "teams", uid));
  return team.exists() ? (team.data() as Team) : null;
};

export const updateTeam = async (teamID: string, data: Partial<Team>) => {
  await updateDoc(doc(db, "teams", teamID), data);
};

export const createResult = async (result: Result) => {
  await setDoc(doc(db, "results", result.resultID), {
    ...result,
    createdAt: serverTimestamp(),
  });
};

export const getResult = async (resultID: string) => {
  console.log("Fetching Result from Firestore");
  const result = await getDoc(doc(db, "results", resultID));
  return result.exists() ? (result.data() as Result) : null;
};

export const getResultList = async (teamID: string) => {
  console.log("Fetching ResultList from Firestore");
  const resultList = await getDocs(
    query(collection(db, "results"), where("teamID", "==", teamID)),
  );
  return !resultList.empty ? resultList.docs.map((doc) => doc.id) : [];
};
