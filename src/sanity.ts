import sanityClient from '@sanity/client';

export const client = sanityClient({
	projectId: 'd7eknirs',
	dataset: import.meta.env.PROD ? 'production' : 'production',
	apiVersion: '2021-10-19',
	useCdn: true
});
