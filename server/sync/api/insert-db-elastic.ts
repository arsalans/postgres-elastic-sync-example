'use strict';

let loopback = require('loopback');
import {validateIsUndefinedOrNull} from "../../utils/helpers";
import {DecoratedQueueObject} from "../queue/decorated-queue-object";
import messageProducer = require ("../queue/message-producer");
let logger = require ("../../logger");

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
export function insertIntoDatabaseAndElastic(id: string, article, index: string): boolean {
  validateIsUndefinedOrNull(id, "id");
  validateIsUndefinedOrNull(article, "article");
  validateIsUndefinedOrNull(index, "index");

  let app = loopback();
  let articleModel = app.registry.getModel('Article');

  articleModel.create(article)
    .then(insertIntoElasticSearchThroughQueue(id, article, index))
    .catch(function (error) {
      logger.error("Error saving into database, will NOT insert into elastic search.", error);
    });

  return false;
}

function insertIntoElasticSearchThroughQueue(objectId: string, article: Object, index: string) {
  let decoratedQueueObject = new DecoratedQueueObject(objectId, article, index, "insert");
  messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}
