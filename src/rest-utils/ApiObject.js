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

const client = new RestClient();

export default class ApiObject {

  static setBaseUrl(url) {
    ApiObject.baseUrl = url;
  }

  static create(data, baseUrl, endpoint) {
    if (!ApiObject.baseUrl) {
      ApiObject.baseUrl = baseUrl;
    }
    const origBaseUrl = ApiObject.baseUrl;
    ApiObject.setBaseUrl(baseUrl);
    const newObj = new ApiObject(data, endpoint);
    ApiObject.setBaseUrl(origBaseUrl);
    return newObj;
  }

  constructor(data, endpoint) {
    if (!ApiObject.baseUrl)
      throw new Error(
        "Please initialise ApiObject base URL with ApiObject.setBaseUrl()"
      );
    this.$isLoaded = false;
    this.$url = ApiObject.baseUrl + "/" + endpoint;
    this.absorbData(data);
  }

  async load(id) {
    if (id) {
      this.id = id;
    }
    if (this.id) {
      let data = await client.get(`${this.$url}/${this.id}`);
      this.$isLoaded = true;
      return this.absorbData(data);
    }
    return this;
  }

  async delete() {
    if (this.id) {
      await client.delete(`${this.$url}/${this.id}`);
      delete this.id;
      this.$isLoaded = false;
    }
    return this;
  }

  async save() {
    let method = this.id ? "put" : "post";
    let data = await client[method](this.$url, this.toJson());
    this.absorbData(data);
    this.$isLoaded = true;
    return this;
  }

  absorbData(data) {
    Object.assign(this, data);
    return this;
  }

  isLoaded() {
    return this.$isLoaded;
  }

  toJson() {
    let out = {};
    Object.keys(this).forEach(key => {
      if (!isFunction(this[key]) && !startsWith(key, "$")) {
        out[key] = this[key];
      }
    });
    return JSON.stringify(out);
  }

  toPojo() {
    return JSON.parse(this.toJson());
  }
}

ApiObject.client = client;