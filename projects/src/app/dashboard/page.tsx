"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Maximize2,
  Factory,
  Store,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ArrowUp,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  productionEnterprises,
  businessEnterprises,
  productionLedger,
  outboundRecords,
  alertRecords,
  monthlyProductionTrend,
  monthlyBusinessTrend,
  cityProductionData,
  productTypeAnalysis,
} from "@/lib/mock-data";

function formatDateTime(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const PIE_COLORS = ["#1A5C9A", "#8B5CF6", "#67C23A", "#E6A23C", "#F56C6C"];

export default function DashboardPage() {
  const [now, setNow] = useState<Date>(new Date());
  const [handledIds, setHandledIds] = usePersistedState<string[]>("handled-alerts", []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const totalProduction = useMemo(
    () => productionLedger.reduce((s, l) => s + l.output, 0),
    []
  );

  const totalBusiness = useMemo(() => {
    return outboundRecords.reduce((s, r) => {
      const num = parseFloat(r.amount.replace(/[^\d.]/g, ""));
      if (isNaN(num)) return s;
      if (r.amount.includes("万元")) return s + num;
      if (r.amount.includes("亿元")) return s + num * 10000;
      return s + num / 10000;
    }, 0);
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: "农药生产企业",
        value: `${productionEnterprises.length}`,
        unit: "家",
        change: "+8%",
        icon: Factory,
        color: "#1A5C9A",
      },
      {
        label: "农药经营企业",
        value: `${businessEnterprises.length}`,
        unit: "家",
        change: "+5%",
        icon: Store,
        color: "#8B5CF6",
      },
      {
        label: "累计产量",
        value: `${totalProduction}`,
        unit: "吨",
        change: "+12%",
        icon: TrendingUp,
        color: "#67C23A",
      },
      {
        label: "累计经营额",
        value: `${totalBusiness.toFixed(1)}`,
        unit: "万元",
        change: "+9%",
        icon: DollarSign,
        color: "#E6A23C",
      },
    ],
    [totalProduction, totalBusiness]
  );

  const pendingAlerts = useMemo(
    () => alertRecords.filter((a) => !handledIds.includes(a.id) && !a.handled).slice(0, 5),
    [handledIds]
  );

  const quickLinks = useMemo(
    () => [
      {
        label: "生产企业",
        value: `${productionEnterprises.length} 家`,
        icon: Factory,
        iconColor: "#1A5C9A",
        iconBg: "rgba(26,92,154,0.1)",
        href: "/production/enterprises",
      },
      {
        label: "经营企业",
        value: `${businessEnterprises.length} 家`,
        icon: Store,
        iconColor: "#8B5CF6",
        iconBg: "rgba(139,92,246,0.1)",
        href: "/business/enterprises",
      },
      {
        label: "生产台账",
        value: `${productionLedger.length} 批次`,
        icon: Package,
        iconColor: "#67C23A",
        iconBg: "rgba(103,194,58,0.1)",
        href: "/production/ledger",
      },
      {
        label: "异常预警",
        value: `${alertRecords.filter((a) => !handledIds.includes(a.id)).length} 条`,
        icon: AlertTriangle,
        iconColor: "#F56C6C",
        iconBg: "rgba(245,108,108,0.1)",
        href: "/business/ledger",
      },
    ],
    [handledIds]
  );

  const handleRefresh = () => {
    setNow(new Date());
    toast.success("数据已刷新");
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        toast.info("当前浏览器不支持全屏");
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleAlert = (id: string) => {
    setHandledIds((prev) => [...prev, id]);
    toast.success("预警已处理");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">农药数字监管首页</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              当前层级：安徽省
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              数据更新时间：{formatDateTime(now)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            刷新
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            <Maximize2 className="mr-1 h-3.5 w-3.5" />
            全屏
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="relative overflow-hidden border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight" style={{ color: m.color }}>
                    {m.value}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{m.unit}</span>
                  </p>
                  <p className="mt-1 flex items-center text-xs text-green-600">
                    <ArrowUp className="mr-0.5 h-3 w-3" />
                    {m.change} 同比
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${m.color}15` }}
                >
                  <m.icon className="h-6 w-6" style={{ color: m.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              预警提醒
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingAlerts.length} 待处理
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm">暂无待处理预警</p>
              </div>
            ) : (
              pendingAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        alert.level === "严重" ? "text-red-500" : "text-amber-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={alert.level === "严重" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm mt-1 leading-snug">
                        <span className="font-medium">{alert.product}</span>
                        {alert.product !== "-" && <span className="mx-1 text-muted-foreground">·</span>}
                        <span className="text-muted-foreground">{alert.enterprise}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {alert.detail}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 flex-shrink-0 text-primary"
                    onClick={() => handleAlert(alert.id)}
                  >
                    处理
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">本月生产量趋势（万吨）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlyProductionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1A5C9A"
                      strokeWidth={2}
                      dot={{ fill: "#1A5C9A" }}
                      name="产量"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">本月经营额趋势（亿元）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlyBusinessTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: "#8B5CF6" }}
                      name="经营额"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">地市生产与经营对比</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cityProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="production" name="产量(吨)" fill="#1A5C9A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="business" name="经营额(万元)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">功能快捷入口</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {quickLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block">
                  <div className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm cursor-pointer">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
                      style={{ backgroundColor: link.iconBg }}
                    >
                      <link.icon className="h-5 w-5" style={{ color: link.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{link.label}</p>
                      <p className="text-lg font-semibold truncate">{link.value}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">产品类型占比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={productTypeAnalysis.map((p) => ({
                    name: p.type,
                    value: p.productionShare,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {productTypeAnalysis.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
