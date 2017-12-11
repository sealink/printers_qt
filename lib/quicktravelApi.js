import { post } from './api';

class QuickTravelApi {
  constructor(host) {
    this.host = host;
  }

  reprintTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
      print_server_type: 'quickets',
    };
    if (opts.authenticity_token) {
      body.authenticity_token = opts.authenticity_token;
    }
    return post(`${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`, JSON.stringify(body));
  }

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
      print_server_type: 'quickets',
    };
    if (opts.authenticity_token) {
      body.authenticity_token = opts.authenticity_token;
    }
    return post(`${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`, JSON.stringify(body));
  }
}

export { QuickTravelApi as default };
