export interface FeedEntry {
	/** 博客作者，使用作者明确的自称 */
	author: string
	/** 友链卡片的作者名后缀；作者自称明确且较短时，可填简短站名，避免重复作者名 */
	sitenick?: string
	/** 悬浮卡片与订阅源使用的完整站点标题；与作者名相同时省略，默认使用 sitenick 或 author */
	title?: string
	/** 个人简介/博客描述 */
	desc?: string
	/** 博客地址 */
	link: string
	/** 订阅源 */
	feed?: string
	/** 站点小图标 */
	icon: string
	/** 个人头像 */
	avatar: string
	/** 博客技术架构 */
	archs?: Arch[]
	/** 申请/评论日期；主动收录时使用收录日期 */
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
