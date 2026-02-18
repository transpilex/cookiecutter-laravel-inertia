import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';

{%- if cookiecutter.framework == 'React' %}
import react from '@vitejs/plugin-react';
{%- endif %}

{%- if cookiecutter.framework == 'Vue' %}
import vue from '@vitejs/plugin-vue';
{%- if cookiecutter.ui_library == 'Bootstrap' %}
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';
{%- endif %}
{%- endif %}


{%- if cookiecutter.ui_library == 'Tailwind' %}
import tailwindcss from '@tailwindcss/vite';
{%- endif %}

export default defineConfig({
    plugins: [
        laravel({
            {%- if cookiecutter.framework == 'React' %}
            input: ['resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            {%- endif %}
            {%- if cookiecutter.framework == 'Vue' %}
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            {%- endif %}
            refresh: true,
        }),
        {%- if cookiecutter.framework == 'React' %}
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        {%- endif %}

        {%- if cookiecutter.framework == 'Vue' %}
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        {%- if cookiecutter.ui_library == 'Bootstrap' %}
        Components({
            resolvers: [BootstrapVueNextResolver()],
        }),
        {%- endif %}
        {%- endif %}

        {%- if cookiecutter.ui_library == 'Tailwind' %}
        tailwindcss(),
        {%- endif %}
        wayfinder({
            formVariants: true,
        }),
    ],
    {%- if cookiecutter.framework == 'React' %}
    esbuild: {
        jsx: 'automatic',
    },
    {%- endif %}
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    resolve: {
        alias: {
            '@/': path.resolve(__dirname, './resources/js'),
            '@/images': path.resolve(__dirname, 'resources/images'),
            '@/data': path.resolve(__dirname, 'resources/data'),
            {%- if cookiecutter.ui_library == 'Bootstrap' %}
            '@/scss': path.resolve(__dirname, 'resources/scss'),
            {%- else %}
            '@/css': path.resolve(__dirname, 'resources/css'),
            {%- endif %}
        },
    },
});
