const sqlite3 = require('sqlite3');
const Promise = require('bluebird');
var logger = require('./logger.js');


class appDAO {
  constructor(dbFilePath){
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if(err){
        logger.printWriteLine('Could not connect to database: ' + err, 1);
      }
      else{
        logger.printWriteLine('Database connection successful', 0);
      }
    });
  }
}

module.exports = appDAO;
