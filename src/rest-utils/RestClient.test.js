import RestClient from "./RestClient";

const MOCK_ENDPOINT = "http://test.me";
const MOCK_REQUEST = { mock: "request" };
const MOCK_RESPONSE = "mock-response";
const client = new RestClient();

describe("Class: RestClient", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("Function: enqueue", () => {
    it("should allow user to send a custom request to an endpoint", () => {
      const mockRequestKey = "mock-key";
      mockResponseOnce();
      const promise = RestClient.enqueue(mockRequestKey, MOCK_ENDPOINT);
      expect(RestClient.getInFlightRequest(mockRequestKey)).toBeDefined();
      promise.then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(RestClient.getInFlightRequest(mockRequestKey)).toBeUndefined();
      });
      return promise;
    });
  });

  describe("Function: toQueryString", () => {
    it("should allow user to convert JSON param object to a querystring", () => {
      const params = {
        mock1: "param1",
        mock2: "param2"
      };
      const queryString = RestClient.toQueryString(params);
      expect(queryString).toBe("?mock1=param1&mock2=param2");
    });
  });

  describe("Function: get", () => {
    it("should allow user to fetch data from an endpoint", () => {
      mockResponseOnce();
      return client.get(MOCK_ENDPOINT).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
      });
    });

    it("should allow user to set http request config when making a call", () => {
      mockResponseOnce();
      const mockConfig = "mockConfig";
      return client.get(MOCK_ENDPOINT, { mock: mockConfig }).then(() => {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });

    it("should prevent concurrent instances of the same request", () => {
      mockResponseOnce();
      client.get(MOCK_ENDPOINT);
      client.get(MOCK_ENDPOINT);
      return client.get(MOCK_ENDPOINT).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
  });

  describe("Function: put", () => {
    it("should allow user to update data at an endpoint", () => {
      mockResponseOnce();
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("PUT");
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(MOCK_REQUEST));
      });
    });

    it("should send data as text/plain content-type", () => {
      mockResponseOnce();
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
          "text/plain"
        );
      });
    });

    it("should allow user to set http request config when making a call", () => {
      mockResponseOnce();
      const mockConfig = "mockConfig";
      return client
        .put(MOCK_ENDPOINT, MOCK_REQUEST, { mock: mockConfig })
        .then(() => {
          expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
        });
    });

    it("should prevent concurrent instances of the same request", () => {
      mockResponseOnce();
      client.put(MOCK_ENDPOINT, MOCK_REQUEST);
      client.put(MOCK_ENDPOINT, MOCK_REQUEST);
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });

    it("should require data to be sent in the request", () => {
      try {
        client.put(MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("PUT request requires data");
      }
    });
  });

  describe("Function: post", () => {
    it("should allow user to create data at an endpoint", () => {
      mockResponseOnce();
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("POST");
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(MOCK_REQUEST));
      });
    });

    it("should send data as text/plain content-type", () => {
      mockResponseOnce();
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
          "text/plain"
        );
      });
    });

    it("should allow user to set http request config when making a call", () => {
      mockResponseOnce();
      const mockConfig = "mockConfig";
      return client
        .post(MOCK_ENDPOINT, MOCK_REQUEST, { mock: mockConfig })
        .then(() => {
          expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
        });
    });

    it("should prevent concurrent instances of the same request", () => {
      mockResponseOnce();
      client.post(MOCK_ENDPOINT, MOCK_REQUEST);
      client.post(MOCK_ENDPOINT, MOCK_REQUEST);
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });

    it("should require data to be sent in the request", () => {
      try {
        client.post(MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("POST request requires data");
      }
    });
  });

  describe("Function: delete", () => {
    it("should allow user to delete data at an endpoint", () => {
      mockResponseOnce();
      return client.delete(MOCK_ENDPOINT).then(response => {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("DELETE");
      });
    });

    it("should allow user to set http request config when making a call", () => {
      mockResponseOnce();
      const mockConfig = "mockConfig";
      return client.delete(MOCK_ENDPOINT, { mock: mockConfig }).then(() => {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });

    it("should prevent concurrent instances of the same request", () => {
      mockResponseOnce();
      client.delete(MOCK_ENDPOINT);
      client.delete(MOCK_ENDPOINT);
      return client.delete(MOCK_ENDPOINT).then(() => {
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
  });
});

function mockResponseOnce() {
  fetch.mockResponseOnce(JSON.stringify({ data: MOCK_RESPONSE }));
}
