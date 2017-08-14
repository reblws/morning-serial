import axios from 'axios';

class APIClient {
  constructor() {
    this.axios = axios.create({
      baseURL: 'https://serial.reblws.me/api/',
      timeout: 10000,
    });
  }

  fetch(endpoint, config = {}) {
    return this.axios.get(endpoint, config).then(x => x.data);
  }

  getNextPage(page, sources, increment = 25, offset = 0) {
    return this.fetch('/feeds', {
      params: {
        sources: Array.isArray(sources) ? sources.join('+') : sources,
        page,
        increment,
        offset,
      },
    });
  }
}

export default new APIClient();
