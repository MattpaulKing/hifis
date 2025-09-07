import { entityBlockLayoutMetaData } from "$src/schemas";
import { getRequestEvent, query } from "$app/server";
import { tryQuery } from "$src/lib/server/db";

export const entityBlockLayoutMetaDataQuery = query(async () => {
  let { locals: { db } } = getRequestEvent()
  return tryQuery({
    fn: db
      .select({
        entityBlockType: entityBlockLayoutMetaData.entityBlockType,
        minWidthGridUnits: entityBlockLayoutMetaData.minWidthGridUnits,
        minHeightGridUnits: entityBlockLayoutMetaData.minHeightGridUnits,
      })
      .from(entityBlockLayoutMetaData),
    errorMsg: "Something went wrong fetching block layout meta data."
  })
})
