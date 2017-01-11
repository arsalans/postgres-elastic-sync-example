'use strict';

let loopback = require('loopback');
import {validateIsUndefinedOrNull} from "../../utils/helpers";
import {DecoratedQueueObject} from "../queue/decorated-queue-object";
import messageProducer = require ("../queue/message-producer");
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
export function updateIntoDatabaseAndElastic(id: string, article, index: string): boolean {
  validateIsUndefinedOrNull(id, "id");
  validateIsUndefinedOrNull(article, "article");
  validateIsUndefinedOrNull(index, "index");

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
      logger.error("Version is incorrect, not going to update the database.")
    });

  return true;
}

function isVersionCorrect(objectId: string, article, articleModel) {
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

function updateElasticSearchThroughQueue(objectId: string, article: Object, index: string) {
  let decoratedQueueObject = new DecoratedQueueObject(objectId, article, index, "update");
  messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}

module.exports = updateIntoDatabaseAndElastic;
