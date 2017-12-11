const nock = require('nock');
const { expect } = require('chai');
const { PrintService } = require('../dist/printers_qt');

const hosts = {
  quicktravel: 'http://127.0.0.1:8000',
  config: 'http://127.0.0.1:8001',
};

describe('printReservations', () => {
  beforeEach(() => {
    const response =
    [
      {
        id: 1,
        description: '_DO_NOT_PRINT',
        server: {
          host: 'https://cups-pdf.quicktravel.com.au',
          api_key: 'some_random_key',
        },
        dimensions: [],
      },
      {
        id: 2,
        description: 'PDF',
        server: {
          host: 'https://cups-pdf.quicktravel.com.au',
          api_key: 'some_random_key',
        },
        dimensions: [],
      },
    ];
    nock(hosts.config)
      .get('/print_groups/1/printers')
      .reply(200, response);

    const issuedTickets = [
      {
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      },
    ];

    nock(hosts.quicktravel)
      .post('/api/bookings/1/issued_tickets/issue_and_print', {
        reservation_ids: [1, 2, 3],
        print_server_type: 'quickets',
      }).reply(200, issuedTickets);

    nock(hosts.quicktravel)
      .post('/api/bookings/2/issued_tickets/issue_and_print', {
        reservation_ids: [1, 2, 3],
        print_server_type: 'quickets',
      }).reply(200, []);

    nock('https://cups-pdf.quicktravel.com.au')
      .post('/print-tickets', {
        printer_name: '_DO_NOT_PRINT',
        printer: 1,
        api_key: 'some_random_key',
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      }).reply(200, { msg: 'Success' });

    nock('https://cups-pdf.quicktravel.com.au')
      .post('/print-tickets', {
        printer_name: 'PDF',
        printer: 2,
        api_key: 'some_random_key',
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      }).reply(200, { msg: 'Success' });
  });

  it('should print to the printer', (done) => {
    const reservationIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(hosts);
    printService.printReservations(printGroupId, bookingId, reservationIds).then((response) => {
      expect(response).to.eq(true);
      done();
    });
  });

  it('should do nothing if no tickets are defined', (done) => {
    const reservationIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 2;

    const printService = new PrintService(hosts);
    printService.printReservations(printGroupId, bookingId, reservationIds).then((response) => {
      expect(response).to.eq(false);
      done();
    });
  });
});
