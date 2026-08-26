import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    devtools: {
        enabled: true
    },

    css: [
        './app/assets/css/main.css'
    ],

    vite: {
        plugins: [
            tailwindcss()
        ]
    },

    // runtimeConfig: {
    //     public: {
    //         apiBase: process.env.API_DOMAIN
    //     }
    // },

    modules: [
        '@vite-pwa/nuxt'
    ],

    pwa: {
        registerType: 'autoUpdate',

        manifest: {
            id: '/',
            name: 'LogBuku',
            short_name: 'LogBuku',
            description: 'Aplikasi manajemen koleksi dan progres bacaan buku.',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            theme_color: '#ffffff',
            background_color: '#ffffff',

            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ]
        },

        workbox: {
            navigateFallback: '/',
            globPatterns: [
                '**/*.{js,css,html,png,svg,ico}'
            ],
            navigateFallbackAllowlist: [
                /^\//
            ]
        },

        devOptions: {
            enabled: true,
            type: 'module'
        }
    }
})