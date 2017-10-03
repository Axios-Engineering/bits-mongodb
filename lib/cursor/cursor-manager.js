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
  const CursorMessenger = require('./cursor-messenger');

  class CursorManager extends EventEmitter {
    constructor() {
      super();
      this._db = new Map();
      this._id = 0;
      this._messenger = new CursorMessenger(this);
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => this._messenger.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
      .then(() => this._messenger.unload())
      .then(() => {
        const chain = [];
        this._db.forEach((data) => {
          const cursor = data.cursor;
          chain.push(cursor.close());
        });
        return Promise.all(chain);
      });
    }

    create(cursor) {
      return Promise.resolve()
      .then(() => {
        const id = this._id++;

        const onClose = () => this._onClose(id);
        const onData = (data) => this._onData(id, data);
        const onEnd = () => this._onEnd(id);
        const onReadable = () => this._onReadable(id);

        const data = {
          cursor: cursor,
          onClose: onClose,
          onData: onData,
          onEnd: onEnd,
          onReadable: onReadable
        };

        cursor.on('close', onClose);
        cursor.on('data', onData);
        cursor.on('end', onEnd);
        cursor.on('readable', onReadable);

        this._db.set(id, data);
        return id;
      });
    }

    _onClose(id) {
      this.emit('close', id);
    }

    _onData(id, data) {
      this.emit('data', id, data);
    }

    _onEnd(id) {
      return this._get(id)
      .then((data) => {
        this._db.delete(id);
        this.emit('end', id);
      });
    }

    _onReadable(id) {
      this.emit('readable', id);
    }

    _get(cursorId) {
      return Promise.resolve()
      .then(() => {
        if (this._db.has(cursorId)) {
          return this._db.get(cursorId);
        } else {
          return Promise.reject(new Error('cursor/not-found'));
        }
      });
    }

    limit(cursorId, value) {
      return this._get(cursorId)
      .then((data) => {
        const cursor = data.cursor;
        cursor.limit(value);
        return cursorId;
      });
    }

    skip(cursorId, value) {
      return this._get(cursorId)
      .then((data) => {
        const cursor = data.cursor;
        cursor.skip(value);
        return cursorId;
      });
    }

    sort(cursorId, keyOrList, direction) {
      return this._get(cursorId)
      .then((data) => {
        const cursor = data.cursor;
        cursor.sort(keyOrList, direction);
        return cursorId;
      });
    }

    toArray(cursorId) {
      return this._get(cursorId)
      .then((data) => {
        const cursor = data.cursor;
        return cursor.toArray();
      });
    }
  }

  module.exports = CursorManager;
})();
