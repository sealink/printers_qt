const nock = require('nock');
const { expect } = require('chai');
const { QuickTravelApi } = require('../dist/printers_qt');

const host = 'http://127.0.0.1:8000';
const bookingId = 1;

describe('reprint', () => {
  beforeEach(() => {
    nock(host)
      .post('/api/bookings/1/issued_tickets/reprint', {
        issued_ticket_ids: [1, 2, 3],
        print_server_type: 'quickets',
      })
      .reply(200, { msg: 'Success' });

    nock(host)
      .post('/api/bookings/1/issued_tickets/reprint', {
        issued_ticket_ids: [1, 2, 3],
        print_server_type: 'quickets',
        authenticity_token: 'token',
      })
      .reply(200, { msg: 'SuccessWithToken' });
  });

  it('should print to the printer', (done) => {
    const issuedTicketIds = [1, 2, 3];

    new QuickTravelApi(host).reprintTickets(bookingId, issuedTicketIds).then((response) => {
      expect(response).to.deep.equal({ msg: 'Success' });
      done();
    });
  });

  it('should optionally provide a csrf token', (done) => {
    const issuedTicketIds = [1, 2, 3];
    const opts = { authenticity_token: 'token' };

    new QuickTravelApi(host).reprintTickets(bookingId, issuedTicketIds, opts).then((response) => {
      expect(response).to.deep.equal({ msg: 'SuccessWithToken' });
      done();
    });
  });
});

describe('issue_and_print', () => {
  const reservationIds = [100, 2, 300];
  beforeEach(() => {
    nock(host)
      .post('/api/bookings/1/issued_tickets/issue_and_print', {
        reservation_ids: [100, 2, 300],
        print_server_type: 'quickets',
      })
      .reply(200, { msg: 'Success' });

    nock(host)
      .post('/api/bookings/1/issued_tickets/issue_and_print', {
        reservation_ids: [100, 2, 300],
        print_server_type: 'quickets',
        authenticity_token: 'token',
      })
      .reply(200, { msg: 'SuccessWithToken' });
  });

  it('should print to the printer', (done) => {
    new QuickTravelApi(host).issueAndPrint(bookingId, reservationIds).then((response) => {
      expect(response).to.deep.equal({ msg: 'Success' });
      done();
    });
  });

  it('should optionally provide a csrf token', (done) => {
    const opts = { authenticity_token: 'token' };

    new QuickTravelApi(host).issueAndPrint(bookingId, reservationIds, opts).then((response) => {
      expect(response).to.deep.equal({ msg: 'SuccessWithToken' });
      done();
    });
  });
});
