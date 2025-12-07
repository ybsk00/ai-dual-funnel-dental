"use client";

import Link from "next/link";
import { Smile, Wind, Clock, Coffee, Baby } from "lucide-react";

const menuItems = [
    {
        id: "smile_test",
        label: "AI 스마일 인상체크",
        desc: "내 미소는 어떤 느낌일까?",
        icon: Smile,
        color: "bg-amber-100 text-amber-600",
        href: "/healthcare/chat?topic=smile_test"
    },
    {
        id: "breath_mbti",
        label: "입냄새 MBTI",
        desc: "나의 구강 타입 알아보기",
        icon: Wind,
        color: "bg-blue-100 text-blue-600",
        href: "/healthcare/chat?topic=breath_mbti"
    },
    {
        id: "teeth_age",
        label: "치아 나이 테스트",
        desc: "내 치아는 몇 살일까?",
        icon: Clock,
        color: "bg-green-100 text-green-600",
        href: "/healthcare/chat?topic=teeth_age"
    },
    {
        id: "stain_risk",
        label: "커피 착색 카드",
        desc: "커피 마실 때 착색 위험도",
        icon: Coffee,
        color: "bg-stone-100 text-stone-600",
        href: "/healthcare/chat?topic=stain_risk"
    },
    {
        id: "kids_mission",
        label: "양치 히어로 (키즈)",
        desc: "양치하고 히어로 배지 받자!",
        icon: Baby,
        color: "bg-pink-100 text-pink-600",
        href: "/healthcare/chat?topic=kids_mission"
    }
];

export default function HealthcareMenu() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {menuItems.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{item.label}</h3>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
