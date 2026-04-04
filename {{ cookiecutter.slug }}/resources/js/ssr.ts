import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => (title ? `${title} - ${appName}` : appName),
            resolve: async (name) => {
              const page: any = await resolvePageComponent(
                `/resources/js/views/${name}.vue`,
                import.meta.glob<DefineComponent>('/resources/js/views/**/*.vue')
              )

              page.default.layout ??= (h: any, page: any) => {
                return h(MainLayout, null, {
                  default: () => page
                })
              }

              return page
            },
            setup: ({ App, props, plugin }) =>
                createSSRApp({ render: () => h(App, props) }).use(plugin),
        }),
    { cluster: true },
);
