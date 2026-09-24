import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    ssr: true,

    compatibilityDate: '2025-07-15',

    devtools: {
        enabled: true
    },

    nitro: {
        prerender: {
            routes: ['/']
        }
    },

    css: [
        './app/assets/css/main.css'
    ],

    app: {
        head: {
            title: 'LogBuku',
            meta: [
                { name: 'theme-color', content: '#52788c' },
                { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#52788c' },
                { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#52788c' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
                { name: 'mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'apple-mobile-web-app-title', content: 'LogBuku' }
            ]
        }
    },

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
            theme_color: '#52788c',
            background_color: '#52788c',

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
            navigateFallbackAllowlist: [
                /^\//
            ],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
            globPatterns: [
                '**/*.{js,css,html,png,svg,ico,woff,woff2,json}'
            ],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'google-fonts-stylesheets',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-webfonts',
                        expiration: {
                            maxEntries: 30,
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images-cache',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 60 * 60 * 24 * 30
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /\/api\/.*/i,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 5,
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        },

        devOptions: {
            enabled: true,
            type: 'module'
        }
    }
})