import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
    plugins: [
        symfonyPlugin(),
    ],

    build: {
        rollupOptions: {
            input: {
                toolbar: './src/assets/js/toolbar.ts',
            },
        },
        outDir: "./bundle/Resources/public/"
    },
});