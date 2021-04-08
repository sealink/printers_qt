import ConfigApi from "./configApi";
import QuickTravelApi from "./quicktravelApi";
import findPrinters from "./printerMatcher";
import print from "./quickPrintApi";
import { QUICKETS_SERVER_TYPE } from "./constants";
import { v4 as uuidv4 } from "uuid";

const wrapTickets = (tickets) => {
  return tickets.map((ticket) => {
    return { barcode: ticket, id: uuidv4() };
  });
};

class PrintService {
  constructor({ quicktravel, config }) {
    // QuickTravel Service
    this.quicktravel_url = quicktravel.host;
    this.bearerToken = quicktravel.bearerToken;

    // Config Service
    this.config_url = config.host;
    this.config_bearerToken = config.config_bearerToken;

    this.printServerType = config.printServerType || QUICKETS_SERVER_TYPE;
  }

  createQuickTravelApi() {
    return new QuickTravelApi(
      this.quicktravel_url,
      this.bearerToken,
      this.printServerType
    );
  }
  createConfigApi() {
    return new ConfigApi(this.config_url, this.config_bearerToken);
  }

  async printTickets(printGroupId, tickets) {
    // Due to legacy reasons albert tickets will not be returned as an array
    if (!Array.isArray(tickets)) {
      tickets = [tickets];
    }

    if (tickets.length === 0) {
      return false;
    }

    const allPrinters = await this.createConfigApi().listPrintGroupsPrinters(
      printGroupId
    );

    const printJobs = tickets.reduce((accumulator, ticket) => {
      const jobs = findPrinters(
        allPrinters,
        ticket.page_format
      ).map((printer) => print(printer, ticket, this.printServerType));

      return accumulator.concat(jobs);
    }, []);

    await Promise.all(printJobs);
    return true;
  }

  async printReservations(printGroupId, bookingId, reservationIds, opts = {}) {
    const tickets = await this.createQuickTravelApi().issueAndPrint(
      bookingId,
      reservationIds,
      opts
    );
    return this.printTickets(printGroupId, tickets);
  }

  async issueTickets(bookingId, reservationIds, opts = {}) {
    return this.createQuickTravelApi().issueTickets(
      bookingId,
      reservationIds,
      opts
    );
  }

  async issuedTicket(ticketIdentifier, opts = {}) {
    return this.createQuickTravelApi().issuedTicket(ticketIdentifier, opts);
  }

  async reprintTickets(printGroupId, bookingId, issuedTicketIds, opts = {}) {
    const tickets = await this.createQuickTravelApi().reprintTickets(
      bookingId,
      issuedTicketIds,
      opts
    );
    return this.printTickets(printGroupId, tickets);
  }

  async voidTickets(bookingId, issuedTicketIds, opts = {}) {
    return this.createQuickTravelApi().voidTickets(
      bookingId,
      issuedTicketIds,
      opts
    );
  }

  async validateTicket(ticketIdentifier, opts = {}) {
    return this.createQuickTravelApi().validateTicket(ticketIdentifier, opts);
  }

  async printReceipt(printGroupId, bookingId, opts = {}) {
    const tickets = await this.createQuickTravelApi().printReceipt(
      bookingId,
      opts
    );
    return this.printTickets(printGroupId, tickets);
  }

  async boardTickets(tickets) {
    return this.createQuickTravelApi().boardServerScans(wrapTickets(tickets));
  }
}

export { PrintService as default };
