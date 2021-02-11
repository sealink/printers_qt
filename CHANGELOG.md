## Unreleased

## 1.9.0

* [TT-8847] - Convert non-array input issuedTicketIds in quicktravelApi to be array
* [TT-8837] - Allow http 204 response code to be parsed.
* [TT-8852] - Migrate to github actions

## 1.8.0

* [TT-7002] - Remove support for CSRF token.  Added support for Bearer token

## 1.7.0

* [TT-6689] - Update babel to version 7

## 1.6.1

* [TT-5660] - Fix version in package

### 1.6.0

* [TT-5660] - Quickets printers now support printing receipts

### 1.5.0

* [TT-5645] - Use "include" credentials only on QT GET requests.
* [TT-5649] - Update Rollup and Mocha to latest versions

### 1.4.0

* [TT-5645] - Change credentials to "include" for GET requests

### 1.3.0

* [TT-5422] - Add validate endpoint
* [TT-5444] - Add issued_tickets/barcodes endpoint
* [TT-5525] - Update JS dependencies

### 1.2.1

* [TT-5042] - Handle 422 validation errors

### 1.2.0

* [TT-4915] - Add ability to issue tickets without printing
* [TT-4958] - Change require to import for isomorphic-fetch

### 1.1.2

* [TT-4627] - Force albert to always print receipts

### 1.1.1

* [TT-4529] - Handle albert ticket return

### 1.1.0

* [TT-4615] - Support configurable print server type
* [TT-4621] - Add new endpoint '/print-receipt'

### 1.0.0

* [TT-4538] - Support CORS in Quicktravel
* [TT-4538] - Rename Quickets to Quickprint
* [TT-4538] - Add ability to print receipts

### 0.2.3

* [TT-3615] - Send session cookie

### 0.2.2

* [TT-3604] - Use isomorphic-fetch rather than node-fetch

### 0.2.1

* [TT-3441] - Allow the additional "print-receipt" and "checkin" quicktravel parameters

### 0.2.0

* [TT-3410] - Allowing passing the CSRF Token
* [TT-3409] - Disable compression on quicktravel post requests
* [TT-3411] - Add void tickets endpoint
* [TT-3413] - Address coverage

### 0.1.0

* [TT-3349] - Initial Release
