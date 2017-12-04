const nock = require('nock');
const { expect } = require('chai');
const { printToPrinter } = require('../dist/printers_qt');

const printer = {
  id: 1,
  description: 'TEST',
  server: {
    host: 'http://cups-pdf.quicktravel.com.au',
    api_key: '123456789',
  },
};

const pageFormat = {
  tickets: [],
  pageFormat: {
    length: 100,
    width: 200,
    margin: 2,
  },
  base_url: '/',
};

describe('errors', () => {
  beforeEach(() => {
    nock('http://cups-pdf.quicktravel.com.au')
      .post('/print-tickets')
      .reply(500, { msg: 'Success' });
  });

  it('should print to the printer', (done) => {
    printToPrinter(printer, pageFormat).catch((err) => {
      expect(err.response.status).to.eq(500);
      done();
    });
  });
});

describe('printToPrinter', () => {
  beforeEach(() => {
    nock('http://cups-pdf.quicktravel.com.au')
      .post('/print-tickets')
      .reply(200, { msg: 'Success' });
  });

  it('should print to the printer', (done) => {
    printToPrinter(printer, pageFormat).then((response) => {
      expect(response).to.deep.equal({ msg: 'Success' });
      done();
    });
  });
});
