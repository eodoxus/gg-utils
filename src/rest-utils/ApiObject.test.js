import ApiObject from "./ApiObject";
import RestClient from "./RestClient";
jest.mock("./RestClient");

const MOCK_BASE_URL = "http://test.me";
const MOCK_ENDPOINT = "mock-endpoint";
const MOCK_DATA = { mock: "data" };
const MOCK_RESPONSE = { data: "mock-response" };

describe("Class: ApiObject", () => {
  beforeEach(() => {
    RestClient.prototype.get.mockClear();
    RestClient.prototype.get.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    RestClient.prototype.delete.mockClear();
    RestClient.prototype.delete.mockReturnValue(Promise.resolve());
    RestClient.prototype.put.mockClear();
    RestClient.prototype.put.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    RestClient.prototype.post.mockClear();
    RestClient.prototype.post.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    fetch.resetMocks();
  });

  describe("Function: setBaseUrl", () => {
    it("should allow user to change the API endpoint base URL for all new ApiObject instances", () => {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      const myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      const myObj2 = new ApiObject(MOCK_DATA, "mock2");
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj2.$url).toBe(MOCK_BASE_URL + "/mock2");
      const mockBaseUrl2 = "base2";
      ApiObject.setBaseUrl(mockBaseUrl2);
      const myObj3 = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      expect(myObj3.$url).toBe(mockBaseUrl2 + "/" + MOCK_ENDPOINT);
    });
  });

  describe("Function: create", () => {
    it("should allow user to create a new API object and set the default baseUrl", () => {
      const myObj = ApiObject.create(MOCK_DATA, MOCK_BASE_URL, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj.mock).toBe(MOCK_DATA.mock);
    });

    it("should not allow user to override the baseUrl if already set", () => {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      const mockBaseUrl = "mockBaseUrl";
      const myObj = ApiObject.create(MOCK_DATA, mockBaseUrl, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(mockBaseUrl + "/" + MOCK_ENDPOINT);
      expect(ApiObject.baseUrl).toBe(MOCK_BASE_URL);
    });
  });

  describe("Function: constructor", () => {
    it("should allow user to create a new API object holding data and specifying URL", () => {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      const myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj.mock).toBe(MOCK_DATA.mock);
      expect(myObj.$isLoaded).toBe(false);
    });

    it("should require a base URL before new objects can be created", () => {
      try {
        const myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("Please initialise");
      }
    });
  });

  describe("Function: load", () => {
    it("should make a GET http request if object has a primary key set already, and be chainable", () => {
      const myObj = new ApiObject({ id: 1 }, MOCK_ENDPOINT);
      return myObj.load().then(out => {
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(out).toEqual(myObj);
        expect(RestClient.prototype.get.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });

    it("should not make an http request if object does not have a primary key set", () => {
      const myObj = new ApiObject();
      return myObj.load().then(() => {
        expect(RestClient.prototype.get.mock.calls.length).toBe(0);
      });
    });
  });

  describe("Function: delete", () => {
    it("should make a DELETE http request if object has a primary key set already, and be chainable", () => {
      const myObj = new ApiObject({ id: 1 });
      return myObj.delete().then(out => {
        expect(out).toEqual(myObj);
        expect(out.id).toBeUndefined();
        expect(myObj.$isLoaded).toBe(false);
      });
    });

    it("should not make an http request if object does not have a primary key set", () => {
      const myObj = new ApiObject();
      return myObj.delete().then(out => {
        expect(RestClient.prototype.delete.mock.calls.length).toBe(0);
      });
    });
  });

  describe("Function: save", () => {
    it("should make a PUT http request if object has a primary key set already, and be chainable", () => {
      const myObj = new ApiObject({ id: 1 });
      return myObj.save().then(out => {
        expect(out).toEqual(myObj);
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(RestClient.prototype.put.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });

    it("should make a POST http request if object does not have a primary key set already, and be chainable", () => {
      const myObj = new ApiObject();
      return myObj.save().then(out => {
        expect(out).toEqual(myObj);
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(RestClient.prototype.post.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });
  });

  describe("Function: toJson", () => {
    it("should return object as JSON stri, ommitting internal vars", () => {
      const myObj = new ApiObject({ id: 1 });
      const json = myObj.toJson();
      expect(json).toBe(`{"id":1}`);
    });
  });

  describe("Function: toPojo", () => {
    it("should return object as plain old javascript object, ommitting internal vars", () => {
      const myObj = new ApiObject({ id: 1 });
      const pojo = myObj.toPojo();
      expect(pojo.id).toBe(1);
      expect(pojo.$url).toBeUndefined();
      expect(pojo.$isLoaded).toBeUndefined();
    });
  });
});
