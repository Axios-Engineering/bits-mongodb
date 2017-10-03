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

  class CursorApi {
    static get SCOPES() {
      return null;
    }
    static get TAG() {
      return 'mongodb#Cursor';
    }

    static get REQUEST() {
      return {
        LIMIT: `${CursorApi.TAG} limit`,
        SKIP: `${CursorApi.TAG} skip`,
        SORT: `${CursorApi.TAG} sort`,
        TO_ARRAY: `${CursorApi.TAG} toArray`
      };
    }

    static get EVENT() {
      return {
        CLOSE: `${CursorApi.TAG} close`,
        DATA: `${CursorApi.TAG} data`,
        END: `${CursorApi.TAG} end`,
        READABLE: `${CursorApi.TAG} readable`
      };
    }

    constructor(messageCenter, cursorId) {
      this._messageCenter = messageCenter;
      this._cursorId = cursorId;
      this._chain = Promise.resolve();
    }

    limit(value) {
      this._chain = this._chain.then(() => {
        return this._messageCenter.sendRequest(CursorApi.REQUEST.LIMIT,
          {scopes: CursorApi.SCOPES}, this._cursorId, value);
      });
      return this;
    }

    skip(value) {
      this._chain = this._chain.then(() => {
        return this._messageCenter.sendRequest(CursorApi.REQUEST.SKIP,
          {scopes: CursorApi.SCOPES}, this._cursorId, value);
      });
      return this;
    }

    sort(keyOrList, direction) {
      this._chain = this._chain.then(() => {
        return this._messageCenter.sendRequest(CursorApi.REQUEST.SORT,
          {scopes: CursorApi.SCOPES}, this._cursorId, keyOrList, direction);
      });
      return this;
    }

    toArray() {
      return this._chain.then(() => {
        return this._messageCenter.sendRequest(CursorApi.REQUEST.TO_ARRAY,
          {scopes: CursorApi.SCOPES}, this._cursorId);
      });
    }

    addCloseListener(listener) {
      return this._messageCenter.addEventListener(CursorApi.EVENT.CLOSE,
        {scopes: CursorApi.SCOPES}, listener);
    }

    removeCloseListener(listener) {
      return this._messageCenter.removeEventListener(CursorApi.EVENT.CLOSE,
        {scopes: CursorApi.SCOPES}, listener);
    }

    addDataListener(listener) {
      return this._messageCenter.addEventListener(CursorApi.EVENT.DATA,
        {scopes: CursorApi.SCOPES}, listener);
    }

    removeDataListener(listener) {
      return this._messageCenter.removeEventListener(CursorApi.EVENT.DATA,
        {scopes: CursorApi.SCOPES}, listener);
    }

    addEndListener(listener) {
      return this._messageCenter.addEventListener(CursorApi.EVENT.END,
        {scopes: CursorApi.SCOPES}, listener);
    }

    removeEndListener(listener) {
      return this._messageCenter.removeEventListener(CursorApi.EVENT.END,
        {scopes: CursorApi.SCOPES}, listener);
    }

    addReadableListener(listener) {
      return this._messageCenter.addEventListener(CursorApi.EVENT.READABLE,
        {scopes: CursorApi.SCOPES}, listener);
    }

    removeReadableListener(listener) {
      return this._messageCenter.removeEventListener(CursorApi.EVENT.READABLE,
        {scopes: CursorApi.SCOPES}, listener);
    }
  }

  module.exports = CursorApi;
})();
