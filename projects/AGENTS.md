# 农药数字监管分系统 - 项目上下文

### 项目概述
农药数字监管分系统是安徽省粮食安全监测监管信息系统的专项监管子系统，面向省、市、县三级农药主管部门及农药生产/经营企业，实现农药生产、流通全链条可追溯管理。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **主色调**: #1A5C9A

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── dashboard/      # 首页监管总览
│   │   ├── production/     # 生产监管模块
│   │   │   ├── enterprises/    # 生产企业管理（含[id]详情）
│   │   │   ├── ledger/         # 生产台账（含new新增）
│   │   │   └── tracking/       # 生产流向追踪
│   │   ├── business/       # 经营监管模块
│   │   │   ├── enterprises/    # 经营企业管理（含[id]详情）
│   │   │   ├── ledger/         # 经营电子台账（含inbound/outbound）
│   │   │   └── tracking/       # 经营流向追踪
│   │   ├── statistics/     # 统计分析
│   │   └── system/         # 系统管理
│   │       ├── entities/       # 主体管理
│   │       ├── products/       # 产品管理（农药登记证）
│   │       └── interfaces/     # 接口管理
│   ├── components/
│   │   ├── crud/           # 通用CRUD组件 (FormModal, DetailModal, DeleteDialog, FileUpload)
│   │   ├── layout/         # 布局组件 (AppShell)
│   │   └── ui/             # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks (useCrudData)
│   ├── lib/
│   │   ├── utils.ts        # 通用工具函数 (cn)
│   │   └── mock-data.ts    # Mock数据（生产/经营企业、台账、统计等）
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 页面路由清单（16个页面）

| 路由 | 功能 |
|------|------|
| `/dashboard` | 首页监管总览 |
| `/production/enterprises` | 生产企业列表（CRUD） |
| `/production/enterprises/[id]` | 生产企业详情 |
| `/production/ledger` | 生产台账列表（CRUD） |
| `/production/ledger/new` | 新增生产批次 |
| `/production/tracking` | 生产流向追踪 |
| `/business/enterprises` | 经营企业列表（CRUD） |
| `/business/enterprises/[id]` | 经营企业详情 |
| `/business/ledger` | 经营电子台账总览 |
| `/business/ledger/inbound` | 入库登记 |
| `/business/ledger/outbound` | 出库登记 |
| `/business/tracking` | 经营流向追踪 |
| `/statistics` | 统计分析 |
| `/system/entities` | 主体管理（CRUD） |
| `/system/products` | 农药登记证管理（CRUD） |
| `/system/interfaces` | 接口管理 |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 禁止在渲染逻辑中直接使用 `Date.now()`、`Math.random()` 等不纯函数，必须使用 `useEffect` + `useState`
- 禁止非法 HTML 嵌套（如 `<p>` 嵌套 `<div>`）

### Hydration 问题防范

- 严禁在 JSX 渲染逻辑中直接使用 `typeof window`、`Date.now()`、`Math.random()` 等动态数据
- 必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接

## UI 设计与组件规范

- 项目采用 shadcn/ui 组件库，位于 `src/components/ui/` 目录下
- 主色 #1A5C9A，辅色 #8B5CF6，警示色 #E6A23C，危险色 #F56C6C，成功色 #67C23A
- 背景色 #F5F7FA，卡片色 #FFFFFF

## 数据说明

- 当前使用 `src/lib/mock-data.ts` 提供模拟数据
- Mock数据涵盖：生产企业、经营企业、生产台账、经营台账、流向追踪、统计数据、产品登记证、接口管理等
- 后续对接真实API时，替换mock数据调用即可
