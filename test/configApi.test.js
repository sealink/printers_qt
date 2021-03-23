const { ConfigApi } = require("../dist/printers_qt");
const nock = require("nock");
const { expect } = require("chai");

const host = "http://127.0.0.1:8000";
const bearerToken = "bearerToken";
const configHeaders = {
  authorization: `Bearer ${bearerToken}`
};

describe("errorHandling", () => {
  beforeEach(() => {
    nock(host, { reqHeaders: configHeaders })
      .get("/catalogues/2/print_groups")
      .reply(500, []);

    nock(host, { reqHeaders: configHeaders })
      .get("/print_groups/2/printers")
      .reply(500, []);
  });

  it("should handle errors when listing print groups", done => {
    new ConfigApi(host, bearerToken).listPrintGroupsPrinters(2).catch(err => {
      expect(err.response.status).to.eq(500);
      done();
    });
  });

  it("should handle errors when listing print groups", done => {
    new ConfigApi(host, bearerToken).listPrintGroupsPrinters(2).catch(err => {
      expect(err.response.status).to.eq(500);
      done();
    });
  });
});

describe("listPrintGroups", () => {
  beforeEach(() => {
    const printGroupsResponse = [
      {
        id: 1,
        description: "Print Group 1",
        catalogue_id: 1
      },
      {
        id: 2,
        description: "Print Group 2",
        catalogue_id: 2
      }
    ];

    nock(host, { reqHeaders: configHeaders })
      .get("/catalogues/1/print_groups")
      .reply(200, printGroupsResponse);
  });

  it("should return a hash of print groups", done => {
    new ConfigApi(host, bearerToken).listPrintGroups(1).then(groups => {
      expect(groups).to.have.lengthOf(2);
      done();
    });
  });
});

describe("listPrintGroupPrinters", () => {
  beforeEach(() => {
    const response = [
      {
        id: 1,
        description: "_DO_NOT_PRINT",
        server: {
          host: "https://cups-pdf.quicktravel.com.au",
          api_key: "some_random_key"
        },
        dimensions: []
      },
      {
        id: 2,
        description: "PDF",
        server: {
          host: "https://cups-pdf.quicktravel.com.au",
          api_key: "some_random_key"
        },
        dimensions: []
      }
    ];
    nock(host, { reqHeaders: configHeaders })
      .get("/print_groups/1/printers")
      .reply(200, response);
  });

  it("should return a hash of printers", done => {
    new ConfigApi(host, bearerToken)
      .listPrintGroupsPrinters(1)
      .then(printers => {
        expect(printers).to.have.lengthOf(2);
        expect(printers[0].description).to.eq("_DO_NOT_PRINT");
        expect(printers[1].description).to.eq("PDF");
        done();
      });
  });
});
