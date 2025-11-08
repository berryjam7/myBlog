// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://myblog-akg.pages.dev',
    output: 'static',
    adapter: cloudflare(),
    integrations: [
        sitemap(),
        mdx()
    ],
    markdown: {
        shikiConfig: {
            theme: 'github-dark',
            wrap: true
        }
    }
});