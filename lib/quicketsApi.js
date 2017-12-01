import { post } from './api';

export function printToPrinter(printer, page) {
  const body = {
    printer_name: printer.description,
    printer: printer.id,
    api_key: printer.server.api_key,
    tickets: page.tickets,
    page_format: page.page_format,
    base_url: page.base_url,
  };

  return post(`${printer.server.host}/print-tickets`, JSON.stringify(body));
}
