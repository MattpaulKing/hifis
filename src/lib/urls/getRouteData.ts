import { goto, preloadData, pushState } from "$app/navigation";
import resolveURL from "./resolveURL";

export default async function(route: string) {
  const result = await preloadData(route);
  let url = resolveURL(route)
  url.searchParams.set("modal", "true")
  if (result.type === 'loaded' && result.status === 200) {
    const { supabase, ...data } = result.data;
    pushState(url, data);
    return data;
  } else {
    goto(route);
  }
}
