export interface NavItem {
	icon: string
	text: string
	url: string
	external?: boolean
}

export type Nav = {
	title: string
	items: NavItem[]
}[]
