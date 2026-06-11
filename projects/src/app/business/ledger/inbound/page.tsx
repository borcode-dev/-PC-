'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';
import { productionProducts } from '@/lib/mock-data';

export default function InboundPage() {
  const [selectedRegNo, setSelectedRegNo] = useState('PD20101001');
  const selectedProduct = productionProducts.find((p) => p.regNo === selectedRegNo);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/business/ledger">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" />返回</Button>
          </Link>
          <h1 className="text-xl font-semibold">农药入库登记</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="mr-1 h-4 w-4" />保存</Button>
          <Button><Send className="mr-1 h-4 w-4" />提交</Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">入库基本信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>入库单号</Label>
              <Input value="RK-2026060601" disabled />
            </div>
            <div className="space-y-2">
              <Label>入库企业</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">怀远县农技服务站</SelectItem>
                  <SelectItem value="2">阜阳农药批发中心</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>入库日期</Label>
              <Input type="date" defaultValue="2026-06-06" />
            </div>
            <div className="space-y-2">
              <Label>入库类型</Label>
              <RadioGroup defaultValue="purchase" className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="purchase" id="r1" /><Label htmlFor="r1">采购入库</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="return" id="r2" /><Label htmlFor="r2">退货入库</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="r3" /><Label htmlFor="r3">其他</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">供货方信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>供货单位</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">安徽农药化工集团</SelectItem>
                  <SelectItem value="2">蚌埠农化股份公司</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>联系人</Label>
              <Input placeholder="联系人" />
            </div>
            <div className="space-y-2">
              <Label>联系电话</Label>
              <Input placeholder="联系电话" />
            </div>
            <div className="space-y-2">
              <Label>发票号</Label>
              <Input placeholder="发票号" />
            </div>
            <div className="space-y-2">
              <Label>发票日期</Label>
              <Input type="date" defaultValue="2026-06-06" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">入库产品明细</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">农药名称</th>
                  <th className="pb-2 text-left font-medium">登记证号</th>
                  <th className="pb-2 text-left font-medium">批次号</th>
                  <th className="pb-2 text-left font-medium">生产日期</th>
                  <th className="pb-2 text-left font-medium">数量</th>
                  <th className="pb-2 text-left font-medium">单价</th>
                  <th className="pb-2 text-left font-medium">金额</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">
                    <Select value={selectedRegNo} onValueChange={setSelectedRegNo}>
                      <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {productionProducts.map((p) => (
                          <SelectItem key={p.regNo} value={p.regNo}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="font-mono">{selectedRegNo}</td>
                  <td><Input className="w-[120px]" defaultValue="PC-001*01" /></td>
                  <td>06-01</td>
                  <td><Input className="w-[80px]" type="number" defaultValue="5" />吨</td>
                  <td><Input className="w-[100px]" type="number" defaultValue="31000" /></td>
                  <td className="font-medium">15.5万</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t font-medium">
                  <td colSpan={4}>合计</td>
                  <td>5吨</td>
                  <td></td>
                  <td>15.5万元</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Button variant="outline" size="sm" className="mt-3">+ 添加产品</Button>
        </CardContent>
      </Card>

      {/* Auto-filled Product Detail */}
      {selectedProduct && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">农药产品详情（自动带出）</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
              <div><span className="text-muted-foreground">农药名称：</span>{selectedProduct.name}</div>
              <div><span className="text-muted-foreground">登记证号：</span>{selectedProduct.regNo}</div>
              <div><span className="text-muted-foreground">剂型：</span>{selectedProduct.form}</div>
              <div><span className="text-muted-foreground">毒性：</span>{selectedProduct.toxicity}</div>
              <div><span className="text-muted-foreground">有效成分：</span>{selectedProduct.content}</div>
              <div><span className="text-muted-foreground">有效期至：</span>{selectedProduct.expiry}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">存储信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>存放仓库</Label>
              <Select defaultValue="w1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="w1">1号仓库</SelectItem>
                  <SelectItem value="w2">2号仓库</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>存放位置</Label>
              <Select defaultValue="a3">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a3">农药货架A区-03</SelectItem>
                  <SelectItem value="b1">农药货架B区-01</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
