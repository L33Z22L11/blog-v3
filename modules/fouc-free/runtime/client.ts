export default (storageKey: string) => {
	const toKebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
	const raw = localStorage.getItem(storageKey)
	if (!raw)
		return
	try {
		const perferences = JSON.parse(raw)
		for (const key in perferences) {
			document.documentElement.style.setProperty(`--${toKebab(key)}`, perferences[key])
		}
	}
	catch {}
}
