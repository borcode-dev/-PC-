'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Printer, RotateCcw, BarChart2, TrendingUp, PieChart, Map } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  productionEnterprises,
  businessEnterprises,
  productionLedger,
  outboundRecords,
  pesticideRegistrations,
  monthlyProductionTrend,
  monthlyBusinessTrend,
  cityProductionData,
} from '@/lib/mock-data';

const PRIMARY = '#1A5C9A';
const SECONDARY = '#8B5CF6';
const WARNING = '#E6A23C';
const DANGER = '#F56C6C';
const PIE_COLORS = [PRIMARY, SECONDARY, WARNING, DANGER, '#4C9A2A', '#17A2B8'];

const parseAmount = (a: string) => {
  const raw = a.replace(/[^\d.]/g, '');
  const num = parseFloat(raw) || 0;
  if (a.includes('元') && !a.includes('万') && !a.includes('亿')) return num / 10000;
  if (a.includes('亿')) return num * 10000;
  return num;
};

const regions = ['蚌埠市', '阜阳市', '宿州市', '滁州市', '合肥市', '六安市', '亳州市', '其他'];

export default function StatisticsPage() {
  const [yearFilter, setYearFilter] = useState('2026');
  const [regionFilter, setRegionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => {
    const regionStats = regions.map((region) => {
      const regionShort = region.replace('市', '');
      const prodCount = productionEnterprises.filter((e) => e.region.includes(regionShort)).length;
      const bizCount = businessEnterprises.filter((e) => e.region.includes(regionShort)).length;

      const regionProdIds = productionEnterprises
        .filter((e) => e.region.includes(regionShort))
        .map((e) => e.id);
      const regionLedger = productionLedger.filter((l) => regionProdIds.includes(l.enterpriseId));
      const totalOutput = regionLedger.reduce((s, l) => s + l.output, 0);

      const regionBizIds = businessEnterprises
        .filter((e) => e.region.includes(regionShort))
        .map((e) => e.id);
      const regionOutbound = outboundRecords.filter((r) => regionBizIds.includes(r.enterpriseId));
      const totalBusiness = regionOutbound.reduce((s, r) => s + parseAmount(r.amount), 0);

      const reportRate = regionLedger.length > 0
        ? (regionLedger.filter((l) => l.status === '正常').length / regionLedger.length * 100).toFixed(1)
        : '0.0';

      return {
        region,
        producers: prodCount,
        operators: bizCount,
        production: totalOutput,
        business: Math.round(totalBusiness),
        reportRate,
      };
    });

    const totalProducers = productionEnterprises.length;
    const totalOperators = businessEnterprises.length;
    const totalProduction = productionLedger.reduce((s, l) => s + l.output, 0);
    const totalBusinessAmount = outboundRecords.reduce((s, r) => s + parseAmount(r.amount), 0);

    const categories: Array<'除草剂' | '杀虫剂' | '杀菌剂' | '植物生长调节剂' | '其他'> = [
      '除草剂', '杀虫剂', '杀菌剂', '植物生长调节剂', '其他',
    ];
    const categoryStats = categories.map((cat) => {
      const count = pesticideRegistrations.filter((p) => p.category === cat).length;
      const regNos = pesticideRegistrations.filter((p) => p.category === cat).map((p) => p.regNo);
      const catLedger = productionLedger.filter((l) => regNos.includes(l.regNo));
      const catOutput = catLedger.reduce((s, l) => s + l.output, 0);
      const productionPct = totalProduction > 0 ? Math.round((catOutput / totalProduction) * 100) : 0;

      const catOutbound = outboundRecords.filter((r) => regNos.includes(r.regNo));
      const catBusiness = catOutbound.reduce((s, r) => s + parseAmount(r.amount), 0);
      const businessPct = totalBusinessAmount > 0 ? Math.round((catBusiness / totalBusinessAmount) * 100) : 0;

      return { type: cat, count, productionPct, businessPct, catOutput };
    });

    return { regionStats, totalProducers, totalOperators, totalProduction, totalBusinessAmount, categoryStats };
  }, []);

  const chartData = stats.regionStats.map((r) => ({
    city: r.region.replace('市', ''),
    production: r.production,
    business: r.business,
  }));

  const pieData = stats.categoryStats
    .filter((c) => c.catOutput > 0)
    .map((c) => ({ name: c.type, value: c.catOutput }));

  const formatProduction = (val: number) => {
    if (val >= 10000) return `${(val / 10000).toFixed(2)}万吨`;
    return `${val.toLocaleString()}吨`;
  };

  const formatBusiness = (val: number) => {
    if (val >= 10000) return `${(val / 10000).toFixed(2)}亿元`;
    return `${val.toLocaleString()}万元`;
  };

  const totalProductionFormatted = formatProduction(stats.totalProduction);
  const totalBusinessFormatted = formatBusiness(stats.totalBusinessAmount);

  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <BarChart2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">农药监管统计分析</h1>
            <p className="text-xs text-slate-500">数据实时计算 · 覆盖企业/台账/出库全链路</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <Download className="mr-1.5 h-3.5 w-3.5" />导出
          </Button>
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <Printer className="mr-1.5 h-3.5 w-3.5" />打印
          </Button>
          <Button
            size="sm"
            className="text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            定制报表
          </Button>
        </div>
      </div>

      {/* 筛选栏 */}
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">筛选条件：</span>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="统计年度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026年</SelectItem>
                <SelectItem value="2025">2025年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="地区范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全省范围</SelectItem>
                <SelectItem value="蚌埠">蚌埠市</SelectItem>
                <SelectItem value="阜阳">阜阳市</SelectItem>
                <SelectItem value="宿州">宿州市</SelectItem>
                <SelectItem value="滁州">滁州市</SelectItem>
                <SelectItem value="合肥">合肥市</SelectItem>
                <SelectItem value="六安">六安市</SelectItem>
                <SelectItem value="亳州">亳州市</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="农药类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="除草剂">除草剂</SelectItem>
                <SelectItem value="杀虫剂">杀虫剂</SelectItem>
                <SelectItem value="杀菌剂">杀菌剂</SelectItem>
                <SelectItem value="植物生长调节剂">植物生长调节剂</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setYearFilter('2026');
                setRegionFilter('all');
                setTypeFilter('all');
              }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />重置筛选
            </Button>
            <div className="ml-auto text-xs text-slate-500">
              数据更新时间：2026-06-09
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-1" style={{ backgroundColor: PRIMARY }} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">农药生产企业</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">
                  {stats.totalProducers}
                  <span className="text-sm font-normal ml-1 text-slate-500">家</span>
                </p>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${PRIMARY}15` }}
              >
                <Map className="h-5 w-5" style={{ color: PRIMARY }} />
              </div>
            </div>
            <p className="text-xs mt-3 text-green-600 font-medium">▲ 较上年 +5.2%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-1" style={{ backgroundColor: SECONDARY }} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">农药经营企业</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">
                  {stats.totalOperators}
                  <span className="text-sm font-normal ml-1 text-slate-500">家</span>
                </p>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${SECONDARY}15` }}
              >
                <PieChart className="h-5 w-5" style={{ color: SECONDARY }} />
              </div>
            </div>
            <p className="text-xs mt-3 text-green-600 font-medium">▲ 较上年 +1.3%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-1" style={{ backgroundColor: WARNING }} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">累计产量</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">
                  {totalProductionFormatted}
                </p>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${WARNING}15` }}
              >
                <BarChart2 className="h-5 w-5" style={{ color: WARNING }} />
              </div>
            </div>
            <p className="text-xs mt-3 text-green-600 font-medium">▲ 同比增长 +15.0%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-1" style={{ backgroundColor: DANGER }} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">累计经营额</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">
                  {totalBusinessFormatted}
                </p>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${DANGER}15` }}
              >
                <TrendingUp className="h-5 w-5" style={{ color: DANGER }} />
              </div>
            </div>
            <p className="text-xs mt-3 text-green-600 font-medium">▲ 同比增长 +8.0%</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表第一行：各市产量/经营额分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" style={{ color: PRIMARY }} />
              <CardTitle className="text-sm font-semibold text-slate-800">各市产量分布（BarChart）</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} 吨`, '产量']}
                  contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="production" name="产量(吨)" fill={PRIMARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" style={{ color: SECONDARY }} />
              <CardTitle className="text-sm font-semibold text-slate-800">各市经营额分布（BarChart）</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} 万元`, '经营额']}
                  contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="business" name="经营额(万元)" fill={SECONDARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 图表第二行：月度产量/经营额趋势（LineChart） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: WARNING }} />
              <CardTitle className="text-sm font-semibold text-slate-800">月度产量趋势（LineChart）</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProductionTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip
                  formatter={(value: number) => [`${value} 万吨`, '产量']}
                  contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="产量(万吨)"
                  stroke={WARNING}
                  strokeWidth={2.5}
                  dot={{ fill: WARNING, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: WARNING }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: DANGER }} />
              <CardTitle className="text-sm font-semibold text-slate-800">月度经营额趋势（LineChart）</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBusinessTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip
                  formatter={(value: number) => [`${value} 亿元`, '经营额']}
                  contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="经营额(亿元)"
                  stroke={DANGER}
                  strokeWidth={2.5}
                  dot={{ fill: DANGER, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: DANGER }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 产品类型分析表 */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4" style={{ color: PRIMARY }} />
            <CardTitle className="text-sm font-semibold text-slate-800">农药产品类型分析</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 bg-slate-100/60">产品类型</TableHead>
                <TableHead className="font-semibold text-slate-700 bg-slate-100/60">登记数量</TableHead>
                <TableHead className="font-semibold text-slate-700 bg-slate-100/60">产量占比</TableHead>
                <TableHead className="font-semibold text-slate-700 bg-slate-100/60">经营额占比</TableHead>
                <TableHead className="font-semibold text-slate-700 bg-slate-100/60 text-right">产量(吨)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.categoryStats.map((p) => (
                <TableRow key={p.type} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-800">{p.type}</TableCell>
                  <TableCell className="text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {p.count} 种
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[140px]">
                        <div
                          className="rounded-full h-2 transition-all"
                          style={{ width: `${p.productionPct}%`, backgroundColor: PRIMARY }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 w-10">{p.productionPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[140px]">
                        <div
                          className="rounded-full h-2 transition-all"
                          style={{ width: `${p.businessPct}%`, backgroundColor: SECONDARY }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 w-10">{p.businessPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-800">
                    {p.catOutput.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 饼图 + 数据表 布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" style={{ color: SECONDARY }} />
              <CardTitle className="text-sm font-semibold text-slate-800">产品类型产量占比（PieChart）</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={340}>
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={11}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} 吨`, '产量']}
                    contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-slate-400">暂无数据</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4" style={{ color: PRIMARY }} />
              <CardTitle className="text-sm font-semibold text-slate-800">地区详细数据表</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60">地区</TableHead>
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60">生产企业</TableHead>
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60">经营企业</TableHead>
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60">累计产量</TableHead>
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60">累计经营额</TableHead>
                  <TableHead className="font-semibold text-slate-700 bg-slate-100/60 text-right">台账上报率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.regionStats.map((d) => (
                  <TableRow key={d.region} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">{d.region}</TableCell>
                    <TableCell className="text-slate-600">{d.producers} 家</TableCell>
                    <TableCell className="text-slate-600">{d.operators} 家</TableCell>
                    <TableCell className="text-slate-600">{formatProduction(d.production)}</TableCell>
                    <TableCell className="text-slate-600">{formatBusiness(d.business)}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          parseFloat(d.reportRate) >= 98
                            ? 'bg-green-50 text-green-700'
                            : parseFloat(d.reportRate) >= 95
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {d.reportRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300 hover:bg-slate-100">
                  <TableCell className="text-slate-800">合计</TableCell>
                  <TableCell className="text-slate-800">{stats.totalProducers} 家</TableCell>
                  <TableCell className="text-slate-800">{stats.totalOperators} 家</TableCell>
                  <TableCell className="text-slate-800">{totalProductionFormatted}</TableCell>
                  <TableCell className="text-slate-800">{totalBusinessFormatted}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-700">
                      98.1%
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 底部说明 */}
      <div className="text-center text-xs text-slate-400 pt-2 pb-4">
        © 2026 安徽省农药数字监管分系统 · 数据来源：生产企业台账 + 经营企业出库记录 + 产品登记证库
      </div>
    </div>
  );
}
