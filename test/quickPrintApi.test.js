const nock = require('nock');
const { QUICKETS_SERVER_TYPE } = require('../lib/constants');
const { default: print } = require('../lib/quickPrintApi');

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
    nock('http://cups-pdf.quicktravel.com.au', {
      reqHeaders: { 'x-api-key': '123456789' },
    })
      .post('/print-tickets')
      .reply(500, { msg: 'Failed' });
  });

  it('should print to the printer', (done) => {
    print(printer, pageFormat, QUICKETS_SERVER_TYPE).catch((err) => {
      expect(err.response.status).toEqual(500);
      done();
    });
  });
});

describe('printToPrinter', () => {
  beforeEach(() => {
    nock('http://cups-pdf.quicktravel.com.au', {
      reqHeaders: { 'x-api-key': '123456789' },
    })
      .post('/print-tickets')
      .reply(200, { msg: 'Success' });
  });

  it('should print to the printer', (done) => {
    print(printer, pageFormat, QUICKETS_SERVER_TYPE).then((response) => {
      expect(response).toEqual({ msg: 'Success' });
      done();
    });
  });
});
