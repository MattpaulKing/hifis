import type { ParamMatcher } from '@sveltejs/kit';
const uuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

export const match: ParamMatcher = (param) => {
  return uuidRegex.test(param)
}
