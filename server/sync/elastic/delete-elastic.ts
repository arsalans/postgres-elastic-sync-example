import client = require('../core/elastic-core');
import {validateIsUndefinedOrNull} from "../../utils/helpers";

export function deleteElasticRecord(index: string, id: string) {
  validateIsUndefinedOrNull(index, "index");
  validateIsUndefinedOrNull(id, "id");

  return client.delete({
    index: index,
    type: index,
    id: id,
  });

}
