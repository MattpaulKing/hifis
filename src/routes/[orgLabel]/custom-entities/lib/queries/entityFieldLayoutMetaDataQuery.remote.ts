import { entityFieldLayoutMetaData } from "$src/schemas";
import { getRequestEvent, query } from "$app/server";
import { tryQuery } from "$src/lib/server/db";

export const entityFieldLayoutMetaDataQuery = query(async () => {
  let { locals: { db } } = getRequestEvent()
  return tryQuery({
    fn: db
      .select({
        entityFieldType: entityFieldLayoutMetaData.entityFieldType,
        minWidthGridUnits: entityFieldLayoutMetaData.minWidthGridUnits,
        minHeightGridUnits: entityFieldLayoutMetaData.minHeightGridUnits,
      })
      .from(entityFieldLayoutMetaData),
    errorMsg: "Something went wrong fetching field layout meta data."
  })
})
