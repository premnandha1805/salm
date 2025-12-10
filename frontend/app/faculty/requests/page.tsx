"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

type PendingLeave = {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    auto_type: string;
    status: string;
    conflict_count: number;
    created_at: string;
    student_name: string;
    class_name: string | null;
};

export default function FacultyRequestsPage() {
    const [leaves, setLeaves] = useState<PendingLeave[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    async function loadPending() {
        try {
            // Only set global loading on first load if we have no data
            if (leaves.length === 0) setLoading(true);
            setError(null);
            const data = await apiFetch<PendingLeave[]>(
                `/leaves/pending`
            );
            setLeaves(data);
        } catch (err: any) {
            setError(err.message || "Failed to load pending leaves");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Initial load
        loadPending();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadPending();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    async function handleAction(id: number, action: "approve" | "reject") {
        if (action === "reject") {
            setSelectedLeaveId(id);
            setRejectReason("");
            setRejectModalOpen(true);
            return;
        }

        await submitAction(id, "approve");
    }

    async function submitAction(id: number, action: "approve" | "reject", comment: string = "") {

        setActionLoadingId(id);
        setError(null);
        try {
            await apiFetch(
                `/leaves/${id}/${action}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ comment }),
                }
            );

            // Remove from UI after action
            setLeaves((prev) => prev.filter((l) => l.id !== id));
            setRejectModalOpen(false); // Close modal if open
        } catch (err: any) {
            setError(err.message || `Failed to ${action} leave`);
        } finally {
            setActionLoadingId(null);
        }
    }

    const pendingCount = leaves.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 font-sans text-slate-900">
            <Navbar role="FACULTY" />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-purple-100/50 p-6 md:p-8 border border-white/50">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                                    Pending Requests
                                </h2>
                                {pendingCount > 0 && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                                        {pendingCount}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 mt-1 font-medium">
                                Review and take action on student applications.
                            </p>
                        </div>
                        <button
                            onClick={() => loadPending()}
                            className="self-start md:self-auto px-5 py-2.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                        >
                            Refresh List
                        </button>
                    </div>

                    {/* Messages */}
                    {loading && leaves.length === 0 && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50/50 text-red-600 border border-red-100 text-sm font-semibold text-center mb-6">
                            {error}
                        </div>
                    )}

                    {!loading && leaves.length === 0 && !error && (
                        <div className="text-center py-24 flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm text-4xl transform rotate-3">
                                ✅
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">All caught up!</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                No pending leave requests at the moment. Enjoy your day!
                            </p>
                        </div>
                    )}

                    {/* Desktop/Tablet Table View */}
                    {!loading && leaves.length > 0 && (
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100/80 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="p-4 md:p-5 first:rounded-tl-2xl">Student</th>
                                        <th className="p-4 md:p-5">Dates & Type</th>
                                        <th className="p-4 md:p-5 md:w-1/3">Reason</th>
                                        <th className="p-4 md:p-5 last:rounded-tr-2xl text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {leaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 md:p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-50 text-purple-600 flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                                                        {leave.student_name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{leave.student_name}</div>
                                                        <div className="text-xs text-slate-500 font-semibold">{leave.class_name || "N/A"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {leave.start_date} <span className="text-slate-400">→</span> {leave.end_date}
                                                    </span>
                                                    <span className="inline-flex self-start items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wide">
                                                        {leave.auto_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-5">
                                                <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                                                    "{leave.reason}"
                                                </p>
                                            </td>
                                            <td className="p-4 md:p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave.id, "reject")}
                                                        disabled={actionLoadingId === leave.id}
                                                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave.id, "approve")}
                                                        disabled={actionLoadingId === leave.id}
                                                        className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-200 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                                                    >
                                                        {actionLoadingId === leave.id ? "..." : "Approve"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Rejection Modal */}
                {rejectModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Reject Leave Request</h3>
                            <p className="text-slate-500 text-sm mb-4">Please provide a reason for rejecting this request. The student will be notified via email.</p>

                            <textarea
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 resize-none mb-4"
                                rows={4}
                                placeholder="Enter rejection reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                autoFocus
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setRejectModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => selectedLeaveId && submitAction(selectedLeaveId, "reject", rejectReason)}
                                    disabled={!rejectReason.trim()}
                                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:bg-red-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reject Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
