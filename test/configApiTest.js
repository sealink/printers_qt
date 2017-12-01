var ConfigApi = require('../dist/printers_qt').ConfigApi
var nock = require('nock');
var expect = require('chai').expect

const host = "http://127.0.0.1:8000";

describe('errorHandling', () => {
  beforeEach(function() {
    nock(host)
      .get('/catalogues/2/print_groups')
      .reply(500, []);

    nock(host)
      .get('/print_groups/2/printers')
      .reply(500, []);
  });

  it('should handle errors when listing print groups', (done) => {
    new ConfigApi(host).listPrintGroupsPrinters(2).catch(function(err) {
      expect(err.response.status).to.eq(500);
      done();
    });
  });

  it('should handle errors when listing print groups', (done) => {
    new ConfigApi(host).listPrintGroupsPrinters(2).catch(function(err) {
      expect(err.response.status).to.eq(500);
      done();
    });
  });
});

describe('listPrintGroups', () => {
  beforeEach(function() {
    const printGroupsResponse =
    [
      {
        id: 1,
        description: 'Print Group 1',
        catalogue_id: 1,
      },
      {
        id: 2,
        description: 'Print Group 2',
        catalogue_id: 2,
      },
    ];

    nock(host)
      .get('/catalogues/1/print_groups')
      .reply(200, printGroupsResponse);
  });

  it ('should return a hash of print groups', (done) => {
    new ConfigApi(host).listPrintGroups(1).then(function(groups) {
      expect(groups).to.have.lengthOf(2);
      done();
    });
  });
});

describe('listPrintGroupPrinters', () => {
  beforeEach(function() {
    const response =
    [
      {
          "id": 1,
          "description": "_DO_NOT_PRINT",
          "server": {
              "host": "https://cups-pdf.quicktravel.com.au",
              "api_key": "some_random_key"
          },
          "dimensions": [],
      },
      {
          "id": 2,
          "description": "PDF",
          "server": {
              "host": "https://cups-pdf.quicktravel.com.au",
              "api_key": "some_random_key"
          },
          "dimensions": [],
      },
    ];
    nock(host)
      .get('/print_groups/1/printers')
      .reply(200, response);
  });

  it ('should return a hash of printers', function(done) {
    new ConfigApi(host).listPrintGroupsPrinters(1).then(function(printers) {
      expect(printers).to.have.lengthOf(2);
      expect(printers[0].description).to.eq('_DO_NOT_PRINT');
      expect(printers[1].description).to.eq('PDF');
      done();
    });
  });
});
