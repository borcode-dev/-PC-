'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  RefreshCw,
  Server,
  Settings,
  XCircle,
  Zap,
} from 'lucide-react';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { interfaceList } from '@/lib/mock-data';

interface InterfaceItem {
  id: string;
  name: string;
  type: string;
  system: string;
  status: string;
  lastSync: string;
  url: string;
  frequency: string;
  syncFields: string[];
}

const typeOptions = ['推送', '查询', '接收'];
const statusOptions = ['正常', '降级', '异常'];
const frequencyOptions = ['实时', '每小时', '每日', '每周'];
const systemOptions = ['省农药监管平台', '农业农村部', '市场监管局', '省农检中心', '省预警平台'];
const defaultSyncFields = [
  '批次编号',
  '产品名称',
  '数量',
  '生产日期',
  '销售去向',
  '购买方',
  '许可证号',
  '有效期',
];

const emptyForm: Omit<InterfaceItem, 'id'> = {
  name: '',
  type: '推送',
  system: '省农药监管平台',
  status: '正常',
  lastSync: '未同步',
  url: '',
  frequency: '每小时',
  syncFields: defaultSyncFields,
};

const initialData: InterfaceItem[] = interfaceList.map((item) => ({
  id: item.id,
  name: item.name,
  type: item.type,
  system: item.system,
  status: item.status,
  lastSync: item.lastSync,
  url: item.address,
  frequency: item.frequency,
  syncFields: item.syncFields,
}));

export default function InterfaceManagementPage() {
  const [data, setData] = usePersistedState<InterfaceItem[]>('system-interfaces', initialData);
  const [typeFilter, setTypeFilter] = useState('全部');
  const [systemFilter, setSystemFilter] = useState('全部');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InterfaceItem | null>(null);
  const [detailSyncFields, setDetailSyncFields] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<InterfaceItem, 'id'>>(emptyForm);
  const [formSyncFields, setFormSyncFields] = useState<string[]>(defaultSyncFields);

  const total = data.length;
  const normalCount = data.filter((d) => d.status === '正常').length;
  const abnormalCount = data.filter((d) => d.status === '异常' || d.status === '降级').length;
  const pendingCount = data.filter((d) => d.lastSync === '未同步').length;

  const filtered = data.filter((item) => {
    const matchType = typeFilter === '全部' || item.type === typeFilter;
    const matchSystem = systemFilter === '全部' || item.system === systemFilter;
    return matchType && matchSystem;
  });

  const handleTestAll = () => {
    toast('接口测试完成');
  };

  const handleTestOne = (name: string) => {
    toast(`正在测试 ${name} 接口...`);
    setTimeout(() => {
      toast.success('接口测试成功');
    }, 2000);
  };

  const handleSync = (id: string, name: string) => {
    toast('同步中...');
    setTimeout(() => {
      toast.success('同步完成');
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, lastSync: new Date().toLocaleString('zh-CN', { hour12: false }).slice(5, 16) } : item,
        ),
      );
    }, 1500);
  };

  const openDetail = (item: InterfaceItem) => {
    setDetailItem(item);
    setDetailSyncFields([...item.syncFields]);
    setDetailOpen(true);
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast.error('请填写完整的接口信息');
      return;
    }
    const newItem: InterfaceItem = {
      ...form,
      syncFields: formSyncFields,
      id: Date.now().toString(),
      lastSync: '未同步',
    };
    setData((prev) => [...prev, newItem]);
    setForm(emptyForm);
    setFormSyncFields(defaultSyncFields);
    setAddOpen(false);
    toast.success('接口添加成功');
  };

  const toggleField = (list: string[], field: string, setter: (v: string[]) => void) => {
    if (list.includes(field)) {
      setter(list.filter((f) => f !== field));
    } else {
      setter([...list, field]);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === '正常') {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
          <CheckCircle className="mr-1 h-3 w-3" />
          正常
        </Badge>
      );
    }
    if (status === '降级') {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
          <AlertCircle className="mr-1 h-3 w-3" />
          降级
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
        <XCircle className="mr-1 h-3 w-3" />
        异常
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    if (type === '推送') {
      return <Badge variant="outline">↑ 推送</Badge>;
    }
    if (type === '查询') {
      return <Badge variant="outline">↔ 查询</Badge>;
    }
    return <Badge variant="outline">↓ 接收</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">接口管理</h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            新增接口
          </Button>
          <Button variant="outline" size="sm" onClick={handleTestAll}>
            <Zap className="mr-1 h-4 w-4" />
            测试接口
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">接口总数</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              共 {data.length} 个对接接口
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">正常运行</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{normalCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {total > 0 ? Math.round((normalCount / total) * 100) : 0}% 运行正常
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">异常/降级</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{abnormalCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">需关注接口健康状态</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待同步</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{pendingCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">等待数据同步</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">
            <Activity className="mr-1 inline h-4 w-4 text-muted-foreground" />
            接口列表
          </CardTitle>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="接口类型" />
              </SelectTrigger>
              <SelectContent>
                {['全部', ...typeOptions].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="对接系统" />
              </SelectTrigger>
              <SelectContent>
                {['全部', ...systemOptions].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>接口名称</TableHead>
                <TableHead>接口类型</TableHead>
                <TableHead>对接系统</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后同步</TableHead>
                <TableHead>接口地址</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    暂无匹配的接口数据
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>{item.system}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.lastSync}</TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground">{item.url}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          查看详情
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleTestOne(item.name)}>
                          <Zap className="mr-1 h-3.5 w-3.5" />
                          测试
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleSync(item.id, item.name)}>
                          <RefreshCw className="mr-1 h-3.5 w-3.5" />
                          同步
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>接口详情</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">接口名称</div>
                  <div className="mt-1 font-medium">{detailItem.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">接口类型</div>
                  <div className="mt-1">{getTypeBadge(detailItem.type)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">对接系统</div>
                  <div className="mt-1 font-medium">{detailItem.system}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">同步频率</div>
                  <div className="mt-1 font-medium">{detailItem.frequency}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">接口地址</div>
                  <div className="mt-1 break-all">
                    <code className="bg-muted px-2 py-0.5 rounded text-xs">{detailItem.url}</code>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">最后同步</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-medium">{detailItem.lastSync}</span>
                    {getStatusBadge(detailItem.status)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm">同步字段</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border p-3">
                  {defaultSyncFields.map((field) => (
                    <label key={field} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={detailSyncFields.includes(field)}
                        onChange={() => toggleField(detailSyncFields, field, setDetailSyncFields)}
                        className="rounded border-gray-300"
                      />
                      {field}
                    </label>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => handleTestOne(detailItem.name)}>
                  <Zap className="mr-1 h-4 w-4" />
                  测试连接
                </Button>
                <Button variant="outline" onClick={() => handleSync(detailItem.id, detailItem.name)}>
                  <RefreshCw className="mr-1 h-4 w-4" />
                  重新同步
                </Button>
                <Button variant="outline">
                  <Settings className="mr-1 h-4 w-4" />
                  配置告警
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>新增接口</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">接口名称</Label>
                <Input
                  id="name"
                  placeholder="请输入接口名称"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>接口类型</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>对接系统</Label>
                <Select value={form.system} onValueChange={(v) => setForm({ ...form, system: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择系统" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="url">接口地址</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/api/sync"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>同步频率</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) => setForm({ ...form, frequency: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm">同步字段</Label>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border p-3">
                {defaultSyncFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formSyncFields.includes(field)}
                      onChange={() => toggleField(formSyncFields, field, setFormSyncFields)}
                      className="rounded border-gray-300"
                    />
                    {field}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setForm(emptyForm);
                setFormSyncFields(defaultSyncFields);
                setAddOpen(false);
              }}
            >
              取消
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-1 h-4 w-4" />
              确定新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
