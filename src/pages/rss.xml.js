import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    const sortedPosts = posts.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

    return rss({
        title: 'Planetary Pulsar',
        description: '기술과 생각을 공유하는 블로그입니다.',
        site: context.site,
        items: sortedPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.slug}/`,
            categories: [post.data.category, ...post.data.tags],
            author: post.data.author,
        })),
        customData: `<language>ko-kr</language>`,
    });
}
