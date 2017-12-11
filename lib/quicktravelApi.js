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

    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint.json`;
    return post(url, JSON.stringify(body), { compress: false });
  }

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
      print_server_type: 'quickets',
    };
    if (opts.authenticity_token) {
      body.authenticity_token = opts.authenticity_token;
    }
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print.json`;
    return post(url, JSON.stringify(body), { compress: false });
  }
}

export { QuickTravelApi as default };
