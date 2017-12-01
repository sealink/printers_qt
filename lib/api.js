import fetch from 'node-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export function get(url) {
  return fetch(url)
         .then(checkStatus)
         .then(parseJSON);
}

export function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body
  })
  .then(checkStatus)
  .then(parseJSON)
}
