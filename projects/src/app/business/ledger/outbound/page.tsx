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
import { ArrowLeft, Save, Send, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function OutboundPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/business/ledger">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" />返回</Button>
          </Link>
          <h1 className="text-xl font-semibold">农药出库登记</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="mr-1 h-4 w-4" />保存</Button>
          <Button><Send className="mr-1 h-4 w-4" />提交</Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">出库基本信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>出库单号</Label>
              <Input value="CK-2026060601" disabled />
            </div>
            <div className="space-y-2">
              <Label>出库企业</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">怀远县农技服务站</SelectItem>
                  <SelectItem value="2">阜阳农药批发中心</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>出库日期</Label>
              <Input type="date" defaultValue="2026-06-06" />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <Label>出库类型</Label>
              <RadioGroup defaultValue="sale" className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="sale" id="s1" /><Label htmlFor="s1">销售出库</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="return" id="s2" /><Label htmlFor="s2">退货出库</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="damage" id="s3" /><Label htmlFor="s3">报损出库</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="s4" /><Label htmlFor="s4">其他</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">购买方信息（销售出库时必填）</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>购买方类型</Label>
              <RadioGroup defaultValue="farmer" className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="farmer" id="b1" /><Label htmlFor="b1">农户</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="company" id="b2" /><Label htmlFor="b2">农业企业</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="coop" id="b3" /><Label htmlFor="b3">合作社</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="b4" /><Label htmlFor="b4">其他</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>购买方名称</Label>
              <Input placeholder="农户/企业名称" />
            </div>
            <div className="space-y-2">
              <Label>身份证号</Label>
              <Input placeholder="农户必填" />
            </div>
            <div className="space-y-2">
              <Label>联系电话</Label>
              <Input placeholder="手机号" />
            </div>
            <div className="space-y-2">
              <Label>所在地区</Label>
              <div className="flex gap-2">
                <Select defaultValue="bengbu">
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bengbu">蚌埠市</SelectItem>
                    <SelectItem value="fuyang">阜阳市</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="huaiyuan">
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huaiyuan">怀远县</SelectItem>
                    <SelectItem value="guzhen">固镇县</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>详细地址</Label>
              <Input placeholder="详细地址" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">出库产品明细</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">农药名称</th>
                  <th className="pb-2 text-left font-medium">登记证号</th>
                  <th className="pb-2 text-left font-medium">当前库存</th>
                  <th className="pb-2 text-left font-medium">数量</th>
                  <th className="pb-2 text-left font-medium">单价</th>
                  <th className="pb-2 text-left font-medium">金额</th>
                  <th className="pb-2 text-left font-medium">购买用途</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">草甘膦水剂</td>
                  <td className="font-mono">PD20101001</td>
                  <td>8吨</td>
                  <td><Input className="w-[80px]" type="number" defaultValue="50" />L</td>
                  <td>62元</td>
                  <td className="font-medium">3,100元</td>
                  <td>
                    <Select defaultValue="agri">
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agri">农业生产</SelectItem>
                        <SelectItem value="self">自用</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td colSpan={3}>合计</td>
                  <td>50L</td>
                  <td></td>
                  <td>3,100元</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Button variant="outline" size="sm" className="mt-3">+ 添加产品</Button>
        </CardContent>
      </Card>

      {/* Restricted Pesticide Warning */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
            <div>
              <p>该农药为一般毒性以下农药，可正常销售。</p>
              <p className="mt-1 text-muted-foreground">如销售限制使用农药，需查验购买方资质（限制农药经营许可证）。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
