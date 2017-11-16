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

  const Daemon = global.helper.Daemon;
  const UtilFs = global.utils.fs;
  const path = require('path');
  const MongoDB = require('mongodb');
  const MongoClient = MongoDB.MongoClient;
  const logger = global.LoggerFactory.getLogger();
  const BaseModuleApi = global.helper.BaseModuleApi;
  const BaseActivityApi = global.helper.BaseActivityApi;

  const RECONNECT_TIMEOUT_MS = 1000;
  const RESTART_TIMEOUT = 5000;
  const RETRY_ATTEMPTS = 4;

  class MongodManager {
    constructor() {
      this._daemon = null;
      this._messageCenter = null;
      this._dataDir = null;
      this._dbpath = null;
      this._logpath = null;
      this._started = null;
      this._baseModuleApi = null;

      this._errorRetries = 0;
      this._timeout = null;

      this._boundOnClose = this._onClose.bind(this);
      this._boundOnError = this._onError.bind(this);
      this._boundOnStdout = this._onStdout.bind(this);
      this._boundOnStderr = this._onStderr.bind(this);
    }

    _ensureDirectoryExists(dirpath) {
      return UtilFs.mkdir(dirpath)
        .catch((err) => {
          if ('EEXIST' !== err.code) {
            throw err;
          }
        });
    }

    _createFilepaths() {
      return Promise.resolve()
        .then(() => this._baseModuleApi.getDataDirectory('mongodb'))
        .then((dirpath) => {
          this._dataDir = dirpath;
          this._dbpath = path.resolve(this._dataDir, 'db');
          this._logpath = path.resolve(this._dataDir, 'mongod.log');
          return this._ensureDirectoryExists(this._dbpath);
        });
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          this._messageCenter = messageCenter;
          this._baseModuleApi = new BaseModuleApi(messageCenter);
          this._baseActivityApi = new BaseActivityApi(messageCenter);
        })
        .then(() => this._createFilepaths())
        .then(() => {
          this._daemon = new Daemon('mongod', [
            '--journal', '--logappend',
            '--bind_ip', '127.0.0.1',
            '--dbpath', this._dbpath,
            '--logpath', this._logpath
          ], {
            restart: true
          });
          this._daemon.on('stdout', this._boundOnStdout);
          this._daemon.on('stderr', this._boundOnStderr);
          this._daemon.on('error', this._boundOnError);
          this._daemon.on('close', this._boundOnClose);
          return this._daemon.start();
        });
    }

    unload() {
      return Promise.resolve()
        .then(() => this._shutdown())
        .then(() => {
          clearTimeout(this._timeout);
          this._baseModuleApi = null;
          this._messageCenter = null;
          this._dataDir = null;
          this._dbpath = null;
          this._logpath = null;
        });
    }

    _shutdown() {
      return Promise.resolve()
        .then(() => {
          if (null !== this._daemon) {
            return Promise.resolve()
              .then(() => {
                this._daemon.removeListener('stdout', this._boundOnStdout);
                this._daemon.removeListener('stderr', this._boundOnStderr);
                this._daemon.removeListener('error', this._boundOnError);
                this._daemon.removeListener('close', this._boundOnClose);
              })
              .then(() => this._daemon.shutdown())
              .catch((err) => {
                logger.error('A critical error while trying to shutdown', err);
              })
              .then(() => {
                this._daemon = null;
              });
          }
        });
    }

    waitUntilStarted() {
      if (null === this._started) {
        this._started = this._attemptConnect();
      }
      return this._started;
    }

    _attemptConnect() {
      const url = 'mongodb://127.0.0.1:27017/mongodb';
      return MongoClient.connect(url)
        .catch((err) => {
          return new Promise((resolve) => setTimeout(resolve, RECONNECT_TIMEOUT_MS))
            .then(() => this._attemptConnect());
        });
    }

    _onClose(code) {
      logger.error('Mongo closed with exit code', code);
    }
    _onError(err) {
      logger.error('Error with Mongo', err);

      this._errorRetries += 1;
      if (this._errorRetries > RETRY_ATTEMPTS) {
        // Create a base error and close out
        clearTimeout(this._timeout);
        return this._shutdown()
          .catch((err) => {
            logger.error('Could not properly recover from a critical error', err);
          })
          .then(() => {
            return this._baseActivityApi.create({
              title: `Mongo Database has had too many critical errors. Please reboot.`,
              projectName: 'Mongodb',
              icon: 'icons:error',
              elementContent: null,
              elementImport: null,
              data: null,
            });
          });
      }

      if (!this._timeout) {
        this._timeout = setTimeout(() => {
          this._timeout = null;
          this._errorRetries = 0;
        }, RESTART_TIMEOUT);
      }
    }
    _onStderr(data) {
      const lines = data.toString().split('\n');
      lines.forEach((line) => logger.warn(`mongod: ${line}`));
    }
    _onStdout(data) {
      const lines = data.toString().split('\n');
      lines.forEach((line) => logger.silly(`mongod: ${line}`));
    }
  }

  module.exports = MongodManager;
})();
