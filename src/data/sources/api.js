const axios = require('axios');

// Prototype for sources
class API {
  static fetch(axiosConfig) {
    const request = axios.create(axiosConfig);
    return (endpoint, config = {}) => (
      request.get(endpoint, config).then(x => x.data)
    );
  }

  static createAxiosConfig(baseURL, apiKey) {
    let params = {};

    if (!apiKey) {
      return {
        baseURL,
        timeout: 10000,
      };
    }

    if (typeof apiKey === 'string') {
      params = { apiKey };
    } else {
      const keyName = Object.keys(apiKey)[0];
      params = { [keyName]: apiKey[keyName] };
    }

    return {
      baseURL,
      timeout: 10000,
      params,
    };
  }

  constructor(baseURL, apiKey) {
    const axiosConfig = API.createAxiosConfig(baseURL, apiKey);
    this.fetch = API.fetch(axiosConfig);
  }
}

module.exports = API;
