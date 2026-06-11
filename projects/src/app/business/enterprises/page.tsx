"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Pagination } from "@/components/ui/pagination";
import { Search, Plus, Upload, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { businessEnterprises as initialData } from "@/lib/mock-data";
import { FormModal, type FormField, DetailModal, type DetailField, DeleteDialog } from "@/components/crud";
import type { UploadedFile } from "@/components/crud/file-upload";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/use-persisted-state";

interface Enterprise {
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
  canRestricted: string;
  attachment?: UploadedFile[];
  licenseFile?: UploadedFile[];
}

const STATUS_TABS = ["全部", "正常", "临期", "过期", "整改中", "已停业"] as const;
const TYPE_OPTIONS = [
  { label: "全部", value: "全部" },
  { label: "批发+零售", value: "批发+零售" },
  { label: "批发", value: "批发" },
  { label: "零售", value: "零售" },
];

const statusConfig: Record<string, string> = {
  "正常": "bg-green-100 text-green-700 hover:bg-green-100",
  "临期": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  "过期": "bg-red-100 text-red-700 hover:bg-red-100",
  "整改中": "bg-orange-100 text-orange-700 hover:bg-orange-100",
  "已停业": "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

const gradeConfig: Record<string, string> = {
  "A": "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  "B": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  "C": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  "D": "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
};

const formFields: FormField[] = [
  { name: "name", label: "企业名称", type: "text", required: true, colSpan: 2, placeholder: "请输入企业全称" },
  { name: "creditCode", label: "统一社会信用代码", type: "text", required: true, placeholder: "18位统一社会信用代码" },
  { name: "legalPerson", label: "法定代表人", type: "text", required: true, placeholder: "法人/负责人姓名" },
  { name: "phone", label: "联系电话", type: "text", required: true, placeholder: "联系方式" },
  { name: "region", label: "所在地区", type: "select", required: true, options: [
    { label: "蚌埠市怀远县", value: "蚌埠市怀远县" },
    { label: "蚌埠市蚌山区", value: "蚌埠市蚌山区" },
    { label: "阜阳市颍东区", value: "阜阳市颍东区" },
    { label: "宿州市埇桥区", value: "宿州市埇桥区" },
    { label: "合肥市肥西县", value: "合肥市肥西县" },
    { label: "滁州市南谯区", value: "滁州市南谯区" },
  ] },
  { name: "address", label: "详细地址", type: "text", required: true, colSpan: 2, placeholder: "实际经营地址" },
  { name: "type", label: "经营类型", type: "select", required: true, options: [
    { label: "批发+零售", value: "批发+零售" },
    { label: "批发", value: "批发" },
    { label: "零售", value: "零售" },
  ] },
  { name: "licenseNo", label: "经营许可证号", type: "text", required: true, placeholder: "JY-XXXXXXXXX" },
  { name: "licenseExpiry", label: "许可证有效期至", type: "date", required: true },
  { name: "canRestricted", label: "可经营限制农药", type: "select", options: [
    { label: "是", value: "是" },
    { label: "否", value: "否" },
  ] },
  { name: "creditGrade", label: "诚信等级", type: "select", options: [
    { label: "A级", value: "A" },
    { label: "B级", value: "B" },
    { label: "C级", value: "C" },
    { label: "D级", value: "D" },
  ] },
  { name: "status", label: "状态", type: "select", options: [
    { label: "正常", value: "正常" },
    { label: "临期", value: "临期" },
    { label: "过期", value: "过期" },
    { label: "整改中", value: "整改中" },
    { label: "已停业", value: "已停业" },
  ] },
  { name: "licenseFile", label: "经营许可证附件", type: "image", accept: "image/*,.pdf", maxFiles: 3, colSpan: 2 },
  { name: "attachment", label: "其他附件材料", type: "file", accept: "image/*,.pdf,.doc,.docx", maxFiles: 5, colSpan: 2 },
];

const detailFields: DetailField[] = [
  { name: "name", label: "企业名称", colSpan: 2 },
  { name: "creditCode", label: "统一社会信用代码" },
  { name: "legalPerson", label: "法定代表人" },
  { name: "phone", label: "联系电话" },
  { name: "region", label: "所在地区" },
  { name: "address", label: "详细地址", colSpan: 2 },
  { name: "type", label: "经营类型" },
  { name: "licenseNo", label: "经营许可证号" },
  { name: "licenseExpiry", label: "许可证有效期至" },
  { name: "canRestricted", label: "可经营限制农药" },
  { name: "creditGrade", label: "诚信等级" },
  { name: "status", label: "状态", type: "badge" },
  { name: "licenseFile", label: "经营许可证附件", type: "image", colSpan: 2 },
  { name: "attachment", label: "其他附件材料", type: "file", colSpan: 2 },
];

const PAGE_SIZE = 10;

function normalizeEnterprise(raw: Record<string, unknown>, idx: number): Enterprise {
  return {
    id: String(raw.id ?? `be-${Date.now()}-${idx}`),
    name: String(raw.name ?? ""),
    creditCode: String(raw.creditCode ?? ""),
    legalPerson: String(raw.legalPerson ?? ""),
    phone: String(raw.phone ?? ""),
    region: String(raw.region ?? ""),
    address: String(raw.address ?? ""),
    type: String(raw.type ?? "零售"),
    licenseNo: String(raw.licenseNo ?? ""),
    licenseExpiry: String(raw.licenseExpiry ?? ""),
    creditGrade: String(raw.creditGrade ?? "B"),
    status: String(raw.status ?? "正常"),
    canRestricted: raw.restrictedPesticide === true || raw.restrictedPesticide === "是" ? "是" : "否",
    attachment: (raw.attachment as UploadedFile[]) || [],
    licenseFile: (raw.licenseFile as UploadedFile[]) || [],
  };
}

const defaultFormValues = (): Record<string, unknown> => ({
  name: "",
  creditCode: "",
  legalPerson: "",
  phone: "",
  region: "",
  address: "",
  type: "零售",
  licenseNo: "",
  licenseExpiry: "",
  canRestricted: "否",
  creditGrade: "B",
  status: "正常",
  attachment: [],
  licenseFile: [],
});

export default function BusinessEnterprisesPage() {
  const initialMapped = (initialData as unknown as Record<string, unknown>[]).map((e, idx) =>
    normalizeEnterprise(e, idx)
  );

  const [data, setData] = usePersistedState<Enterprise[]>("business-enterprises", initialMapped);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [typeFilter, setTypeFilter] = useState<string>("全部");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formValues, setFormValues] = useState<Record<string, unknown>>(defaultFormValues());
  const [editingId, setEditingId] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<Record<string, unknown> | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const filtered = useMemo(() => {
    return data.filter((e) => {
      if (statusFilter !== "全部" && e.status !== statusFilter) return false;
      if (typeFilter !== "全部" && e.type !== typeFilter) return false;
      if (search) {
        const kw = search.trim().toLowerCase();
        if (!kw) return true;
        const hitName = e.name.toLowerCase().includes(kw);
        const hitLicense = e.licenseNo.toLowerCase().includes(kw);
        if (!hitName && !hitLicense) return false;
      }
      return true;
    });
  }, [data, statusFilter, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const openAdd = () => {
    setFormMode("add");
    setFormValues(defaultFormValues());
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (item: Enterprise) => {
    setFormMode("edit");
    setFormValues({
      ...item,
      attachment: item.attachment || [],
      licenseFile: item.licenseFile || [],
    });
    setEditingId(item.id);
    setFormOpen(true);
  };

  const openDetail = (item: Enterprise) => {
    const displayGrade = item.creditGrade;
    setDetailData({
      ...item,
      creditGrade:
        displayGrade && displayGrade.length === 1 && /^[A-D]$/i.test(displayGrade)
          ? `${displayGrade.toUpperCase()}级`
          : displayGrade,
    });
    setDetailOpen(true);
  };

  const openDelete = (item: Enterprise) => {
    setDeleteId(item.id);
    setDeleteName(item.name);
    setDeleteOpen(true);
  };

  const handleFormChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (!formValues.name || String(formValues.name).trim() === "") {
      toast.error("请填写企业名称");
      return;
    }
    if (!formValues.creditCode || String(formValues.creditCode).trim() === "") {
      toast.error("请填写统一社会信用代码");
      return;
    }
    if (formMode === "add") {
      const newItem: Enterprise = {
        id: `be-${Date.now()}`,
        name: String(formValues.name || ""),
        creditCode: String(formValues.creditCode || ""),
        legalPerson: String(formValues.legalPerson || ""),
        phone: String(formValues.phone || ""),
        region: String(formValues.region || ""),
        address: String(formValues.address || ""),
        type: String(formValues.type || "零售"),
        licenseNo: String(formValues.licenseNo || ""),
        licenseExpiry: String(formValues.licenseExpiry || ""),
        creditGrade: String(formValues.creditGrade || "B"),
        status: String(formValues.status || "正常"),
        canRestricted: String(formValues.canRestricted || "否"),
        attachment: (formValues.attachment as UploadedFile[]) || [],
        licenseFile: (formValues.licenseFile as UploadedFile[]) || [],
      };
      setData((prev) => [newItem, ...prev]);
      toast.success("新增成功", { description: `企业「${newItem.name}」已添加` });
    } else if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formValues,
                id: item.id,
                attachment: (formValues.attachment as UploadedFile[]) || item.attachment || [],
                licenseFile: (formValues.licenseFile as UploadedFile[]) || item.licenseFile || [],
              }
            : item
        )
      );
      toast.success("编辑成功", { description: `企业「${formValues.name}」已更新` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setData((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("删除成功", { description: `企业「${deleteName}」已删除` });
    }
    setDeleteOpen(false);
  };

  const renderGradeBadge = (grade: string) => {
    const key = (grade || "").toUpperCase().replace(/级/g, "").charAt(0) || "B";
    const cls = gradeConfig[key] || gradeConfig["B"];
    const label = /级$/.test(grade) ? grade : `${key}级`;
    return (
      <Badge variant="outline" className={cls}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">经营企业管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理农药经营企业档案、许可证与诚信等级
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openAdd}>
            <Plus className="mr-1.5 h-4 w-4" /> 新增企业
          </Button>
          <Button variant="outline">
            <Upload className="mr-1.5 h-4 w-4" /> 批量导入
          </Button>
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> 导出
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab;
            return (
              <Button
                key={tab}
                variant={active ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setStatusFilter(tab);
                  setPage(1);
                }}
                className={active ? "" : "text-muted-foreground"}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 pt-3 pb-4 border-b">
          <div className="w-[200px]">
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="经营类型" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 min-w-[240px] max-w-[480px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="按企业名称或许可证号搜索..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">{filtered.length}</span> 家企业
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">企业名称</TableHead>
                  <TableHead className="min-w-[180px]">统一社会信用代码</TableHead>
                  <TableHead className="min-w-[140px]">所在地区</TableHead>
                  <TableHead className="min-w-[160px]">经营许可证号</TableHead>
                  <TableHead className="min-w-[130px]">有效期至</TableHead>
                  <TableHead className="min-w-[110px]">经营类型</TableHead>
                  <TableHead className="min-w-[120px] text-center">可经营限制农药</TableHead>
                  <TableHead className="min-w-[100px] text-center">诚信等级</TableHead>
                  <TableHead className="min-w-[100px] text-center">状态</TableHead>
                  <TableHead className="w-[180px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 opacity-40" />
                        <span>暂无符合条件的经营企业</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="font-mono text-xs">{e.creditCode}</TableCell>
                      <TableCell>{e.region}</TableCell>
                      <TableCell className="font-mono text-xs">{e.licenseNo}</TableCell>
                      <TableCell>{e.licenseExpiry}</TableCell>
                      <TableCell>{e.type}</TableCell>
                      <TableCell className="text-center">{e.canRestricted}</TableCell>
                      <TableCell className="text-center">{renderGradeBadge(e.creditGrade)}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={statusConfig[e.status] || statusConfig["正常"]}
                        >
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(e)}>
                            <Eye className="mr-0.5 h-3.5 w-3.5" /> 查看
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(e)}>
                            <Pencil className="mr-0.5 h-3.5 w-3.5" /> 编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDelete(e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="px-4 py-3 border-t">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
            />
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "add" ? "新增经营企业" : "编辑经营企业"}
        fields={formFields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        submitLabel={formMode === "add" ? "确认新增" : "保存修改"}
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
