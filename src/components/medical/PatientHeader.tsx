"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientHeader() {
    const [userName, setUserName] = useState("환자님");
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user?.email) {
                setUserName(user.email.split("@")[0]);
            }
        };
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
            <Link href="/medical/dashboard" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors duration-300">
                    <span className="text-white text-xs font-bold font-serif">AI</span>
                </div>
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">AI 스마일 덴탈케어 <span className="text-blue-400 font-light">AI</span></span>
            </Link>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="text-sm font-bold text-blue-400">{userName}님</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    로그아웃
                </button>
                <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center">
                    {/* Profile Image Placeholder */}
                    <User className="w-5 h-5 text-blue-400" />
                </div>
            </div>
        </header>
    );
}
