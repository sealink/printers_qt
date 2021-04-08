import { request } from "./api";

class ConfigApi {
  constructor(host, bearerToken) {
    this.host = host;
    this.bearerToken = bearerToken;
  }

  makeGetRequest() {
    return {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
    };
  }

  listPrintGroups(catalougeId) {
    const url = `${this.host}/catalogues/${catalougeId}/print_groups`;
    return request(url, this.makeGetRequest());
  }

  listPrintGroupsPrinters(printGroupId) {
    const url = `${this.host}/print_groups/${printGroupId}/printers`;
    return request(url, this.makeGetRequest());
  }
}

export { ConfigApi as default };
