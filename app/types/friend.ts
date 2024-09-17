export interface Friend {
    /** 昵称/博客名称，昵称优先 */
    name: string
    /** 头衔 */
    title?: string
    /** 个人简介/博客描述，显示在悬浮窗中 */
    desc?: string
    /** 博客地址 */
    link: string
    /** 头像/站点图标 */
    icon: string
    /** 博客技术架构 */
    archs?: Arch[]
    /** 友链添加日期 */
    date: string
    /** 博主备注 */
    comment?: string
}

export interface FriendGroup {
    /** 分组名 */
    name: string
    /** 描述 */
    desc?: string
    /** 友链列表 */
    items: Friend[]
}
