"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Search, Bell, Video, LogOut } from "lucide-react";

export default function DoctorSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: Calendar, label: "오늘 환자", href: "/medical/dashboard" },
        { icon: Search, label: "환자 검색", href: "/medical/dashboard/search" },
        { icon: Bell, label: "알림/리마인드", href: "/medical/dashboard/notifications" },
        { icon: Video, label: "영상분석", href: "/medical/dashboard/video-analysis" },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-30">
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        AI
                    </div>
                    <h1 className="font-bold text-white text-lg">AI 스마일 덴탈케어</h1>
                </div>
                <p className="text-xs text-blue-400 font-medium pl-11">Doctor Dashboard</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                ? "bg-slate-800 text-blue-400"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-blue-400" : "text-slate-500"} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                    <LogOut size={20} className="text-slate-500" />
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
