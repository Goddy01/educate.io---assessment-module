'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const getSidebarItems = (isInstructor: boolean): SidebarItem[] => {
  const baseItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  if (isInstructor) {
    return [
      ...baseItems,
      { label: 'Programs', href: '/courses', icon: <BookOpen className="w-5 h-5" /> },
      { label: 'Assessments', href: '/quizzes', icon: <FileQuestion className="w-5 h-5" /> },
      { label: 'Performance', href: '/grades', icon: <GraduationCap className="w-5 h-5" /> },
      { label: 'Entrepreneurs', href: '/students', icon: <Users className="w-5 h-5" /> },
    ];
  }

  // Student navigation items
  return [
    ...baseItems,
    { label: 'My Programs', href: '/my-courses', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Assessments', href: '/my-assessments', icon: <FileQuestion className="w-5 h-5" /> },
    { label: 'My Results', href: '/my-results', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Classmates', href: '/classmates', icon: <Users className="w-5 h-5" /> },
  ];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsInstructor(authService.isInstructor());
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">e</span>
          </div>
          <span className="font-orbitron font-bold text-xl text-gray-900">
            educate.io
          </span>
        </div>
      </div>

      {/* User Profile */}
      {mounted && user ? (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-700 font-semibold text-sm">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      ) : (
        // Placeholder during SSR to match structure
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 font-semibold text-sm">--</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-300">Loading...</p>
              <p className="text-xs text-gray-300">---</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {mounted ? (
            getSidebarItems(isInstructor).map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })
          ) : (
            // Placeholder during SSR - always show Dashboard link to match structure
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 opacity-50"
              >
                <span className="flex-shrink-0">
                  <LayoutDashboard className="w-5 h-5" />
                </span>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Log Out</span>
        </button>
        <Link
          href="/dashboard"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>
      </aside>
    </>
  );
}

