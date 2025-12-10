"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

type CalendarItem = {
    student_name: string;
    class_name: string | null;
    start_date: string;
    end_date: string;
    auto_type: string;
    reason: string;
};

export default function FacultyCalenderPage() {
    const [items, setItems] = useState<CalendarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch<CalendarItem[]>(
                    `/leaves/calendar`
                );
                setItems(data);
            } catch (err: any) {
                setError(err.message || "Failed to load calender data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const byDate: Record<string, CalendarItem[]> = {};
    for (const item of items) {
        const key = item.start_date;
        if (!byDate[key]) byDate[key] = [];
        byDate[key].push(item);
    }
    const sortedDates = Object.keys(byDate).sort();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 font-sans text-slate-900">
            <Navbar role="FACULTY" />

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-8 border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Approved Leaves Calendar</h2>
                            <p className="text-slate-500 mt-1">Overview of students who are on leave.</p>
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                            <span className="text-sm font-bold text-slate-700">{items.length} <span className="text-slate-500 font-normal">Approved Leaves</span></span>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium text-center mb-6">
                            {error}
                        </div>
                    )}

                    {!loading && !error && items.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🗓️</div>
                            <p className="text-slate-900 font-semibold">No approved leaves</p>
                            <p className="text-slate-500 text-sm mt-1">Check pending requests to approve some leaves.</p>
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <div className="space-y-6">
                            {sortedDates.map((date) => (
                                <div key={date}>
                                    <div className="flex items-center gap-3 mb-3 pl-1">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">{date}</h3>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {byDate[date].map((item, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{item.student_name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{item.class_name || "N/A"}</p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                                        {item.auto_type}
                                                    </span>
                                                </div>

                                                <div className="mt-3">
                                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={item.reason}>
                                                        "{item.reason}"
                                                    </p>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                                    <span>Range</span>
                                                    <span>{item.start_date} → {item.end_date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
