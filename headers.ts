import type { NitroConfig } from 'nitropack'

const headerRouteRules = <NitroConfig['routeRules']>{
    '/api/stats': { prerender: true, headers: { 'Content-Type': 'application/json' } },
    '/atom.xml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
    '/zhilu.opml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
}

export default headerRouteRules
