"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Cat {
  key: string;
  label: string;
}

interface Props {
  categories: Cat[];
}

function CounsellingCategoryButtons({ categories }: Props) {
  const searchParams = useSearchParams();
  const catParam = searchParams?.get('cat') || undefined;
  const active = catParam && categories.find((c) => c.key === catParam) ? catParam : categories[0]?.key;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((cat) => (
        <Link
          key={cat.key}
          href={`/services/counselling?cat=${cat.key}`}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm ${
            cat.key === active
              ? 'bg-gradient-to-r from-[#9370DB] to-[#8BA872] text-white shadow-lg transform scale-105'
              : 'bg-white/70 border border-gray-200 text-gray-700 hover:border-[#9370DB] hover:bg-[#9370DB]/10 hover:scale-105'
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}

export default function CounsellingCategoryButtonsClient({ categories }: Props) {
  return (
    <Suspense fallback={
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse w-32 h-12"></div>
        <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse w-40 h-12"></div>
        <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse w-36 h-12"></div>
      </div>
    }>
      <CounsellingCategoryButtons categories={categories} />
    </Suspense>
  );
}
