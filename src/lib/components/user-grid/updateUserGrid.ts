import { route } from "$lib/ROUTES";
import type { LayoutItem } from "./types";

export default async function(gridItemState: LayoutItem[]) {
  let req = await fetch(route(''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gridItemState)
  });
  return req
}
