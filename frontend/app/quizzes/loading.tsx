'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-56 bg-gray-200 rounded" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


