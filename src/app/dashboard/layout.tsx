"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Plus, Tag } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/admin-login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <div className="flex">
          <div className="w-64 bg-primary min-h-screen p-4">
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-600 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-8">
            <div className="h-8 bg-gray-300 rounded animate-pulse mb-6"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
      </div>
    );
  }
  const navigation = [
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Create Product", href: "/dashboard/create-product", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <div className="flex">
        <div className="w-64 bg-primary min-h-screen p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent1 text-white"
                      : "text-secondary hover:bg-accent1 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
