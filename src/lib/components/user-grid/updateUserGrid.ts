import { route } from "$lib/ROUTES";
import type { GridItemState } from "$lib/interfaces/Grid";

export default async function(gridItemState: GridItemState[]) {
  let req = await fetch(route('POST /api/v1/grid'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gridItemState)
  });
  return req
}
