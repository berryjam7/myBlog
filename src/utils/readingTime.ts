// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

export function formatReadingTime(minutes: number): string {
    return `${minutes}분 소요`;
}
