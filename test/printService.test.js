const nock = require('nock');
const {
  QUICKETS_SERVER_TYPE,
  ALBERT_SERVER_TYPE,
} = require('../lib/constants');
const { default: PrintService } = require('../lib/printService');
const uuid = require('uuid');
jest.mock('uuid');

const config = {
  quicktravel: {
    host: 'http://127.0.0.1:8000',
    bearerToken: 'bearerToken',
  },
  config: {
    host: 'http://127.0.0.1:8001',
    bearerToken: 'bearerToken',
  },
};

const reqHeaders = {
  Authorization: `Bearer ${config.quicktravel.bearerToken}`,
};

const printersResponse = [
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

const issuedTickets = [
  { tickets: [], page_format: { width: 105, height: 57 } },
];

describe('configuration', () => {
  beforeEach(() => {
    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/1/issued_tickets/reprint')
      .reply(200, issuedTickets);

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/1/issued_tickets/reprint', {
        print_receipt: true,
        print_server_type: 'albert',
      })
      .reply(200, issuedTickets);

    nock(config.config.host, { reqHeaders: reqHeaders })
      .get('/print_groups/1/printers')
      .reply(200, printersResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should have configurable print_server_type', (done) => {
    const printService = new PrintService(config);
    expect(printService.printServerType).toEqual(QUICKETS_SERVER_TYPE);

    const printService2 = new PrintService({
      quicktravel: config.quicktravel,
      config: {
        host: config.config.host,
        bearerToken: config.config.bearerToken,
        printServerType: ALBERT_SERVER_TYPE,
      },
    });
    expect(printService2.printServerType).toEqual(ALBERT_SERVER_TYPE);

    done();
  });

  it('should call "/print-tickets" for QUICKETS_SERVER_TYPE', (done) => {
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(config);

    nock('https://cups-pdf.quicktravel.com.au', {
      reqHeaders: reqHeaders,
    })
      .post('/print-tickets', {
        printer_name: 'PDF',
        printer: 2,
        api_key: 'some_random_key',
        tickets: [],
        page_format: {
          width: 105,
          height: 57,
        },
      })
      .reply(200, { msg: 'Success' });

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
      })
      .reply(200, { msg: 'Success' });

    printService.printReceipt(printGroupId, bookingId).then((response) => {
      expect(response).toEqual(true);
      done();
    });
  });

  it('should not call "/print-tickets" for ALBERT_SERVER_TYPE', (done) => {
    const printGroupId = 1;
    const bookingId = 1;

    const receiptPrintService = new PrintService({
      quicktravel: config.quicktravel,
      config: {
        host: config.config.host,
        bearerToken: config.config.bearerToken,
        printServerType: ALBERT_SERVER_TYPE,
      },
    });

    nock('https://cups-pdf.quicktravel.com.au', {
      reqHeaders: reqHeaders,
    })
      .post('/print-receipts', {
        printer_name: 'PDF',
        tickets: [],
      })
      .reply(200, { msg: 'Success' });

    nock('https://cups-pdf.quicktravel.com.au')
      .post('/print-receipts', {
        printer_name: '_DO_NOT_PRINT',
        tickets: [],
      })
      .reply(200, { msg: 'Success' });

    receiptPrintService
      .printReceipt(printGroupId, bookingId)
      .then((response) => {
        expect(response).toEqual(true);
        done();
      });
  });
});

describe('voidTickets', () => {
  beforeEach(() => {
    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
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
      expect(response).toEqual({ msg: 'Success' });
      done();
    });
  });
});

describe('issueTickets', () => {
  beforeEach(() => {
    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/1/issued_tickets', {
        reservation_ids: [1, 2, 3],
      })
      .reply(200, { msg: 'Success' });

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/2/issued_tickets', {
        reservation_ids: [1, 2, 3],
      })
      .reply(500, { msg: 'Internal Server Error' });
  });

  it('should issue the tickets', (done) => {
    const reservationIds = [1, 2, 3];
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.issueTickets(bookingId, reservationIds).then((response) => {
      expect(response).toEqual({ msg: 'Success' });
      done();
    });
  });

  it('should handle failures when issue the tickets', (done) => {
    const reservationIds = [1, 2, 3];
    const bookingId = 2;

    const printService = new PrintService(config);
    printService.issueTickets(bookingId, reservationIds).catch((err) => {
      expect(err.response.status).toEqual(500);
      done();
    });
  });
});

describe('issuedTickets', () => {
  beforeEach(() => {
    nock(config.quicktravel.host)
      .get('/api/issued_tickets/barcodes/12345')
      .reply(200, { ticket: 'TICKET GOES HERE' });

    nock(config.quicktravel.host)
      .get('/api/issued_tickets/barcodes/54321')
      .reply(404, { error: 'ERROR GOES HERE' });
  });

  it('should retreive the ticket', (done) => {
    const identifier = 12345;
    const printService = new PrintService(config);
    printService.issuedTicket(identifier).then((response) => {
      expect(response).toEqual({ ticket: 'TICKET GOES HERE' });
      done();
    });
  });

  it('should handle failures when tickets are not found', (done) => {
    const identifier = 54321;
    const printService = new PrintService(config);
    printService
      .issuedTicket(identifier)
      .then((response) => {
        fail('Should never be called');
        done();
      })
      .catch((err) => {
        expect(err.response.status).toEqual(404);
        done();
      });
  });
});

describe('validate', () => {
  beforeEach(() => {
    nock(config.quicktravel.host)
      .post('/api/issued_tickets/validate', {
        identifier: 123,
      })
      .reply(200, { ticket: 'TICKET GOES HERE' });

    nock(config.quicktravel.host)
      .post('/api/issued_tickets/validate', {
        identifier: 321,
      })
      .reply(422, { error: 'ERROR GOES HERE' });
  });

  it('should validate the ticket', (done) => {
    const identifier = 123;
    const printService = new PrintService(config);
    printService.validateTicket(identifier).then((response) => {
      expect(response).toEqual({ ticket: 'TICKET GOES HERE' });
      done();
    });
  });

  it('should return an error if the ticket is invalid', (done) => {
    const identifier = 321;
    const printService = new PrintService(config);
    printService
      .validateTicket(identifier)
      .then((response) => {
        fail('Should never be called');
        done();
      })
      .catch((err) => {
        expect(err.response.status).toEqual(422);
        done();
      });
  });
});

describe('reprint', () => {
  beforeEach(() => {
    const response = [
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
      })
      .reply(200, { msg: 'Success' });

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
      })
      .reply(200, { msg: 'Success' });

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
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

    printService
      .reprintTickets(printGroupId, bookingId, issuedTicketIds)
      .then((response) => {
        expect(response).toEqual(true);
        done();
      });
  });
});

describe('print-receipt', () => {
  beforeEach(() => {
    const response = [
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
      })
      .reply(200, { msg: 'Success' });

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
      })
      .reply(200, { msg: 'Success' });

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/1/issued_tickets/reprint', {
        print_receipt: true,
        print_server_type: 'quickets',
      })
      .reply(200, issuedTickets);
  });

  it('should print to the printer', (done) => {
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(config);
    printService.printReceipt(printGroupId, bookingId).then((response) => {
      expect(response).toEqual(true);
      done();
    });
  });
});

describe('printReservations', () => {
  beforeEach(() => {
    const response = [
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

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/1/issued_tickets/issue_and_print', {
        reservation_ids: [1, 2, 3],
        print_server_type: 'quickets',
      })
      .reply(200, issuedTickets);

    nock(config.quicktravel.host, { reqHeaders: reqHeaders })
      .post('/api/bookings/2/issued_tickets/issue_and_print', {
        reservation_ids: [1, 2, 3],
        print_server_type: 'quickets',
      })
      .reply(200, []);

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
      })
      .reply(200, { msg: 'Success' });

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
      })
      .reply(200, { msg: 'Success' });
  });

  it('should print to the printer', (done) => {
    const reservationIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 1;

    const printService = new PrintService(config);
    printService
      .printReservations(printGroupId, bookingId, reservationIds)
      .then((response) => {
        expect(response).toEqual(true);
        done();
      });
  });

  it('should do nothing if no tickets are defined', (done) => {
    const reservationIds = [1, 2, 3];
    const printGroupId = 1;
    const bookingId = 2;

    const printService = new PrintService(config);
    printService
      .printReservations(printGroupId, bookingId, reservationIds)
      .then((response) => {
        expect(response).toEqual(false);
        done();
      });
  });
});

describe('boardTickets', () => {
  beforeEach(() => {
    uuid.v4.mockImplementation(() => 'uuid');
    const expectedBody = {
      barcodes: [
        { barcode: { id: 1 }, id: 'uuid' },
        { barcode: { id: 2 }, id: 'uuid' },
      ],
    };

    const response = [{ id: '1', status: 200, diff: [] }];
    nock(config.quicktravel.host)
      .post('/api/issued_tickets/board', expectedBody)
      .reply(200, response);
  });

  it('should call wrapTickets and boardServerScans from quicktravelApi', (done) => {
    const printService = new PrintService(config);
    const barcodes = [{ id: 1 }, { id: 2 }];
    printService.boardTickets(barcodes).then((response) => {
      expect(response).toEqual([{ id: '1', status: 200, diff: [] }]);
      done();
    });
  });
});
