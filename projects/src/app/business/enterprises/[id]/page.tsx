'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Edit, BookOpen, RefreshCw } from 'lucide-react';
import { businessEnterprises, inboundRecords, outboundRecords, inventoryData, alertRecords } from '@/lib/mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BusinessEnterpriseDetailPage() {
  const params = useParams();
  const enterprise = businessEnterprises.find((e) => e.id === params.id) || businessEnterprises[0];
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(0);

  useEffect(() => {
    const days = Math.ceil(
      (new Date(enterprise.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    setDaysUntilExpiry(days);
  }, [enterprise.licenseExpiry]);

  const creditCriteria = [
    { label: '台账记录完整率≥95%', met: enterprise.creditGrade === 'A' || enterprise.creditGrade === 'B' },
    { label: '许可证有效期正常', met: daysUntilExpiry > 90 },
    { label: '农药抽检合格率≥98%', met: enterprise.creditGrade === 'A' || enterprise.creditGrade === 'B' },
    { label: '无违规经营记录', met: enterprise.creditGrade !== 'D' },
  ];

  // 数据闭环：基于该企业的入库/出库/库存记录计算经营概况
  const enterpriseInbound = inboundRecords.filter((r) => r.enterpriseId === enterprise.id);
  const enterpriseOutbound = outboundRecords.filter((r) => r.enterpriseId === enterprise.id);
  const enterpriseInventory = inventoryData.filter((i) => i.enterpriseId === enterprise.id);
  const enterpriseAlerts = alertRecords.filter((a) => a.enterpriseId === enterprise.id);

  // 从 quantity 字符串解析数字（如 "5吨" -> 5, "200L" -> 200）
  const parseQuantity = (q: string) => parseFloat(q.replace(/[^\d.]/g, '')) || 0;

  const totalInboundQty = enterpriseInbound.reduce((sum, r) => sum + parseQuantity(r.quantity), 0);
  const totalInboundAmount = enterpriseInbound.reduce((sum, r) => sum + parseQuantity(r.amount), 0);
  const totalOutboundQty = enterpriseOutbound.length;
  const totalOutboundAmount = enterpriseOutbound.reduce((sum, r) => sum + parseQuantity(r.amount), 0);
  const totalStock = enterpriseInventory.reduce((sum, i) => sum + i.stock, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/business/enterprises">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" />返回列表</Button>
          </Link>
          <h1 className="text-xl font-semibold">企业详情 - {enterprise.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Edit className="mr-1 h-3.5 w-3.5" />编辑</Button>
          <Link href="/business/ledger">
            <Button variant="outline" size="sm"><BookOpen className="mr-1 h-3.5 w-3.5" />台账</Button>
          </Link>
          <Button variant="outline" size="sm"><RefreshCw className="mr-1 h-3.5 w-3.5" />同步</Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">企业基本信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
            <div><span className="text-muted-foreground">企业名称：</span>{enterprise.name}</div>
            <div><span className="text-muted-foreground">统一社会信用代码：</span>{enterprise.creditCode}</div>
            <div><span className="text-muted-foreground">法定代表人：</span>{enterprise.legalPerson}</div>
            <div><span className="text-muted-foreground">联系电话：</span>{enterprise.phone}</div>
            <div><span className="text-muted-foreground">所在地区：</span>{enterprise.region}</div>
            <div><span className="text-muted-foreground">详细地址：</span>{enterprise.address}</div>
            <div><span className="text-muted-foreground">经营类型：</span>{enterprise.type}</div>
            <div><span className="text-muted-foreground">营业面积：</span>{enterprise.area}㎡</div>
          </div>
        </CardContent>
      </Card>

      {/* License Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">许可证信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
            <div><span className="text-muted-foreground">农药经营许可证号：</span>{enterprise.licenseNo}</div>
            <div><span className="text-muted-foreground">经营地址：</span>{enterprise.address}</div>
            <div><span className="text-muted-foreground">发证机关：</span>{enterprise.licenseIssuer}</div>
            <div><span className="text-muted-foreground">有效期：</span>{enterprise.licenseStart} 至 {enterprise.licenseExpiry}</div>
            <div>
              <span className="text-muted-foreground">状态：</span>
              <span className={`inline-flex items-center gap-1 ${daysUntilExpiry > 90 ? 'text-green-600' : daysUntilExpiry > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${daysUntilExpiry > 90 ? 'bg-green-500' : daysUntilExpiry > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                {daysUntilExpiry > 0 ? `正常（距到期${daysUntilExpiry}天）` : '已过期'}
              </span>
            </div>
            {enterprise.restrictedPesticide && (
              <div><span className="text-muted-foreground">可经营限制使用农药：</span>是</div>
            )}
            {enterprise.restrictedLicenseNo && (
              <div><span className="text-muted-foreground">限制农药经营许可证号：</span>{enterprise.restrictedLicenseNo}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operations Summary - 数据闭环：基于入库/出库/库存数据计算 */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">经营概况（基于台账数据）</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{enterpriseInbound.length}批次/{totalInboundQty}吨</p>
              <p className="mt-1 text-sm text-muted-foreground">采购入库</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{enterpriseOutbound.length}笔/{totalOutboundQty}笔</p>
              <p className="mt-1 text-sm text-muted-foreground">销售出库</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{totalStock}吨</p>
              <p className="mt-1 text-sm text-muted-foreground">在库库存</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalOutboundAmount.toFixed(1)}万元</p>
              <p className="mt-1 text-sm text-muted-foreground">销售总额</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory - 数据闭环：展示该企业的库存明细 */}
      {enterpriseInventory.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">库存明细</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>产品名称</TableHead>
                  <TableHead>登记证号</TableHead>
                  <TableHead>批次号</TableHead>
                  <TableHead className="text-right">库存量(吨)</TableHead>
                  <TableHead className="text-right">安全库存(吨)</TableHead>
                  <TableHead>有效期至</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enterpriseInventory.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{item.regNo}</TableCell>
                    <TableCell className="font-mono text-sm">{item.batchNo}</TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell className="text-right">{item.safeStock}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === '正常' ? 'default' :
                        item.status === '不足' ? 'destructive' : 'secondary'
                      }>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Alerts - 数据闭环：展示该企业的预警记录 */}
      {enterpriseAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">预警记录（{enterpriseAlerts.length}条）</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enterpriseAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.level === '严重' ? 'destructive' : 'secondary'}>
                      {alert.level}
                    </Badge>
                    <Badge variant="outline">{alert.type}</Badge>
                    <span className="text-sm">{alert.product} - {alert.detail}</span>
                  </div>
                  <Badge variant={alert.handled ? 'default' : 'outline'}>
                    {alert.handled ? '已处理' : '待处理'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">诚信档案</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">诚信等级：</span>
                <Badge variant={enterprise.creditGrade === 'A' ? 'default' : enterprise.creditGrade === 'D' ? 'destructive' : 'secondary'}>
                  {enterprise.creditGrade}级
                </Badge>
                <span className="text-sm text-muted-foreground">（{enterprise.creditGrade === 'A' ? '优秀' : enterprise.creditGrade === 'B' ? '良好' : enterprise.creditGrade === 'C' ? '一般' : '较差'}）</span>
              </div>
              <div className="space-y-2 text-sm">
                {creditCriteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={c.met ? 'text-green-600' : 'text-red-500'}>
                      {c.met ? '✓' : '✗'}
                    </span>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>上次评定：2026-01</p>
              <p>违规记录：{enterprise.creditGrade === 'D' ? '1次' : '0次'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link href="/business/enterprises">
        <Button variant="outline"><ArrowLeft className="mr-1 h-4 w-4" />返回列表</Button>
      </Link>
    </div>
  );
}
