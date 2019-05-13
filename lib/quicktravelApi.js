import { request, get } from './api';
import { QUICKETS_SERVER_TYPE, ALBERT_SERVER_TYPE } from './constants';

class QuickTravelApi {
  constructor(host, csrfToken, printServerType = QUICKETS_SERVER_TYPE) {
    this.host = host;
    this.csrfToken = csrfToken;
    this.printServerType = printServerType;
  }

  makeRequest(body, opts = {}) {
    return {
      method: 'POST',
      credentials: 'include',
      compress: false,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken,
      },
      body: JSON.stringify(Object.assign({}, body, opts)),
    };
  }

  voidTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/void`;
    return request(url, this.makeRequest(body, opts));
  }

  reprintTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      print_receipt: this.printServerType === ALBERT_SERVER_TYPE,
      issued_ticket_ids: issuedTicketIds,
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
      print_receipt: this.printServerType === ALBERT_SERVER_TYPE,
      reservation_ids: reservationIds,
      print_server_type: this.printServerType,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return request(url, this.makeRequest(body, opts));
  }

  validateTicket(ticketIdentifier, opts = {}) {
    const body = {
      identifier: ticketIdentifier
    };

    const url = `${this.host}/api/issued_tickets/validate`;
    return request(url, this.makeRequest(body, opts));
  }

  issuedTicket(ticketIdentifier, opts = {}) {
    const url = `${this.host}/api/issued_tickets/barcodes/${ticketIdentifier}`;
    return request(url, {
      method: 'GET',
      credentials: 'include',
      compress: false,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken,
      }
    });
  }
}

export { QuickTravelApi as default };
