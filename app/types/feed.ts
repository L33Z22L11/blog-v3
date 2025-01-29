export interface FeedEntry {
    /** 博客作者 */
    author: string
    /** 网站趣称 */
    sitenick?: string
    /** 博客网站标题，允许长标题，用于订阅源，为空则使用网站趣称或作者名 */
    title?: string
    /** 个人简介/博客描述 */
    desc?: string
    /** 博客地址 */
    link: string
    /** 订阅源 */
    feed?: string
    /** 站点小图标 */
    icon: string
    /** 个人头像，为空则使用站点图标 */
    avatar: string
    /** 博客技术架构 */
    archs?: Arch[]
    /** 订阅日期 */
    date: string
    /** 博主备注 */
    comment?: string
    /** 错误信息 */
    error?: string
}

export interface FeedGroup {
    /** 分组名 */
    name: string
    /** 描述 */
    desc?: string
    /** 友链列表 */
    entries: FeedEntry[]
}
