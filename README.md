## MongoDB
A thin wrapper for the [MongoDB Nodejs](https://mongodb.github.io/node-mongodb-native/) driver.

### Installation
This module requires the latest available mongodb. Instructions to install the latest are available [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). This gist of guide boils down to these commands:

``` Bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
# Ubuntu 14.04
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
# Ubuntu 16.04
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### API
See `./lib/messengers/collection-api.js`
