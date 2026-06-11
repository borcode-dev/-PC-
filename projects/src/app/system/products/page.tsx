"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Upload, Eye, Pencil, Trash2, Shield, AlertTriangle } from "lucide-react";
import { pesticideRegistrations as initialData, productionLedger } from "@/lib/mock-data";
import { FormModal, type FormField, DetailModal, type DetailField, DeleteDialog } from "@/components/crud";
import { toast } from "sonner";

type Registration = (typeof initialData)[number] & { id: string; producers?: string; attachment?: string };

const STORAGE_KEY = "pesticide-registrations";
const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = ["除草剂", "杀虫剂", "杀菌剂", "植物生长调节剂"];
const FORM_OPTIONS = ["水剂", "可湿性粉剂", "悬浮剂", "乳油", "水分散粒剂"];
const TOXICITY_OPTIONS = ["低毒", "中等毒", "高毒"];
const STATUS_OPTIONS = ["有效", "即将到期", "已过期"];

const formFields: FormField[] = [
  { name: "regNo", label: "登记证号", type: "text", required: true, placeholder: "PDXXXXXXXX" },
  { name: "name", label: "农药名称", type: "text", required: true, placeholder: "请输入农药名称" },
  { name: "form", label: "剂型", type: "select", required: true, options: FORM_OPTIONS.map((v) => ({ label: v, value: v })) },
  { name: "toxicity", label: "毒性等级", type: "select", required: true, options: TOXICITY_OPTIONS.map((v) => ({ label: v, value: v })) },
  { name: "content", label: "有效成分含量", type: "text", required: true, placeholder: "如41%" },
  { name: "category", label: "农药类别", type: "select", required: true, options: CATEGORY_OPTIONS.map((v) => ({ label: v, value: v })) },
  { name: "expiry", label: "有效期至", type: "date", required: true },
  { name: "status", label: "状态", type: "select", required: true, options: STATUS_OPTIONS.map((v) => ({ label: v, value: v })) },
  { name: "attachment", label: "附件材料", type: "file", accept: ".pdf,.doc,.docx,image/*" },
];

const detailFields: DetailField[] = [
  { name: "regNo", label: "登记证号" },
  { name: "name", label: "农药名称" },
  { name: "form", label: "剂型" },
  { name: "toxicity", label: "毒性等级" },
  { name: "content", label: "有效成分含量" },
  { name: "category", label: "农药类别" },
  { name: "expiry", label: "有效期至" },
  { name: "status", label: "状态", type: "badge" },
  { name: "producers", label: "生产企业", colSpan: 2 },
  { name: "attachment", label: "附件材料", type: "file" },
];

const toxicityBadge = (toxicity: string) => {
  if (toxicity === "高毒") return "bg-red-100 text-red-700 border-red-200";
  if (toxicity === "中等毒") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-green-100 text-green-700 border-green-200";
};

const statusBadge = (status: string) => {
  if (status === "已过期") return "bg-red-100 text-red-700 border-red-200";
  if (status === "即将到期") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-green-100 text-green-700 border-green-200";
};

function loadData(): Registration[] {
  if (typeof window === "undefined") {
    return initialData.map((item, i) => ({ ...item, id: `reg-${i}` }));
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Registration[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return initialData.map((item, i) => ({ ...item, id: `reg-${i}` }));
}

export default function ProductManagementPage() {
  const [data, setData] = useState<Registration[]>(() => loadData());
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formFilter, setFormFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<Record<string, unknown> | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const producersByRegNo = useMemo(() => {
    const map: Record<string, string[]> = {};
    productionLedger.forEach((ledger) => {
      if (!map[ledger.regNo]) map[ledger.regNo] = [];
      if (!map[ledger.regNo].includes(ledger.enterprise)) map[ledger.regNo].push(ledger.enterprise);
    });
    return map;
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.length, 有效: 0, 即将到期: 0, 已过期: 0 };
    data.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status]++;
    });
    return counts;
  }, [data]);

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        const matchesForm = formFilter === "all" || item.form === formFilter;
        const matchesSearch =
          !searchTerm || item.name.includes(searchTerm) || item.regNo.includes(searchTerm);
        return matchesStatus && matchesCategory && matchesForm && matchesSearch;
      }),
    [data, statusFilter, categoryFilter, formFilter, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = useMemo(
    () => filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredData, currentPage]
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, formFilter, searchTerm]);

  const enrichItem = (item: Registration) => ({
    ...item,
    producers: producersByRegNo[item.regNo]?.join("、") || "暂无",
  });

  const openAdd = () => {
    setFormMode("add");
    setFormValues({ status: "有效", toxicity: "低毒", form: "水剂", category: "除草剂" });
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (item: Registration) => {
    setFormMode("edit");
    setFormValues({ ...item });
    setEditingId(item.id);
    setFormOpen(true);
  };

  const openDetail = (item: Registration) => {
    setDetailData(enrichItem(item));
    setDetailOpen(true);
  };

  const openDelete = (item: Registration) => {
    setDeleteId(item.id);
    setDeleteName(item.name);
    setDeleteOpen(true);
  };

  const handleFormChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (formMode === "add") {
      const newItem = { ...formValues, id: `reg-${Date.now()}` } as Registration;
      setData((prev) => [newItem, ...prev]);
      toast.success("新增成功", { description: `登记证「${formValues.regNo}」已添加` });
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId ? ({ ...item, ...formValues } as Registration) : item
        )
      );
      toast.success("编辑成功", { description: `登记证「${formValues.regNo}」已更新` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== deleteId));
    toast.success("删除成功", { description: `登记证「${deleteName}」已删除` });
    setDeleteOpen(false);
  };

  const handleBatchImport = () => {
    toast.info("批量导入", { description: "请选择要导入的 Excel/CSV 文件（演示）" });
  };

  const handleReset = () => {
    setData(initialData.map((item, i) => ({ ...item, id: `reg-${i}` })));
    toast.success("已重置为初始数据");
  };

  const tabs = [
    { key: "all", label: "全部", icon: Package },
    { key: "有效", label: "有效", icon: Shield },
    { key: "即将到期", label: "即将到期", icon: AlertTriangle },
    { key: "已过期", label: "已过期", icon: Trash2 },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">农药登记证管理</h1>
            <p className="text-xs text-muted-foreground">
              管理辖区内所有农药产品登记证信息，共 {data.length} 条记录
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} title="重置为初始数据">
            重置数据
          </Button>
          <Button variant="outline" onClick={handleBatchImport}>
            <Upload className="mr-1 h-4 w-4" />
            批量导入
          </Button>
          <Button onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            新增登记证
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-1 border-b px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${
                    active
                      ? "text-primary border-primary font-medium"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {statusCounts[tab.key] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 p-4 border-b bg-muted/20">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="农药类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="剂型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部剂型</SelectItem>
                {FORM_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px] max-w-[340px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索农药名称或登记证号..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">登记证号</TableHead>
                  <TableHead>农药名称</TableHead>
                  <TableHead>剂型</TableHead>
                  <TableHead>毒性等级</TableHead>
                  <TableHead>有效成分</TableHead>
                  <TableHead>农药类别</TableHead>
                  <TableHead className="w-[110px]">有效期至</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-center w-[200px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{item.regNo}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.form}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${toxicityBadge(item.toxicity)}`}>
                        {item.toxicity}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.content}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${statusBadge(item.status)}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
                          <Eye className="mr-0.5 h-3.5 w-3.5" />
                          查看
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                          <Pencil className="mr-0.5 h-3.5 w-3.5" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDelete(item)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-10 w-10 opacity-40" />
                        <p className="text-sm">暂无匹配的登记证数据</p>
                        <p className="text-xs">尝试调整筛选条件或新增一条记录</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t text-sm">
            <span className="text-muted-foreground">
              共 <span className="font-medium text-foreground">{filteredData.length}</span> 条登记证
              {currentPage > 0 && filteredData.length > 0 && (
                <span className="ml-2 text-xs">
                  （第 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredData.length)} 条）
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                上一页
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "add" ? "新增登记证" : "编辑登记证"}
        fields={formFields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="登记证详情"
        fields={detailFields}
        data={detailData}
      />
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        description={`确定要删除登记证「${deleteName}」吗？删除后将无法恢复。`}
      />
    </div>
  );
}
