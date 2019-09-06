import _regeneratorRuntime from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/regenerator";
import _asyncToGenerator from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/createClass";

/**
 * This is mostly just a POJO, but has ActiveRecord methods:
 * - `load`:    Load the object from server
 * - `save`:    Save the object back to the server.
 * - `delete`:  Delete the object from the server
 *
 * It is intended to be used with a REST API for CRUD operations on
 * a single record in a database. It assumes the primary key is called
 * `id`.
 *
 * There are some handy helper methods:
 * - `absorbData`:  Will copy all keys of incoming object onto this one
 * - `isLoaded`:    Boolean to check if object has been requested from server
 *                  yet or not.
 * - `toJson`:      Return object represented as JSON string
 * - `toPojo`:      Return object represented as plain old javascript object
 *
 * TODO: Make primary key configurable
 *
 * > NOTE: If extending this class, if you want some variables to be ommitted
 * from output when using toJson or toPojo, prefix them with `$`.
 */
import isFunction from "lodash/isFunction";
import startsWith from "lodash/startsWith";
import RestClient from "./RestClient";
var client = new RestClient();

var ApiObject =
/*#__PURE__*/
function () {
  _createClass(ApiObject, null, [{
    key: "setBaseUrl",
    value: function setBaseUrl(url) {
      ApiObject.baseUrl = url;
    }
  }, {
    key: "create",
    value: function create(data, baseUrl, endpoint) {
      if (!ApiObject.baseUrl) {
        ApiObject.baseUrl = baseUrl;
      }

      var origBaseUrl = ApiObject.baseUrl;
      ApiObject.setBaseUrl(baseUrl);
      var newObj = new ApiObject(data, endpoint);
      ApiObject.setBaseUrl(origBaseUrl);
      return newObj;
    }
  }]);

  function ApiObject(data, endpoint) {
    _classCallCheck(this, ApiObject);

    if (!ApiObject.baseUrl) throw new Error("Please initialise ApiObject base URL with ApiObject.setBaseUrl()");
    this.$isLoaded = false;
    this.$url = ApiObject.baseUrl + "/" + endpoint;
    this.absorbData(data);
  }

  _createClass(ApiObject, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(id) {
        var data;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (id) {
                  this.id = id;
                }

                if (!this.id) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return client.get("".concat(this.$url, "/").concat(this.id));

              case 4:
                data = _context.sent;
                this.$isLoaded = true;
                return _context.abrupt("return", this.absorbData(data));

              case 7:
                return _context.abrupt("return", this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.id) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return client["delete"]("".concat(this.$url, "/").concat(this.id));

              case 3:
                delete this.id;
                this.$isLoaded = false;

              case 5:
                return _context2.abrupt("return", this);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _delete() {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3() {
        var method, data;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                method = this.id ? "put" : "post";
                _context3.next = 3;
                return client[method](this.$url, this.toJson());

              case 3:
                data = _context3.sent;
                this.absorbData(data);
                this.$isLoaded = true;
                return _context3.abrupt("return", this);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function save() {
        return _save.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: "absorbData",
    value: function absorbData(data) {
      Object.assign(this, data);
      return this;
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      return this.$isLoaded;
    }
  }, {
    key: "toJson",
    value: function toJson() {
      var _this = this;

      var out = {};
      Object.keys(this).forEach(function (key) {
        if (!isFunction(_this[key]) && !startsWith(key, "$")) {
          out[key] = _this[key];
        }
      });
      return JSON.stringify(out);
    }
  }, {
    key: "toPojo",
    value: function toPojo() {
      return JSON.parse(this.toJson());
    }
  }]);

  return ApiObject;
}();

export { ApiObject as default };
ApiObject.client = client;