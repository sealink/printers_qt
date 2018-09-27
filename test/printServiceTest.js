const nock = require('nock');
const { expect } = require('chai');
const { PrintService } = require('../dist/printers_qt');

const config = {
  quicktravel: {
    host: 'http://127.0.0.1:8000',
    csrfToken: '123'
  },
  config: {
    host: 'http://127.0.0.1:8001'
  },
};


describe('configuration', () => {
  it('should have configurable print_server_type', (done) => {
    const printService = new PrintService(config);
    expect(printService.qt_print_server_type).to.not.exist;

    const printService2 = new PrintService({ quicktravel: config.quicktravel, config: { host: config.config.host, qt_print_server_type: 'crickets' } });
    expect(printService2.qt_print_server_type).to.equal('crickets');

    done();
  });
});

describe('voidTickets', () => {
  beforeEach(() => {
    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
      .post('/api/bookings/1/issued_tickets/void', {
        issued_ticket_ids: [1, 2, 3],
      })
      .reply(200, { msg: 'Success' });
  });

  it('should void the tickets', (done) => {
    const issuedTicketIds = [1, 2, 3];
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.voidTickets(bookingId, issuedTicketIds).then((response) => {
      expect(response).to.deep.equal({ msg: 'Success' });
      done();
    }).catch((err) => console.log(err));
  });
});

describe('voidTickets', () => {
  beforeEach(() => {
    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
      .post('/api/bookings/1/issued_tickets/void', {
        issued_ticket_ids: [1, 2, 3],
      })
      .reply(200, { msg: 'Success' });
  });

  it('should void the tickets', (done) => {
    const issuedTicketIds = [1, 2, 3];
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.voidTickets(bookingId, issuedTicketIds).then((response) => {
      expect(response).to.deep.equal({ msg: 'Success' });
      done();
    }).catch((err) => console.log(err));
  });
});

describe('reprint', () => {
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
    nock(config.config.host)
      .get('/print_groups/1/printers')
      .reply(200, response);

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

    const issuedTickets = [
      {
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      },
    ];

    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
      .post('/api/bookings/1/issued_tickets/reprint', {
        issued_ticket_ids: [1, 2, 3],
        print_server_type: 'quickets',
      })
      .reply(200, issuedTickets);
  });

  it('should print to the printer', (done) => {
    const issuedTicketIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.reprintTickets(printGroupId, bookingId, issuedTicketIds).then((response) => {
      expect(response).to.eq(true);
      done();
    }).catch( (err) => console.log(err) );
  });
});

describe('print-receipt', () => {
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
    nock(config.config.host)
      .get('/print_groups/1/printers')
      .reply(200, response);

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

    const issuedTickets = [
      {
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      },
    ];

    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
      .post('/api/bookings/1/issued_tickets/reprint', {
        print_receipt: true,
        print_server_type: 'quickets',
      })
      .reply(200, issuedTickets);
  });

  it('should print to the printer', (done) => {
    const issuedTicketIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.printReceipt(printGroupId, bookingId).then((response) => {
      expect(response).to.eq(true);
      done();
    }).catch( (err) => console.log(err) );
  });
});

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
    nock(config.config.host)
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

    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
      .post('/api/bookings/1/issued_tickets/issue_and_print', {
        reservation_ids: [1, 2, 3],
        print_server_type: 'quickets',
      }).reply(200, issuedTickets);

    nock(config.quicktravel.host, { reqHeaders: { 'x-csrf-Token': '123' } })
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

    const printService = new PrintService(config);
    printService.printReservations(printGroupId, bookingId, reservationIds).then((response) => {
      expect(response).to.eq(true);
      done();
    });
  });

  it('should do nothing if no tickets are defined', (done) => {
    const reservationIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 2;

    const printService = new PrintService(config);
    printService.printReservations(printGroupId, bookingId, reservationIds).then((response) => {
      expect(response).to.eq(false);
      done();
    });
  });
});
