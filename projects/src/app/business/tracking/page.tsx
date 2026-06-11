"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Printer,
  FileText,
  ArrowRight,
  Package,
  Store,
  MapPin,
  Truck,
  TrendingUp,
  Users,
  Leaf,
} from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  inboundRecords,
  outboundRecords,
  inventoryData,
  businessEnterprises,
  pesticideRegistrations,
} from "@/lib/mock-data";

type InboundRecord = (typeof inboundRecords)[number];
type OutboundRecord = (typeof outboundRecords)[number];

const STORAGE_KEY = "business-tracking-filters";

function parseNumber(str: string): number {
  if (!str) return 0;
  const cleaned = str
    .replace(/,/g, "")
    .replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function isInWan(str: string): boolean {
  return /万/.test(str);
}

function formatWan(val: number): string {
  return `${val.toFixed(1)}万元`;
}

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status.includes("已")) return "default";
  if (status.includes("待")) return "secondary";
  if (status.includes("不足") || status.includes("过期")) return "destructive";
  return "outline";
}

export default function BusinessTrackingPage() {
  const [filters, setFilters] = usePersistedState<{
    enterpriseId: string;
    regNo: string;
    flowType: "all" | "inbound" | "outbound";
    keyword: string;
  }>(STORAGE_KEY, {
    enterpriseId: "all",
    regNo: "all",
    flowType: "all",
    keyword: "",
  });

  const [keywordInput, setKeywordInput] = useState(filters.keyword);

  const filteredInbound = useMemo<InboundRecord[]>(() => {
    return inboundRecords.filter((r) => {
      if (filters.enterpriseId !== "all" && r.enterpriseId !== filters.enterpriseId) return false;
      if (filters.regNo !== "all" && r.regNo !== filters.regNo) return false;
      if (filters.keyword && !r.product.includes(filters.keyword)) return false;
      return true;
    });
  }, [filters]);

  const filteredOutbound = useMemo<OutboundRecord[]>(() => {
    return outboundRecords.filter((r) => {
      if (filters.enterpriseId !== "all" && r.enterpriseId !== filters.enterpriseId) return false;
      if (filters.regNo !== "all" && r.regNo !== filters.regNo) return false;
      if (filters.keyword && !r.product.includes(filters.keyword)) return false;
      return true;
    });
  }, [filters]);

  const filteredInventory = useMemo(() => {
    return inventoryData.filter((r) => {
      if (filters.enterpriseId !== "all" && r.enterpriseId !== filters.enterpriseId) return false;
      if (filters.regNo !== "all" && r.regNo !== filters.regNo) return false;
      if (filters.keyword && !r.productName.includes(filters.keyword)) return false;
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const purchaseQty = filteredInbound.reduce((sum, r) => sum + parseNumber(r.quantity), 0);
    const purchaseAmount = filteredInbound.reduce(
      (sum, r) => sum + parseNumber(r.amount) * (isInWan(r.amount) ? 1 : 0.0001),
      0
    );
    const salesQty = filteredOutbound.reduce((sum, r) => sum + parseNumber(r.quantity), 0);
    const salesAmount = filteredOutbound.reduce(
      (sum, r) => sum + parseNumber(r.amount) * (isInWan(r.amount) ? 0.0001 : 0.0001),
      0
    );
    return {
      purchaseQty: purchaseQty.toFixed(1),
      purchaseAmount: purchaseAmount.toFixed(1),
      salesQty: salesQty.toFixed(0),
      salesAmount: salesAmount.toFixed(1),
    };
  }, [filteredInbound, filteredOutbound]);

  const flowSteps = [
    { icon: Leaf, label: "供应商 / 生产企业", desc: "农药生产源头" },
    { icon: Truck, label: "经营企业入库", desc: "采购入库登记" },
    { icon: Store, label: "在库仓储", desc: "库存动态管理" },
    { icon: Package, label: "销售出库", desc: "销售流向登记" },
    { icon: Users, label: "购买方 / 农户", desc: "最终使用终端" },
  ];

  const showInbound = filters.flowType === "all" || filters.flowType === "inbound";
  const showOutbound = filters.flowType === "all" || filters.flowType === "outbound";

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, keyword: keywordInput.trim() }));
  };

  const handleReset = () => {
    setKeywordInput("");
    setFilters({
      enterpriseId: "all",
      regNo: "all",
      flowType: "all",
      keyword: "",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">经营流向追踪</h1>
            <p className="text-sm text-muted-foreground">
              实时追踪农药从生产企业到最终购买方的完整流转链路
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出数据
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            打印报表
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">经营企业</label>
              <Select
                value={filters.enterpriseId}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, enterpriseId: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部企业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部经营企业</SelectItem>
                  {businessEnterprises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">农药产品</label>
              <Select
                value={filters.regNo}
                onValueChange={(v) => setFilters((prev) => ({ ...prev, regNo: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部产品" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部产品（按登记证号）</SelectItem>
                  {pesticideRegistrations.map((p) => (
                    <SelectItem key={p.regNo} value={p.regNo}>
                      {p.name}（{p.regNo}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">流向类型</label>
              <Select
                value={filters.flowType}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    flowType: v as "all" | "inbound" | "outbound",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部流向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="inbound">入库</SelectItem>
                  <SelectItem value="outbound">出库</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">产品名称搜索</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="输入产品名称关键词"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  查询
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                采购总量
              </CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.purchaseQty} 吨</div>
            <div className="mt-1 text-xs text-muted-foreground">
              共 {filteredInbound.length} 条入库记录
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                采购总额
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatWan(parseFloat(stats.purchaseAmount) || filteredInbound.reduce((s, r) => s + parseNumber(r.amount), 0))}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              累计采购金额
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                销售总量
              </CardTitle>
              <Package className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.salesQty} 件</div>
            <div className="mt-1 text-xs text-muted-foreground">
              共 {filteredOutbound.length} 条出库记录
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                销售总额
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatWan(filteredOutbound.reduce((s, r) => s + parseNumber(r.amount) * 0.0001, 0))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">累计销售金额</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>流向链路示意</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {flowSteps.map((step, idx) => (
              <div key={idx} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="mt-2 text-sm font-medium">{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="hidden flex-1 items-center md:flex">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                    <div className="ml-1 h-0.5 flex-1 bg-gradient-to-r from-primary/30 to-primary/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>流向追踪图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 text-center">
              <Truck className="mx-auto h-8 w-8 text-blue-600" />
              <div className="mt-2 text-sm font-medium text-blue-700">采购入库</div>
              <div className="mt-3 text-3xl font-bold text-blue-700">
                {filteredInbound.reduce((s, r) => s + parseNumber(r.quantity), 0).toFixed(1)} 吨
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {filteredInbound.length} 条入库记录
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                <span>入仓</span>
              </div>
              <div className="w-full rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center">
                <Store className="mx-auto h-8 w-8 text-amber-600" />
                <div className="mt-2 text-sm font-medium text-amber-700">在库库存</div>
                <div className="mt-3 text-3xl font-bold text-amber-700">
                  {filteredInventory.reduce((s, r) => s + parseNumber(String(r.stock)), 0).toFixed(1)} 吨
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {filteredInventory.length} 条库存记录
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>出库</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
              <Package className="mx-auto h-8 w-8 text-emerald-600" />
              <div className="mt-2 text-sm font-medium text-emerald-700">销售出库</div>
              <div className="mt-3 text-3xl font-bold text-emerald-700">
                {filteredOutbound.length} 笔
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {filteredOutbound.length} 条出库记录
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showInbound && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                采购入库明细
              </CardTitle>
              <Badge variant="secondary">{filteredInbound.length} 条记录</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredInbound.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <div className="mt-3 text-sm font-medium text-muted-foreground">
                  暂无入库记录
                </div>
                <div className="text-xs text-muted-foreground">请调整筛选条件后重试</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>入库单号</TableHead>
                    <TableHead>供货单位</TableHead>
                    <TableHead>产品</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInbound.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.orderNo}</TableCell>
                      <TableCell>{r.supplier}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.product}</div>
                        <div className="text-xs text-muted-foreground">{r.regNo}</div>
                      </TableCell>
                      <TableCell className="text-right">{r.quantity}</TableCell>
                      <TableCell className="text-right">{r.amount}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {showOutbound && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-500" />
                销售出库明细
              </CardTitle>
              <Badge variant="secondary">{filteredOutbound.length} 条记录</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOutbound.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <div className="mt-3 text-sm font-medium text-muted-foreground">
                  暂无出库记录
                </div>
                <div className="text-xs text-muted-foreground">请调整筛选条件后重试</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>出库单号</TableHead>
                    <TableHead>购买方</TableHead>
                    <TableHead>产品</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>用途</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        流向地区
                      </div>
                    </TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutbound.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.orderNo}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.buyer}</div>
                        <div className="text-xs text-muted-foreground">{r.buyerType}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{r.product}</div>
                        <div className="text-xs text-muted-foreground">{r.regNo}</div>
                      </TableCell>
                      <TableCell className="text-right">{r.quantity}</TableCell>
                      <TableCell className="text-right">{r.amount}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.purpose}</TableCell>
                      <TableCell>{r.region}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
