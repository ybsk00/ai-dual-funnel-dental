import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI 스마일 덴탈케어 진료 시스템",
    description: "의료진 전용 대시보드",
};

export default function MedicalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
            {children}
        </div>
    );
}
