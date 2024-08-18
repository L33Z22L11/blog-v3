interface NavItem {
    icon: string
    text: string
    url: string
}

export type Nav = {
    title: string
    items: NavItem[]
}[]
