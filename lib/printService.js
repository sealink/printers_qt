import ConfigApi from './configApi';
import QuickTravelApi from './quicktravelApi';
import findPrinters from './printerMatcher';
import printToPrinter from './quicketsApi';

class PrintService {
  constructor({ quicktravel, config }) {
    this.quicktravel_url = quicktravel;
    this.config_url = config;
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

  async printReservations(printGroupId, bookingId, reservationIds) {
    const tickets = await new QuickTravelApi(this.quicktravel_url)
      .issueAndPrint(bookingId, reservationIds);
    return this.printTickets(printGroupId, tickets);
  }

  async reprintTickets(printGroupId, bookingId, issuedTicketIds) {
    const tickets = await new QuickTravelApi(this.quicktravel_url)
      .reprintTickets(bookingId, issuedTicketIds);
    return this.printTickets(printGroupId, tickets);
  }

  async voidTickets(bookingId, issuedTicketIds, opts = {}) {
    return new QuickTravelApi(this.quicktravel_url).voidTickets(bookingId, issuedTicketIds, opts);
  }
}

export { PrintService as default };
