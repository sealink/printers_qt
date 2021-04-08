import { request } from "./api";
import { QUICKETS_SERVER_TYPE, ALBERT_SERVER_TYPE } from "./constants";

class QuickTravelApi {
  constructor(host, bearerToken, printServerType = QUICKETS_SERVER_TYPE) {
    this.host = host;
    this.bearerToken = bearerToken;
    this.printServerType = printServerType;
  }

  makeGetRequest() {
    return {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearerToken}`,
      },
    };
  }

  makeRequest(body, opts = {}) {
    return {
      method: "POST",
      credentials: "include",
      compress: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearerToken}`,
      },
      body: JSON.stringify(Object.assign({}, opts, body)),
    };
  }

  voidTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: this.convertToArray(issuedTicketIds),
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/void`;
    return request(url, this.makeRequest(body, opts));
  }

  reprintTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: this.convertToArray(issuedTicketIds),
      print_server_type: this.printServerType,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`;
    return request(url, this.makeRequest(body, opts));
  }

  printReceipt(bookingId, opts = {}) {
    const body = {
      print_receipt: true,
      print_server_type: this.printServerType,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`;
    return request(url, this.makeRequest(body, opts));
  }

  issueTickets(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets`;
    return request(url, this.makeRequest(body, opts));
  }

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
      print_server_type: this.printServerType,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return request(url, this.makeRequest(body, opts));
  }

  validateTicket(ticketIdentifier, opts = {}) {
    const body = {
      identifier: ticketIdentifier,
    };

    const url = `${this.host}/api/issued_tickets/validate`;
    return request(url, this.makeRequest(body, opts));
  }

  issuedTicket(ticketIdentifier, opts = {}) {
    const url = `${this.host}/api/issued_tickets/barcodes/${ticketIdentifier}`;
    return request(url, this.makeGetRequest());
  }

  convertToArray(input) {
    return Array.isArray(input) ? input : Array.of(input);
  }

  boardServerScans(serverScans) {
    const url = `${this.host}/api/issued_tickets/board`;
    const body = { barcodes: serverScans };
    return request(url, this.makeRequest(body));
  }
}

export { QuickTravelApi as default };
