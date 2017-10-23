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

  const PREFIX = 'mongodb#Collection ';
  const CollectionConstants = {
    REQUEST: {
      AGGREGATE: PREFIX + 'aggregate',
      COUNT: PREFIX + 'count',
      CREATE_INDEX: PREFIX + 'createIndex',
      CREATE_INDEXES: PREFIX + 'createIndexes',
      DELETE_MANY: PREFIX + 'deleteMany',
      DELETE_ONE: PREFIX + 'deleteOne',
      DISTINCT: PREFIX + 'distinct',
      DROP: PREFIX + 'drop',
      DROP_INDEX: PREFIX + 'dropIndex',
      DROP_INDEXES: PREFIX + 'dropIndexes',
      FIND: PREFIX + 'find',
      FIND_ONE: PREFIX + 'findOne',
      FIND_ONE_AND_DELETE: PREFIX + 'findOneAndDelete',
      FIND_ONE_AND_REPLACE: PREFIX + 'findOneAndReplace',
      FIND_ONE_AND_UPDATE: PREFIX + 'findOneAndUpdate',
      GEO_NEAR: PREFIX + 'geoNear',
      INDEXES: PREFIX + 'indexes',
      INDEX_EXISTS: PREFIX + 'indexExists',
      INDEX_INFORMATION: PREFIX + 'indexInformation',
      INSERT_MANY: PREFIX + 'insertMany',
      INSERT_ONE: PREFIX + 'insertOne',
      MAP_REDUCE: PREFIX + 'mapReduce',
      RE_INDEX: PREFIX + 'reIndex',
      REPLACE_ONE: PREFIX + 'replaceOne',
      STATS: PREFIX + 'stats',
      UPDATE_MANY: PREFIX + 'updateMany',
      UPDATE_ONE: PREFIX + 'updateOne'
    }
  };

  module.exports = CollectionConstants;
})();
