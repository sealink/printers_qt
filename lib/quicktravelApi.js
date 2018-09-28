import { request } from './api';
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

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      print_receipt: this.printServerType === ALBERT_SERVER_TYPE,
      reservation_ids: reservationIds,
      print_server_type: this.printServerType,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return request(url, this.makeRequest(body, opts));
  }
}

export { QuickTravelApi as default };
