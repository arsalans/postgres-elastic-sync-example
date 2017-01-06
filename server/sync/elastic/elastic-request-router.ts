import {upsertElasticRecord} from "./upsert-elastic";
import {deleteElasticRecord} from "./delete-elastic";
let logger = require ("../../logger");

export function elasticRequestRouter(objectId: string, requestType: string, object: Object, index: string) {

  let promise;
  switch (requestType) {
    case "insert":
      promise = upsertElasticRecord(index, object);
      break;
    case "update":
      promise = upsertElasticRecord(index, object);
      break;
    case "delete":
      promise = deleteElasticRecord(index, objectId);
      break;

    default:
      logger.error("Request type of the message %s is not supported, Not inserting in elastic search.", requestType);
  }
  return promise;
}
