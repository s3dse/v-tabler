import { whyframe } from '@whyframe/core'
import { whyframeVue } from '@whyframe/vue'
import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'

export default defineConfig({
    vite: {
        plugins: [
            UnoCSS(),
            whyframe({
                defaultSrc: '/frames/default'
            }),
            whyframeVue({
                include: /\.(?:vue|md)$/
            })
        ]
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: tag => tag === 'whyframe'
            }
        }
    },
    head: [['link', { rel: 'icon', type: 'image/x-icon', href: '/base/favicon.ico' }]],
    title: 'V-Tabler',
    description: 'A comprehensive Vue 3 component library with advanced table functionality',

    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Components', link: '/components/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'GitHub', link: 'https://github.com/s3dse/v-tabler' }
        ],

        sidebar: {
            '/components/': [
                {
                    text: 'Components',
                    items: [
                        { text: 'Table Component', link: '/components/table-component' },
                        { text: 'Card Component', link: '/components/card-component' },
                        { text: 'Dialog Component', link: '/components/dialog-component' },
                        { text: 'Dropdown Component', link: '/components/dropdown-component' },
                        { text: 'Select Components', link: '/components/select-components' },
                        { text: 'ListSelect Component', link: '/components/listselect' },
                        { text: 'Toggle Component', link: '/components/toggle-component' },
                        { text: 'Checkbox Component', link: '/components/checkbox-component' },
                        { text: 'Pagination Component', link: '/components/pagination-component' },
                        { text: 'Typography', link: '/components/typography' }
                    ]
                }
            ],
            '/guide/': [
                {
                    text: 'Getting Started',
                    items: [
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Quick Start', link: '/guide/quick-start' },
                        { text: 'Configuration', link: '/guide/configuration' }
                    ]
                },
                {
                    text: 'Advanced Features',
                    items: [{ text: 'Internationalization', link: '/guide/internationalization' }]
                },
                {
                    text: 'Migration',
                    items: [
                        {
                            text: 'Table Column Alignment',
                            link: '/guide/table-column-alignment-migration'
                        },
                        {
                            text: 'Table Events',
                            link: '/guide/table-events-migration'
                        }
                    ]
                }
            ]
        },

        socialLinks: [{ icon: 'github', link: 'https://github.com/s3dse/v-tabler' }],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025 Sebastian Doerl'
        },

        search: {
            provider: 'local'
        }
    },

    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        }
    }
})
