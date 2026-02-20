import superagent from "superagent";

export class ApiController {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  postBin() {
    const url = this.apiUrl;
    return superagent.post(url);
  }

  getSingleBin(id: string, latest: boolean = false) {
    const url = this.apiUrl;
    let endpoint: string;
    if (latest) {
      endpoint = url + "/" + id + "/latest";
    } else {
      endpoint = url + "/" + id;
    }
    return superagent.get(endpoint);
  }

  putBin(id: string) {
    const url = this.apiUrl;
    return superagent.put(url + "/" + id);
  }

  deleteBin(id: string) {
    const url = this.apiUrl;
    return superagent.delete(url + "/" + id);
  }

  postBinWithHeaders(apiMasterKey: string, binName?: string) {
    const req = this.postBin()
      .set("Content-Type", "application/json")
      .set("X-Master-Key", apiMasterKey);

    if (binName) {
      req.set("X-Bin-Name", binName);
    }

    return req;
  }

  putBinWithHeaders(id: string, apiMasterKey: string) {
    return this.putBin(id)
      .set("Content-Type", "application/json")
      .set("X-Master-Key", apiMasterKey);
  }

  deleteBinWithMasterKey(id: string, apiMasterKey: string) {
    return this.deleteBin(id).set("X-Master-Key", apiMasterKey);
  }

  getBinWithMasterKey(id: string, apiMasterKey: string, latest: boolean = false) {
    return this.getSingleBin(id).set("X-Master-Key", apiMasterKey);
  }
}
