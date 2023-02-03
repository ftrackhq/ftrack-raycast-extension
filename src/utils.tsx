import { sortBy, sortedUniq } from "lodash";

/**
 * Return *value* as string, joined by separator* if array.
 **
 * @param {string | string[]} arr
 * @returns {string}
 */
function arrayToString(value: string | string[], separator = ", ") {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.join(separator);
}

/**
 *
 * @param {{
 *  entityType: string,
 *  projection: string[],
 *  order: string,
 *  filter: string | string[],
 *  limit: number,
 *  offset: number,
 * }} query
 * @returns
 */
export function buildExpression({
  entityType,
  projection,
  order = "",
  filter = "",
  limit = 0,
  offset = 0,
}: {
  entityType: string;
  projection: string[];
  order?: string;
  filter?: string | string[];
  limit?: number;
  offset?: number;
}) {
  const sortedProjection = sortedUniq(sortBy(projection));
  const projectionsLabel = sortedProjection.join(", ");
  const expression = `select ${projectionsLabel}
            from ${entityType}
            ${filter && `where ${arrayToString(filter, " and ")}`}
            ${order && `order by ${order}`}
            ${offset > 0 ? `offset ${offset}` : ""}
            ${limit > 0 ? `limit ${limit}` : ""}`;
  return expression;
}
