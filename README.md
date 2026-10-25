# flow

一个本地优先的个人待办、习惯与记账 PWA。没有账号、没有后端，数据只保存在当前设备。

> 当前版本：**2.1.0**

[下载 Android APK](https://github.com/rmrfnoise/flow/releases/latest)

## 功能

- **待办**：`#标签`、截止时间、按到期分组、完成折叠、左滑删除、标签筛选
- **习惯**：每天或指定星期、80 个图标、最近 30 天补卡、周视图和月视图
- **记账**：收入/支出、分类、日期、流水、周报月报
- **余额**：可选开启，首次输入实际余额；关闭会清除余额起点和调整记录，流水保留
- **通用**：中英文、浅色/深色/跟随系统、本地备份、PWA 安装与离线使用

## 技术栈

- React 19 + TypeScript 7
- Vite 8 + Tailwind CSS 4
- `vite-plugin-pwa` / Workbox
- Capacitor Android
- Inter（SIL OFL 1.1），中文使用设备系统字体

## 本地数据

| Key | 内容 |
|---|---|
| `flow.todos.v1` | 待办 |
| `flow.habits.v1` | 习惯 |
| `flow.habitCheckins.v1` | 习惯打卡 |
| `flow.expenses.v1` | 收入、支出与余额调整 |
| `flow.customExpenseCategories.v1` | 自定义分类 |
| `flow.balance.v1` | 余额开关与起点 |
| `flow.locale.v1` | 语言 |
| `flow.appearance.v1` | 外观 |

数据只存在当前浏览器或 WebView。APK 与 PWA 数据相互独立，换设备前请在设置页导出 JSON。

## 开发

```bash
npm install
npm run dev        # 开发
npm run typecheck  # 类型检查
npm run build      # 生产构建
npm run preview    # 预览构建
npm run android:sync  # 同步前端产物到 Android
```

Android 工程位于 `android/`。

## 设计

Inter + 设备中文系统字体，暖色纸感背景和深绿品牌色。页面以少卡片、细分隔线和克制动效为主；记账页把结余、收支和实际余额放在同一张总览里。

## 已知边界

- 仅支持人民币 `¥`
- 没有预算、多币种、云同步和提醒
- 自定义分类暂不支持改名和排序
- 修改习惯周期会重新计算历史计划日
