"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type NavbarProps = {
    role: "STUDENT" | "FACULTY";
};

export default function Navbar({ role }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleLogout() {
        // Clear user session
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
        }
        router.push("/login?role=" + role);
        setIsMobileMenuOpen(false); // Close mobile menu on logout
    }

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${role === "STUDENT"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20"
                            : "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"
                            }`}>
                            <span className="text-white font-bold text-sm">
                                {role === "STUDENT" ? "SL" : "FL"}
                            </span>
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 leading-tight">
                                {role === "STUDENT" ? "Student Portal" : "Faculty Portal"}
                            </h1>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider hidden sm:block">
                                Leaves Manager
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {role === "STUDENT" ? (
                            <>
                                <Link
                                    href="/student/apply-leave"
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isActive("/student/apply-leave")
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 scale-105"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Apply
                                </Link>
                                <Link
                                    href="/student/my-leaves"
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isActive("/student/my-leaves")
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 scale-105"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    History
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/faculty/requests"
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isActive("/faculty/requests")
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-500 ring-offset-2 scale-105"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Requests
                                </Link>
                                <Link
                                    href="/faculty/calender"
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isActive("/faculty/calender")
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-500 ring-offset-2 scale-105"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Calendar
                                </Link>
                            </>
                        )}

                        {/* Divider */}
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm hover:shadow-red-500/20 active:scale-95"
                            title="Sign out"
                        >
                            <span>Logout</span>
                            <div className="bg-slate-100 rounded-full p-1 group-hover:bg-red-100 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-3 h-3 group-hover:text-red-600 transition-colors"
                                >
                                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-4 space-y-3">
                        {role === "STUDENT" ? (
                            <>
                                <Link
                                    href="/student/apply-leave"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive("/student/apply-leave")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    Apply Leave
                                </Link>
                                <Link
                                    href="/student/my-leaves"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive("/student/my-leaves")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    My History
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/faculty/requests"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive("/faculty/requests")
                                        ? "bg-purple-50 text-purple-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    Requests
                                </Link>
                                <Link
                                    href="/faculty/calender"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive("/faculty/calender")
                                        ? "bg-purple-50 text-purple-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    Calendar
                                </Link>
                            </>
                        )}
                        <div className="h-px bg-slate-100 my-2"></div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-80">
                                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
