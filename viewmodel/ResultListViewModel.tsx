import { ResultListModel } from "@/models/ResultListModel";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { makeAutoObservable, runInAction } from "mobx";

export class ResultListViewModel {
  resultList = new ResultListModel();
  list: string[] = [];
  populatedList: ResultViewModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Add a result to the resultList
  addResult(resultID: string) {
    this.list.push(resultID);
    this.resultList.storeResultList();
  }

  // Populate the full results data into  populatedList
  async handlePopulate() {
    await this.resultList.getResults();
    runInAction(() => {
      this.populatedList = this.resultList.populatedList;
    });
  }

  // Save the resultList
  handleSave() {
    this.resultList.storeResultList();
  }

  // Restore the resultList
  async handleRestore(teamID: string) {
    await this.resultList.loadResultList(teamID);
    this.list = this.resultList.resultList;
  }
}
