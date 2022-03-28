module.exports = {
    // 站点配置
    lang: 'zh-CN',
    title: 'Bonfire',
    description: '这是我的第一个 VuePress 站点',
    head: [['link', { rel: 'icon', href: '/bonfire.png' }]],
    plugins: [
        [
          '@vuepress/plugin-search',
          {
            locales: {
              '/': {
                placeholder: '搜索文档',
              }
            },
          },
        ]
    ],
    // 主题和它的配置
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: '/bonfire.png',
        navbar: [
            { text: '指南', link: '/guide/' },
            // { text: '博客', link: '/' },
            { text: 'Gitee', link: 'https://gitee.com/izneus' },
            { text: 'Github', link: 'https://github.com/izneus' },
        ],
        sidebar: [
            {
                text: '快速了解',
                collapsable: false,
                children: [
                    '/guide/',
                    '/guide/getting-started',
                    '/guide/change-log'
                ]
            },
            {
                text: '开发手册',
                collapsable: false,
                children: [
                    '/guide/faq',
                    '/guide/backend',
                    '/guide/frontend',
                ]
            },
            {
                text: '其他',   
                collapsable: false,   
                children: [
                ]
            },
            {
                text: '鸣谢',
                collapsable: false,
                link: '/guide/thanks'
            }

        ],
        sidebarDepth: 1
    },
    markdown: {
        lineNumbers: true
    }
}