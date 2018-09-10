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
