'use client';

import { BlogCard } from "@/components/nosotros/blog-card";
import { useTranslation } from 'react-i18next';

export default function BlogSection() {
    const { t } = useTranslation();

    return (
        <section className="flex justify-center">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mt-12 mb-12">
                    {t('blog.title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 mx-auto">
                    <BlogCard
                        title={t('blog.posts.educational')}
                        category={t('blog.categories.education')}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Motu-Tours1.webp"
                    />
                    <BlogCard
                        title={t('blog.posts.corporate')}
                        category={t('blog.categories.corporate')}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/Easter-Island-Trekking-Experience-Chile.webp"
                    />
                    <BlogCard
                        title={t('blog.posts.testimonials')}
                        category={t('blog.categories.testimonials')}
                        href="#"
                        imageUrl="https://backend.hotumatur.com/wp-content/uploads/2024/12/pexels-bianeyre-1236028-1.webp"
                    />
                </div>
            </div>
        </section>
    );
} 