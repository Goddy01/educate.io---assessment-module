'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="animate-pulse space-y-6 max-w-3xl">
          <div className="h-8 w-40 bg-gray-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </main>
    </div>
  );
}


