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

  const Messenger = global.helper.Messenger;

  const SCOPES = null;
  const CollectionConstants = require('./collection-constants');

  function createPassThrough(manager, methodName) {
    return function(metadata, ...data) {
      return manager[methodName](...data);
    };
  }

  class CollectionMessenger extends Messenger {
    constructor(manager) {
      super();
      this._manager = manager;
      this.addRequestListener(CollectionConstants.REQUEST.AGGREGATE, SCOPES, createPassThrough(manager, 'aggregate'));
      this.addRequestListener(CollectionConstants.REQUEST.COUNT, SCOPES, createPassThrough(manager, 'count'));
      this.addRequestListener(CollectionConstants.REQUEST.CREATE_INDEX, SCOPES, createPassThrough(manager, 'createIndex'));
      this.addRequestListener(CollectionConstants.REQUEST.CREATE_INDEXES, SCOPES, createPassThrough(manager, 'createIndexes'));
      this.addRequestListener(CollectionConstants.REQUEST.DELETE_MANY, SCOPES, createPassThrough(manager, 'deleteMany'));
      this.addRequestListener(CollectionConstants.REQUEST.DELETE_ONE, SCOPES, createPassThrough(manager, 'deleteOne'));
      this.addRequestListener(CollectionConstants.REQUEST.DISTINCT, SCOPES, createPassThrough(manager, 'distinct'));
      this.addRequestListener(CollectionConstants.REQUEST.DROP, SCOPES, createPassThrough(manager, 'drop'));
      this.addRequestListener(CollectionConstants.REQUEST.DROP_INDEX, SCOPES, createPassThrough(manager, 'dropIndex'));
      this.addRequestListener(CollectionConstants.REQUEST.DROP_INDEXES, SCOPES, createPassThrough(manager, 'dropIndexes'));
      this.addRequestListener(CollectionConstants.REQUEST.FIND, SCOPES, createPassThrough(manager, 'find'));
      this.addRequestListener(CollectionConstants.REQUEST.FIND_ONE, SCOPES, createPassThrough(manager, 'findOne'));
      this.addRequestListener(CollectionConstants.REQUEST.FIND_ONE_AND_DELETE, SCOPES, createPassThrough(manager, 'findOneAndDelete'));
      this.addRequestListener(CollectionConstants.REQUEST.FIND_ONE_AND_REPLACE, SCOPES, createPassThrough(manager, 'findOneAndReplace'));
      this.addRequestListener(CollectionConstants.REQUEST.FIND_ONE_AND_UPDATE, SCOPES, createPassThrough(manager, 'findOneAndUpdate'));
      this.addRequestListener(CollectionConstants.REQUEST.GEO_NEAR, SCOPES, createPassThrough(manager, 'geoNear'));
      this.addRequestListener(CollectionConstants.REQUEST.INDEXES, SCOPES, createPassThrough(manager, 'indexes'));
      this.addRequestListener(CollectionConstants.REQUEST.INDEX_EXISTS, SCOPES, createPassThrough(manager, 'indexExists'));
      this.addRequestListener(CollectionConstants.REQUEST.INDEX_INFORMATION, SCOPES, createPassThrough(manager, 'indexInformation'));
      this.addRequestListener(CollectionConstants.REQUEST.INSERT_MANY, SCOPES, createPassThrough(manager, 'insertMany'));
      this.addRequestListener(CollectionConstants.REQUEST.INSERT_ONE, SCOPES, createPassThrough(manager, 'insertOne'));
      this.addRequestListener(CollectionConstants.REQUEST.RE_INDEX, SCOPES, createPassThrough(manager, 'reIndex'));
      this.addRequestListener(CollectionConstants.REQUEST.REPLACE_ONE, SCOPES, createPassThrough(manager, 'replaceOne'));
      this.addRequestListener(CollectionConstants.REQUEST.STATS, SCOPES, createPassThrough(manager, 'stats'));
      this.addRequestListener(CollectionConstants.REQUEST.UPDATE_MANY, SCOPES, createPassThrough(manager, 'updateMany'));
      this.addRequestListener(CollectionConstants.REQUEST.UPDATE_ONE, SCOPES, createPassThrough(manager, 'updateOne'));
    }
  }

  module.exports = CollectionMessenger;
})();
