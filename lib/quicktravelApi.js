import { post } from './api';

class QuickTravelApi {
  constructor(host) {
    this.host = host;
  }

  voidTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
    };
    if (opts.authenticity_token) {
      body.authenticity_token = opts.authenticity_token;
    }
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/void`;
    return post(url, JSON.stringify(body), { compress: false });
  }

  reprintTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
      print_server_type: 'quickets',
    };
    if (opts.authenticity_token) {
      body.authenticity_token = opts.authenticity_token;
    }
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`;
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
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return post(url, JSON.stringify(body), { compress: false });
  }
}

export { QuickTravelApi as default };
