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
  const CollectionMessenger = require('./collection-messenger');
  const BaseHelperApi = global.helper.BaseHelperApi;
  const MongoDB = require('mongodb');
  const ObjectId = MongoDB.ObjectId;

  const COLLECTION_API_FILEPATH = path.resolve(__dirname, './collection-api');
  const DEFAULT_DB_NAME = 'bits';

  class CollectionManager {
    constructor(connectionManager, cursorManager) {
      this._connectionManager = connectionManager;
      this._cursorManager = cursorManager;
      this._messenger = new CollectionMessenger(this);
      this._baseHelperApi = null;
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => {
        this._baseHelperApi = new BaseHelperApi(messageCenter);
      })
      .then(() => this._baseHelperApi.add({name: 'MongodbCollectionApi', filepath: COLLECTION_API_FILEPATH}))
      .then(() => this._messenger.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
      .then(() => this._messenger.unload());
    }

    _getCollection(dbName, collectionName) {
      return Promise.resolve()
      .then(() => this._connectionManager.connect(dbName))
      .then((db) => db.collection(collectionName));
    }

    _convertToObjectIds(obj, {downStreamId=false}={}) {
      if ('object' === typeof(obj) && null !== obj) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
          const isId = downStreamId || '_id' === key;
          if (isId) {
            const value = obj[key];
            const valueType = typeof(value);
            if ('string' === valueType || 'number' === valueType) {
              if (ObjectId.isValid(value)) {
                obj[key] = new ObjectId(value);
              } else {
                // Not a valid ObjectId
              }
            } else if ('object' === valueType && null !== value) {
              this._convertToObjectIds(value, {downStreamId: isId});
            } else {
              // Type that cannot be an ObjectId
            }
          } else {
            // This is not an _id field
          }
        });
      }
    }

    aggregate(collectionName, pipeline, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.aggregate(pipeline, options))
      .then((cursor) => cursor.toArray());
    }

    count(collectionName, query, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(query);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.count(query, options));
    }

    createIndex(collectionName, fieldOrSpec, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.createIndex(fieldOrSpec, options));
    }

    createIndexes(collectionName, indexSpecs, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.createIndexes(indexSpecs, options));
    }

    deleteMany(collectionName, filter, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.deleteMany(filter, options));
    }

    deleteOne(collectionName, filter, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.deleteOne(filter, options));
    }

    distinct(collectionName, key, query, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.distinct(key, query, options));
    }

    drop(collectionName, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.drop(options));
    }

    dropIndex(collectionName, indexName, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.dropIndex(indexName, options));
    }

    dropIndexes(collectionName, {dbName=DEFAULT_DB_NAME}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.dropIndexes());
    }

    find(collectionName, query, {dbName=DEFAULT_DB_NAME, options={}} = {}) {
      this._convertToObjectIds(query);
      return this._getCollection(dbName, collectionName)
      .then((collection) => {
        const cursor = collection.find(query);
        if ('object' === typeof(options.project)) {
          cursor.project(options.project);
        }
        if ('number' === typeof(options.limit)) {
          cursor.limit(options.limit);
        }
        if ('number' === typeof(options.skip)) {
          cursor.skip(options.skip);
        }
        if ('object' === typeof(options.sort) && null !== options.sort) {
          cursor.sort(options.sort);
        }
        return cursor.toArray();
      });
    }

    findOne(collectionName, query, {dbName=DEFAULT_DB_NAME, options} = {}) {
      this._convertToObjectIds(query);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.findOne(query, options));
    }

    findOneAndDelete(collectionName, filter, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.findOneAndDelete(filter, options));
    }

    findOneAndReplace(collectionName, filter, replacement, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.findOneAndReplace(filter, replacement, options));
    }

    findOneAndUpdate(collectionName, filter, update, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.findOneAndUpdate(filter, update, options));
    }

    geoNear(collectionName, x, y, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.geoNear(x, y, options));
    }

    indexes(collectionName, {dbName=DEFAULT_DB_NAME}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.indexes());
    }

    indexExists(collectionName, indexes, {dbName=DEFAULT_DB_NAME} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.indexExists(indexes));
    }

    indexInformation(collectionName, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.indexInformation(options));
    }

    insertMany(collectionName, docs, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.insertMany(docs, options));
    }

    insertOne(collectionName, doc, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.insertOne(doc, options))
      .then((r) => {
        return {
          insertedCount: r.insertedCount,
          ops: r.ops,
          insertedId: r.insertedId,
          result: r.result
        };
      });
    }

    mapReduce(collectionName, map, reduce, {dbName=DEFAULT_DB_NAME, options=null}={}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.mapReduce(map, reduce, options))
      .then((r) => {
        const {out={}} = options;
        const {inline=0} = out;
        if (1 !== inline) {
          return {
            stats: r.stats
          };
        }
        return {
          results: r.results,
          stats: r.stats
        };
      });
    }

    reIndex(collectionName, {dbName=DEFAULT_DB_NAME}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.reIndex());
    }

    replaceOne(collectionName, filter, doc, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.replaceOne(filter, doc, options));
    }

    stats(collectionName, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.stats(options));
    }

    updateMany(collectionName, filter, update, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.updateMany(filter, update, options));
    }

    updateOne(collectionName, filter, update, {dbName=DEFAULT_DB_NAME, options=null} = {}) {
      this._convertToObjectIds(filter);
      return this._getCollection(dbName, collectionName)
      .then((collection) => collection.updateOne(filter, update, options));
    }
  }

  module.exports = CollectionManager;
})();
