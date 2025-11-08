// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://38a232dd.myblog-akg.pages.dev', // Update with your Cloudflare Pages URL
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