export default defineNuxtPlugin(() => {
	const dir = useTextDirection()
	const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
	let currentStep = 0

	useEventListener('keydown', ({ code }) => {
		if (code !== konamiCode[currentStep]) {
			currentStep = code === konamiCode[0] ? 1 : 0
			return
		}

		currentStep++

		if (currentStep === konamiCode.length) {
			dir.value = dir.value === 'ltr' ? 'rtl' : 'ltr'
			currentStep = 0
		}
	})
})
