import { defineConfig } from 'vitepress'

export default defineConfig({
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
            { text: 'Toggle Component', link: '/components/toggle-component' },
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
          text: 'Migration',
          items: [
            { text: 'Table Column Alignment', link: '/guide/table-column-alignment-migration' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/s3dse/v-tabler' }
    ],

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
