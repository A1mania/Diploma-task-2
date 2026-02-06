import superagent from "superagent";

export class ApiController {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  postBin() {
    const url = this.apiUrl + "/b";
    return superagent.post(url);
  }

  getSingleBin(id: string) {
    const url = this.apiUrl + "/b";
    return superagent.get(url + "/" + id);
  }

  putBin(id: string) {
    const url = this.apiUrl + "/b";
    return superagent.put(url + "/" + id);
  }

  getSingleBinLatest(id: string) {
    const url = this.apiUrl + "/b";
    return superagent.get(url + "/" + id + "/latest");
  }

  deleteBin(id: string) {
    const url = this.apiUrl + "/b";
    return superagent.delete(url + "/" + id);
  }
}
