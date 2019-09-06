import _regeneratorRuntime from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/regenerator";
import _asyncToGenerator from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/home/jgordon/Projects/jaygordo.com/gg-utils/node_modules/@babel/runtime/helpers/esm/createClass";

/**
 * A very simple implementation of REST client to send HTTP requests
 * to a server using different methods: GET, PUT, POST, DELETE.
 * Typically used to interact with REST API servers.
 *
 * TODO: Make default Content-Type configurable
 */
import "whatwg-fetch";
var _inFlight = [];

var RestClient =
/*#__PURE__*/
function () {
  function RestClient() {
    _classCallCheck(this, RestClient);
  }

  _createClass(RestClient, [{
    key: "get",
    value: function get(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return executeRequest(url, config);
    }
  }, {
    key: "put",
    value: function put(url, data) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!data) throw new Error("PUT request requires data");
      return executeRequest(url, Object.assign(config, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
      }));
    }
  }, {
    key: "post",
    value: function post(url, data) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!data) throw new Error("POST request requires data");
      return executeRequest(url, Object.assign(config, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
      }));
    }
  }, {
    key: "delete",
    value: function _delete(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return executeRequest(url, Object.assign(config, {
        method: "DELETE"
      }));
    }
  }], [{
    key: "enqueue",
    value: function enqueue(key, url, config) {
      var promise = new Promise(function (resolve, reject) {
        fetch(url, fetchConfig(config)).then(function (response) {
          var iDx = _inFlight.findIndex(function (request) {
            return request.key === key;
          });

          _inFlight.splice(iDx, 1);

          resolve(validate(response));
        })["catch"](function (e) {
          return reject(e);
        });
      });

      _inFlight.push({
        key: key,
        promise: promise
      });

      return promise;
    }
  }, {
    key: "getInFlightRequest",
    value: function getInFlightRequest(key) {
      var request = _inFlight.find(function (request) {
        return request.key === key;
      });

      if (request) {
        return request.promise;
      }
    }
  }, {
    key: "toQueryString",
    value: function toQueryString(params) {
      return "?" + Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      }).join("&");
    }
  }]);

  return RestClient;
}();

export { RestClient as default };

function executeRequest(_x, _x2) {
  return _executeRequest.apply(this, arguments);
}

function _executeRequest() {
  _executeRequest = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(url, config) {
    var requestKey, request, response;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            //url += (url.includes("?") ? "&" : "?") + "XDEBUG_SESSION_START=Jason";
            requestKey = url + JSON.stringify(config);
            request = RestClient.getInFlightRequest(requestKey);

            if (!request) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return request;

          case 6:
            _context.t0 = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return RestClient.enqueue(requestKey, url, config);

          case 11:
            _context.t0 = _context.sent;

          case 12:
            response = _context.t0;
            return _context.abrupt("return", response);

          case 16:
            _context.prev = 16;
            _context.t1 = _context["catch"](0);
            console.error("REST ".concat(config.method || "GET", " failed"), url, _context.t1);
            throw _context.t1;

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));
  return _executeRequest.apply(this, arguments);
}

function fetchConfig(overrides) {
  var defaults = {
    credentials: "same-origin"
  };
  return Object.assign(defaults, overrides);
}

function validate(response) {
  return response.json();
}