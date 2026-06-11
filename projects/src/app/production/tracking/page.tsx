"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  Package,
  Factory,
  MapPin,
  Truck,
} from "lucide-react";
import {
  productionLedger,
  productionFlowSales,
  productionEnterprises,
  pesticideRegistrations,
} from "@/lib/mock-data";
import { usePersistedState } from "@/hooks/use-persisted-state";

const PRIMARY_COLOR = "#1A5C9A";

type FlowStep = {
  label: string;
  icon: React.ReactNode;
  sub: string;
};

export default function ProductionTrackingPage() {
  const [selectedBatch, setSelectedBatch] = usePersistedState<string>(
    "production-tracking-batch",
    productionLedger[0].batchNo
  );
  const [enterpriseFilter, setEnterpriseFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const selected = useMemo(
    () =>
      productionLedger.find((l) => l.batchNo === selectedBatch) ||
      productionLedger[0],
    [selectedBatch]
  );

  const registration = useMemo(
    () => pesticideRegistrations.find((r) => r.regNo === selected.regNo),
    [selected.regNo]
  );

  const outRate = selected.output > 0
    ? Math.round((selected.sold / selected.output) * 100)
    : 0;

  // 动态步骤进度：根据出库率决定当前高亮步骤
  // 0:生产入库, 1:检验合格, 2:销售出库, 3:经销商, 4:零售商, 5:农户
  const currentStep = useMemo(() => {
    if (selected.stock === selected.output) return 1; // 刚入库，在检验环节
    if (outRate === 0) return 2;
    if (outRate > 0 && outRate < 40) return 3;
    if (outRate >= 40 && outRate < 80) return 4;
    if (outRate >= 80) return 5;
    return 2;
  }, [outRate, selected.stock, selected.output]);

  const steps: FlowStep[] = useMemo(
    () => [
      {
        label: "生产入库",
        icon: <Factory className="h-4 w-4" />,
        sub: `${selected.date}`,
      },
      {
        label: "检验合格",
        icon: <Badge className="h-4 w-4" asChild={false} />,
        sub: `${selected.output}吨`,
      },
      {
        label: "销售出库",
        icon: <Truck className="h-4 w-4" />,
        sub: `${selected.sold}吨`,
      },
      {
        label: "经销商",
        icon: <Package className="h-4 w-4" />,
        sub: `库存 ${selected.stock}吨`,
      },
      {
        label: "零售商",
        icon: <MapPin className="h-4 w-4" />,
        sub: "区域分销",
      },
      {
        label: "农户",
        icon: <TrendingUp className="h-4 w-4" />,
        sub: "最终用户",
      },
    ],
    [selected]
  );

  // 销售明细（按批次筛选）
  const batchSales = useMemo(
    () => productionFlowSales.filter((s) => s.batchNo === selectedBatch),
    [selectedBatch]
  );

  // 筛选后的批次列表
  const filteredBatches = useMemo(() => {
    let result = productionLedger;
    if (enterpriseFilter !== "all") {
      result = result.filter((l) => l.enterpriseId === enterpriseFilter);
    }
    if (searchText) {
      result = result.filter((l) =>
        l.productName.includes(searchText.trim())
      );
    }
    return result;
  }, [enterpriseFilter, searchText]);

  // 当筛选结果为空时自动回落到首个可选批次
  const availableBatchNos = useMemo(
    () => filteredBatches.map((b) => b.batchNo),
    [filteredBatches]
  );
  const currentBatchValid = availableBatchNos.includes(selectedBatch);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* 顶部标题区 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <TrendingUp className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                生产流向追踪
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              从生产到农户的全链路追溯，支持批次/企业/产品多维度筛选
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-200 bg-white hover:border-[#1A5C9A] hover:text-[#1A5C9A]"
            >
              <Download className="h-4 w-4" />
              导出
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-200 bg-white hover:border-[#1A5C9A] hover:text-[#1A5C9A]"
            >
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-white shadow-sm"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <FileText className="h-4 w-4" />
              追溯报告
            </Button>
          </div>
        </div>

        {/* 筛选栏 */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                批次编号：
              </span>
              <Select
                value={currentBatchValid ? selectedBatch : ""}
                onValueChange={setSelectedBatch}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="请选择批次" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.map((l) => (
                    <SelectItem key={l.batchNo} value={l.batchNo}>
                      {l.batchNo} · {l.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                生产企业：
              </span>
              <Select
                value={enterpriseFilter}
                onValueChange={setEnterpriseFilter}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="全部企业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部企业</SelectItem>
                  {productionEnterprises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                产品名称：
              </span>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="输入产品名称搜索..."
                  className="pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 选中批次详情 */}
        <Card
          className="border-slate-200 bg-white shadow-sm"
          style={{ borderTop: `3px solid ${PRIMARY_COLOR}` }}
        >
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  批次详情
                </CardTitle>
                <Badge
                  className="font-medium"
                  style={{ backgroundColor: PRIMARY_COLOR, color: "#fff" }}
                >
                  {selected.batchNo}
                </Badge>
                <span className="text-sm text-slate-500">
                  {selected.productName}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                登记证号：{selected.regNo}
                {registration ? ` · ${registration.content}` : ""}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-slate-100 pt-4 md:grid-cols-5">
            <div>
              <p className="text-xs text-slate-500">产量</p>
              <p className="text-base font-semibold text-slate-900">
                {selected.output} 吨
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">销量</p>
              <p className="text-base font-semibold text-slate-900">
                {selected.sold} 吨
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">库存</p>
              <p className="text-base font-semibold text-slate-900">
                {selected.stock} 吨
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">出库率</p>
              <p
                className="text-base font-semibold"
                style={{ color: PRIMARY_COLOR }}
              >
                {outRate}%
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-slate-500">生产企业</p>
              <p className="truncate text-base font-semibold text-slate-900">
                {selected.enterprise}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 流向步骤条 */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-900">
              流转环节
            </CardTitle>
            <p className="text-xs text-slate-500">
              当前状态：
              <span className="font-medium" style={{ color: PRIMARY_COLOR }}>
                {steps[currentStep].label}
              </span>
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-stretch justify-between gap-2">
              {steps.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                const pending = i > currentStep;

                return (
                  <React.Fragment key={step.label}>
                    <div className="flex min-w-[110px] flex-1 flex-col items-center text-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition ${
                          done
                            ? "border-green-500 bg-green-50 text-green-600"
                            : active
                              ? "border-transparent text-white shadow-md"
                              : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                        style={
                          active
                            ? { backgroundColor: PRIMARY_COLOR }
                            : undefined
                        }
                      >
                        {done ? (
                          <span className="text-sm font-bold">✓</span>
                        ) : (
                          step.icon
                        )}
                      </div>
                      <p
                        className={`mt-2 text-sm font-medium ${
                          done
                            ? "text-green-600"
                            : active
                              ? "text-slate-900"
                              : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-400">{step.sub}</p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mx-1 hidden items-center md:flex">
                        <ArrowRight
                          className={`h-4 w-4 ${
                            done ? "text-green-500" : "text-slate-300"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 3个统计卡片 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm text-slate-500">当前库存</p>
                <p
                  className="mt-1 text-2xl font-bold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {selected.stock}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    吨
                  </span>
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-opacity-10"
                style={{ backgroundColor: `${PRIMARY_COLOR}1A`, color: PRIMARY_COLOR }}
              >
                <Package className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm text-slate-500">已出库率</p>
                <p
                  className="mt-1 text-2xl font-bold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {outRate}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    %
                  </span>
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${PRIMARY_COLOR}1A`, color: PRIMARY_COLOR }}
              >
                <TrendingUp className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm text-slate-500">可追溯率</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  100
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    %
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <FileText className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 销售明细表格 */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                销售明细
              </CardTitle>
              <p className="text-xs text-slate-500">
                批次 {selected.batchNo} · 共 {batchSales.length} 笔
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {batchSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${PRIMARY_COLOR}1A`, color: PRIMARY_COLOR }}
                >
                  <Package className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  暂无销售数据
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  当前批次尚未产生销售出库记录
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-medium text-slate-700">
                        购买方
                      </TableHead>
                      <TableHead className="font-medium text-slate-700">
                        购买量(吨)
                      </TableHead>
                      <TableHead className="font-medium text-slate-700">
                        购买日期
                      </TableHead>
                      <TableHead className="font-medium text-slate-700">
                        流向地区
                      </TableHead>
                      <TableHead className="font-medium text-slate-700">
                        状态
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchSales.map((s, i) => (
                      <TableRow key={i} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-800">
                          {s.buyer}
                        </TableCell>
                        <TableCell>{s.quantity}</TableCell>
                        <TableCell className="text-slate-600">
                          2026-{s.date}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3.5 w-3.5" />
                            {s.region}
                          </div>
                        </TableCell>
                        <TableCell>
                          {s.status === "已发货" ? (
                            <Badge
                              className="font-medium"
                              style={{
                                backgroundColor: "#22c55e",
                                color: "#fff",
                              }}
                            >
                              已发货
                            </Badge>
                          ) : (
                            <Badge
                              className="font-medium"
                              style={{
                                backgroundColor: "#f59e0b",
                                color: "#fff",
                              }}
                            >
                              待发货
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            数据来源：生产台账 + 销售流向记录 · 数据闭环已校验
          </span>
          <span>最后更新：实时</span>
        </div>
      </div>
    </div>
  );
}
