<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { client } from 'src/sanity';
	import type { Post, SanityPost } from 'src/types';

	export const load: Load = async (input) => {
		// fetch posts from sanity api
		const posts: [SanityPost] = await client.fetch(`*[_type == "post"]`);

		return {
			status: 200,
			props: {
				posts: posts.map(
					(post) =>
						({
							title: post.title,
							slug: post.slug.current,
							excerpt: post.excerpt,
							releaseDate: new Date(post.publishedAt),
							lastUpdate: new Date(post._updatedAt),
						} as Post)
				).sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1)
			}
		};
	};
</script>

<script lang="ts">
	import Card from '../components/Card.svelte';

	export let posts: [Post?] = [];
</script>

<div class="container">
	<header class="title">All Around Scorer</header>

	<main class="content">
		<ul class="posts">
			{#each posts as post}
				<Card {post} />
			{/each}
		</ul>
	</main>
</div>

<style lang="scss">
	@import "../global.scss";

	.container {
		margin: 0 auto;
		padding-top: 1rem;
		min-height: 100vh;

		text-align: center;
	}

	.content {
		margin: auto;
		width: $sm-bp;

		padding: 0 1rem;

		padding-bottom: 3rem;

		@media screen and (max-width: $sm-bp) {
			width: 100vw;
		}

		ul {
			list-style-type: none;
			padding: 0;
		}
	}

	.title {
		margin: auto;

		font-family: 'Open Sans';

		display: block;
		font-weight: 300;
		font-size: 100px;
		color: rgb(39, 39, 39);
		letter-spacing: 1px;
	}
</style>
