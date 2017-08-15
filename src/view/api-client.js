import axios from 'axios';
import { host } from '../config/view';

class APIClient {
  constructor() {
    const baseURL = `//${host}`;
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
    });
    this.fetch = this.fetch.bind(this);
  }

  fetch(endpoint, config = {}) {
    const request = this.axios.get(endpoint, config)
      .then(x => x.data)
      .catch(e => {
        throw e;
      });
    return request;
  }

  getPage(page, sources, increment, offset = 0) {
    return this.fetch('/api/feeds', {
      params: {
        sources: Array.isArray(sources)
          ? sources.join('+')
          : sources,
        page,
        increment,
        offset,
      },
    });
  }
}

export default new APIClient();
