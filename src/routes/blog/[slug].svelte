<script lang="ts" context="module">
	import sanityClient from '@sanity/client';
	import blockToHTML from '@sanity/block-content-to-html';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
import { dataset_dev } from 'svelte/internal';

	export const load: Load = async ({ url, params }) => {
		if (browser) {
			return {};
		}
		if (!browser) {
			const { slug } = params;

			const client = sanityClient({
				projectId: 'd7eknirs',
				dataset: import.meta.env.DEV ? 'production' : 'production',
				apiVersion: '2021-10-19',
				useCdn: true
			});

			try {
				//const post = await client.fetch(`*[_type == "post" && slug.current == "${slug}"][0]`);
				const post = await client.fetch(`*[_type == "post"][0]`);

				if (post == null) {
					return {
						status: 404,
						error: new Error('Post not found')
					};
				}

				const h = blockToHTML.h;

				const serializers = {
					types: {
						normal: (props) => h('p'),
						h1: (props) => h('h1'),
						a: (props) => h('a', { target: "_blank" })
					}
				};

				const content = blockToHTML({
					blocks: post.body,
					serializers
				});

				console.log(content)

				return {
					status: 200,
					props: {
						slug,
						content,
						title: post.title,
						dateString: new Date(post._updatedAt).toLocaleString("de"),
					}
				};
			} catch (e) {
				console.log(e);

				return {
					status: 404,
					error: new Error('Post not found')
				};
			}
		}
	};
</script>

<script lang="ts">
	//export let slug = 'unknown';
	export let content: string;
	export let title: string;
	export let dateString: string;
</script>

<div id="blog-post">
	<div id="progress-bar" />

	<header>
		<!-- <HomeButton /> -->

		<div id="head">
			<h1>{title}</h1>
			<span id="date">{dateString}</span>
		</div>

		<hr />
	</header>

	<article>
		{#if content}
			{@html content}
		{:else}
			<p>Nothing to see here</p>
		{/if}

		<!-- <HomeButton /> -->
	</article>
</div>

<style lang="scss" global>
	@import "../../global.scss";

	// DEFINITIONS
	$progress-bar-height: 4px;

	#progress-bar {
		position: fixed;
		z-index: 1000;
		left: 0;
		top: 0;

		background-color: rgb(65, 65, 65);

		width: 0vw;
		height: $progress-bar-height;
	}

	#blog-post {
		text-align: center;
		font-size: 1.2rem;
		padding: 0 20px;

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-family: 'Oswald';
			font-weight: 600;

			margin-top: 1.5rem;
		}

		hr {
			height: 1px;
			width: 100%;

			margin: 2rem auto;

			border: none;
			color: black;
			background-color: black;
		}

		ol,
		ul {
			text-align: left;
		}

		.img-paragraph {
			text-align: center;
		}

		a {
			color: black;
			text-decoration-color: $accent-color;
		}

		a:hover {
			color: $accent-color;
		}
	}

	header {
		line-height: 1.2; // relative to font height

		margin-top: $progress-bar-height;
		width: 100%;

		h1 {
			margin-top: 0;
			font-size: 4rem;
		}

		#head {
			font-family: 'Oswald';

			width: 100%;
			margin: 2rem auto;

			h1 {
				margin-bottom: 0.5rem;
			}

			#date {
				color: grey;

				font-size: 0.9em;
				font-weight: 300;
			}
		}

		hr {
			position: relative;
			left: 0;
			animation: 1s 'draw-line';
			animation-timing-function: cubic-bezier(0.52, 0.34, 0.15, 1);
		}

		@keyframes draw-line {
			0% {
				width: 0%;
			}

			100% {
				width: 100%;
			}
		}
	}

	article {
		line-height: 1.6;
		text-align: left;

		margin: auto;
		padding: 0;

		padding-bottom: 3rem;

		width: $sm-bp;

		@media screen and (max-width: $sm-bp) {
			width: 100%;
		}

		h1 {
			margin-left: 0;
		}

		h2 {
			margin-left: 0.5rem;
		}

		h3,
		h4,
		h5,
		h6 {
			margin-left: 1rem;
		}

		p {
			line-height: 1.6rem;
		}

		p,
		blockquote,
		ol,
		ul {
			margin-top: 1rem;
		}

		blockquote {
			color: lighten(black, 20%);
			font-style: italic;

			border-left: 2px solid $accent-color;
			border-radius: 2px;
			padding-left: 0.5rem;
		}

		img {
			margin: auto;
			padding: 0;

			//width: 66%;
			width: 100%;

			border: 1px solid rgba(0, 0, 0, 0.308);
		}
	}

	#back-to-home {
		margin-top: 3rem;
		width: 100%;
		text-align: right;
	}
</style>
