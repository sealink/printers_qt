import { request } from './api';

export default function printToPrinter(printer, page) {
  const body = {
    printer_name: printer.description,
    printer: printer.id, // deprecated
    api_key: printer.server.api_key, // deprecated
    tickets: page.tickets,
    page_format: page.page_format,
    base_url: page.base_url,
  };

  const postData = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': printer.server.api_key,
    },
    body: JSON.stringify(body),
  };

  return request(`${printer.server.host}/print-tickets`, postData);
}
