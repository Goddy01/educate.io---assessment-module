'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-gray-200 rounded" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-72 bg-gray-200 rounded" />
            <div className="h-10 w-36 bg-gray-200 rounded" />
            <div className="h-10 w-28 bg-gray-200 rounded" />
          </div>
          <div className="bg-white rounded shadow">
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


