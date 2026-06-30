import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SelectedListSidebar } from "./SelectedListSidebar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 p-8 lg:pr-[340px] w-full max-w-7xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-black text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
              Vibe Influencers
            </Link>
            {title && <h1 className="text-3xl font-bold mt-4 text-gray-800">{title}</h1>}
          </div>
        </header>
        <main>{children}</main>
      </div>
      <SelectedListSidebar />
    </div>
  );
}
