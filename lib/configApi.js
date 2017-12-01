import { get } from './api';

class ConfigApi {
  constructor(host) {
    this.host = host;
  }

  listPrintGroups(catalougeId) {
    return get(`${this.host}/catalogues/${catalougeId}/print_groups`);
  }

  listPrintGroupsPrinters(printGroupId) {
    return get(`${this.host}/print_groups/${printGroupId}/printers`);
  }
}

export { ConfigApi };
