<script lang="ts" context="module">
	import blockToHTML from '@sanity/block-content-to-html';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import type { SanityPost } from 'src/types';
	import { client } from 'src/sanity';

	export const load: Load = async ({ params }) => {
		if (browser) return {};

		const { slug } = params;

		try {
			const query =
				`
				*[_type == "post" && slug.current == ${slug}]{
					body[]{
						...,
						asset->{
							...,
							"_key": _id
						}
					}
				}[0..5]
				`;

			const post: SanityPost = await client.fetch(
				//`*[_type == "post" && slug.current == "${slug}"][0]`
				query
			);

			console.log(post)

			if (post == null) {
				return {
					status: 404,
					error: new Error('Post not found')
				};
			}

			const h = blockToHTML.h;

			const serializers = {
				types: {
					normal: (props) => {
						console.log('hi');
						return h('p');
					},
					h1: (props) => h('h1'),
					a: (props) => {
						console.log('a');
						console.log(props);
						return h('a', { target: '_blank' }, props.children);
					}
				}
			};

			const content = await blockToHTML({
				blocks: post.body,
				serializers
			});

			return {
				status: 200,
				props: {
					slug,
					content,
					title: post.title,
					date: new Date(post.publishedAt)
				}
			};
		} catch (e) {
			console.log(e);

			return {
				status: 404,
				error: new Error('Post not found')
			};
		}
	};
</script>

<script lang="ts">
	import HomeButton from '../../components/HomeButton.svelte';

	export let content: string;
	export let title: string;
	export let date: Date;

	$: dateString = date.toLocaleDateString();
</script>

<svelte:head>
	<title>{title} - All Around Scorer</title>

	<script>
		function updateScrollBar() {
			// get scroll percentage
			var h = document.documentElement,
				b = document.body,
				st = 'scrollTop',
				sh = 'scrollHeight';

			var scroll = (h ? h[st] : b[st]) / ((h ? h[sh] : b[sh]) - h.clientHeight);

			// set width of progress bar
			document.getElementById('progress-bar').style.width = scroll * 100 + 'vw';
		}

		document.addEventListener('scroll', updateScrollBar);
	</script>
</svelte:head>

<div id="blog-post">
	<div id="progress-bar" />

	<header>
		<div id="head">
			<h1>{title}</h1>
		</div>

		<div id="meta-container">
			<HomeButton />
			<span id="date">Florian Michelmann - {dateString}</span>
		</div>

		<hr />
	</header>

	<article>
		{@html content}
	</article>

	<div id="back-home">
		<HomeButton />
	</div>
</div>

<style lang="scss" global>
	@import 'src/global.scss';

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
			font-size: 3.5rem;
		}

		#head {
			font-family: 'Oswald';

			width: 100%;
			margin: 2rem auto;

			h1 {
				margin-bottom: 0.5rem;
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

	#meta-container {
		font-family: 'Oswald';

		display: flex;
		align-content: space-between;

		* {
			margin: auto;
		}

		#date {
			color: grey;

			font-size: 0.9em;
			font-weight: 300;
		}
	}

	article {
		line-height: 1.6;
		text-align: left;

		margin: auto;
		padding: 0;

		padding-bottom: 1rem;

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

	#back-home {
		float: right;
		padding-right: 1rem;
		padding-bottom: 1.5rem;
	}
</style>
