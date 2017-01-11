'use strict';
let loopback = require('loopback');
const helpers_1 = require("../../utils/helpers");
const decorated_queue_object_1 = require("../queue/decorated-queue-object");
const messageProducer = require("../queue/message-producer");
let logger = require("../../logger");
/**
 * This method deletes the json content both in postgres and elastic search (through queue). It should be called like this:
 * <pre>
 *    http://localhost:3000/api/Articles/sync/delete/article/100ABCD
 * <pre>
 * @param id defines the object id (i.e., article id)
 * @param index defines the elastic search index where the data will be deleted (i.e., article)
 * @returns {boolean} true if everything is successful
 */
function deleteFromDatabaseAndElastic(id, index) {
    helpers_1.validateIsUndefinedOrNull(id, "id");
    helpers_1.validateIsUndefinedOrNull(index, "index");
    let app = loopback();
    let articleModel = app.registry.getModel('Article');
    articleModel.destroyById(id)
        .then(deleteFromElasticThroughQueue(id, index))
        .catch(function (error) {
        logger.error("Error saving into database, will NOT delete from elastic search.", error);
    });
    return true;
}
function deleteFromElasticThroughQueue(objectId, index) {
    let decoratedQueueObject = new decorated_queue_object_1.DecoratedQueueObject(objectId, null, index, "delete");
    messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}
module.exports = deleteFromDatabaseAndElastic;
//# sourceMappingURL=delete-db-elastic.js.map