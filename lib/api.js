require('isomorphic-fetch');

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
  return fetch(url).then(checkStatus).then(parseJSON);
}

export function post(url, body, options = {}) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, Object.assign(fetchOptions, options))
    .then(checkStatus)
    .then(parseJSON);
}
