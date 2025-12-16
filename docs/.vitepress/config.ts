import { defineConfig } from 'vitepress'
import { nav } from './navbar'
import { sidebar } from './sidebar'
import { healthyLinkPrefixPlugin } from './linkPrefixPlugin'
export * from './navbar'
export * from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: true,
  title: "巨人的世界",
  description: "Just do it.",
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  markdown: {
    config: (md) => {
      md.use(healthyLinkPrefixPlugin, {
        prefix: '/healthy',
        exclude: ['/healthy/', '/img/', '/pdf/', '/etc/', '/pics/'],
      })
    },
  },

  themeConfig: {
    nav: nav,
    sidebar: sidebar,

    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '目录',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    
    footer: {
      message: '如有转载或 CV 的请标注本站原文地址',
      copyright: 'Copyright © 2025-present Huge man',
    },
  }
})
