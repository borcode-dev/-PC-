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
import { productionEnterprises, productionProducts, productionLedger, pesticideRegistrations } from '@/lib/mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductionEnterpriseDetailPage() {
  const params = useParams();
  const enterprise = productionEnterprises.find((e) => e.id === params.id) || productionEnterprises[0];
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(0);

  useEffect(() => {
    const days = Math.ceil(
      (new Date(enterprise.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    setDaysUntilExpiry(days);
  }, [enterprise.licenseExpiry]);

  // 数据闭环：只展示该企业关联的产品（通过 productRegNos）
  const enterpriseProducts = pesticideRegistrations.filter((p) =>
    enterprise.productRegNos?.includes(p.regNo)
  );

  // 数据闭环：只展示该企业的台账记录
  const enterpriseLedger = productionLedger.filter((l) => l.enterpriseId === enterprise.id);
  const totalOutput = enterpriseLedger.reduce((sum, l) => sum + l.output, 0);
  const totalSold = enterpriseLedger.reduce((sum, l) => sum + l.sold, 0);
  const totalStock = enterpriseLedger.reduce((sum, l) => sum + l.stock, 0);
  const stockRate = totalOutput > 0 ? ((totalStock / totalOutput) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/production/enterprises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />返回列表
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">企业详情 - {enterprise.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Edit className="mr-1 h-3.5 w-3.5" />编辑</Button>
          <Link href="/production/ledger">
            <Button variant="outline" size="sm"><BookOpen className="mr-1 h-3.5 w-3.5" />台账</Button>
          </Link>
          <Button variant="outline" size="sm"><RefreshCw className="mr-1 h-3.5 w-3.5" />同步</Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">企业基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
            <div><span className="text-muted-foreground">企业名称：</span>{enterprise.name}</div>
            <div><span className="text-muted-foreground">统一社会信用代码：</span>{enterprise.creditCode}（已认证）</div>
            <div><span className="text-muted-foreground">法定代表人：</span>{enterprise.legalPerson}</div>
            <div><span className="text-muted-foreground">联系电话：</span>{enterprise.phone}</div>
            <div><span className="text-muted-foreground">所在地区：</span>{enterprise.region}</div>
            <div><span className="text-muted-foreground">详细地址：</span>{enterprise.address}</div>
          </div>
        </CardContent>
      </Card>

      {/* License Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">许可证信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
            <div><span className="text-muted-foreground">农药生产许可证号：</span>{enterprise.licenseNo}</div>
            <div><span className="text-muted-foreground">生产范围：</span>{enterprise.licenseScope}</div>
            <div><span className="text-muted-foreground">发证机关：</span>{enterprise.licenseIssuer}</div>
            <div><span className="text-muted-foreground">有效期：</span>{enterprise.licenseStart} 至 {enterprise.licenseExpiry}</div>
            <div>
              <span className="text-muted-foreground">状态：</span>
              <span className={`inline-flex items-center gap-1 ${daysUntilExpiry > 90 ? 'text-green-600' : daysUntilExpiry > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${daysUntilExpiry > 90 ? 'bg-green-500' : daysUntilExpiry > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                {daysUntilExpiry > 0 ? `正常（距到期${daysUntilExpiry}天）` : '已过期'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products - 数据闭环：只展示该企业登记的产品 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">生产产品列表（{enterpriseProducts.length}种）</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>登记证号</TableHead>
                <TableHead>农药名称</TableHead>
                <TableHead>剂型</TableHead>
                <TableHead>毒性</TableHead>
                <TableHead>有效成分含量</TableHead>
                <TableHead>类别</TableHead>
                <TableHead className="text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enterpriseProducts.map((p) => (
                <TableRow key={p.regNo}>
                  <TableCell className="font-mono text-sm">{p.regNo}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.form}</TableCell>
                  <TableCell>
                    <Badge variant={p.toxicity === '中等毒' ? 'destructive' : 'secondary'}>
                      {p.toxicity}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.content}</TableCell>
                  <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Link href="/system/products">
                      <Button variant="ghost" size="sm">详情</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Production - 数据闭环：基于该企业的台账数据计算 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">生产概况（基于台账数据）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{enterpriseLedger.length}批</p>
              <p className="mt-1 text-sm text-muted-foreground">生产批次</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalOutput}吨</p>
              <p className="mt-1 text-sm text-muted-foreground">累计产量</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalSold}吨</p>
              <p className="mt-1 text-sm text-muted-foreground">累计销量</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{totalStock}吨</p>
              <p className="mt-1 text-sm text-muted-foreground">在库库存</p>
              <p className="text-xs text-muted-foreground">库存占比 {stockRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Records - 数据闭环：展示该企业的台账明细 */}
      {enterpriseLedger.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">生产台账明细</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>批次编号</TableHead>
                  <TableHead>产品名称</TableHead>
                  <TableHead>登记证号</TableHead>
                  <TableHead>生产日期</TableHead>
                  <TableHead className="text-right">产量(吨)</TableHead>
                  <TableHead className="text-right">销量(吨)</TableHead>
                  <TableHead className="text-right">库存(吨)</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enterpriseLedger.map((l) => (
                  <TableRow key={l.batchNo}>
                    <TableCell className="font-mono text-sm">{l.batchNo}</TableCell>
                    <TableCell>{l.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{l.regNo}</TableCell>
                    <TableCell>{l.date}</TableCell>
                    <TableCell className="text-right">{l.output}</TableCell>
                    <TableCell className="text-right">{l.sold}</TableCell>
                    <TableCell className="text-right">{l.stock}</TableCell>
                    <TableCell>
                      <Badge variant={l.status === '正常' ? 'default' : 'secondary'}>{l.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Violation Record */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">历史违规记录</CardTitle>
        </CardHeader>
        <CardContent>
          {enterprise.creditGrade === 'A' ? (
            <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
              无违规记录
            </div>
          ) : (
            <div className="flex h-16 items-center justify-center text-sm text-amber-600">
              诚信等级：{enterprise.creditGrade}级，请关注
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
