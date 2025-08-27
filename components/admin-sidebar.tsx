"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Upload, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Videos", href: "/dashboard", icon: Video },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Users", href: "/dashboard/users", icon: Users },
  {
    name: "Generate Key",
    href: "/dashboard/generate-key",
    icon: LayoutDashboard,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            Video Admin Portal
          </span>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
