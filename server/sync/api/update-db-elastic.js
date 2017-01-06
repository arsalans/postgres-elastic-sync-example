'use strict';
let loopback = require('loopback');
const helpers_1 = require("../../utils/helpers");
const decorated_queue_object_1 = require("../queue/decorated-queue-object");
const messageProducer = require("../queue/message-producer");
let logger = require("../../logger");
/**
 * This method updates the json content both in postgres and elastic search (through queue). It should be called like this:
 * <pre>
 *    http://localhost:3000/api/Articles/sync/update/article/100ABCD
 *    The article needs to be posted as follows:
 *    {
 *      "id": "100ABCD",
 *      "version": "4",
 *      "blob": {"city": "Mississauga", "name": "Arsalan"}
 *    }
 * <pre>
 * @param id defines the object id (i.e., article id)
 * @param article defines the data in the body of the request as explained above.
 * @param index defines the elastic search index where the data will be updated (i.e., article)
 * @returns {boolean} true if everything is successful
 */
function updateIntoDatabaseAndElastic(id, article, index) {
    helpers_1.validateIsUndefinedOrNull(id, "id");
    helpers_1.validateIsUndefinedOrNull(article, "article");
    helpers_1.validateIsUndefinedOrNull(index, "index");
    let app = loopback();
    let articleModel = app.registry.getModel('Article');
    isVersionCorrect(id, article, articleModel)
        .then(function (versionCorrect) {
        articleModel.update(article)
            .then(updateElasticSearchThroughQueue(id, article, index))
            .catch(function (error) {
            logger.error("Error saving into database, will NOT insert into elastic search.", error);
        });
    }, function (versionInCorrect) {
        logger.error("Version is incorrect, not going to update the database.");
    });
    return true;
}
exports.updateIntoDatabaseAndElastic = updateIntoDatabaseAndElastic;
function isVersionCorrect(objectId, article, articleModel) {
    return new Promise(function (fulfill, reject) {
        articleModel.findById(objectId)
            .then(function (instance) {
            console.log(instance);
            if (Number(article.version) < Number(instance.version)) {
                logger.error("Version %s in the database is more recent than the one passed %s.", article.version, instance.version);
                reject();
            }
            else {
                fulfill();
            }
        })
            .catch(function (error) {
            logger.error("Error found while retrieving the article by ID", error);
        });
    });
}
function updateElasticSearchThroughQueue(objectId, article, index) {
    let decoratedQueueObject = new decorated_queue_object_1.DecoratedQueueObject(objectId, article, index, "update");
    messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}
//# sourceMappingURL=update-db-elastic.js.map