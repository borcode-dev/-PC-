"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Search, Plus, Upload, Eye, Pencil, Trash2, Factory, Leaf, Package, TrendingUp } from "lucide-react";
import { productionLedger as initialData, productionEnterprises, pesticideRegistrations } from "@/lib/mock-data";
import { FormModal, type FormField, DetailModal, type DetailField, DeleteDialog } from "@/components/crud";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/use-persisted-state";

interface ProductionLedgerItem {
  id: string;
  batchNo: string;
  productName: string;
  regNo: string;
  enterpriseId: string;
  enterprise: string;
  date: string;
  output: number;
  sold: number;
  stock: number;
  status: string;
}

const PAGE_SIZE = 10;

const initialMapped: ProductionLedgerItem[] = initialData.map((item, i) => ({
  id: `pl-${i + 1}`,
  batchNo: item.batchNo,
  productName: item.productName,
  regNo: item.regNo,
  enterpriseId: item.enterpriseId,
  enterprise: item.enterprise,
  date: item.date,
  output: item.output,
  sold: item.sold,
  stock: item.stock,
  status: item.status,
}));

const formFields: FormField[] = [
  { name: "batchNo", label: "批次编号", type: "text", required: true, placeholder: "如：PC-001*01" },
  {
    name: "productName",
    label: "产品名称",
    type: "select",
    required: true,
    options: pesticideRegistrations.map((p) => ({ label: p.name, value: p.name })),
  },
  {
    name: "regNo",
    label: "登记证号",
    type: "select",
    required: true,
    options: pesticideRegistrations.map((p) => ({ label: p.regNo, value: p.regNo })),
  },
  {
    name: "enterpriseId",
    label: "生产企业",
    type: "select",
    required: true,
    options: productionEnterprises.map((e) => ({ label: e.name, value: e.id })),
  },
  { name: "date", label: "生产日期", type: "date", required: true },
  { name: "output", label: "产量(吨)", type: "number", required: true, placeholder: "0" },
  { name: "sold", label: "销量(吨)", type: "number", required: true, placeholder: "0" },
  { name: "stock", label: "库存(吨)", type: "number", required: true, placeholder: "0" },
  {
    name: "status",
    label: "状态",
    type: "select",
    required: true,
    options: [
      { label: "正常", value: "正常" },
      { label: "临期", value: "临期" },
    ],
  },
];

const detailFields: DetailField[] = [
  { name: "batchNo", label: "批次编号" },
  { name: "productName", label: "产品名称" },
  { name: "regNo", label: "登记证号" },
  { name: "enterprise", label: "生产企业" },
  { name: "date", label: "生产日期" },
  { name: "output", label: "产量(吨)", type: "number" },
  { name: "sold", label: "销量(吨)", type: "number" },
  { name: "stock", label: "库存(吨)", type: "number" },
  { name: "status", label: "状态", type: "badge" },
];

export default function ProductionLedgerPage() {
  const [data, setData] = usePersistedState<ProductionLedgerItem[]>("production-ledger", initialMapped);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [enterpriseFilter, setEnterpriseFilter] = useState("all");
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

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (enterpriseFilter !== "all" && item.enterpriseId !== enterpriseFilter) return false;
      if (search) {
        const keyword = search.trim().toLowerCase();
        if (
          !item.productName.toLowerCase().includes(keyword) &&
          !item.batchNo.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [data, statusFilter, enterpriseFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const totalOutput = useMemo(() => data.reduce((s, e) => s + e.output, 0), [data]);
  const totalSold = useMemo(() => data.reduce((s, e) => s + e.sold, 0), [data]);
  const totalStock = useMemo(() => data.reduce((s, e) => s + e.stock, 0), [data]);

  const openAdd = () => {
    setFormMode("add");
    setFormValues({ status: "正常" });
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (item: ProductionLedgerItem) => {
    setFormMode("edit");
    setFormValues({ ...item });
    setEditingId(item.id);
    setFormOpen(true);
  };

  const openDetail = (item: ProductionLedgerItem) => {
    setDetailData({ ...item });
    setDetailOpen(true);
  };

  const openDelete = (item: ProductionLedgerItem) => {
    setDeleteId(item.id);
    setDeleteName(item.batchNo);
    setDeleteOpen(true);
  };

  const handleFormChange = (name: string, value: unknown) => {
    setFormValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "productName") {
        const reg = pesticideRegistrations.find((p) => p.name === value);
        if (reg) updated.regNo = reg.regNo;
      }
      if (name === "enterpriseId") {
        const ent = productionEnterprises.find((e) => e.id === value);
        if (ent) updated.enterprise = ent.name;
      }
      return updated;
    });
  };

  const handleFormSubmit = () => {
    if (formMode === "add") {
      const ent = productionEnterprises.find((e) => e.id === formValues.enterpriseId);
      const newItem: ProductionLedgerItem = {
        id: `pl-${Date.now()}`,
        batchNo: String(formValues.batchNo || ""),
        productName: String(formValues.productName || ""),
        regNo: String(formValues.regNo || ""),
        enterpriseId: String(formValues.enterpriseId || ""),
        enterprise: ent?.name || String(formValues.enterprise || ""),
        date: String(formValues.date || ""),
        output: Number(formValues.output) || 0,
        sold: Number(formValues.sold) || 0,
        stock: Number(formValues.stock) || 0,
        status: String(formValues.status || "正常"),
      };
      setData([newItem, ...data]);
      toast.success("新增成功", { description: `批次「${newItem.batchNo}」已添加` });
    } else if (editingId) {
      const ent = productionEnterprises.find((e) => e.id === formValues.enterpriseId);
      setData(
        data.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formValues,
                output: Number(formValues.output) ?? item.output,
                sold: Number(formValues.sold) ?? item.sold,
                stock: Number(formValues.stock) ?? item.stock,
                enterprise: ent?.name || item.enterprise,
              }
            : item
        )
      );
      toast.success("编辑成功", { description: `批次「${formValues.batchNo}」已更新` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== deleteId));
    toast.success("删除成功", { description: `批次「${deleteName}」已删除` });
    setDeleteOpen(false);
  };

  const handleBatchImport = () => {
    toast.info("批量导入", { description: "功能入口：请上传符合模板的 Excel 文件" });
  };

  const renderStatusBadge = (status: string) => {
    if (status === "临期") {
      return <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700">{status}</Badge>;
    }
    return <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-700">{status}</Badge>;
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">生产台账</h1>
        <div className="flex gap-2">
          <Button onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            新增批次
          </Button>
          <Button variant="outline" onClick={handleBatchImport}>
            <Upload className="mr-1 h-4 w-4" />
            批量导入
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">本月生产批次</p>
              <p className="mt-1 text-2xl font-bold text-primary">{data.length} 批</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Factory className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">累计产量(吨)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{totalOutput.toLocaleString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Leaf className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">累计销量(吨)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{totalSold.toLocaleString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">在库库存(吨)</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{totalStock.toLocaleString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="正常">正常</SelectItem>
                <SelectItem value="临期">临期</SelectItem>
              </SelectContent>
            </Select>

            <Select value={enterpriseFilter} onValueChange={(v) => { setEnterpriseFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="生产企业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部企业</SelectItem>
                {productionEnterprises.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品名称..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>批次编号</TableHead>
                <TableHead>产品名称</TableHead>
                <TableHead>登记证号</TableHead>
                <TableHead>生产企业</TableHead>
                <TableHead>生产日期</TableHead>
                <TableHead className="text-right">产量(吨)</TableHead>
                <TableHead className="text-right">销量(吨)</TableHead>
                <TableHead className="text-right">库存(吨)</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-center w-[220px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.batchNo}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.regNo}</TableCell>
                  <TableCell>{item.enterprise}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">{item.output}</TableCell>
                  <TableCell className="text-right">{item.sold}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell>{renderStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
                        <Eye className="mr-0.5 h-3.5 w-3.5" />查看
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                        <Pencil className="mr-0.5 h-3.5 w-3.5" />编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(item)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
            totalItems={filtered.length}
            className="pt-2"
          />
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "add" ? "新增生产批次" : "编辑生产批次"}
        fields={formFields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="批次详情"
        fields={detailFields}
        data={detailData}
      />
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        description={`确定要删除批次「${deleteName}」吗？删除后将无法恢复。`}
      />
    </div>
  );
}
