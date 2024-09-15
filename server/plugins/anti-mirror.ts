/* eslint style/semi: ["error", "always"] */

import blogConfig from '~~/blog.config';

const encodedBlacklist = [
    'dgvhqt.com',
].map(btoa);

const encodedOfficial = btoa(new URL(blogConfig.url).hostname);

function redirect(sourcesEncoded: string[], targetEncoded: string): void {
    const sources = sourcesEncoded.map(atob);
    const target = atob(targetEncoded);
    const shouldRedirect = sources.some(domain => location.hostname.endsWith(domain));

    if (shouldRedirect)
        location.href = location.href.replace(location.hostname, target);
}

function toIIFEString(fn: (...args: any[]) => void, ...args: any[]): string {
    const fnString = fn.toString().replace(/\s{2,}/g, '');
    const argsString = JSON.stringify(args).slice(1, -1);
    return `(${fnString})(${argsString});`;
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html) => {
        html.head.push(`<script>${toIIFEString(redirect, encodedBlacklist, encodedOfficial)}</script>`);
    });
});
