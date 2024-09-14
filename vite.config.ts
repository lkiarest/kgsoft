import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
import preact from '@preact/preset-vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		wasm(),
		preact({
			// prerender: {
			// 	enabled: true,
			// 	renderTarget: '#app',
			// 	additionalPrerenderRoutes: ['/idcard', '/about', '/404'],
			// 	previewMiddlewareEnabled: true,
			// 	previewMiddlewareFallback: '/404',
			// },
		}),
		topLevelAwait({
			promiseExportName: '__tla',
			promiseImportName: (i) => `__tla_${i}`,
		}),
	]
});
