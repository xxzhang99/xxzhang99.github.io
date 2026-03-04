'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import { CodeBracketIcon, DocumentArrowDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="relative bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <h3 className="font-semibold text-primary leading-tight mb-2">
                            {pub.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={author.isHighlighted ? 'font-bold text-accent' : ''}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>*</sup>
                                    )}
                                    {author.isStudentFirstAuthor && author.isHighlighted && (
                                        <sup className="ml-0 text-accent">#</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                            {pub.journal || pub.conference}
                        </p>
                        {pub.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {pub.url && (
                                <a
                                    href={pub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                                    Paper
                                </a>
                            )}
                            {pub.abstract && (
                                <button
                                    onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                    className={cn(
                                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                                        expandedAbstractId === pub.id
                                            ? "bg-accent text-white"
                                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                    )}
                                >
                                    <DocumentTextIcon className="h-3 w-3 mr-1" />
                                    {messages.publications.abstract}
                                </button>
                            )}
                            {pub.code && (
                                <a
                                    href={pub.code}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    <CodeBracketIcon className="h-3 w-3 mr-1" />
                                    {messages.publications.code}
                                </a>
                            )}
                        </div>
                        <AnimatePresence>
                            {expandedAbstractId === pub.id && pub.abstract && (
                                <motion.div
                                    key="abstract"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mt-3"
                                >
                                    <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            {pub.abstract}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {pub.ccf && (
                            <span className="absolute bottom-3 right-3 px-1.5 py-0.5 text-xs font-semibold rounded bg-accent/10 text-accent border border-accent/20">
                                {pub.ccf}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
