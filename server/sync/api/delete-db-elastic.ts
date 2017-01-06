'use strict';

let loopback = require('loopback');
import {validateIsUndefinedOrNull} from "../../utils/helpers";
import {DecoratedQueueObject} from "../queue/decorated-queue-object";
import messageProducer = require ("../queue/message-producer");
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
export function deleteFromDatabaseAndElastic(id: string, index: string): boolean {
  validateIsUndefinedOrNull(id, "id");
  validateIsUndefinedOrNull(index, "index");

  let app = loopback();
  let articleModel = app.registry.getModel('Article');

  articleModel.destroyById(id)
    .then(deleteFromElasticThroughQueue(id, index))
    .catch(function (error) {
      logger.error("Error saving into database, will NOT delete from elastic search.", error);
    });

  return true;
}

function deleteFromElasticThroughQueue(objectId: string, index: string) {
  let decoratedQueueObject = new DecoratedQueueObject(objectId, null, index, "delete");
  messageProducer.sendMessageToDefaultQueue(JSON.stringify(decoratedQueueObject));
}
