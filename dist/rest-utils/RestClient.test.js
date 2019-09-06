import RestClient from "./RestClient";
var MOCK_ENDPOINT = "http://test.me";
var MOCK_REQUEST = {
  mock: "request"
};
var MOCK_RESPONSE = "mock-response";
var client = new RestClient();
describe("Class: RestClient", function () {
  beforeEach(function () {
    fetch.resetMocks();
  });
  describe("Function: enqueue", function () {
    it("should allow user to send a custom request to an endpoint", function () {
      var mockRequestKey = "mock-key";
      mockResponseOnce();
      var promise = RestClient.enqueue(mockRequestKey, MOCK_ENDPOINT);
      expect(RestClient.getInFlightRequest(mockRequestKey)).toBeDefined();
      promise.then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(RestClient.getInFlightRequest(mockRequestKey)).toBeUndefined();
      });
      return promise;
    });
  });
  describe("Function: toQueryString", function () {
    it("should allow user to convert JSON param object to a querystring", function () {
      var params = {
        mock1: "param1",
        mock2: "param2"
      };
      var queryString = RestClient.toQueryString(params);
      expect(queryString).toBe("?mock1=param1&mock2=param2");
    });
  });
  describe("Function: get", function () {
    it("should allow user to fetch data from an endpoint", function () {
      mockResponseOnce();
      return client.get(MOCK_ENDPOINT).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
      });
    });
    it("should allow user to set http request config when making a call", function () {
      mockResponseOnce();
      var mockConfig = "mockConfig";
      return client.get(MOCK_ENDPOINT, {
        mock: mockConfig
      }).then(function () {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });
    it("should prevent concurrent instances of the same request", function () {
      mockResponseOnce();
      client.get(MOCK_ENDPOINT);
      client.get(MOCK_ENDPOINT);
      return client.get(MOCK_ENDPOINT).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
  });
  describe("Function: put", function () {
    it("should allow user to update data at an endpoint", function () {
      mockResponseOnce();
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("PUT");
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(MOCK_REQUEST));
      });
    });
    it("should send data as text/plain content-type", function () {
      mockResponseOnce();
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe("text/plain");
      });
    });
    it("should allow user to set http request config when making a call", function () {
      mockResponseOnce();
      var mockConfig = "mockConfig";
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST, {
        mock: mockConfig
      }).then(function () {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });
    it("should prevent concurrent instances of the same request", function () {
      mockResponseOnce();
      client.put(MOCK_ENDPOINT, MOCK_REQUEST);
      client.put(MOCK_ENDPOINT, MOCK_REQUEST);
      return client.put(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
    it("should require data to be sent in the request", function () {
      try {
        client.put(MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("PUT request requires data");
      }
    });
  });
  describe("Function: post", function () {
    it("should allow user to create data at an endpoint", function () {
      mockResponseOnce();
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("POST");
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(MOCK_REQUEST));
      });
    });
    it("should send data as text/plain content-type", function () {
      mockResponseOnce();
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe("text/plain");
      });
    });
    it("should allow user to set http request config when making a call", function () {
      mockResponseOnce();
      var mockConfig = "mockConfig";
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST, {
        mock: mockConfig
      }).then(function () {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });
    it("should prevent concurrent instances of the same request", function () {
      mockResponseOnce();
      client.post(MOCK_ENDPOINT, MOCK_REQUEST);
      client.post(MOCK_ENDPOINT, MOCK_REQUEST);
      return client.post(MOCK_ENDPOINT, MOCK_REQUEST).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
    it("should require data to be sent in the request", function () {
      try {
        client.post(MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("POST request requires data");
      }
    });
  });
  describe("Function: delete", function () {
    it("should allow user to delete data at an endpoint", function () {
      mockResponseOnce();
      return client["delete"](MOCK_ENDPOINT).then(function (response) {
        expect(response.data).toEqual(MOCK_RESPONSE);
        expect(fetch.mock.calls[0][1].method).toBe("DELETE");
      });
    });
    it("should allow user to set http request config when making a call", function () {
      mockResponseOnce();
      var mockConfig = "mockConfig";
      return client["delete"](MOCK_ENDPOINT, {
        mock: mockConfig
      }).then(function () {
        expect(fetch.mock.calls[0][1].mock).toBe(mockConfig);
      });
    });
    it("should prevent concurrent instances of the same request", function () {
      mockResponseOnce();
      client["delete"](MOCK_ENDPOINT);
      client["delete"](MOCK_ENDPOINT);
      return client["delete"](MOCK_ENDPOINT).then(function () {
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });
  });
});

function mockResponseOnce() {
  fetch.mockResponseOnce(JSON.stringify({
    data: MOCK_RESPONSE
  }));
}