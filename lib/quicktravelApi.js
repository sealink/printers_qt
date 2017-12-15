import { post } from './api';

class QuickTravelApi {
  constructor(host) {
    this.host = host;
  }

  voidTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
    };
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/void`;
    const data = JSON.stringify(Object.assign({}, body, opts));
    return post(url, data, { compress: false });
  }

  reprintTickets(bookingId, issuedTicketIds, opts = {}) {
    const body = {
      issued_ticket_ids: issuedTicketIds,
      print_server_type: 'quickets',
    };
    const data = JSON.stringify(Object.assign({}, body, opts));
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/reprint`;
    return post(url, data , { compress: false });
  }

  issueAndPrint(bookingId, reservationIds, opts = {}) {
    const body = {
      reservation_ids: reservationIds,
      print_server_type: 'quickets',
    };
    const data = JSON.stringify(Object.assign({}, body, opts));
    const url = `${this.host}/api/bookings/${bookingId}/issued_tickets/issue_and_print`;
    return post(url, data, { compress: false });
  }
}

export { QuickTravelApi as default };
