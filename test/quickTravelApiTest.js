const nock = require("nock");
const { expect } = require("chai");
const { QuickTravelApi } = require("../dist/printers_qt");

const host = "http://127.0.0.1:8000";
const bookingId = 1;

describe("receipt", () => {
  beforeEach(() => {
    nock(host)
      .post("/api/bookings/1/issued_tickets/reprint", {
        print_receipt: true,
        print_server_type: "quickets"
      })
      .reply(200, { msg: "Success" });
  });

  it("should print to the printer", done => {
    new QuickTravelApi(host).printReceipt(bookingId).then(response => {
      expect(response).to.deep.equal({ msg: "Success" });
      done();
    });
  });
});

describe("reprint", () => {
  beforeEach(() => {
    nock(host)
      .post("/api/bookings/1/issued_tickets/reprint", {
        issued_ticket_ids: [1, 2, 3],
        print_server_type: "quickets"
      })
      .reply(200, { msg: "Success" });

    nock(host)
      .post("/api/bookings/1/issued_tickets/reprint", {
        issued_ticket_ids: [1, 2, 3],
        print_server_type: "quickets",
        authenticity_token: "token"
      })
      .reply(200, { msg: "SuccessWithToken" });
  });

  it("should print to the printer", done => {
    const issuedTicketIds = [1, 2, 3];

    new QuickTravelApi(host)
      .reprintTickets(bookingId, issuedTicketIds)
      .then(response => {
        expect(response).to.deep.equal({ msg: "Success" });
        done();
      });
  });

  it("should optionally provide a csrf token", done => {
    const issuedTicketIds = [1, 2, 3];
    const opts = { authenticity_token: "token" };

    new QuickTravelApi(host)
      .reprintTickets(bookingId, issuedTicketIds, opts)
      .then(response => {
        expect(response).to.deep.equal({ msg: "SuccessWithToken" });
        done();
      });
  });
});

describe("issue", () => {
  const reservation_ids = "All";

  beforeEach(() => {
    nock(host)
      .post("/api/bookings/1/issued_tickets", {
        reservation_ids: "All"
      })
      .reply(200, { msg: "Success" });

    nock(host)
      .post("/api/bookings/2/issued_tickets", {
        reservation_ids: "All"
      })
      .reply(500, { msg: "Internal Server Error" });
  });

  it("should issue tickets", done => {
    new QuickTravelApi(host).issueTickets(1, reservation_ids).then(response => {
      expect(response).to.deep.equal({ msg: "Success" });
      done();
    });
  });

  it("should handle failures when issue tickets", done => {
    new QuickTravelApi(host).issueTickets(2, reservation_ids).catch(err => {
      expect(err.response.status).to.eq(500);
      done();
    });
  });
});

describe("issue_and_print", () => {
  const reservationIds = [100, 2, 300];
  beforeEach(() => {
    nock(host)
      .post("/api/bookings/1/issued_tickets/issue_and_print", {
        reservation_ids: reservationIds,
        print_server_type: "quickets"
      })
      .reply(200, { msg: "Success" });

    nock(host)
      .post("/api/bookings/1/issued_tickets/issue_and_print", {
        reservation_ids: reservationIds,
        print_server_type: "quickets",
        authenticity_token: "token"
      })
      .reply(200, { msg: "SuccessWithToken" });

    nock(host)
      .post("/api/bookings/2/issued_tickets/issue_and_print", {
        reservation_ids: reservationIds,
        print_server_type: "quickets"
      })
      .reply(422, { error: "Balance must be paid to issue tickets" });
  });

  it("should handle validation errors", done => {
    new QuickTravelApi(host).issueAndPrint(2, reservationIds).catch(err => {
      expect(err.message).to.eq("Balance must be paid to issue tickets");
      done();
    });
  });

  it("should print to the printer", done => {
    new QuickTravelApi(host)
      .issueAndPrint(bookingId, reservationIds)
      .then(response => {
        expect(response).to.deep.equal({ msg: "Success" });
        done();
      });
  });

  it("should optionally provide a csrf token", done => {
    const opts = { authenticity_token: "token" };

    new QuickTravelApi(host)
      .issueAndPrint(bookingId, reservationIds, opts)
      .then(response => {
        expect(response).to.deep.equal({ msg: "SuccessWithToken" });
        done();
      });
  });
});

describe("void", () => {
  beforeEach(() => {
    nock(host)
      .post("/api/bookings/1/issued_tickets/void", {
        issued_ticket_ids: [1, 2, 3]
      })
      .reply(204);

    nock(host)
      .post("/api/bookings/1/issued_tickets/void", {
        issued_ticket_ids: [1, 2, 3],
        authenticity_token: "token"
      })
      .reply(204);
  });

  it("should void the tickets", done => {
    const issuedTicketIds = [1, 2, 3];

    new QuickTravelApi(host)
      .voidTickets(bookingId, issuedTicketIds)
      .then(response => {
        expect(response).to.deep.equal({});
        done();
      });
  });

  it("should optionally provide a csrf token", done => {
    const issuedTicketIds = [1, 2, 3];
    const opts = { authenticity_token: "token" };

    new QuickTravelApi(host)
      .voidTickets(bookingId, issuedTicketIds, opts)
      .then(response => {
        expect(response).to.deep.equal({});
        done();
      });
  });
});

describe("validate", () => {
  beforeEach(() => {
    nock(host)
      .post("/api/issued_tickets/validate", {
        identifier: 123
      })
      .reply(200, { ticket: "TICKET GOES HERE" });

    nock(host)
      .post("/api/issued_tickets/validate", {
        identifier: 321
      })
      .reply(422, { error: "ERROR GOES HERE" });
  });

  it("should validate the ticket", done => {
    const identifier = 123;

    new QuickTravelApi(host).validateTicket(identifier).then(response => {
      expect(response).to.deep.equal({ ticket: "TICKET GOES HERE" });
      done();
    });
  });

  it("should return an error if the ticket is invalid", done => {
    const identifier = 321;

    new QuickTravelApi(host)
      .validateTicket(identifier)
      .then(response => {
        fail("Should never be called");
        done();
      })
      .catch(err => {
        expect(err.response.status).to.eq(422);
        done();
      });
  });
});

describe("issued_ticket", () => {
  beforeEach(() => {
    nock(host)
      .get("/api/issued_tickets/barcodes/12345")
      .reply(200, { ticket: "TICKET GOES HERE" });

    nock(host)
      .get("/api/issued_tickets/barcodes/54321")
      .reply(404, { error: "ERROR GOES HERE" });
  });

  it("should find the ticket", done => {
    const identifier = 12345;

    new QuickTravelApi(host).issuedTicket(identifier).then(response => {
      expect(response).to.deep.equal({ ticket: "TICKET GOES HERE" });
      done();
    });
  });

  it("should return an error if the ticket cant be found", done => {
    const identifier = 54321;

    new QuickTravelApi(host)
      .issuedTicket(identifier)
      .then(response => {
        fail("Should never be called");
        done();
      })
      .catch(err => {
        expect(err.response.status).to.eq(404);
        done();
      });
  });
});

describe("defaults and config", () => {
  it("should have configurable print_server_type", done => {
    const api = new QuickTravelApi(host);
    expect(api.printServerType).to.equal("quickets");

    const api2 = new QuickTravelApi(host, "token", "crickets");
    expect(api2.printServerType).to.equal("crickets");

    done();
  });
});
