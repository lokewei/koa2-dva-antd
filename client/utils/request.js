const Ajax = require('robe-ajax')

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, options) {
  if (options.cross) {
    return Ajax.getJSON('http://query.yahooapis.com/v1/public/yql', {
      q: "select * from json where url='" + url + '?' + Ajax.param(options.data) + "'",
      format: 'json'
    })
  } else {
    const param = options.data ? Ajax.param(options.data) : {};
    return Ajax.ajax({
      url,
      method: options.method || 'get',
      // contentType: 'application/json; charset=utf-8',
      data: param,
      processData: options.method === 'get',
      dataType: 'JSON'
    }).done((data) => {
      return data
    })
  }
}
