/* eslint-disable test/no-import-node-test -- Use Node's built-in runner without adding a test framework. */
import assert from 'node:assert/strict'
import test from 'node:test'
import { parseCssTime } from '../app/utils/anim'
import blogConfig from '../blog.config'
import {
	getDomain,
	getGithubUsername,
	getMainDomain,
	isExtLink,
	normalizeContentPath,
	safelyDecodeUriComponent,
} from '../shared/utils/link'
import { formatBytes, getPromptLanguage, highlightHtml, removeHtmlTags } from '../shared/utils/str'
import { isSameUnit, isTimeDiffSignificant, toZonedTemporal } from '../shared/utils/time'

test('shared/utils/link normalizes paths, extracts domains/usernames, and handles bad URI encodings', () => {
	assert.equal(normalizeContentPath('/'), '/')
	assert.equal(normalizeContentPath('/posts/hello///'), '/posts/hello')

	assert.equal(getDomain('https://blog.zhilu.site/2025/a'), 'blog.zhilu.site')
	assert.equal(getMainDomain('https://a.b.github.io/'), 'b.github.io')
	assert.equal(getMainDomain('https://a.b.github.io/', true), 'github.io')
	assert.equal(getGithubUsername('https://github.com/L33Z22L11/blog-v3'), 'L33Z22L11')
	assert.equal(getGithubUsername('https://example.com/user'), '')

	assert.equal(isExtLink('https://example.com'), true)
	assert.equal(isExtLink('/avatar.png'), true)
	assert.equal(isExtLink('/posts/hello'), false)

	assert.equal(safelyDecodeUriComponent('%E4%B8%AD%E6%96%87'), '中文')
	assert.equal(safelyDecodeUriComponent('%E0%A4%A'), '%E0%A4%A')
})

test('shared/utils/str escapes HTML, highlights special-char terms, and formats sizes/prompts', () => {
	assert.equal(
		highlightHtml('<script>C++ & Next.js\nline2</script>', ['C++', 'Next.js'], 'hl'),
		'&lt;script&gt;<mark class="hl">C++</mark> &amp; <mark class="hl">Next.js</mark><br>line2&lt;/script&gt;',
	)
	assert.equal(removeHtmlTags('<p>Hello <b>World</b></p>'), 'Hello World')
	assert.equal(formatBytes(0), '0 Bytes')
	assert.equal(formatBytes(1536), '1.5 KiB')
	assert.equal(getPromptLanguage('$ pnpm test'), 'sh')
	assert.equal(getPromptLanguage(false), 'text')
})

test('shared/utils/time parses zoned/instant/plain timestamps and compares units', () => {
	assert.equal(toZonedTemporal('2026-01-01T12:00:00+09:00[Asia/Tokyo]').timeZoneId, 'Asia/Tokyo')
	assert.equal(toZonedTemporal('2026-01-01T04:00:00Z').timeZoneId, blogConfig.timeZone)
	assert.equal(toZonedTemporal('2026-01-01 12:00:00').timeZoneId, blogConfig.timeZone)

	assert.equal(isSameUnit('2026-05-01', '2026-05-20', 'month'), true)
	assert.equal(isSameUnit('2026-05-01', '2026-06-01', 'month'), false)
	assert.equal(isTimeDiffSignificant('2020-01-01', '2026-01-01', 0.6), true)
	assert.equal(isTimeDiffSignificant('invalid', '2026-01-01', 0.6), true)
})

test('app/utils/anim parseCssTime converts s and ms consistently', () => {
	assert.equal(parseCssTime('0.2s'), 200)
	assert.equal(parseCssTime('150ms'), 150)
	assert.equal(parseCssTime(' .5s '), 500)
})
