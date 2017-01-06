import client = require('../core/elastic-core');
import {validateIsUndefinedOrNull} from "../../utils/helpers";

export function upsertElasticRecord(index: string, article) {
  validateIsUndefinedOrNull(index, "index");
  validateIsUndefinedOrNull(article, "article");

  return client.index({
    index: index,
    type: index,
    id: article.id,
    body: article.blob
  });
}
