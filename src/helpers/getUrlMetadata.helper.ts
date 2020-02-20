import urlMetadata = require('url-metadata');

export function getUrlMetadataHelper(url: string): Promise<any> {
  const decodedURI = decodeSafeUrl(addhttp(url));
  return urlMetadata(decodedURI);
}

function decodeSafeUrl(value: string): string {
  return decodeURI(value);
}

function addhttp(url: string): string {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'http://' + url;
  }
  return url;
}
