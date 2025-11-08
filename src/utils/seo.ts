export interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url: string;
    type?: 'website' | 'article';
    publishedTime?: Date;
    modifiedTime?: Date;
    author?: string;
    tags?: string[];
}

export function generateSEOTags(props: SEOProps) {
    const {
        title,
        description,
        image = '/default-og-image.jpg',
        url,
        type = 'website',
        publishedTime,
        modifiedTime,
        author,
        tags
    } = props;

    return {
        title,
        description,
        canonical: url,
        openGraph: {
            title,
            description,
            url,
            type,
            image,
            ...(publishedTime && { publishedTime: publishedTime.toISOString() }),
            ...(modifiedTime && { modifiedTime: modifiedTime.toISOString() }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            image,
        },
        structuredData: generateStructuredData(props)
    };
}

function generateStructuredData(props: SEOProps) {
    const baseSchema = {
        '@context': 'https://schema.org',
    };

    if (props.type === 'article') {
        return {
            ...baseSchema,
            '@type': 'BlogPosting',
            headline: props.title,
            description: props.description,
            image: props.image,
            datePublished: props.publishedTime?.toISOString(),
            dateModified: props.modifiedTime?.toISOString(),
            author: {
                '@type': 'Person',
                name: props.author || 'Admin'
            },
            keywords: props.tags?.join(', ')
        };
    }

    return {
        ...baseSchema,
        '@type': 'WebSite',
        name: props.title,
        description: props.description,
        url: props.url
    };
}

export function generateBreadcrumbs(path: string, siteName: string = 'Home') {
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs = [
        {
            '@type': 'ListItem',
            position: 1,
            name: siteName,
            item: '/'
        }
    ];

    let currentPath = '';
    parts.forEach((part, index) => {
        currentPath += `/${part}`;
        breadcrumbs.push({
            '@type': 'ListItem',
            position: index + 2,
            name: part.charAt(0).toUpperCase() + part.slice(1),
            item: currentPath
        });
    });

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs
    };
}
