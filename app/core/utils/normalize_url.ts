export function normalizeUrl(url: string): string {
  let normalizedUrl = ''

  if (!url.includes('https://') && !url.includes('http://')) {
    normalizedUrl = `https://${url}`
  } else if (url.includes('http://')) {
    const onlyUrl = url.slice(6)
    normalizedUrl = `https://${onlyUrl}`
  } else {
    normalizedUrl = url
  }

  return normalizedUrl
}
