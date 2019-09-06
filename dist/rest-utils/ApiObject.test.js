import ApiObject from "./ApiObject";
import RestClient from "./RestClient";
jest.mock("./RestClient");
var MOCK_BASE_URL = "http://test.me";
var MOCK_ENDPOINT = "mock-endpoint";
var MOCK_DATA = {
  mock: "data"
};
var MOCK_RESPONSE = {
  data: "mock-response"
};
describe("Class: ApiObject", function () {
  beforeEach(function () {
    RestClient.prototype.get.mockClear();
    RestClient.prototype.get.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    RestClient.prototype["delete"].mockClear();
    RestClient.prototype["delete"].mockReturnValue(Promise.resolve());
    RestClient.prototype.put.mockClear();
    RestClient.prototype.put.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    RestClient.prototype.post.mockClear();
    RestClient.prototype.post.mockReturnValue(Promise.resolve(MOCK_RESPONSE));
    fetch.resetMocks();
  });
  describe("Function: setBaseUrl", function () {
    it("should allow user to change the API endpoint base URL for all new ApiObject instances", function () {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      var myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      var myObj2 = new ApiObject(MOCK_DATA, "mock2");
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj2.$url).toBe(MOCK_BASE_URL + "/mock2");
      var mockBaseUrl2 = "base2";
      ApiObject.setBaseUrl(mockBaseUrl2);
      var myObj3 = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      expect(myObj3.$url).toBe(mockBaseUrl2 + "/" + MOCK_ENDPOINT);
    });
  });
  describe("Function: create", function () {
    it("should allow user to create a new API object and set the default baseUrl", function () {
      var myObj = ApiObject.create(MOCK_DATA, MOCK_BASE_URL, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj.mock).toBe(MOCK_DATA.mock);
    });
    it("should not allow user to override the baseUrl if already set", function () {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      var mockBaseUrl = "mockBaseUrl";
      var myObj = ApiObject.create(MOCK_DATA, mockBaseUrl, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(mockBaseUrl + "/" + MOCK_ENDPOINT);
      expect(ApiObject.baseUrl).toBe(MOCK_BASE_URL);
    });
  });
  describe("Function: constructor", function () {
    it("should allow user to create a new API object holding data and specifying URL", function () {
      ApiObject.setBaseUrl(MOCK_BASE_URL);
      var myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      expect(myObj.$url).toBe(MOCK_BASE_URL + "/" + MOCK_ENDPOINT);
      expect(myObj.mock).toBe(MOCK_DATA.mock);
      expect(myObj.$isLoaded).toBe(false);
    });
    it("should require a base URL before new objects can be created", function () {
      try {
        var myObj = new ApiObject(MOCK_DATA, MOCK_ENDPOINT);
      } catch (e) {
        expect(e.message).toContain("Please initialise");
      }
    });
  });
  describe("Function: load", function () {
    it("should make a GET http request if object has a primary key set already, and be chainable", function () {
      var myObj = new ApiObject({
        id: 1
      }, MOCK_ENDPOINT);
      return myObj.load().then(function (out) {
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(out).toEqual(myObj);
        expect(RestClient.prototype.get.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });
    it("should not make an http request if object does not have a primary key set", function () {
      var myObj = new ApiObject();
      return myObj.load().then(function () {
        expect(RestClient.prototype.get.mock.calls.length).toBe(0);
      });
    });
  });
  describe("Function: delete", function () {
    it("should make a DELETE http request if object has a primary key set already, and be chainable", function () {
      var myObj = new ApiObject({
        id: 1
      });
      return myObj["delete"]().then(function (out) {
        expect(out).toEqual(myObj);
        expect(out.id).toBeUndefined();
        expect(myObj.$isLoaded).toBe(false);
      });
    });
    it("should not make an http request if object does not have a primary key set", function () {
      var myObj = new ApiObject();
      return myObj["delete"]().then(function (out) {
        expect(RestClient.prototype["delete"].mock.calls.length).toBe(0);
      });
    });
  });
  describe("Function: save", function () {
    it("should make a PUT http request if object has a primary key set already, and be chainable", function () {
      var myObj = new ApiObject({
        id: 1
      });
      return myObj.save().then(function (out) {
        expect(out).toEqual(myObj);
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(RestClient.prototype.put.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });
    it("should make a POST http request if object does not have a primary key set already, and be chainable", function () {
      var myObj = new ApiObject();
      return myObj.save().then(function (out) {
        expect(out).toEqual(myObj);
        expect(myObj.data).toBe(MOCK_RESPONSE.data);
        expect(RestClient.prototype.post.mock.calls.length).toBe(1);
        expect(myObj.$isLoaded).toBe(true);
      });
    });
  });
  describe("Function: toJson", function () {
    it("should return object as JSON stri, ommitting internal vars", function () {
      var myObj = new ApiObject({
        id: 1
      });
      var json = myObj.toJson();
      expect(json).toBe("{\"id\":1}");
    });
  });
  describe("Function: toPojo", function () {
    it("should return object as plain old javascript object, ommitting internal vars", function () {
      var myObj = new ApiObject({
        id: 1
      });
      var pojo = myObj.toPojo();
      expect(pojo.id).toBe(1);
      expect(pojo.$url).toBeUndefined();
      expect(pojo.$isLoaded).toBeUndefined();
    });
  });
});