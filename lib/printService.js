import ConfigApi from './configApi';
import QuickTravelApi from './quicktravelApi';
import findPrinters from './printerMatcher';
import printToPrinter from './quickPrintApi';

class PrintService {
  constructor({ quicktravel, config }) {
    this.quicktravel_url = quicktravel.host;
    this.config_url = config.host;
    this.csrfToken = quicktravel.csrfToken;
    this.print_server_type = config.print_server_type;
  }

  createQuickTravelApi() {
    return new QuickTravelApi(this.quicktravel_url, this.csrfToken, this.print_server_type);
  }

  async printTickets(printGroupId, tickets) {
    if (tickets.length === 0) {
      return false;
    }

    const allPrinters = await new ConfigApi(this.config_url)
      .listPrintGroupsPrinters(printGroupId);

    const printJobs = tickets.reduce((accumulator, ticket) => {
      const jobs = findPrinters(allPrinters, ticket.page_format)
        .map(printer => printToPrinter(printer, ticket));

      return accumulator.concat(jobs);
    }, []);

    await Promise.all(printJobs);
    return true;
  }

  async printReservations(printGroupId, bookingId, reservationIds, opts = {}) {
    const tickets = await this.createQuickTravelApi().issueAndPrint(bookingId, reservationIds, opts);
    return this.printTickets(printGroupId, tickets);
  }

  async reprintTickets(printGroupId, bookingId, issuedTicketIds, opts = {}) {
    const tickets = await this.createQuickTravelApi().reprintTickets(bookingId, issuedTicketIds, opts);
    return this.printTickets(printGroupId, tickets);
  }

  async voidTickets(bookingId, issuedTicketIds, opts = {}) {
    return this.createQuickTravelApi().voidTickets(bookingId, issuedTicketIds, opts);
  }

  async printReceipt(printGroupId, bookingId, opts = {}) {
    const tickets = await this.createQuickTravelApi().printReceipt(bookingId, opts);
    return this.printTickets(printGroupId, tickets)
  }
}

export { PrintService as default };
