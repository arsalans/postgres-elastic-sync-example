"use strict";
const upsert_elastic_1 = require("./upsert-elastic");
const delete_elastic_1 = require("./delete-elastic");
let logger = require("../../logger");
function elasticRequestRouter(objectId, requestType, object, index) {
    let promise;
    switch (requestType) {
        case "insert":
            promise = upsert_elastic_1.upsertElasticRecord(index, object);
            break;
        case "update":
            promise = upsert_elastic_1.upsertElasticRecord(index, object);
            break;
        case "delete":
            promise = delete_elastic_1.deleteElasticRecord(index, objectId);
            break;
        default:
            logger.error("Request type of the message %s is not supported, Not inserting in elastic search.", requestType);
    }
    return promise;
}
exports.elasticRequestRouter = elasticRequestRouter;
//# sourceMappingURL=elastic-request-router.js.map