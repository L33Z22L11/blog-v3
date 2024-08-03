export interface NavItem {
    icon: string
    title: string
    link: string
    external?: boolean
}

export interface NavGroup {
    title: string
    list: NavItem[]
}
