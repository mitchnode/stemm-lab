import { ResultListModel } from "@/models/ResultListModel";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";
import { makeAutoObservable } from "mobx";

export class ResultListViewModel {
  resultList = new ResultListModel();
  list: string[] = [];
  populatedList: ResultViewModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addResult(resultID: string) {
    this.list.push(resultID);
    this.resultList.storeResultList();
  }

  async handlePopulate() {
    await this.resultList.getResults();
    this.populatedList = this.resultList.populatedList;
  }

  handleSave() {
    this.resultList.storeResultList();
  }

  async handleRestore() {
    await this.resultList.loadResultList();
    this.list = this.resultList.resultList;
  }
}
