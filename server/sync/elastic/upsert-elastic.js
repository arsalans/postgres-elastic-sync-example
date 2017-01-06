"use strict";
const client = require('../core/elastic-core');
const helpers_1 = require("../../utils/helpers");
function upsertElasticRecord(index, article) {
    helpers_1.validateIsUndefinedOrNull(index, "index");
    helpers_1.validateIsUndefinedOrNull(article, "article");
    return client.index({
        index: index,
        type: index,
        id: article.id,
        body: article.blob
    });
}
exports.upsertElasticRecord = upsertElasticRecord;
//# sourceMappingURL=upsert-elastic.js.map