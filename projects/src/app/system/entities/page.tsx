"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Eye,
  Pencil,
  Trash2,
  Factory,
  Store,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormModal,
  type FormField,
  DetailModal,
  type DetailField,
  DeleteDialog,
} from "@/components/crud";
import { Pagination } from "@/components/ui/pagination";
import { usePersistedState } from "@/hooks/use-persisted-state";

import {
  productionEnterprises as initialProductionEnterprises,
  businessEnterprises as initialBusinessEnterprises,
} from "@/lib/mock-data";

// ============================================================
// 类型定义
// ============================================================
interface ProductionEnterprise {
  id: string;
  name: string;
  type: string;
  licenseNo: string;
  licenseExpiry: string;
  status: string;
  region: string;
  legalPerson: string;
  phone: string;
  address: string;
  creditCode: string;
  licenseScope: string;
  licenseIssuer: string;
  licenseStart: string;
  creditGrade: string;
  productRegNos: string[];
}

interface BusinessEnterprise {
  id: string;
  name: string;
  type: string;
  licenseNo: string;
  licenseExpiry: string;
  status: string;
  region: string;
  legalPerson: string;
  phone: string;
  address: string;
  creditCode: string;
  area: number;
  restrictedPesticide: boolean;
  restrictedLicenseNo: string;
  licenseStart: string;
  licenseIssuer: string;
  creditGrade: string;
}

// ============================================================
// 常量
// ============================================================
const STATUS_OPTIONS = [
  { label: "正常", value: "正常" },
  { label: "临期", value: "临期" },
  { label: "过期", value: "过期" },
  { label: "整改中", value: "整改中" },
];

const PRODUCTION_TYPE_OPTIONS = [
  { label: "原药", value: "原药" },
  { label: "制剂", value: "制剂" },
  { label: "原药+制剂", value: "原药+制剂" },
];

const BUSINESS_TYPE_OPTIONS = [
  { label: "批发", value: "批发" },
  { label: "零售", value: "零售" },
  { label: "批发+零售", value: "批发+零售" },
];

const CREDIT_GRADE_OPTIONS = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
];

const REGION_OPTIONS = [
  { label: "合肥市", value: "合肥市" },
  { label: "蚌埠市", value: "蚌埠市" },
  { label: "阜阳市", value: "阜阳市" },
  { label: "宿州市", value: "宿州市" },
  { label: "滁州市", value: "滁州市" },
  { label: "六安市", value: "六安市" },
  { label: "亳州市", value: "亳州市" },
];

const PAGE_SIZE = 10;

const EMPTY_PRODUCTION: ProductionEnterprise = {
  id: "",
  name: "",
  type: "原药",
  licenseNo: "",
  licenseExpiry: "",
  status: "正常",
  region: "",
  legalPerson: "",
  phone: "",
  address: "",
  creditCode: "",
  licenseScope: "",
  licenseIssuer: "",
  licenseStart: "",
  creditGrade: "A",
  productRegNos: [],
};

const EMPTY_BUSINESS: BusinessEnterprise = {
  id: "",
  name: "",
  type: "批发",
  licenseNo: "",
  licenseExpiry: "",
  status: "正常",
  region: "",
  legalPerson: "",
  phone: "",
  address: "",
  creditCode: "",
  area: 0,
  restrictedPesticide: false,
  restrictedLicenseNo: "",
  licenseStart: "",
  licenseIssuer: "",
  creditGrade: "A",
};

// ============================================================
// 表单字段
// ============================================================
const PRODUCTION_FIELDS: FormField[] = [
  { name: "name", label: "企业名称", type: "text", required: true, placeholder: "请输入企业名称" },
  { name: "creditCode", label: "统一社会信用代码", type: "text", required: true, placeholder: "请输入信用代码" },
  { name: "region", label: "所在地区", type: "select", required: true, options: REGION_OPTIONS },
  { name: "legalPerson", label: "法定代表人", type: "text", placeholder: "请输入法定代表人" },
  { name: "phone", label: "联系电话", type: "text", placeholder: "请输入联系电话" },
  { name: "address", label: "详细地址", type: "text", colSpan: 2, placeholder: "请输入详细地址" },
  { name: "licenseNo", label: "生产许可证号", type: "text", required: true, placeholder: "请输入生产许可证号" },
  { name: "type", label: "生产类型", type: "select", required: true, options: PRODUCTION_TYPE_OPTIONS },
  { name: "licenseScope", label: "许可范围", type: "text", placeholder: "请输入许可范围" },
  { name: "licenseIssuer", label: "发证机关", type: "text", placeholder: "请输入发证机关" },
  { name: "licenseStart", label: "发证日期", type: "date" },
  { name: "licenseExpiry", label: "有效期至", type: "date" },
  { name: "creditGrade", label: "诚信等级", type: "select", options: CREDIT_GRADE_OPTIONS },
  { name: "status", label: "状态", type: "select", required: true, options: STATUS_OPTIONS },
];

const BUSINESS_FIELDS: FormField[] = [
  { name: "name", label: "企业名称", type: "text", required: true, placeholder: "请输入企业名称" },
  { name: "creditCode", label: "统一社会信用代码", type: "text", required: true, placeholder: "请输入信用代码" },
  { name: "region", label: "所在地区", type: "select", required: true, options: REGION_OPTIONS },
  { name: "legalPerson", label: "法定代表人", type: "text", placeholder: "请输入法定代表人" },
  { name: "phone", label: "联系电话", type: "text", placeholder: "请输入联系电话" },
  { name: "address", label: "经营地址", type: "text", colSpan: 2, placeholder: "请输入经营地址" },
  { name: "licenseNo", label: "经营许可证号", type: "text", required: true, placeholder: "请输入经营许可证号" },
  { name: "type", label: "经营类型", type: "select", required: true, options: BUSINESS_TYPE_OPTIONS },
  { name: "area", label: "经营面积(㎡)", type: "number", placeholder: "请输入经营面积" },
  {
    name: "restrictedPesticide",
    label: "可经营限制农药",
    type: "select",
    options: [
      { label: "是", value: "true" },
      { label: "否", value: "false" },
    ],
  },
  { name: "restrictedLicenseNo", label: "限制农药许可证号", type: "text", placeholder: "如可经营限制农药请填写" },
  { name: "licenseIssuer", label: "发证机关", type: "text", placeholder: "请输入发证机关" },
  { name: "licenseStart", label: "发证日期", type: "date" },
  { name: "licenseExpiry", label: "有效期至", type: "date" },
  { name: "creditGrade", label: "诚信等级", type: "select", options: CREDIT_GRADE_OPTIONS },
  { name: "status", label: "状态", type: "select", required: true, options: STATUS_OPTIONS },
];

const PRODUCTION_DETAIL_FIELDS: DetailField[] = [
  { name: "name", label: "企业名称", colSpan: 2 },
  { name: "creditCode", label: "统一社会信用代码" },
  { name: "region", label: "所在地区" },
  { name: "legalPerson", label: "法定代表人" },
  { name: "phone", label: "联系电话" },
  { name: "address", label: "详细地址", colSpan: 2 },
  { name: "licenseNo", label: "生产许可证号" },
  { name: "type", label: "生产类型" },
  { name: "licenseScope", label: "许可范围", colSpan: 2 },
  { name: "licenseIssuer", label: "发证机关" },
  { name: "licenseStart", label: "发证日期" },
  { name: "licenseExpiry", label: "有效期至" },
  { name: "creditGrade", label: "诚信等级", type: "badge" },
  { name: "status", label: "状态", type: "badge" },
];

const BUSINESS_DETAIL_FIELDS: DetailField[] = [
  { name: "name", label: "企业名称", colSpan: 2 },
  { name: "creditCode", label: "统一社会信用代码" },
  { name: "region", label: "所在地区" },
  { name: "legalPerson", label: "法定代表人" },
  { name: "phone", label: "联系电话" },
  { name: "address", label: "经营地址", colSpan: 2 },
  { name: "licenseNo", label: "经营许可证号" },
  { name: "type", label: "经营类型" },
  { name: "area", label: "经营面积(㎡)", type: "number" },
  { name: "restrictedPesticide", label: "可经营限制农药" },
  { name: "restrictedLicenseNo", label: "限制农药许可证号" },
  { name: "licenseIssuer", label: "发证机关" },
  { name: "licenseStart", label: "发证日期" },
  { name: "licenseExpiry", label: "有效期至" },
  { name: "creditGrade", label: "诚信等级", type: "badge" },
  { name: "status", label: "状态", type: "badge" },
];

// ============================================================
// 工具函数
// ============================================================
function getStatusBadgeVariant(status: string): string {
  const map: Record<string, string> = {
    正常: "bg-green-100 text-green-700 border-green-200",
    临期: "bg-yellow-100 text-yellow-700 border-yellow-200",
    过期: "bg-red-100 text-red-700 border-red-200",
    整改中: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

function getCreditBadgeVariant(grade: string): string {
  const map: Record<string, string> = {
    A: "bg-blue-100 text-blue-700 border-blue-200",
    B: "bg-green-100 text-green-700 border-green-200",
    C: "bg-yellow-100 text-yellow-700 border-yellow-200",
    D: "bg-red-100 text-red-700 border-red-200",
  };
  return map[grade] || "bg-slate-100 text-slate-700 border-slate-200";
}

function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string
) {
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const v = row[h.key];
        const str = Array.isArray(v) ? v.join("、") : String(v ?? "");
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const headerRow = headers.map((h) => `"${h.label}"`).join(",");
  const csv = "\ufeff" + [headerRow, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateId(): string {
  return Date.now().toString();
}

// ============================================================
// 页面组件
// ============================================================
export default function EntitiesPage() {
  // ---------- 持久化数据 ----------
  const [productionList, setProductionList] = usePersistedState<ProductionEnterprise[]>(
    "production-entities",
    initialProductionEnterprises as ProductionEnterprise[]
  );
  const [businessList, setBusinessList] = usePersistedState<BusinessEnterprise[]>(
    "business-entities",
    initialBusinessEnterprises as BusinessEnterprise[]
  );

  // ---------- Tab ----------
  const [activeTab, setActiveTab] = useState<"production" | "business">("production");

  // ---------- 生产企业筛选/分页 ----------
  const [productionSearch, setProductionSearch] = useState("");
  const [productionRegion, setProductionRegion] = useState<string>("");
  const [productionStatus, setProductionStatus] = useState<string>("");
  const [productionPage, setProductionPage] = useState(1);

  // ---------- 经营企业筛选/分页 ----------
  const [businessSearch, setBusinessSearch] = useState("");
  const [businessRegion, setBusinessRegion] = useState<string>("");
  const [businessStatus, setBusinessStatus] = useState<string>("");
  const [businessPage, setBusinessPage] = useState(1);

  // ---------- 新增弹窗（选择类型） ----------
  const [addTypeOpen, setAddTypeOpen] = useState(false);

  // ---------- 表单状态 ----------
  const [productionFormOpen, setProductionFormOpen] = useState(false);
  const [productionFormValues, setProductionFormValues] =
    useState<Record<string, unknown>>({});
  const [productionEditing, setProductionEditing] = useState<ProductionEnterprise | null>(null);

  const [businessFormOpen, setBusinessFormOpen] = useState(false);
  const [businessFormValues, setBusinessFormValues] = useState<Record<string, unknown>>({});
  const [businessEditing, setBusinessEditing] = useState<BusinessEnterprise | null>(null);

  // ---------- 查看详情 ----------
  const [productionDetail, setProductionDetail] = useState<ProductionEnterprise | null>(null);
  const [businessDetail, setBusinessDetail] = useState<BusinessEnterprise | null>(null);

  // ---------- 删除 ----------
  const [productionDeleting, setProductionDeleting] = useState<ProductionEnterprise | null>(null);
  const [businessDeleting, setBusinessDeleting] = useState<BusinessEnterprise | null>(null);

  // ---------- 筛选数据 ----------
  const filteredProduction = useMemo(() => {
    const kw = productionSearch.trim().toLowerCase();
    return productionList.filter((e) => {
      if (productionRegion && !e.region.includes(productionRegion)) return false;
      if (productionStatus && e.status !== productionStatus) return false;
      if (kw) {
        return (
          e.name.toLowerCase().includes(kw) ||
          e.creditCode.toLowerCase().includes(kw) ||
          e.licenseNo.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [productionList, productionSearch, productionRegion, productionStatus]);

  const filteredBusiness = useMemo(() => {
    const kw = businessSearch.trim().toLowerCase();
    return businessList.filter((e) => {
      if (businessRegion && !e.region.includes(businessRegion)) return false;
      if (businessStatus && e.status !== businessStatus) return false;
      if (kw) {
        return (
          e.name.toLowerCase().includes(kw) ||
          e.creditCode.toLowerCase().includes(kw) ||
          e.licenseNo.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [businessList, businessSearch, businessRegion, businessStatus]);

  const productionTotalPages = Math.max(1, Math.ceil(filteredProduction.length / PAGE_SIZE));
  const businessTotalPages = Math.max(1, Math.ceil(filteredBusiness.length / PAGE_SIZE));
  const pagedProduction = filteredProduction.slice(
    (productionPage - 1) * PAGE_SIZE,
    productionPage * PAGE_SIZE
  );
  const pagedBusiness = filteredBusiness.slice(
    (businessPage - 1) * PAGE_SIZE,
    businessPage * PAGE_SIZE
  );

  // ---------- 新增/编辑 生产企业 ----------
  const openAddProduction = () => {
    setAddTypeOpen(false);
    setProductionEditing(null);
    setProductionFormValues({ ...EMPTY_PRODUCTION });
    setProductionFormOpen(true);
  };

  const openEditProduction = (e: ProductionEnterprise) => {
    setProductionEditing(e);
    setProductionFormValues({ ...e, productRegNos: e.productRegNos.join("、") });
    setProductionFormOpen(true);
  };

  const submitProduction = () => {
    const vals = productionFormValues as Record<string, unknown>;
    if (!vals.name || !String(vals.name).trim()) {
      toast.error("请填写企业名称");
      return;
    }
    if (!vals.creditCode || !String(vals.creditCode).trim()) {
      toast.error("请填写统一社会信用代码");
      return;
    }
    if (!vals.licenseNo || !String(vals.licenseNo).trim()) {
      toast.error("请填写生产许可证号");
      return;
    }

    if (productionEditing) {
      setProductionList((prev) =>
        prev.map((x) => ({
          ...x,
          name: String(vals.name ?? ""),
          creditCode: String(vals.creditCode ?? ""),
          region: String(vals.region ?? ""),
          legalPerson: String(vals.legalPerson ?? ""),
          phone: String(vals.phone ?? ""),
          address: String(vals.address ?? ""),
          licenseNo: String(vals.licenseNo ?? ""),
          type: String(vals.type ?? ""),
          licenseScope: String(vals.licenseScope ?? ""),
          licenseIssuer: String(vals.licenseIssuer ?? ""),
          licenseStart: String(vals.licenseStart ?? ""),
          licenseExpiry: String(vals.licenseExpiry ?? ""),
          creditGrade: String(vals.creditGrade ?? "A"),
          status: String(vals.status ?? "正常"),
        }))
      );
      toast.success("生产企业已更新");
    } else {
      const newItem: ProductionEnterprise = {
        ...EMPTY_PRODUCTION,
        id: generateId(),
        name: String(vals.name ?? ""),
        creditCode: String(vals.creditCode ?? ""),
        region: String(vals.region ?? ""),
        legalPerson: String(vals.legalPerson ?? ""),
        phone: String(vals.phone ?? ""),
        address: String(vals.address ?? ""),
        licenseNo: String(vals.licenseNo ?? ""),
        type: String(vals.type ?? "原药"),
        licenseScope: String(vals.licenseScope ?? ""),
        licenseIssuer: String(vals.licenseIssuer ?? ""),
        licenseStart: String(vals.licenseStart ?? ""),
        licenseExpiry: String(vals.licenseExpiry ?? ""),
        creditGrade: String(vals.creditGrade ?? "A"),
        status: String(vals.status ?? "正常"),
      };
      setProductionList((prev) => [newItem, ...prev]);
      toast.success("生产企业已新增");
    }
    setProductionFormOpen(false);
  };

  // ---------- 新增/编辑 经营企业 ----------
  const openAddBusiness = () => {
    setAddTypeOpen(false);
    setBusinessEditing(null);
    setBusinessFormValues({ ...EMPTY_BUSINESS, restrictedPesticide: "false" });
    setBusinessFormOpen(true);
  };

  const openEditBusiness = (e: BusinessEnterprise) => {
    setBusinessEditing(e);
    setBusinessFormValues({
      ...e,
      restrictedPesticide: e.restrictedPesticide ? "true" : "false",
    });
    setBusinessFormOpen(true);
  };

  const submitBusiness = () => {
    const vals = businessFormValues as Record<string, unknown>;
    if (!vals.name || !String(vals.name).trim()) {
      toast.error("请填写企业名称");
      return;
    }
    if (!vals.creditCode || !String(vals.creditCode).trim()) {
      toast.error("请填写统一社会信用代码");
      return;
    }
    if (!vals.licenseNo || !String(vals.licenseNo).trim()) {
      toast.error("请填写经营许可证号");
      return;
    }

    const restrictedPesticide = String(vals.restrictedPesticide) === "true";
    const area = Number(vals.area) || 0;

    if (businessEditing) {
      setBusinessList((prev) =>
        prev.map((x) => ({
          ...x,
          name: String(vals.name ?? ""),
          creditCode: String(vals.creditCode ?? ""),
          region: String(vals.region ?? ""),
          legalPerson: String(vals.legalPerson ?? ""),
          phone: String(vals.phone ?? ""),
          address: String(vals.address ?? ""),
          licenseNo: String(vals.licenseNo ?? ""),
          type: String(vals.type ?? ""),
          area,
          restrictedPesticide,
          restrictedLicenseNo: String(vals.restrictedLicenseNo ?? ""),
          licenseIssuer: String(vals.licenseIssuer ?? ""),
          licenseStart: String(vals.licenseStart ?? ""),
          licenseExpiry: String(vals.licenseExpiry ?? ""),
          creditGrade: String(vals.creditGrade ?? "A"),
          status: String(vals.status ?? "正常"),
        }))
      );
      toast.success("经营企业已更新");
    } else {
      const newItem: BusinessEnterprise = {
        ...EMPTY_BUSINESS,
        id: generateId(),
        name: String(vals.name ?? ""),
        creditCode: String(vals.creditCode ?? ""),
        region: String(vals.region ?? ""),
        legalPerson: String(vals.legalPerson ?? ""),
        phone: String(vals.phone ?? ""),
        address: String(vals.address ?? ""),
        licenseNo: String(vals.licenseNo ?? ""),
        type: String(vals.type ?? "批发"),
        area,
        restrictedPesticide,
        restrictedLicenseNo: String(vals.restrictedLicenseNo ?? ""),
        licenseIssuer: String(vals.licenseIssuer ?? ""),
        licenseStart: String(vals.licenseStart ?? ""),
        licenseExpiry: String(vals.licenseExpiry ?? ""),
        creditGrade: String(vals.creditGrade ?? "A"),
        status: String(vals.status ?? "正常"),
      };
      setBusinessList((prev) => [newItem, ...prev]);
      toast.success("经营企业已新增");
    }
    setBusinessFormOpen(false);
  };

  // ---------- 删除 ----------
  const confirmDeleteProduction = () => {
    if (!productionDeleting) return;
    setProductionList((prev) => prev.filter((x) => x.id !== productionDeleting.id));
    toast.success("已删除生产企业");
    setProductionDeleting(null);
  };

  const confirmDeleteBusiness = () => {
    if (!businessDeleting) return;
    setBusinessList((prev) => prev.filter((x) => x.id !== businessDeleting.id));
    toast.success("已删除经营企业");
    setBusinessDeleting(null);
  };

  // ---------- 导出 ----------
  const handleExport = () => {
    if (activeTab === "production") {
      exportToCSV(
        filteredProduction as unknown as Record<string, unknown>[],
        [
          { key: "name", label: "企业名称" },
          { key: "creditCode", label: "统一社会信用代码" },
          { key: "region", label: "所在地区" },
          { key: "licenseNo", label: "生产许可证号" },
          { key: "licenseExpiry", label: "有效期至" },
          { key: "type", label: "生产类型" },
          { key: "creditGrade", label: "诚信等级" },
          { key: "status", label: "状态" },
        ],
        `生产企业_${new Date().toISOString().slice(0, 10)}.csv`
      );
    } else {
      exportToCSV(
        filteredBusiness.map((b) => ({
          ...b,
          restrictedPesticide: b.restrictedPesticide ? "是" : "否",
        })),
        [
          { key: "name", label: "企业名称" },
          { key: "creditCode", label: "统一社会信用代码" },
          { key: "region", label: "所在地区" },
          { key: "licenseNo", label: "经营许可证号" },
          { key: "licenseExpiry", label: "有效期至" },
          { key: "type", label: "经营类型" },
          { key: "restrictedPesticide", label: "可经营限制农药" },
          { key: "creditGrade", label: "诚信等级" },
          { key: "status", label: "状态" },
        ],
        `经营企业_${new Date().toISOString().slice(0, 10)}.csv`
      );
    }
    toast.success("已导出数据");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 顶部标题与操作 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">主体管理</h1>
            <p className="text-sm text-muted-foreground">统一管理生产企业与经营企业信息</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setAddTypeOpen(true)}>
            <Plus className="mr-1.5 size-4" /> 新增主体
          </Button>
          <Button variant="outline" onClick={() => toast.info("批量导入功能")}>
            <Upload className="mr-1.5 size-4" /> 批量导入
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-1.5 size-4" /> 导出
          </Button>
        </div>
      </div>

      {/* 主体卡片 */}
      <Card>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "production" | "business")}
            className="w-full"
          >
            <div className="border-b px-6 pt-4">
              <TabsList className="mb-0">
                <TabsTrigger value="production" className="gap-2">
                  <Factory className="size-4" /> 生产企业
                  <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-[11px]">
                    {productionList.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="business" className="gap-2">
                  <Store className="size-4" /> 经营企业
                  <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-[11px]">
                    {businessList.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ---------- 生产企业 ---------- */}
            {activeTab === "production" && (
              <div className="p-6">
                {/* 筛选栏 */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Select value={productionRegion} onValueChange={(v) => { setProductionRegion(v); setProductionPage(1); }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="所在地区" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部地区</SelectItem>
                        {REGION_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={productionStatus} onValueChange={(v) => { setProductionStatus(v); setProductionPage(1); }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部状态</SelectItem>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索企业名称 / 信用代码 / 许可证号"
                        value={productionSearch}
                        onChange={(e) => { setProductionSearch(e.target.value); setProductionPage(1); }}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* 表格 */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>企业名称</TableHead>
                        <TableHead>信用代码</TableHead>
                        <TableHead>所在地区</TableHead>
                        <TableHead>许可证号</TableHead>
                        <TableHead>有效期</TableHead>
                        <TableHead>生产类型</TableHead>
                        <TableHead>诚信等级</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedProduction.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Factory className="size-8 text-muted-foreground/40" />
                              <span className="text-sm">暂无生产企业数据</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pagedProduction.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{e.creditCode}</TableCell>
                            <TableCell>{e.region}</TableCell>
                            <TableCell>{e.licenseNo}</TableCell>
                            <TableCell>{e.licenseExpiry}</TableCell>
                            <TableCell>{e.type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`border ${getCreditBadgeVariant(e.creditGrade)}`}>
                                {e.creditGrade}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`border ${getStatusBadgeVariant(e.status)}`}>
                                {e.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setProductionDetail(e)}>
                                  <Eye className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEditProduction(e)}>
                                  <Pencil className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setProductionDeleting(e)}>
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 分页 */}
                <div className="pt-4">
                  <Pagination
                    page={productionPage}
                    totalPages={productionTotalPages}
                    onPageChange={setProductionPage}
                    pageSize={PAGE_SIZE}
                    totalItems={filteredProduction.length}
                  />
                </div>
              </div>
            )}

            {/* ---------- 经营企业 ---------- */}
            {activeTab === "business" && (
              <div className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Select value={businessRegion} onValueChange={(v) => { setBusinessRegion(v); setBusinessPage(1); }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="所在地区" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部地区</SelectItem>
                        {REGION_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={businessStatus} onValueChange={(v) => { setBusinessStatus(v); setBusinessPage(1); }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部状态</SelectItem>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索企业名称 / 信用代码 / 许可证号"
                        value={businessSearch}
                        onChange={(e) => { setBusinessSearch(e.target.value); setBusinessPage(1); }}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>企业名称</TableHead>
                        <TableHead>信用代码</TableHead>
                        <TableHead>所在地区</TableHead>
                        <TableHead>许可证号</TableHead>
                        <TableHead>有效期</TableHead>
                        <TableHead>经营类型</TableHead>
                        <TableHead>限制农药</TableHead>
                        <TableHead>诚信等级</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedBusiness.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Store className="size-8 text-muted-foreground/40" />
                              <span className="text-sm">暂无经营企业数据</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pagedBusiness.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{e.creditCode}</TableCell>
                            <TableCell>{e.region}</TableCell>
                            <TableCell>{e.licenseNo}</TableCell>
                            <TableCell>{e.licenseExpiry}</TableCell>
                            <TableCell>{e.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`border ${
                                  e.restrictedPesticide
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {e.restrictedPesticide ? "是" : "否"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`border ${getCreditBadgeVariant(e.creditGrade)}`}>
                                {e.creditGrade}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`border ${getStatusBadgeVariant(e.status)}`}>
                                {e.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setBusinessDetail(e)}>
                                  <Eye className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEditBusiness(e)}>
                                  <Pencil className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setBusinessDeleting(e)}>
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="pt-4">
                  <Pagination
                    page={businessPage}
                    totalPages={businessTotalPages}
                    onPageChange={setBusinessPage}
                    pageSize={PAGE_SIZE}
                    totalItems={filteredBusiness.length}
                  />
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* ---------- 弹窗 ---------- */}

      {/* 选择新增类型 */}
      <Dialog open={addTypeOpen} onOpenChange={(v) => !v && setAddTypeOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>选择要新增的主体类型</DialogTitle>
            <DialogDescription>
              生产企业与经营企业的登记信息有所不同，请选择对应类型。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={openAddProduction}
              className="group flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition hover:border-primary hover:bg-primary/5"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Factory className="size-5" />
              </div>
              <div>
                <div className="font-medium">新增生产企业</div>
                <div className="text-sm text-muted-foreground">登记农药生产加工企业</div>
              </div>
            </button>
            <button
              type="button"
              onClick={openAddBusiness}
              className="group flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition hover:border-primary hover:bg-primary/5"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Store className="size-5" />
              </div>
              <div>
                <div className="font-medium">新增经营企业</div>
                <div className="text-sm text-muted-foreground">登记农药批发/零售企业</div>
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTypeOpen(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 生产企业表单 */}
      <FormModal
        open={productionFormOpen}
        onClose={() => setProductionFormOpen(false)}
        title={productionEditing ? "编辑生产企业" : "新增生产企业"}
        fields={PRODUCTION_FIELDS}
        values={productionFormValues}
        onChange={(name, value) =>
          setProductionFormValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={submitProduction}
      />

      {/* 经营企业表单 */}
      <FormModal
        open={businessFormOpen}
        onClose={() => setBusinessFormOpen(false)}
        title={businessEditing ? "编辑经营企业" : "新增经营企业"}
        fields={BUSINESS_FIELDS}
        values={businessFormValues}
        onChange={(name, value) =>
          setBusinessFormValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={submitBusiness}
      />

      {/* 生产企业详情 */}
      <DetailModal
        open={!!productionDetail}
        onClose={() => setProductionDetail(null)}
        title="生产企业详情"
        fields={PRODUCTION_DETAIL_FIELDS}
        data={productionDetail as Record<string, unknown> | null}
      />

      {/* 经营企业详情 */}
      <DetailModal
        open={!!businessDetail}
        onClose={() => setBusinessDetail(null)}
        title="经营企业详情"
        fields={BUSINESS_DETAIL_FIELDS}
        data={
          businessDetail
            ? ({
                ...businessDetail,
                restrictedPesticide: businessDetail.restrictedPesticide ? "是" : "否",
              } as Record<string, unknown>)
            : null
        }
      />

      {/* 删除生产企业 */}
      <DeleteDialog
        open={!!productionDeleting}
        onClose={() => setProductionDeleting(null)}
        onConfirm={confirmDeleteProduction}
        itemName={productionDeleting?.name}
      />

      {/* 删除经营企业 */}
      <DeleteDialog
        open={!!businessDeleting}
        onClose={() => setBusinessDeleting(null)}
        onConfirm={confirmDeleteBusiness}
        itemName={businessDeleting?.name}
      />
    </div>
  );
}
