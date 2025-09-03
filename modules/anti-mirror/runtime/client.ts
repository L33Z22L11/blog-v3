export default (sourcesEncoded: string[], targetEncoded: string) => {
	const sources = sourcesEncoded.map(atob)
	const target = atob(targetEncoded)
	const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
	const isBadMirror = sources.some(domain => location.hostname.endsWith(domain))
	if (isBadMirror) {
		if (canonical)
			canonical.href = canonical.href.replace(location.host, target)
		location.host = target
	}
}
