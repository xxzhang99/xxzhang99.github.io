'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

function renderContent(content: string) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            result.push(<span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>);
        }
        result.push(
            <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline">
                {match[1]}
            </a>
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
        result.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
    }
    return result;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="relative">
                <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <span className="text-sm text-neutral-500 w-16 flex-shrink-0">{item.date}</span>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{renderContent(item.content)}</p>
                        </div>
                    ))}
                </div>
                {items.length > 6 && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                )}
            </div>
        </motion.section>
    );
}
