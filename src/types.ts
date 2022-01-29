export type SanityPost = {
	body: any;
	slug: { current: string };
	title: string;
	excerpt: string;
	_updatedAt: string;
	publishedAt: string;
};

export type Post = Partial<{
	title: string;
	slug: string;
	excerpt: string;
	releaseDate: Date;
	lastUpdate: Date;
}>;
