'use strict';
let loopback = require('loopback');
const helpers_1 = require("../../utils/helpers");
const decorated_queue_object_1 = require("../queue/decorated-queue-object");
const messageProducer = require("../queue/message-producer");
let logger = require("../../logger");
/**
 * This method inserts the json content both in postgres and elastic search (through queue). It should be called like this:
 * <pre>
 *    http://localhost:3000/api/Articles/sync/insert/article/100ABCD
 *    The article needs to be posted as follows:
 *    {
 *      "id": "100ABCD",
 *      "version": "4",
 *      "blob": {"city": "Mississauga", "name": "Arsalan"}
 *    }
 * <pre>
 * @param id defines the object id (i.e., article id)
 * @param article defines the data in the body of the request as explained above.
 * @param index defines the elastic search index where the data will be inserted (i.e., article)
 * @returns {boolean} true if everything is successful
 */
function insertIntoDatabaseAndElastic(id, article, index) {
    helpers_1.validateIsUndefinedOrNull(id, "id");
    helpers_1.validateIsUndefinedOrNull(article, "article");
    helpers_1.validateIsUndefinedOrNull(index, "index");
    let app = loopback();
    let articleModel = app.registry.getModel('Article');
    articleModel.create(article)
        .then(insertIntoElasticSearchThroughQueue(id, article, index))
        .catch(function (error) {
        logger.error("Error saving into database, will NOT insert into elastic search.", error);
    });
    return false;
}
function insertIntoElasticSearchThroughQueue(objectId, article, index) {
    let decoratedQueueObject = new decorated_queue_object_1.DecoratedQueueObject(objectId, article, index, "insert");
    messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}
module.exports = insertIntoDatabaseAndElastic;
//# sourceMappingURL=insert-db-elastic.js.map