let insertInDatabaseAndElastic = require('../sync/api/insert-db-elastic');
let updateInDatabaseAndElastic = require('../sync/api/update-db-elastic');
let deleteFromDatabaseAndElastic = require('../sync/api/delete-db-elastic');

module.exports = function (Article) {

  Article.insertInDatabaseAndElastic = function (id, article, index, cb) {
    cb(null, insertInDatabaseAndElastic(id, article, index));
  };

  Article.remoteMethod('insertInDatabaseAndElastic', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'article', type: 'object', http: {source: 'body'}},
      {arg: 'index', type: 'string'}
    ],
    returns: {arg: 'confirmation', type: 'string'},
    http: {path: '/sync/insert/:index/:id', verb: 'post'}
  });

  Article.updateInDatabaseAndElastic = function (id, article, index, cb) {
    cb(null, updateInDatabaseAndElastic(id, article, index));
  };

  Article.remoteMethod('updateInDatabaseAndElastic', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'article', type: 'object', http: {source: 'body'}},
      {arg: 'index', type: 'string'}
    ],
    returns: {arg: 'confirmation', type: 'string'},
    http: {path: '/sync/update/:index/:id', verb: 'post'}
  });

  Article.deleteFromDatabaseAndElastic = function (id, index, cb) {
    cb(null, deleteFromDatabaseAndElastic(id, index));
  };

  Article.remoteMethod('deleteFromDatabaseAndElastic', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'index', type: 'string'}
    ],
    returns: {arg: 'confirmation', type: 'string'},
    http: {path: '/sync/delete/:index/:id', verb: 'post'}
  });

};

