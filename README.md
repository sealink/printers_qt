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

* printTickets
* voidTickets
* printReservations
* reprintTickets
* voidTickets
* printReceipt

### QuickTravel

* voidTickets
* reprintTickets
* printReceipt
* issueAndPrint

### QuickPrint

* print-tickets

### Printers Config

* listPrintGroups
* listPrintGroupsPrinters


### Deployment

Build / Deployment is handled via travis CI.
Package management is via NPM.
To publish a new build to npm you can tag a commit and push

```
git tag v0.3.0
git push origin master --tags
```
