export interface Friend {
    icon: string
    name: string
    title?: string
    desc?: string
    link: string
    comment?: string
}

export interface FriendGroup {
    name: string
    desc?: string
    items: Friend[]
}
