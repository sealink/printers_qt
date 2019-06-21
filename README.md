[![npm version](https://badge.fury.io/js/%40sealink%2Fprinters_qt.svg)](https://badge.fury.io/js/%40sealink%2Fprinters_qt)
[![Coverage Status](https://coveralls.io/repos/github/sealink/printers_qt/badge.svg?branch=master)](https://coveralls.io/github/sealink/printers_qt?branch=master)
[![Build Status](https://travis-ci.org/sealink/printers_qt.svg?branch=master)](https://travis-ci.org/sealink/printers_qt)

### Why

Provides a wrapper api which hides the underlying printing services in QuickTravel.
If required you can also manually invoke the underlying API service.

### PrintService (Recommended API)

QuickTravel API endpoints require a CSRF token you must provide as a constructor option.

```
const config = {
  quicktravel: {
    host: 'hostName',
    csrfToken: 'token'
  },
  config: {
    host: 'hostName'
  }
}

const service = new PrintService(config)
```

- printTickets
- issueTickets
- voidTickets
- printReservations
- reprintTickets
- voidTickets
- printReceipt

### QuickTravel

- voidTickets
- reprintTickets
- printReceipt
- issueAndPrint
- issueTickets

### QuickPrint

- print-tickets

### Printers Config

- listPrintGroups
- listPrintGroupsPrinters

### Deployment

Build / Deployment is handled via travis CI.
Package management is via NPM.

First create the release branch

```
git branch release/0.3.0
```

Second Update package.json and specify the version you are releasing

Next Tag and push to travis

```
git tag v0.3.0
git push origin master --tags
```

Remember to merge changes back to the master branch
