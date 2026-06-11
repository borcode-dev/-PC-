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

export default function NewProductionBatchPage() {
  const [selectedRegNo, setSelectedRegNo] = useState('PD20101001');
  const selectedProduct = productionProducts.find((p) => p.regNo === selectedRegNo);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/production/ledger">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" />返回</Button>
          </Link>
          <h1 className="text-xl font-semibold">新增生产批次</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="mr-1 h-4 w-4" />保存</Button>
          <Button><Send className="mr-1 h-4 w-4" />提交</Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">批次基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>批次编号</Label>
              <Input value="PC-001*04" disabled />
              <p className="text-xs text-muted-foreground">系统自动生成</p>
            </div>
            <div className="space-y-2">
              <Label>生产企业</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">安徽农药化工集团</SelectItem>
                  <SelectItem value="3">蚌埠农化股份公司</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>生产日期</Label>
              <Input type="date" defaultValue="2026-06-06" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">产品信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>农药登记证号</Label>
              <Select value={selectedRegNo} onValueChange={setSelectedRegNo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {productionProducts.map((p) => (
                    <SelectItem key={p.regNo} value={p.regNo}>
                      {p.regNo} - {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>农药名称</Label>
              <Input value={selectedProduct?.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>剂型</Label>
              <Input value={selectedProduct?.form || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>毒性等级</Label>
              <Input value={selectedProduct?.toxicity || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>有效成分含量</Label>
              <Input value={selectedProduct?.content || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>生产数量（吨）</Label>
              <Input type="number" placeholder="请输入生产数量" />
            </div>
            <div className="space-y-2">
              <Label>产品规格</Label>
              <Select defaultValue="200L">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="200L">200L/桶</SelectItem>
                  <SelectItem value="20L">20L/桶</SelectItem>
                  <SelectItem value="5L">5L/桶</SelectItem>
                  <SelectItem value="1L">1L/瓶</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>产品批号</Label>
              <Input placeholder="LOT2026060601" />
            </div>
            <div className="space-y-2">
              <Label>仓库位置</Label>
              <Select defaultValue="warehouse1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse1">1号仓库</SelectItem>
                  <SelectItem value="warehouse2">2号仓库</SelectItem>
                  <SelectItem value="warehouse3">3号仓库</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Materials */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">原材料信息（关联采购记录）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">原材料名称</th>
                  <th className="pb-2 text-left font-medium">采购批次</th>
                  <th className="pb-2 text-left font-medium">使用量</th>
                  <th className="pb-2 text-left font-medium">供应商</th>
                  <th className="pb-2 text-left font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">草甘膦原药</td>
                  <td className="font-mono">CG-2026*01</td>
                  <td>15吨</td>
                  <td>江苏化工</td>
                  <td><Button variant="ghost" size="sm">关联</Button></td>
                </tr>
                <tr>
                  <td className="py-2">表面活性剂</td>
                  <td className="font-mono">CG-2026*02</td>
                  <td>3吨</td>
                  <td>浙江表面剂</td>
                  <td><Button variant="ghost" size="sm">关联</Button></td>
                </tr>
                <tr>
                  <td className="py-2">水</td>
                  <td className="font-mono">--</td>
                  <td>32吨</td>
                  <td>自来水公司</td>
                  <td><Button variant="ghost" size="sm">关联</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" className="mt-3">+ 添加原材料</Button>
        </CardContent>
      </Card>

      {/* Quality Inspection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">质量检验</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>质检报告</Label>
              <Button variant="outline" className="w-full">上传质检报告PDF</Button>
            </div>
            <div className="space-y-2">
              <Label>检验结论</Label>
              <RadioGroup defaultValue="qualified" className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="qualified" id="q1" />
                  <Label htmlFor="q1">合格</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="unqualified" id="q2" />
                  <Label htmlFor="q2">不合格</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>检验员</Label>
              <Input placeholder="请输入检验员姓名" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">附件材料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">生产工艺记录</span>
            <Button variant="outline" size="sm">上传</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">原材料出库记录</span>
            <Button variant="outline" size="sm">上传</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
