import { request } from './api';

class QuickTravelApi {
  constructor(host) {
    this.host = host;

  makeRequest(body, opts = {}) {
    return {
      method: 'POST',
      credentials: 'include',
      compress: false,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken
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
      issued_ticket_ids: issuedTicketIds,
      print_server_type: 'quickets',
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`;
    return request(url, this.makeRequest(body, opts));
  }

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
      print_server_type: 'quickets',
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return request(url, this.makeRequest(body, opts));
  }
}

export { QuickTravelApi as default };
