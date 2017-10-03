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

  const MongoDB = require('mongodb');
  const MongoClient = MongoDB.MongoClient;

  class ConnectionManager {
    constructor(mongodManager) {
      this._mongodManager = mongodManager;
      this._databases = {};
    }

    connect(dbName, options = {}) {
      return Promise.resolve()
      .then(() => {
        if ('string' !== typeof(dbName) || 0 >= dbName.length) {
          throw new TypeError('dbName must be a non-empty string.');
        } else if (!this._databases.hasOwnProperty(dbName)) {
          const url = `mongodb://127.0.0.1:27017/${dbName}`;
          this._databases[dbName] = this._mongodManager.waitUntilStarted()
          .then(() => MongoClient.connect(url, options));
        }
        return this._databases[dbName];
      });
    }
  }

  module.exports = ConnectionManager;
})();
