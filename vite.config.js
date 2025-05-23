import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: 'src/phone-formatter.ts',
            name: 'phone-formatter',
            fileName: `phone-formatter`,
        }
    },
    plugins: [dts({
        insertTypesEntry: true
    })]
})