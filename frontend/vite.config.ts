import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Fallback used when VITE_SITE_URL is not set, so a build never emits empty
 *  canonical/og:url tags. Point VITE_SITE_URL at the real deploy origin. */
const DEFAULT_SITE_URL = 'https://ashwanikumar.dev'

/** Crawlers read canonical + og:url/og:image as literal attributes, so the
 *  origin has to be baked into index.html at build time. One token, one source
 *  of truth, instead of the URL being repeated across four meta tags. */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'portfolio-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
  }
})
