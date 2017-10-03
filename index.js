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

  const path = require('path');
  const MongodManager = require('./lib/mongod-manager');
  const ConnectionManager = require('./lib/connection-manager');
  const CollectionManager = require('./lib/collection/collection-manager');
  const CursorManager = require('./lib/cursor/cursor-manager');
  const BaseHelperApi = global.helper.BaseHelperApi;

  const MONGODB_CRUD_MANAGER = path.resolve(__dirname, './lib/helpers/mongodb-crud-manager');

  class Api {
    constructor() {
      this._mongodManager = new MongodManager();
      this._connectionManager = new ConnectionManager(this._mongodManager);
      this._cursorManager = new CursorManager();
      this._collectionManager = new CollectionManager(this._connectionManager, this._cursorManager);
      this._baseHelperApi = null;
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => {
        this._baseHelperApi = new BaseHelperApi(messageCenter);
      })
      .then(() => this._baseHelperApi.add({name: 'MongodbCrudManager', filepath: MONGODB_CRUD_MANAGER}))
      .then(() => this._mongodManager.load(messageCenter))
      .then(() => this._cursorManager.load(messageCenter))
      .then(() => this._collectionManager.load(messageCenter));
    }

    unload(messageCenter) {
      return Promise.resolve()
      .then(() => this._collectionManager.unload())
      .then(() => this._cursorManager.unload())
      .then(() => this._mongodManager.unload())
      .then(() => {
        this._baseHelperApi = null;
      });
    }
  }

  module.exports = new Api();
})();
