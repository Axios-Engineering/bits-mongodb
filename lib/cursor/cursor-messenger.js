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
  const CursorApi = require('./cursor-api');

  class CursorMessenger extends Messenger {
    constructor(manager) {
      super();
      this._manager = manager;
      this.addRequestListener(CursorApi.REQUEST.LIMIT, CursorApi.SCOPES, this._limit.bind(this));
      this.addRequestListener(CursorApi.REQUEST.SKIP, CursorApi.SCOPES, this._skip.bind(this));
      this.addRequestListener(CursorApi.REQUEST.SORT, CursorApi.SCOPES, this._sort.bind(this));
      this.addRequestListener(CursorApi.REQUEST.TO_ARRAY, CursorApi.SCOPES, this._toArray.bind(this));
      this.addEmitterEventListener(this._manager, 'close', this._onClose.bind(this));
      this.addEmitterEventListener(this._manager, 'data', this._onData.bind(this));
      this.addEmitterEventListener(this._manager, 'end', this._onEnd.bind(this));
      this.addEmitterEventListener(this._manager, 'readable', this._onReadable.bind(this));
    }

    _limit(cursorId, value) {
      return this._manager.limit(cursorId, value);
    }

    _skip(cursorId, value) {
      return this._manager.skip(cursorId, value);
    }

    _sort(cursorId, keyOrList, direction) {
      return this._manager.sort(cursorId, keyOrList, direction);
    }

    _toArray(cursorId) {
      return this._manager.toArray(cursorId);
    }

    _onClose(id) {
      this.sendEvent(CursorApi.EVENT.CLOSE, {scopes: CursorApi.SCOPES}, id);
    }

    _onData(id, data) {
      this.sendEvent(CursorApi.EVENT.DATA, {scopes: CursorApi.SCOPES}, id, data);
    }

    _onEnd(id) {
      this.sendEvent(CursorApi.EVENT.END, {scopes: CursorApi.SCOPES}, id);
    }

    _onReadable(id) {
      this.sendEvent(CursorApi.EVENT.READABLE, {scopes: CursorApi.SCOPES}, id);
    }
  }

  module.exports = CursorMessenger;
})();
