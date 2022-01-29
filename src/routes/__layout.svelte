<svelte:head>
	<title>All Around Scorer</title>

	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600&display=swap">
</svelte:head>

<slot />

<style lang="scss" global>
	html {
		font-family: 'Open Sans', sans-serif;
	
		font-size: 16px;
	
		word-spacing: 1px;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
		box-sizing: border-box;
	}
	
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
	}

	/* body {
		text-align: center;
		margin: auto;
		max-width: 1024px;
	} */
</style>
