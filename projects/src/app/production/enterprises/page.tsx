"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Search, Eye, Pencil, Trash2, RefreshCw, Upload, Building2 } from "lucide-react";
import { productionEnterprises as initialData } from "@/lib/mock-data";
import { FormModal, type FormField, DetailModal, type DetailField, DeleteDialog } from "@/components/crud";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/use-persisted-state";

interface ProductionEnterprise {
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  phone: string;
  region: string;
  address: string;
  type: string;
  licenseNo: string;
  licenseExpiry: string;
  creditGrade: string;
  status: string;
}

const STATUS_TABS = ["全部", "正常", "临期", "过期", "整改中", "已停产"];

const statusColorMap: Record<string, { dot: string; badge: string }> = {
  "正常": { dot: "bg-green-500", badge: "bg-green-50 text-green-700 border-green-200" },
  "临期": { dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  "过期": { dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
  "整改中": { dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  "已停产": { dot: "bg-gray-500", badge: "bg-gray-50 text-gray-700 border-gray-200" },
};

const gradeColorMap: Record<string, string> = {
  A: "bg-green-50 text-green-700 border-green-200",
  B: "bg-blue-50 text-blue-700 border-blue-200",
  C: "bg-yellow-50 text-yellow-700 border-yellow-200",
  D: "bg-red-50 text-red-700 border-red-200",
};

const formFields: FormField[] = [
  { name: "name", label: "企业名称", type: "text", required: true, colSpan: 2, placeholder: "请输入企业全称" },
  { name: "creditCode", label: "统一社会信用代码", type: "text", required: true, placeholder: "18位统一社会信用代码" },
  { name: "legalPerson", label: "法定代表人", type: "text", required: true, placeholder: "法人姓名" },
  { name: "phone", label: "联系电话", type: "text", required: true, placeholder: "固定电话或手机号" },
  { name: "region", label: "所在地区", type: "select", required: true, options: [
    { label: "蚌埠市", value: "蚌埠市" },
    { label: "阜阳市", value: "阜阳市" },
    { label: "宿州市", value: "宿州市" },
    { label: "滁州市", value: "滁州市" },
    { label: "合肥市", value: "合肥市" },
    { label: "六安市", value: "六安市" },
    { label: "亳州市", value: "亳州市" },
  ]},
  { name: "address", label: "详细地址", type: "text", required: true, colSpan: 2, placeholder: "详细生产经营地址" },
  { name: "type", label: "生产类型", type: "select", required: true, options: [
    { label: "原药+制剂", value: "原药+制剂" },
    { label: "原药", value: "原药" },
    { label: "制剂", value: "制剂" },
  ]},
  { name: "licenseNo", label: "生产许可证号", type: "text", required: true, placeholder: "WP-XXXXXXXX" },
  { name: "licenseExpiry", label: "许可证有效期至", type: "date", required: true },
  { name: "creditGrade", label: "诚信等级", type: "select", required: true, options: [
    { label: "A级", value: "A" },
    { label: "B级", value: "B" },
    { label: "C级", value: "C" },
    { label: "D级", value: "D" },
  ]},
  { name: "status", label: "状态", type: "select", required: true, options: [
    { label: "正常", value: "正常" },
    { label: "临期", value: "临期" },
    { label: "过期", value: "过期" },
    { label: "整改中", value: "整改中" },
    { label: "已停产", value: "已停产" },
  ]},
];

const detailFields: DetailField[] = [
  { name: "name", label: "企业名称", colSpan: 2 },
  { name: "creditCode", label: "统一社会信用代码" },
  { name: "legalPerson", label: "法定代表人" },
  { name: "phone", label: "联系电话" },
  { name: "region", label: "所在地区" },
  { name: "address", label: "详细地址", colSpan: 2 },
  { name: "type", label: "生产类型" },
  { name: "licenseNo", label: "生产许可证号" },
  { name: "licenseExpiry", label: "许可证有效期至" },
  { name: "creditGrade", label: "诚信等级", type: "badge" },
  { name: "status", label: "状态", type: "badge" },
];

const PAGE_SIZE = 10;

export default function ProductionEnterprisesPage() {
  const [data, setData] = usePersistedState<ProductionEnterprise[]>(
    "production-enterprises",
    initialData as unknown as ProductionEnterprise[]
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<Record<string, unknown> | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { "全部": data.length };
    STATUS_TABS.slice(1).forEach((s) => {
      counts[s] = data.filter((e) => e.status === s).length;
    });
    return counts;
  }, [data]);

  const filtered = useMemo(() =>
    data.filter((e) => {
      if (statusFilter !== "全部" && e.status !== statusFilter) return false;
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (search) {
        const kw = search.trim().toLowerCase();
        if (!e.name.toLowerCase().includes(kw) && !e.licenseNo.toLowerCase().includes(kw)) return false;
      }
      return true;
    }),
    [data, statusFilter, typeFilter, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAdd = () => {
    setFormMode("add");
    setFormValues({
      status: "正常",
      creditGrade: "A",
      type: "制剂",
      name: "",
      creditCode: "",
      legalPerson: "",
      phone: "",
      region: "蚌埠市",
      address: "",
      licenseNo: "",
      licenseExpiry: "",
    });
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (item: ProductionEnterprise) => {
    setFormMode("edit");
    setFormValues({ ...item });
    setEditingId(item.id);
    setFormOpen(true);
  };

  const openDetail = (item: ProductionEnterprise) => {
    setDetailData({
      ...item,
      creditGrade: item.creditGrade + "级",
    });
    setDetailOpen(true);
  };

  const openDelete = (item: ProductionEnterprise) => {
    setDeleteId(item.id);
    setDeleteName(item.name);
    setDeleteOpen(true);
  };

  const validateForm = (): string | null => {
    for (const field of formFields) {
      if (field.required) {
        const v = formValues[field.name];
        if (v === undefined || v === null || String(v).trim() === "") {
          return `请填写${field.label}`;
        }
      }
    }
    return null;
  };

  const handleFormSubmit = () => {
    const err = validateForm();
    if (err) {
      toast.error(err);
      return;
    }

    if (formMode === "add") {
      const newItem: ProductionEnterprise = {
        id: `pe-${Date.now()}`,
        name: String(formValues.name || "").trim(),
        creditCode: String(formValues.creditCode || "").trim(),
        legalPerson: String(formValues.legalPerson || "").trim(),
        phone: String(formValues.phone || "").trim(),
        region: String(formValues.region || ""),
        address: String(formValues.address || "").trim(),
        type: String(formValues.type || "制剂"),
        licenseNo: String(formValues.licenseNo || "").trim(),
        licenseExpiry: String(formValues.licenseExpiry || ""),
        creditGrade: String(formValues.creditGrade || "A"),
        status: String(formValues.status || "正常"),
      };
      setData([newItem, ...data]);
      toast.success("新增成功", { description: `企业「${newItem.name}」已添加` });
    } else if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: String(formValues.name || item.name).trim(),
                creditCode: String(formValues.creditCode || item.creditCode).trim(),
                legalPerson: String(formValues.legalPerson || item.legalPerson).trim(),
                phone: String(formValues.phone || item.phone).trim(),
                region: String(formValues.region || item.region),
                address: String(formValues.address || item.address).trim(),
                type: String(formValues.type || item.type),
                licenseNo: String(formValues.licenseNo || item.licenseNo).trim(),
                licenseExpiry: String(formValues.licenseExpiry || item.licenseExpiry),
                creditGrade: String(formValues.creditGrade || item.creditGrade),
                status: String(formValues.status || item.status),
              }
            : item
        )
      );
      toast.success("编辑成功", { description: `企业「${formValues.name}」已更新` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setData(data.filter((item) => item.id !== deleteId));
    toast.success("删除成功", { description: `企业「${deleteName}」已删除` });
    setDeleteOpen(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const handleRefresh = () => {
    setSearch("");
    setStatusFilter("全部");
    setTypeFilter("all");
    setPage(1);
    toast.info("已刷新筛选条件");
  };

  const handleBatchImport = () => {
    toast.info("批量导入功能开发中", { description: "敬请期待" });
  };

  const renderStatusBadge = (status: string) => {
    const cfg = statusColorMap[status] || statusColorMap["正常"];
    return (
      <Badge variant="outline" className={`inline-flex items-center gap-1 ${cfg.badge}`}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {status}
      </Badge>
    );
  };

  const renderGradeBadge = (grade: string) => {
    const cls = gradeColorMap[grade] || gradeColorMap.A;
    return (
      <Badge variant="outline" className={cls}>{grade}级</Badge>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">生产企业管理</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBatchImport}>
            <Upload className="mr-1 h-4 w-4" />批量导入
          </Button>
          <Button onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />新增企业
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`relative px-4 py-2 text-sm transition-colors ${
                active
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              <span className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 text-xs ${
                active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {statusCounts[tab] ?? 0}
              </span>
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="生产类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="原药+制剂">原药+制剂</SelectItem>
            <SelectItem value="原药">原药</SelectItem>
            <SelectItem value="制剂">制剂</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="搜索企业名称或许可证号..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="ghost" onClick={handleRefresh}>
          <RefreshCw className="mr-1 h-4 w-4" />重置
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Building2 className="h-8 w-8 opacity-40" />
              </div>
              <p className="text-base font-medium">暂无生产企业数据</p>
              <p className="text-sm mt-1">点击右上角「新增企业」添加</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">企业名称</TableHead>
                    <TableHead className="min-w-[180px]">统一社会信用代码</TableHead>
                    <TableHead>所在地区</TableHead>
                    <TableHead className="min-w-[130px]">生产许可证号</TableHead>
                    <TableHead>许可证有效期至</TableHead>
                    <TableHead>生产类型</TableHead>
                    <TableHead>诚信等级</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-center w-[180px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{e.creditCode}</TableCell>
                      <TableCell>{e.region}</TableCell>
                      <TableCell className="font-mono text-sm">{e.licenseNo}</TableCell>
                      <TableCell>{e.licenseExpiry}</TableCell>
                      <TableCell>{e.type}</TableCell>
                      <TableCell>{renderGradeBadge(e.creditGrade)}</TableCell>
                      <TableCell>{renderStatusBadge(e.status)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(e)}>
                            <Eye className="mr-0.5 h-3.5 w-3.5" />查看
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(e)}>
                            <Pencil className="mr-0.5 h-3.5 w-3.5" />编辑
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(e)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t p-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>共 <span className="font-medium text-foreground">{filtered.length}</span> 家企业</span>
                </div>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  pageSize={PAGE_SIZE}
                  totalItems={filtered.length}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "add" ? "新增生产企业" : "编辑生产企业"}
        fields={formFields}
        values={formValues}
        onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
        onSubmit={handleFormSubmit}
      />

      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="企业详情"
        fields={detailFields}
        data={detailData}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        description={`确定要删除企业「${deleteName}」吗？删除后将无法恢复。`}
      />
    </div>
  );
}
