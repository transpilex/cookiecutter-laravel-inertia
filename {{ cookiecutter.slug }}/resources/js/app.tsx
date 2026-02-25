import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

{%- if cookiecutter.ui_library == 'Bootstrap' %}
import '@/scss/app.scss';
{%- else %}
import '@/css/app.css'
{%- endif %}


import MainLayout from './layouts/MainLayout';
import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const page: any = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        )

        page.default.layout ??= (page: React.ReactNode) => (
            <AppProvidersWrapper>
                <MainLayout>
                    {page}
                </MainLayout>
            </AppProvidersWrapper>
        )

        return page
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
});
