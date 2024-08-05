export interface NavItem {
    icon: string
    text: string
    url: string
}

export interface NavGroup {
    title: string
    items: NavItem[]
}
