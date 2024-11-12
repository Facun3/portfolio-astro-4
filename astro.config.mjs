import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown'

import tailwind from "@astrojs/tailwind";
export default defineConfig({
  
  integrations: [
    tailwind(),
    partytown({
        config: {
          forward: ["dataLayer.push"],
        },
    }),]
});
