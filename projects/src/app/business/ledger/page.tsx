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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormModal, DetailModal, DeleteDialog, type FormField, type DetailField } from "@/components/crud";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Plus,
  Search,
  LogIn,
  LogOut,
  Package,
  Bell,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  inboundRecords,
  outboundRecords,
  inventoryData,
  alertRecords,
  businessEnterprises,
  pesticideRegistrations,
} from "@/lib/mock-data";

// ============ 类型定义 ============
type InboundRecord = (typeof inboundRecords)[number] & { id: string };
type OutboundRecord = (typeof outboundRecords)[number] & { id: string };
type InventoryItem = (typeof inventoryData)[number];
type AlertRecord = (typeof alertRecords)[number];

// ============ 状态颜色映射 ============
const stockStatusBg: Record<string, string> = {
  正常: "bg-green-50 text-green-700 border-green-200",
  临期: "bg-amber-50 text-amber-700 border-amber-200",
  不足: "bg-red-50 text-red-700 border-red-200",
  过期: "bg-red-50 text-red-700 border-red-200",
};

const inboundStatusBg: Record<string, string> = {
  已入库: "bg-green-50 text-green-700 border-green-200",
  待验收: "bg-amber-50 text-amber-700 border-amber-200",
};

const outboundStatusBg: Record<string, string> = {
  已出库: "bg-green-50 text-green-700 border-green-200",
  待出库: "bg-blue-50 text-blue-700 border-blue-200",
};

const alertLevelBg: Record<string, string> = {
  严重: "bg-red-50 text-red-700 border-red-200",
  警告: "bg-amber-50 text-amber-700 border-amber-200",
};

const alertTypeIcon: Record<string, React.ReactNode> = {
  库存不足: <Package className="h-4 w-4 text-red-500" />,
  临近过期: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  过期农药: <AlertCircle className="h-4 w-4 text-red-600" />,
  台账异常: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  许可证临期: <AlertCircle className="h-4 w-4 text-amber-500" />,
};

// ============ 表单字段定义 ============
const inboundFormFields: FormField[] = [
  { name: "orderNo", label: "入库单号", type: "text", required: true, placeholder: "如：RK-2026061001" },
  {
    name: "enterprise",
    label: "入库企业",
    type: "select",
    required: true,
    options: businessEnterprises.map((e) => ({ label: e.name, value: e.name })),
  },
  { name: "supplier", label: "供货单位", type: "text", required: true, placeholder: "请输入供货单位" },
  {
    name: "product",
    label: "产品名称",
    type: "select",
    required: true,
    options: pesticideRegistrations.map((p) => ({ label: p.name, value: p.name })),
  },
  { name: "batchNo", label: "批次号", type: "text", required: true, placeholder: "如：PC-001*01" },
  { name: "quantity", label: "数量", type: "text", required: true, placeholder: "如：5吨" },
  { name: "unitPrice", label: "单价", type: "text", placeholder: "如：31,000元/吨" },
  { name: "amount", label: "金额", type: "text", required: true, placeholder: "如：15.5万元" },
  { name: "date", label: "入库日期", type: "date", required: true },
  {
    name: "type",
    label: "入库类型",
    type: "select",
    required: true,
    options: [
      { label: "采购入库", value: "采购入库" },
      { label: "退货入库", value: "退货入库" },
      { label: "其他", value: "其他" },
    ],
  },
  { name: "warehouse", label: "仓库", type: "text", placeholder: "如：1号仓库" },
  { name: "position", label: "存放位置", type: "text", placeholder: "如：农药货架A区-03" },
  {
    name: "status",
    label: "状态",
    type: "select",
    required: true,
    options: [
      { label: "已入库", value: "已入库" },
      { label: "待验收", value: "待验收" },
    ],
  },
];

const outboundFormFields: FormField[] = [
  { name: "orderNo", label: "出库单号", type: "text", required: true, placeholder: "如：CK-2026061001" },
  {
    name: "enterprise",
    label: "出库企业",
    type: "select",
    required: true,
    options: businessEnterprises.map((e) => ({ label: e.name, value: e.name })),
  },
  { name: "buyer", label: "购买方", type: "text", required: true, placeholder: "请输入购买方" },
  {
    name: "buyerType",
    label: "购买方类型",
    type: "select",
    required: true,
    options: [
      { label: "农户", value: "农户" },
      { label: "农业企业", value: "农业企业" },
      { label: "合作社", value: "合作社" },
    ],
  },
  {
    name: "product",
    label: "产品名称",
    type: "select",
    required: true,
    options: pesticideRegistrations.map((p) => ({ label: p.name, value: p.name })),
  },
  { name: "quantity", label: "数量", type: "text", required: true, placeholder: "如：200L" },
  { name: "unitPrice", label: "单价", type: "text", placeholder: "如：62元/L" },
  { name: "amount", label: "金额", type: "text", required: true, placeholder: "如：12,400元" },
  { name: "date", label: "出库日期", type: "date", required: true },
  {
    name: "type",
    label: "出库类型",
    type: "select",
    required: true,
    options: [
      { label: "销售出库", value: "销售出库" },
      { label: "退货出库", value: "退货出库" },
      { label: "报损出库", value: "报损出库" },
    ],
  },
  { name: "purpose", label: "购买用途", type: "text", placeholder: "如：农业生产" },
  { name: "region", label: "流向地区", type: "text", placeholder: "如：蚌埠怀远县" },
  {
    name: "status",
    label: "状态",
    type: "select",
    required: true,
    options: [
      { label: "已出库", value: "已出库" },
      { label: "待出库", value: "待出库" },
    ],
  },
];

const inboundDetailFields: DetailField[] = [
  { name: "orderNo", label: "入库单号" },
  { name: "enterprise", label: "入库企业" },
  { name: "supplier", label: "供货单位" },
  { name: "product", label: "产品名称" },
  { name: "batchNo", label: "批次号" },
  { name: "quantity", label: "数量" },
  { name: "unitPrice", label: "单价" },
  { name: "amount", label: "金额" },
  { name: "date", label: "入库日期" },
  { name: "type", label: "入库类型", type: "badge" },
  { name: "warehouse", label: "仓库" },
  { name: "position", label: "存放位置" },
  { name: "status", label: "状态", type: "badge" },
];

const outboundDetailFields: DetailField[] = [
  { name: "orderNo", label: "出库单号" },
  { name: "enterprise", label: "出库企业" },
  { name: "buyer", label: "购买方" },
  { name: "buyerType", label: "购买方类型", type: "badge" },
  { name: "product", label: "产品名称" },
  { name: "quantity", label: "数量" },
  { name: "unitPrice", label: "单价" },
  { name: "amount", label: "金额" },
  { name: "date", label: "出库日期" },
  { name: "type", label: "出库类型", type: "badge" },
  { name: "purpose", label: "购买用途" },
  { name: "region", label: "流向地区" },
  { name: "status", label: "状态", type: "badge" },
];

// ============ 空状态组件 ============
function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-10 text-center">
      <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ============ 主页面组件 ============
export default function BusinessLedgerPage() {
  const [tab, setTab] = useState("all");

  // 持久化数据
  const [inboundData, setInboundData] = usePersistedState<InboundRecord[]>(
    "biz-inbound",
    inboundRecords as unknown as InboundRecord[]
  );
  const [outboundData, setOutboundData] = usePersistedState<OutboundRecord[]>(
    "biz-outbound",
    outboundRecords as unknown as OutboundRecord[]
  );
  const [inventoryList] = usePersistedState<InventoryItem[]>(
    "biz-inventory",
    inventoryData as unknown as InventoryItem[]
  );
  const [alertList, setAlertList] = usePersistedState<AlertRecord[]>(
    "biz-alerts",
    alertRecords as unknown as AlertRecord[]
  );
  const [handledIds, setHandledIds] = usePersistedState<string[]>("biz-alerts-handled", []);

  // 过滤与搜索状态
  const [inboundSearch, setInboundSearch] = useState("");
  const [inboundType, setInboundType] = useState("all");
  const [outboundSearch, setOutboundSearch] = useState("");
  const [outboundType, setOutboundType] = useState("all");
  const [stockSearch, setStockSearch] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [alertSearch, setAlertSearch] = useState("");
  const [alertLevel, setAlertLevel] = useState("all");
  const [handledFilter, setHandledFilter] = useState("all");

  // 分页状态
  const [inboundPage, setInboundPage] = useState(1);
  const [outboundPage, setOutboundPage] = useState(1);
  const [stockPage, setStockPage] = useState(1);
  const [alertPage, setAlertPage] = useState(1);
  const pageSize = 8;

  // ============ 弹窗状态 ============
  // 入库
  const [inboundFormOpen, setInboundFormOpen] = useState(false);
  const [inboundDetailOpen, setInboundDetailOpen] = useState(false);
  const [inboundDeleteOpen, setInboundDeleteOpen] = useState(false);
  const [inboundEditing, setInboundEditing] = useState<InboundRecord | null>(null);
  const [inboundDeleting, setInboundDeleting] = useState<InboundRecord | null>(null);
  const [inboundFormValues, setInboundFormValues] = useState<Record<string, unknown>>({});

  // 出库
  const [outboundFormOpen, setOutboundFormOpen] = useState(false);
  const [outboundDetailOpen, setOutboundDetailOpen] = useState(false);
  const [outboundDeleteOpen, setOutboundDeleteOpen] = useState(false);
  const [outboundEditing, setOutboundEditing] = useState<OutboundRecord | null>(null);
  const [outboundDeleting, setOutboundDeleting] = useState<OutboundRecord | null>(null);
  const [outboundFormValues, setOutboundFormValues] = useState<Record<string, unknown>>({});

  // ============ 过滤数据 ============
  const filteredInbound = useMemo(
    () =>
      inboundData.filter((r) => {
        const match =
          !inboundSearch ||
          r.product?.includes(inboundSearch) ||
          r.orderNo?.includes(inboundSearch) ||
          r.enterprise?.includes(inboundSearch);
        const typeOk = inboundType === "all" || r.type === inboundType;
        return match && typeOk;
      }),
    [inboundData, inboundSearch, inboundType]
  );

  const filteredOutbound = useMemo(
    () =>
      outboundData.filter((r) => {
        const match =
          !outboundSearch ||
          r.product?.includes(outboundSearch) ||
          r.orderNo?.includes(outboundSearch) ||
          r.buyer?.includes(outboundSearch);
        const typeOk = outboundType === "all" || r.type === outboundType;
        return match && typeOk;
      }),
    [outboundData, outboundSearch, outboundType]
  );

  const filteredStock = useMemo(
    () =>
      inventoryList.filter((r) => {
        const match =
          !stockSearch ||
          r.productName?.includes(stockSearch) ||
          r.regNo?.includes(stockSearch);
        const statusOk = stockStatusFilter === "all" || r.status === stockStatusFilter;
        return match && statusOk;
      }),
    [inventoryList, stockSearch, stockStatusFilter]
  );

  const filteredAlerts = useMemo(
    () =>
      alertList.filter((r) => {
        const match =
          !alertSearch ||
          r.product?.includes(alertSearch) ||
          r.enterprise?.includes(alertSearch) ||
          r.detail?.includes(alertSearch);
        const levelOk = alertLevel === "all" || r.level === alertLevel;
        const isHandled = handledIds.includes(r.id);
        let handledOk = true;
        if (handledFilter === "unhandled") handledOk = !isHandled;
        if (handledFilter === "handled") handledOk = isHandled;
        return match && levelOk && handledOk;
      }),
    [alertList, alertSearch, alertLevel, handledFilter, handledIds]
  );

  // ============ 分页数据 ============
  const pagedInbound = useMemo(() => {
    const start = (inboundPage - 1) * pageSize;
    return filteredInbound.slice(start, start + pageSize);
  }, [filteredInbound, inboundPage]);

  const pagedOutbound = useMemo(() => {
    const start = (outboundPage - 1) * pageSize;
    return filteredOutbound.slice(start, start + pageSize);
  }, [filteredOutbound, outboundPage]);

  const pagedStock = useMemo(() => {
    const start = (stockPage - 1) * pageSize;
    return filteredStock.slice(start, start + pageSize);
  }, [filteredStock, stockPage]);

  const pagedAlerts = useMemo(() => {
    const start = (alertPage - 1) * pageSize;
    return filteredAlerts.slice(start, start + pageSize);
  }, [filteredAlerts, alertPage]);

  // 搜索时重置到第一页
  React.useEffect(() => setInboundPage(1), [inboundSearch, inboundType]);
  React.useEffect(() => setOutboundPage(1), [outboundSearch, outboundType]);
  React.useEffect(() => setStockPage(1), [stockSearch, stockStatusFilter]);
  React.useEffect(() => setAlertPage(1), [alertSearch, alertLevel, handledFilter]);

  // ============ 统计数据 ============
  const unhandledCount = alertList.filter((a) => !handledIds.includes(a.id)).length;

  // ============ 入库 CRUD ============
  const openNewInbound = () => {
    const today = new Date().toISOString().slice(0, 10);
    setInboundEditing(null);
    setInboundFormValues({
      orderNo: `RK-${Date.now().toString().slice(-8)}`,
      enterprise: "",
      supplier: "",
      product: "",
      batchNo: "",
      quantity: "",
      unitPrice: "",
      amount: "",
      date: today,
      type: "采购入库",
      warehouse: "1号仓库",
      position: "",
      status: "待验收",
    });
    setInboundFormOpen(true);
  };

  const openEditInbound = (record: InboundRecord) => {
    setInboundEditing(record);
    setInboundFormValues({ ...record });
    setInboundFormOpen(true);
  };

  const submitInbound = () => {
    const values = inboundFormValues as Partial<InboundRecord>;
    if (!values.orderNo || !values.enterprise || !values.product || !values.amount || !values.date) {
      toast.error("请填写必填字段");
      return;
    }
    if (inboundEditing) {
      setInboundData((prev) =>
        prev.map((r) => (r.id === inboundEditing.id ? ({ ...r, ...values } as InboundRecord) : r))
      );
      toast.success("入库记录已更新");
    } else {
      const newId = String(Date.now());
      setInboundData((prev) => [
        { ...(values as InboundRecord), id: newId },
        ...prev,
      ]);
      toast.success("入库记录已新增");
    }
    setInboundFormOpen(false);
  };

  const confirmDeleteInbound = () => {
    if (!inboundDeleting) return;
    setInboundData((prev) => prev.filter((r) => r.id !== inboundDeleting.id));
    setInboundDeleteOpen(false);
    toast.success("已删除入库记录");
  };

  // ============ 出库 CRUD ============
  const openNewOutbound = () => {
    const today = new Date().toISOString().slice(0, 10);
    setOutboundEditing(null);
    setOutboundFormValues({
      orderNo: `CK-${Date.now().toString().slice(-8)}`,
      enterprise: "",
      buyer: "",
      buyerType: "农户",
      product: "",
      quantity: "",
      unitPrice: "",
      amount: "",
      date: today,
      type: "销售出库",
      purpose: "",
      region: "",
      status: "待出库",
    });
    setOutboundFormOpen(true);
  };

  const openEditOutbound = (record: OutboundRecord) => {
    setOutboundEditing(record);
    setOutboundFormValues({ ...record });
    setOutboundFormOpen(true);
  };

  const submitOutbound = () => {
    const values = outboundFormValues as Partial<OutboundRecord>;
    if (!values.orderNo || !values.enterprise || !values.buyer || !values.product || !values.amount || !values.date) {
      toast.error("请填写必填字段");
      return;
    }
    if (outboundEditing) {
      setOutboundData((prev) =>
        prev.map((r) => (r.id === outboundEditing.id ? ({ ...r, ...values } as OutboundRecord) : r))
      );
      toast.success("出库记录已更新");
    } else {
      const newId = String(Date.now());
      setOutboundData((prev) => [
        { ...(values as OutboundRecord), id: newId },
        ...prev,
      ]);
      toast.success("出库记录已新增");
    }
    setOutboundFormOpen(false);
  };

  const confirmDeleteOutbound = () => {
    if (!outboundDeleting) return;
    setOutboundData((prev) => prev.filter((r) => r.id !== outboundDeleting.id));
    setOutboundDeleteOpen(false);
    toast.success("已删除出库记录");
  };

  // ============ 预警处理 ============
  const handleAlert = (alertId: string) => {
    if (handledIds.includes(alertId)) return;
    setHandledIds((prev) => [...prev, alertId]);
    toast.success("预警已标记为已处理");
  };

  // ============ 总页数 ============
  const inboundTotalPages = Math.max(1, Math.ceil(filteredInbound.length / pageSize));
  const outboundTotalPages = Math.max(1, Math.ceil(filteredOutbound.length / pageSize));
  const stockTotalPages = Math.max(1, Math.ceil(filteredStock.length / pageSize));
  const alertTotalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));

  // ============ 渲染 ============
  return (
    <div className="p-6 space-y-4">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">经营电子台账</h1>
        <div className="flex gap-2">
          <Button onClick={openNewInbound}>
            <Plus className="mr-1 h-4 w-4" />
            新增入库
          </Button>
          <Button variant="outline" onClick={openNewOutbound}>
            <Plus className="mr-1 h-4 w-4" />
            新增出库
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="inbound">
            <LogIn className="mr-1 h-3.5 w-3.5" />
            入库记录
          </TabsTrigger>
          <TabsTrigger value="outbound">
            <LogOut className="mr-1 h-3.5 w-3.5" />
            出库记录
          </TabsTrigger>
          <TabsTrigger value="stock">
            <Package className="mr-1 h-3.5 w-3.5" />
            在库库存
          </TabsTrigger>
          <TabsTrigger value="alert">
            <Bell className="mr-1 h-3.5 w-3.5" />
            异常预警{unhandledCount > 0 && `(${unhandledCount})`}
          </TabsTrigger>
        </TabsList>

        {/* ============ Tab 1 - 全部 ============ */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{inboundData.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">本月采购量（单）</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{outboundData.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">本月销售量（单）</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {inboundData.reduce((sum) => sum + 1, 0) > 0 ? `${inboundData.length * 15.5}万元` : "0万元"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">本月采购额</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {outboundData.length > 0 ? `${(outboundData.length * 1.24).toFixed(1)}万元` : "0万元"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">本月销售额</p>
              </CardContent>
            </Card>
          </div>

          {/* 在库库存预警卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">在库库存预警</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTab("alert")}>
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {alertList.filter((a) => !handledIds.includes(a.id)).length === 0 ? (
                <EmptyState message="暂无预警记录" />
              ) : (
                alertList
                  .filter((a) => !handledIds.includes(a.id))
                  .slice(0, 3)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 p-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {alertTypeIcon[alert.type] ?? <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        <span>{alert.detail}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleAlert(alert.id)}>
                        处理
                      </Button>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>

          {/* 库存明细表 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">库存明细</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTab("stock")}>
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品名称</TableHead>
                    <TableHead>登记证号</TableHead>
                    <TableHead className="text-right">库存量</TableHead>
                    <TableHead className="text-right">安全库存</TableHead>
                    <TableHead>有效期至</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <EmptyState message="暂无库存数据" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventoryList.slice(0, 8).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="font-mono text-sm">{item.regNo}</TableCell>
                        <TableCell className="text-right">{item.stock}吨</TableCell>
                        <TableCell className="text-right">{item.safeStock}吨</TableCell>
                        <TableCell>{item.expiry}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={stockStatusBg[item.status] ?? ""}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 2 - 入库记录 ============ */}
        <TabsContent value="inbound" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={inboundType} onValueChange={setInboundType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="入库类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="采购入库">采购入库</SelectItem>
                <SelectItem value="退货入库">退货入库</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品/单号/企业..."
                className="pl-9 w-[260px]"
                value={inboundSearch}
                onChange={(e) => setInboundSearch(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>入库单号</TableHead>
                    <TableHead>入库企业</TableHead>
                    <TableHead>供货单位</TableHead>
                    <TableHead>产品名称</TableHead>
                    <TableHead>批次号</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>入库日期</TableHead>
                    <TableHead>入库类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInbound.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11}>
                        <EmptyState message="暂无入库记录" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedInbound.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-sm">{r.orderNo}</TableCell>
                        <TableCell className="font-medium">{r.enterprise}</TableCell>
                        <TableCell>{r.supplier}</TableCell>
                        <TableCell>{r.product}</TableCell>
                        <TableCell className="font-mono text-sm">{r.batchNo}</TableCell>
                        <TableCell className="text-right">{r.quantity}</TableCell>
                        <TableCell className="text-right">{r.amount}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {r.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={inboundStatusBg[r.status] ?? ""}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setInboundEditing(r);
                                setInboundDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditInbound(r)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setInboundDeleting(r);
                                setInboundDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="border-t px-4 py-3">
                <Pagination
                  page={inboundPage}
                  totalPages={inboundTotalPages}
                  onPageChange={setInboundPage}
                  pageSize={pageSize}
                  totalItems={filteredInbound.length}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 3 - 出库记录 ============ */}
        <TabsContent value="outbound" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={outboundType} onValueChange={setOutboundType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="出库类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="销售出库">销售出库</SelectItem>
                <SelectItem value="退货出库">退货出库</SelectItem>
                <SelectItem value="报损出库">报损出库</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品/单号/购买方..."
                className="pl-9 w-[260px]"
                value={outboundSearch}
                onChange={(e) => setOutboundSearch(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>出库单号</TableHead>
                    <TableHead>出库企业</TableHead>
                    <TableHead>购买方</TableHead>
                    <TableHead>购买方类型</TableHead>
                    <TableHead>产品</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>出库日期</TableHead>
                    <TableHead>出库类型</TableHead>
                    <TableHead>购买用途</TableHead>
                    <TableHead>流向地区</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutbound.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13}>
                        <EmptyState message="暂无出库记录" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedOutbound.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-sm">{r.orderNo}</TableCell>
                        <TableCell className="font-medium">{r.enterprise}</TableCell>
                        <TableCell>{r.buyer}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {r.buyerType}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.product}</TableCell>
                        <TableCell className="text-right">{r.quantity}</TableCell>
                        <TableCell className="text-right">{r.amount}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {r.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell className="text-sm">{r.region}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={outboundStatusBg[r.status] ?? ""}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setOutboundEditing(r);
                                setOutboundDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditOutbound(r)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setOutboundDeleting(r);
                                setOutboundDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="border-t px-4 py-3">
                <Pagination
                  page={outboundPage}
                  totalPages={outboundTotalPages}
                  onPageChange={setOutboundPage}
                  pageSize={pageSize}
                  totalItems={filteredOutbound.length}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 4 - 在库库存 ============ */}
        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="库存状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="正常">正常</SelectItem>
                <SelectItem value="临期">临期</SelectItem>
                <SelectItem value="不足">不足</SelectItem>
                <SelectItem value="过期">过期</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品名称/登记证号..."
                className="pl-9 w-[260px]"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品名称</TableHead>
                    <TableHead>登记证号</TableHead>
                    <TableHead className="text-right">库存量</TableHead>
                    <TableHead className="text-right">安全库存</TableHead>
                    <TableHead>有效期至</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <EmptyState message="暂无库存数据" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedStock.map((item, i) => {
                      const ratio = typeof item.stock === "number" ? item.stock / Math.max(item.safeStock, 0.0001) : 1;
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="font-mono text-sm">{item.regNo}</TableCell>
                          <TableCell className="text-right">{item.stock}吨</TableCell>
                          <TableCell className="text-right">{item.safeStock}吨</TableCell>
                          <TableCell>{item.expiry}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={stockStatusBg[item.status] ?? ""}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <div className="border-t px-4 py-3">
                <Pagination
                  page={stockPage}
                  totalPages={stockTotalPages}
                  onPageChange={setStockPage}
                  pageSize={pageSize}
                  totalItems={filteredStock.length}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 5 - 异常预警 ============ */}
        <TabsContent value="alert" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={alertLevel} onValueChange={setAlertLevel}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="预警级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="严重">严重</SelectItem>
                <SelectItem value="警告">警告</SelectItem>
              </SelectContent>
            </Select>
            <Select value={handledFilter} onValueChange={setHandledFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="unhandled">未处理</SelectItem>
                <SelectItem value="handled">已处理</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品/企业/详情..."
                className="pl-9 w-[260px]"
                value={alertSearch}
                onChange={(e) => setAlertSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {alertList.filter((a) => a.level === "严重").length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">严重预警</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {alertList.filter((a) => a.level === "警告").length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">警告预警</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{unhandledCount}</p>
                <p className="mt-1 text-sm text-muted-foreground">待处理</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{handledIds.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">已处理</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-10 w-10 text-green-400 mb-2" />
                  <p>暂无符合条件的预警记录</p>
                </CardContent>
              </Card>
            ) : (
              pagedAlerts.map((alert) => {
                const isHandled = handledIds.includes(alert.id);
                return (
                  <Card key={alert.id} className={isHandled ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                          {alertTypeIcon[alert.type] ?? (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className={alertLevelBg[alert.level] ?? ""}>
                              {alert.level}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {alert.type}
                            </Badge>
                            {isHandled && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                已处理
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-1">{alert.detail}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {alert.product && alert.product !== "-" && (
                              <span>产品：{alert.product}</span>
                            )}
                            <span>企业：{alert.enterprise}</span>
                            <span>时间：{alert.date}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {!isHandled && (
                            <Button size="sm" variant="outline" onClick={() => handleAlert(alert.id)}>
                              处理
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {filteredAlerts.length > 0 && (
            <div className="pt-2">
              <Pagination
                page={alertPage}
                totalPages={alertTotalPages}
                onPageChange={setAlertPage}
                pageSize={pageSize}
                totalItems={filteredAlerts.length}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ============ 弹窗：入库 ============ */}
      <FormModal
        open={inboundFormOpen}
        onClose={() => setInboundFormOpen(false)}
        title={inboundEditing ? "编辑入库记录" : "新增入库记录"}
        fields={inboundFormFields}
        values={inboundFormValues}
        onChange={(name, value) => setInboundFormValues((prev) => ({ ...prev, [name]: value }))}
        onSubmit={submitInbound}
      />
      <DetailModal
        open={inboundDetailOpen}
        onClose={() => setInboundDetailOpen(false)}
        title="入库记录详情"
        fields={inboundDetailFields}
        data={(inboundEditing as unknown as Record<string, unknown>) ?? null}
      />
      <DeleteDialog
        open={inboundDeleteOpen}
        onClose={() => setInboundDeleteOpen(false)}
        onConfirm={confirmDeleteInbound}
        itemName={inboundDeleting?.orderNo ?? ""}
      />

      {/* ============ 弹窗：出库 ============ */}
      <FormModal
        open={outboundFormOpen}
        onClose={() => setOutboundFormOpen(false)}
        title={outboundEditing ? "编辑出库记录" : "新增出库记录"}
        fields={outboundFormFields}
        values={outboundFormValues}
        onChange={(name, value) => setOutboundFormValues((prev) => ({ ...prev, [name]: value }))}
        onSubmit={submitOutbound}
      />
      <DetailModal
        open={outboundDetailOpen}
        onClose={() => setOutboundDetailOpen(false)}
        title="出库记录详情"
        fields={outboundDetailFields}
        data={(outboundEditing as unknown as Record<string, unknown>) ?? null}
      />
      <DeleteDialog
        open={outboundDeleteOpen}
        onClose={() => setOutboundDeleteOpen(false)}
        onConfirm={confirmDeleteOutbound}
        itemName={outboundDeleting?.orderNo ?? ""}
      />
    </div>
  );
}
