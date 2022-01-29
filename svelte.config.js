import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// setup path for github pages
		paths: {
			//base: import.meta.env.DEV ? '' : '/all-around-scorer-svelte',
		},

		// adapter-static
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		router: false,
		hydrate: false,

		vite: {
			resolve: {
				alias: {
					"src": "./src",
				},
			},
		},
	},
};

export default config;
