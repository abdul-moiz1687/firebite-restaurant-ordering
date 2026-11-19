
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

const statusConfig = [
  { id: "pending", label: "Pending", color: "#f59e0b" },
  { id: "confirmed", label: "Confirmed", color: "#3b82f6" },
  { id: "preparing", label: "Preparing", color: "#8b5cf6" },
  { id: "ready", label: "Ready", color: "#06b6d4" },
  { id: "out_for_delivery", label: "Out for delivery", color: "#f97316" },
  { id: "delivered", label: "Delivered", color: "#16a34a" },
  { id: "cancelled", label: "Cancelled", color: "#ef4444" },
];

const money = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function RevenueChart({ data }) {
  const width = 700;
  const height = 230;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };

  const max = Math.max(...data.map((item) => item.value), 1);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((item, index) => ({
    ...item,
    x: padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth,
    y: padding.top + chartHeight - (item.value / max) * chartHeight,
  }));

  const line = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const area = `${line} L ${points[points.length - 1]?.x ?? 0} ${
    height - padding.bottom
  } L ${points[0]?.x ?? 0} ${height - padding.bottom} Z`;

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#251f1b]">
            Delivered order value
          </p>
          <p className="mt-1 text-xs text-[#968a80]">
            Last 7 days · By order date
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#df4428]">
          PKR
        </span>
      </div>

      <div className="overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          role="img"
          aria-label="Seven day delivered order value graph"
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#df4428" stopOpacity=".25" />
              <stop offset="100%" stopColor="#df4428" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((lineIndex) => {
            const y = padding.top + (chartHeight / 3) * lineIndex;

            return (
              <line
                key={lineIndex}
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#eee7e0"
                strokeDasharray="4 5"
              />
            );
          })}

          <path d={area} fill="url(#revenueFill)" />

          <path
            d={line}
            fill="none"
            stroke="#df4428"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1500"
            strokeDashoffset="1500"
            className="revenue-line"
          />

          {points.map((point) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#fff"
                stroke="#df4428"
                strokeWidth="3"
              >
                <title>
                  {point.label}: {money(point.value)}
                </title>
              </circle>

              <text
                x={point.x}
                y={height - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#968a80"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <style jsx>{`
        .revenue-line {
          animation: drawLine 1.5s ease forwards;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {points.map((point) => (
          <div key={point.date} className="rounded-xl bg-[#faf7f3] p-3">
            <p className="text-[11px] text-[#968a80]">{point.label}</p>
            <p className="mt-1 text-sm font-bold text-[#251f1b]">
              {money(point.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


function StatusChart({ counts }) {
  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const segments = statusConfig.map((status, index) => {
    const count = counts[status.id] || 0;
    const length = total > 0 ? (count / total) * circumference : 0;

    const offset = statusConfig
      .slice(0, index)
      .reduce((sum, previousStatus) => {
        const previousCount = counts[previousStatus.id] || 0;

        return (
          sum +
          (total > 0
            ? (previousCount / total) * circumference
            : 0)
        );
      }, 0);

    return {
      ...status,
      count,
      length,
      offset,
    };
  });

  return (
    <div className="flex min-w-0 flex-col items-center gap-7">
      <div className="relative size-48 shrink-0">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#f1ece6"
            strokeWidth="17"
          />

          {segments.map((segment) =>
            segment.count > 0 ? (
              <circle
                key={segment.id}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="17"
                strokeDasharray={`${segment.length} ${circumference}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="butt"
                className="status-ring"
              >
                <title>
                  {segment.label}: {segment.count}
                </title>
              </circle>
            ) : null
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#251f1b]">
            {total}
          </span>
          <span className="mt-1 text-xs text-[#968a80]">
            Total orders
          </span>
        </div>

        <style jsx>{`
          .status-ring {
            transition: stroke-dasharray 1s ease, stroke-dashoffset 1s ease;
          }
        `}</style>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-3">
        {segments.map((status) => (
          <div
            key={status.id}
            className="flex min-w-0 items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: status.color }}
              />

              <span className="min-w-0 break-words text-xs font-medium text-[#756a61]">
                {status.label}
              </span>
            </div>

            <span className="shrink-0 text-sm font-bold text-[#251f1b]">
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function AdminDashboard() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);

    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load dashboard.");
      }

      setData(result);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadDashboard(), 0);
    return () => clearTimeout(timer);
  }, [loadDashboard]);

  async function handleLogout() {
    const response = await fetch("/api/admin/session", {
      method: "DELETE",
    });

    if (response.ok) {
      router.replace("/admin/login");
    }
  }

  const stats = data?.statistics;

  const cards = [
    {
      label: "Total orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-orange-50 text-[#df4428]",
    },
    {
      label: "Today's orders",
      value: stats?.todayOrders ?? 0,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Delivered orders",
      value: stats?.deliveredOrders ?? 0,
      icon: PackageCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Delivered order value",
      value: money(stats?.deliveredOrderValue),
      icon: CircleDollarSign,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-[#251f1b] md:flex">
      <aside className="flex w-full flex-col bg-[#211b18] p-5 text-white md:min-h-screen md:w-64">
        <Link href="/admin" className="text-2xl font-black tracking-tight">
          FIRE<span className="text-[#f16a45]">BITE</span>
        </Link>

        <p className="mt-1 text-[10px] font-bold tracking-[.25em] text-white/40">
          RESTAURANT ADMIN
        </p>

        <nav className="mt-10 flex gap-2 md:flex-col">
          <Link
            href="/admin"
            className="flex flex-1 items-center gap-3 rounded-xl bg-[#df4428] px-4 py-3 text-sm font-bold"
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <Link
            href="/admin/orders"
            className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <ClipboardList size={18} />
            Orders
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white md:mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#df4428]">
              Firebite management
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Dashboard overview
            </h1>

            <p className="mt-2 text-sm text-[#968a80]">
              Your restaurant&apos;s latest performance.
            </p>
          </div>

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#e9e0d7] bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:border-[#df4428] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => loadDashboard(true)}
              className="ml-3 font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : data ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-[#eee7e0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#968a80]">
                        {card.label}
                      </span>

                      <span className={`rounded-xl p-2.5 ${card.color}`}>
                        <Icon size={19} />
                      </span>
                    </div>

                    <p className="mt-5 break-words text-2xl font-black">
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </section>

            <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-[#eee7e0] bg-white p-5 shadow-sm sm:p-7">
                <RevenueChart data={data.revenue || []} />
              </div>

              <div className="min-w-0 rounded-2xl border border-[#eee7e0] bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-black">Order status</h2>

                  <p className="mt-1 text-xs text-[#968a80]">
                    Current distribution of all orders
                  </p>
                </div>

                <StatusChart counts={data.statusCounts || {}} />
              </div>
            </section>

            <section className="mt-7 rounded-2xl border border-[#eee7e0] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Recent orders</h2>

                  <p className="mt-1 text-xs text-[#968a80]">
                    Latest activity from your restaurant
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="text-sm font-bold text-[#df4428] hover:underline"
                >
                  Manage all orders →
                </Link>
              </div>

              <div className="mt-5 divide-y divide-[#f0eae4]">
                {data.recentOrders?.length ? (
                  data.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-[#968a80]">
                          #{order.id} · {order.orderType}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {money(order.subtotal)}
                        </p>

                        <p className="mt-1 text-xs capitalize text-[#968a80]">
                          {order.status.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-[#968a80]">
                    No orders yet.
                  </p>
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
