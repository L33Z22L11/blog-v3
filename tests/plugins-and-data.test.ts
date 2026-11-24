/* eslint-disable test/no-import-node-test -- Use Node's built-in runner without adding a test framework. */
import type { Element, Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Processor } from 'unified'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { VFile } from 'vfile'
import feeds from '../app/feeds'
import rehypeMetaSlots from '../remark-plugins/rehype-meta-slots'
import remarkCodeComponent from '../remark-plugins/remark-code-component'
import remarkDemo from '../remark-plugins/remark-demo'
import { normalizeUrl } from '../scripts/framework/utils'
import { getArchIcon } from '../shared/utils/icon'

function hasNonAscii(value: string) {
	return [...value].some(ch => (ch.codePointAt(0) ?? 0) > 0x7F)
}

test('remark-code-component replaces mapped languages and leaves others untouched', () => {
	const tree: MdastRoot = {
		type: 'root',
		children: [
			{ type: 'code', lang: 'mermaid', value: 'graph TD; A-->B' },
			{ type: 'code', lang: 'ts', value: 'const x = 1' },
		],
	}
	remarkCodeComponent({ mermaid: { component: 'Mermaid', prop: 'code' } })(tree)

	assert.equal(tree.children[0]?.type, 'codeComponent')
	assert.deepEqual(tree.children[0]?.data, {
		hName: 'Mermaid',
		hProperties: { code: 'graph TD; A-->B' },
	})
	assert.equal(tree.children[1]?.type, 'code')
})

test('remark-demo expands demo code blocks during parse and keeps regular code blocks', () => {
	const toTree = (doc: string): MdastRoot => ({
		type: 'root',
		children: doc.startsWith('::demo')
			? [{ type: 'code', lang: 'demo', meta: 'open', value: '# Hello' }]
			: [{ type: 'paragraph', children: [{ type: 'text', value: doc }] }],
	})
	const processor = { parser: toTree, parse: toTree } as unknown as Processor
	remarkDemo.call(processor)

	const tree = processor.parser!('::demo', new VFile()) as MdastRoot
	const expanded = tree.children[0]
	assert.equal(expanded?.type, 'containerComponent')
	if (expanded?.type === 'containerComponent') {
		assert.equal(expanded.name, 'demo')
		assert.deepEqual(expanded.attributes, { raw: '# Hello', meta: 'open' })
		assert.equal(expanded.children[0]?.type, 'paragraph')
	}
})

test('rehype-meta-slots extracts <meta-*> slots and cleans comments and empty code className', () => {
	const codeEl: Element = {
		type: 'element',
		tagName: 'code',
		properties: { className: [] },
		children: [{ type: 'text', value: 'x' }],
	}
	const tree: HastRoot = {
		type: 'root',
		children: [
			{
				type: 'element',
				tagName: 'meta-aside',
				properties: { id: 'slot-1' },
				children: [{ type: 'comment', value: 'ignored' }, codeEl],
			},
			{ type: 'element', tagName: 'p', properties: {}, children: [{ type: 'text', value: 'body' }] },
		],
	}
	const file = new VFile()
	rehypeMetaSlots()(tree, file)

	assert.equal(tree.children.length, 1)
	assert.equal(file.data.slots?.aside?.type, 'minimark')
	assert.deepEqual(file.data.slots?.aside?.value, [['code', {}, 'x']])
})

test('app/feeds.ts entries have valid ASCII URLs, unique links, and valid arch icons', () => {
	const seen = new Set<string>()
	for (const group of feeds) {
		for (const entry of group.entries) {
			const parsedLink = URL.parse(entry.link)
			assert.ok(parsedLink && ['http:', 'https:'].includes(parsedLink.protocol), `invalid link: ${entry.link}`)
			assert.equal(hasNonAscii(entry.link), false, `non-ASCII link: ${entry.link}`)

			const key = normalizeUrl(entry.link)
			assert.equal(seen.has(key), false, `duplicate link: ${entry.link}`)
			seen.add(key)

			if (entry.feed) {
				const parsedFeed = URL.parse(entry.feed)
				assert.ok(parsedFeed && ['http:', 'https:'].includes(parsedFeed.protocol), `invalid feed: ${entry.feed}`)
				assert.equal(hasNonAscii(entry.feed), false, `non-ASCII feed: ${entry.feed}`)
			}
			for (const urlField of [entry.icon, entry.avatar]) {
				if (urlField)
					assert.equal(hasNonAscii(urlField), false, `non-ASCII asset URL: ${urlField}`)
			}
			for (const arch of entry.archs ?? [])
				assert.ok(getArchIcon(arch), `unknown arch "${arch}" in ${entry.link}`)
		}
	}
})

test('redirects.json has valid paths, ASCII targets, and no redirect cycles', () => {
	const redirects = JSON.parse(fs.readFileSync(new URL('../redirects.json', import.meta.url), 'utf8')) as Record<string, string>
	for (const [from, to] of Object.entries(redirects)) {
		assert.ok(from.startsWith('/'), `redirect source must start with /: ${from}`)
		assert.ok(to.startsWith('/') || to.startsWith('http://') || to.startsWith('https://'), `invalid target: ${to}`)
		assert.notEqual(from, to, `self-redirect: ${from}`)
		assert.equal(hasNonAscii(from) || hasNonAscii(to), false, `non-ASCII redirect: ${from} -> ${to}`)

		const visited = new Set([from])
		let cursor = to
		while (cursor in redirects) {
			assert.equal(visited.has(cursor), false, `redirect cycle at ${cursor}`)
			visited.add(cursor)
			cursor = redirects[cursor]!
		}
	}
})
