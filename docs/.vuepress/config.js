module.exports = {
    title: 'Bonfire',
    description: 'Just playing around222',
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/' },
            { text: '捐赠', link: '/' },
            { text: 'FAQ', link: '/' },
            { text: '博客', link: '/' },
            { text: 'Github', link: 'https://github.com' },
        ],
        sidebar: [
            {
                title: '指南',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: [
                    '/guide/',
                    '/guide/getting-started',
                    '/guide/backend',
                    '/guide/frontend'
                ]
            },
            {
                title: '其他',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: [
                ]
            },
            {
                title: '鸣谢',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: [
                ]
            }

        ]
    },
    markdown: {
        lineNumbers: true
    }
}