import 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export function get(url) {
  return fetch(url, { credentials: 'same-origin' }).then(checkStatus).then(parseJSON);
}

export function request(url, request) {
  return fetch(url, request)
    .then(checkStatus)
    .then(parseJSON);
}
