'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface InternshipItem {
    company: string;
    role: string;
    date: string;
    project?: string;
}

interface InternshipProps {
    items: InternshipItem[];
    title?: string;
}

export default function Internship({ items, title }: InternshipProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.internship;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">{resolvedTitle}</h2>
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-24 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700" />

                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-0">
                            {/* Date column */}
                            <div className="w-24 flex-shrink-0 text-xs text-neutral-500 dark:text-neutral-400 pt-1 pr-4 text-right leading-tight">
                                {item.date}
                            </div>

                            {/* Dot */}
                            <div className="flex-shrink-0 relative z-10 mx-0">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 -translate-x-0.5" />
                            </div>

                            {/* Content */}
                            <div className="pl-4 pb-2">
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                                    {item.company}
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                                    {item.role}
                                </p>
                                {item.project && (
                                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 italic">
                                        {item.project}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
