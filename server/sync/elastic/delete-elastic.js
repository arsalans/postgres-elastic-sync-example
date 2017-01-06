"use strict";
const client = require('../core/elastic-core');
const helpers_1 = require("../../utils/helpers");
function deleteElasticRecord(index, id) {
    helpers_1.validateIsUndefinedOrNull(index, "index");
    helpers_1.validateIsUndefinedOrNull(id, "id");
    return client.delete({
        index: index,
        type: index,
        id: id,
    });
}
exports.deleteElasticRecord = deleteElasticRecord;
//# sourceMappingURL=delete-elastic.js.map