/**
Copyright 2017 LGS Innovations

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

(() => {
  'use strict';

  const EventEmitter = require('events');
  const CollectionApi = require('./../collection/collection-api');
  const CrudMessenger = global.helper.CrudMessenger;
  const logger = global.LoggerFactory.getLogger();

  function isNonEmptyString(value) {
    return 'string' === typeof(value) && 0 < value.length;
  }

  class MongodbCrudManager extends EventEmitter {
    constructor(collectionName, {dbName, MessengerClass, tag, scopes, readScopes=scopes, writeScopes=scopes}={}) {
      super();
      if (!isNonEmptyString(collectionName)) {
        throw new TypeError('collectionName must be a non-empty string');
      }
      this._collectionName = collectionName;
      this._dbName = dbName;
      if (!CrudMessenger.isPrototypeOf(MessengerClass)) {
        MessengerClass = CrudMessenger;
      }
      this._messenger = new MessengerClass(tag, this, {
        readScopes: readScopes,
        writeScopes: writeScopes
      });
      this._collectionApi = null;

      this._chain = Promise.resolve();
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => {
        this._collectionApi = new CollectionApi(messageCenter, this._collectionName, {dbName: this._dbName});
      })
      .then(() => this._messenger.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
      .then(() => this._messenger.unload())
      .then(() => {
        this._collectionApi = null;
      });
    }

    validate(item) {
      return Promise.resolve(item);
    }

    create(item) {
      const isArray = Array.isArray(item);
      return Promise.resolve()
      .then(() => {
        if (isArray) {
          this._chain = this._chain.then(() => Promise.all(item.map((i) => {
              return this._create(i)
              .catch((err) => {
                logger.error('Failed to validate item', err.toString());
                return {
                  $isError: true,
                  message: err.message,
                  name: err.name
                };
              });
            })));

          return this._chain.catch(() => null);
        } else {
          return this._create(item);
        }
      })
      .then((result) => {
        this.emit('created', (isArray ? result : [result]));
        return result;
      });
    }

    _create(item) {
      return Promise.resolve()
      .then(() => this.validate(item))
      .then((item) => this._collectionApi.insertOne(item))
      .then((r) => r.ops[0]);
    }

    count(query) {
      return Promise.resolve()
      .then(() => this._collectionApi.count(query));
    }

    list(query, options) {
      query = query || {};
      options = options || {};
      return Promise.resolve()
      .then(() => this._collectionApi.find(query, options));
    }

    get(id) {
      return Promise.resolve()
      .then(() => this._collectionApi.findOne({_id: id}));
    }

    update(id, update) {
      const isArray = Array.isArray(id);
      return Promise.resolve()
      .then(() => {
        if (isArray) {
          this._chain = this.chain.then(() => Promise.all(id.map((i) => {
            return this._update(id, update)
            .catch((err) => {
              logger.error('Failed to update item', err.toString());
              return {
                $isError: true,
                message: err.message,
                name: err.name
              };
            });
          })));
          return this._chain.catch(() => null);
        } else {
          return this._update(id, update);
        }
      })
      .then((result) => {
        if (null !== result) {
          this.emit('updated', (isArray ? result : [result]));
        }
        return result;
      });
    }

    _update(id, update) {
      return Promise.resolve()
      .then(() => this.validate(update))
      .then((update) => this._collectionApi.findOneAndUpdate({_id: id}, update, {returnOriginal: false}))
      .then((r) => r.value);
    }

    delete(id) {
      const isArray = Array.isArray(id);
      return Promise.resolve()
      .then(() => {
        if (isArray) {
          this._chain = this._chain.then(() => Promise.all(id.map((i) => {
            return this._delete(i)
            .catch((err) => {
              logger.error('Failed to delete item', err.toString());
              return {
                $isError: true,
                message: err.message,
                name: err.name
              };
            });
          })));

          return this._chain.catch(() => null);
        } else {
          return this._delete(id);
        }
      })
      .then((result) => {
        if (null !== result) {
          this.emit('deleted', (isArray ? result : [result]));
        }
        return result;
      });
    }

    _delete(id) {
      return Promise.resolve()
      .then(() => this._collectionApi.findOneAndDelete({_id: id}, {returnOriginal: false}))
      .then((r) => r.value);
    }
  }

  module.exports = MongodbCrudManager;
})();
