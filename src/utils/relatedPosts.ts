import type { CollectionEntry } from 'astro:content';

interface SimilarityScore {
    post: CollectionEntry<'blog'>;
    score: number;
}

export function getRelatedPosts(
    currentPost: CollectionEntry<'blog'>,
    allPosts: CollectionEntry<'blog'>[],
    limit: number = 3
): CollectionEntry<'blog'>[] {
    const scores: SimilarityScore[] = allPosts
        .filter(post => post.slug !== currentPost.slug && !post.data.draft)
        .map(post => ({
            post,
            score: calculateSimilarity(currentPost, post)
        }))
        .sort((a, b) => b.score - a.score);

    return scores.slice(0, limit).map(item => item.post);
}

function calculateSimilarity(
    post1: CollectionEntry<'blog'>,
    post2: CollectionEntry<'blog'>
): number {
    let score = 0;

    // Same category: 40% weight
    if (post1.data.category === post2.data.category) {
        score += 40;
    }

    // Common tags: 40% weight
    const commonTags = post1.data.tags.filter(tag =>
        post2.data.tags.includes(tag)
    );
    const tagScore = (commonTags.length / Math.max(post1.data.tags.length, 1)) * 40;
    score += tagScore;

    // Date proximity: 20% weight
    const daysDiff = Math.abs(
        post1.data.pubDate.getTime() - post2.data.pubDate.getTime()
    ) / (1000 * 60 * 60 * 24);
    const dateScore = Math.max(0, 20 - (daysDiff / 30) * 20);
    score += dateScore;

    return score;
}
