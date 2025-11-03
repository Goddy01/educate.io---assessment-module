'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-gray-200 rounded" />
          <div className="bg-white rounded shadow">
            <div className="grid grid-cols-12 gap-4 p-4 border-b">
              <div className="h-6 bg-gray-200 rounded col-span-3" />
              <div className="h-6 bg-gray-200 rounded col-span-3" />
              <div className="h-6 bg-gray-200 rounded col-span-2" />
              <div className="h-6 bg-gray-200 rounded col-span-2" />
              <div className="h-6 bg-gray-200 rounded col-span-2" />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 border-b" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


