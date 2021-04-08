import { request } from "./api";
import { QUICKETS_SERVER_TYPE, ALBERT_SERVER_TYPE } from "./constants";

function postData(api_key, body) {
  return {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": api_key,
    },
    body: JSON.stringify(body),
  };
}

function printToPrinter(printer, page) {
  const body = {
    printer_name: printer.description,
    printer: printer.id, // deprecated
    api_key: printer.server.api_key, // deprecated
    tickets: page.tickets,
    page_format: page.page_format,
    base_url: page.base_url, // deprecated
  };

  return request(
    `${printer.server.host}/print-tickets`,
    postData(printer.server.api_key, body)
  );
}

function printToReceipt(printer, page) {
  const body = {
    printer_name: printer.description,
    tickets: page.tickets,
  };

  return request(
    `${printer.server.host}/print-receipts`,
    postData(printer.server.api_key, body)
  );
}

export default function print(printer, page, printServerType) {
  if (printServerType === QUICKETS_SERVER_TYPE) {
    return printToPrinter(printer, page);
  }

  return printToReceipt(printer, page);
}
