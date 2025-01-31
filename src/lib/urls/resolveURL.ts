export default function(url: URL | string) {
  if (url instanceof URL) return url;

  let baseURI = document.baseURI;

  if (!baseURI) {
    const baseTags = document.getElementsByTagName('base');
    baseURI = baseTags.length ? baseTags[0].href : document.URL;
  }

  return new URL(url, baseURI);
}
