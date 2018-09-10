import ConfigApi from './configApi';
import QuickTravelApi from './quicktravelApi';
import findPrinters from './printerMatcher';
import printToPrinter from './quicketsApi';

class PrintService {
  constructor({ quicktravel, config }) {
    this.quicktravel_url = quicktravel.host;
    this.config_url = config.host;
    this.csrfToken = quicktravel.csrfToken;
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
    const tickets = await new QuickTravelApi(this.quicktravel_url, this.csrfToken)
      .issueAndPrint(bookingId, reservationIds, opts);
    return this.printTickets(printGroupId, tickets);
  }

  async reprintTickets(printGroupId, bookingId, issuedTicketIds, opts = {}) {
    const tickets = await new QuickTravelApi(this.quicktravel_url, this.csrfToken)
      .reprintTickets(bookingId, issuedTicketIds, opts);
    return this.printTickets(printGroupId, tickets);
  }

  async voidTickets(bookingId, issuedTicketIds, opts = {}) {
    return new QuickTravelApi(this.quicktravel_url, this.csrfToken)
                .voidTickets(bookingId, issuedTicketIds, opts);
  }

  }
}

export { PrintService as default };
