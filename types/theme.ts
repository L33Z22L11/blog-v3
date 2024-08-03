export type ThemeType = 'system' | 'light' | 'dark'
export type Themes = Record<ThemeType, {
    icon: string
    tip: string
}>
