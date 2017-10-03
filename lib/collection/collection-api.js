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

  const CollectionConstants = require('./collection-constants');
  // const CursorApi = require('./../cursor/cursor-api');

  class CollectionApi {
    constructor(messageCenter, collectionName, {dbName}={}) {
      this._messageCenter = messageCenter;
      this._dbName = dbName;
      this._collectionName = collectionName;
    }

    aggregate(pipeline, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.AGGREGATE, null, this._collectionName, pipeline, {dbName: this._dbName, options: options});
    }

    count(query, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.COUNT, null, this._collectionName, query, {dbName: this._dbName, options: options});
    }

    createIndex(fieldOrSpec, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.CREATE_INDEX, null, this._collectionName, fieldOrSpec, {dbName: this._dbName, options: options});
    }

    createIndexes(indexSpecs, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.CREATE_INDEXES, null, this._collectionName, indexSpecs, {dbName: this._dbName, options: options});
    }

    deleteMany(filter, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DELETE_MANY, null, this._collectionName, filter, {dbName: this._dbName, options: options});
    }

    deleteOne(filter, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DELETE_ONE, null, this._collectionName, filter, {dbName: this._dbName, options: options});
    }

    distinct(key, query, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DISTINCT, null, this._collectionName, key, query, {dbName: this._dbName, options: options});
    }

    drop(options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DROP, null, this._collectionName, {dbName: this._dbName, options: options});
    }

    dropIndex(indexName, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DROP_INDEX, null, this._collectionName, indexName, {dbName: this._dbName, options: options});
    }

    dropIndexes() {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.DROP_INDEXES, null, this._collectionName, {dbName: this._dbName});
    }

    find(query, {limit, skip, sort, project}={}) {
      const options = {
        limit: limit,
        skip: skip,
        sort: sort,
        project: project
      };
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.FIND, null, this._collectionName, query, {dbName: this._dbName, options: options});
    }

    findOne(query, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.FIND_ONE, null, this._collectionName, query, {dbName: this._dbName, options: options});
    }

    findOneAndDelete(filter, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.FIND_ONE_AND_DELETE, null, this._collectionName, filter, {dbName: this._dbName, options: options});
    }

    findOneAndReplace(filter, replacement, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.FIND_ONE_AND_REPLACE, null, this._collectionName, filter, replacement, {dbName: this._dbName, options: options});
    }

    findOneAndUpdate(filter, update, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.FIND_ONE_AND_UPDATE, null, this._collectionName, filter, update, {dbName: this._dbName, options: options});
    }

    geoNear(x, y, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.GEO_NEAR, null, this._collectionName, x, y, {dbName: this._dbName, options: options});
    }

    indexes() {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.INDEXES, null, this._collectionName, {dbName: this._dbName});
    }

    indexExists(indexes) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.INDEX_EXISTS, null, this._collectionName, indexes, {dbName: this._dbName});
    }

    indexInformation(options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.INDEX_INFORMATION, null, this._collectionName, {dbName: this._dbName, options: options});
    }

    insertMany(docs, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.INSERT_MANY, null, this._collectionName, docs, {dbName: this._dbName, options: options});
    }

    insertOne(doc, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.INSERT_ONE, null, this._collectionName, doc, {dbName: this._dbName, options: options});
    }

    reIndex() {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.RE_INDEX, null, this._collectionName, {dbName: this._dbName});
    }

    replaceOne(filter, doc, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.REPLACE_ONE, null, this._collectionName, filter, doc, {dbName: this._dbName, options: options});
    }

    stats(options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.STATS, null, this._collectionName, {dbName: this._dbName, options: options});
    }

    updateMany(filter, update, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.UPDATE_MANY, null, this._collectionName, filter, update, {dbName: this._dbName, options: options});
    }

    updateOne(filter, update, options) {
      return this._messageCenter.sendRequest(CollectionConstants.REQUEST.UPDATE_ONE, null, this._collectionName, filter, update, {dbName: this._dbName, options: options});
    }
  }

  module.exports=CollectionApi;
})();
