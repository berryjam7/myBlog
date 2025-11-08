// 블로그 전체 설정
export const SITE_CONFIG = {
    // 사이트 기본 정보
    siteName: "BerryJam's Blog",
    siteDescription: "dev study blog",
    siteUrl: "https://myblog-akg.pages.dev",

    // 작성자 정보
    author: {
        name: "Berry Jam",
        email: "berryjam7@pm.me",
        bio: "Inspiring game developers for tomorrow",
    },

    // 소셜 링크
    social: {
        github: "https://github.com/berryjam7",
        twitter: "https://twitter.com",
        // linkedin: "https://linkedin.com",
        // instagram: "https://instagram.com",
    },

    // 페이지네이션
    postsPerPage: 9,

    // 홈페이지 텍스트
    hero: {
        title: "안녕하세요! 👋",
        description: "Shaping tomorrow from an ambiguity into an ideal — one you can't wait to meet.",
        primaryButton: "Explore",
        secondaryButton: "About",
    },

    // 섹션 제목
    sections: {
        recentPosts: "Recent",
        allPosts: "All",
        relatedPosts: "Related Post",
        categories: "Category",
        tags: "Tag",
        search: "Search",
    },

    // Footer 텍스트
    footer: {
        description: "Tomorrow with anticipation",
        quickLinks: "Quick Link",
        categoriesTitle: "Category",
        newsletter: {
            title: "Subscribe",
            description: "recieve new post on email",
            placeholder: "Email address",
            button: "Subscribe",
        },
        copyright: "All rights reserved.",
        builtWith: "Built with",
    },

    // 메시지
    messages: {
        noPosts: "No posts yet",
        noPostsDescription: "No posts have been published yet. Please visit again later!",
        noResults: "No results found",
        searchPlaceholder: "Enter search term...",
        readingTime: "min read",
        lastUpdated: "Updated",
        published: "Published",
    },
};

// 네비게이션 메뉴
export const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/categories", label: "Categories" },
    { href: "/tags", label: "Tags" },
    { href: "/about", label: "About" },
    { href: "/search", label: "Search" },
];

// 기본 카테고리 (참고용 - 실제로는 포스트에서 자동 수집)
export const DEFAULT_CATEGORIES = [
    "Hardware",
    "Math",
    "Game",
];

// 추천 태그 (참고용)
export const SUGGESTED_TAGS = [
    "astro",
    "hardware",
    "programming",
    "algorithm",
    "performance",
    "math",
    "c++",
    "game",
];
