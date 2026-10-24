# flow

一个本地优先的个人待办、习惯与记账 PWA。

待办支持自动 `#标签` 和按时间分组；习惯支持每天/每周固定日打卡、补卡、周视图和月视图；记账支持分类、流水、周报和月报。没有账号、没有后端，数据只保存在当前设备。

> 当前版本：**2.0.0** · [更新记录](CHANGELOG.md)

[下载 Android APK](https://github.com/rmrfnoise/flow/releases/latest)

## 功能

### 待办

- 输入 `#工作 #生活` 自动生成标签，已有标签也可以在新建面板直接点选
- 截止时间支持不设、仅日期、日期和时间，使用应用内自绘的日期/时间选择器
- 按“已逾期 / 今天 / 明天 / 以后 / 无日期”分组
- 点击编辑，左滑删除，完成后自动沉底并折叠
- 清空已完成、标签筛选

### 习惯

- 每天，或每周指定星期几
- 今天打卡 / 取消，最近 30 天补卡
- 周视图、月视图、前后周期切换
- 连续次数、本周完成数、累计次数
- 删除习惯时同步清理打卡记录

### 记账

- 11 组、约 60 个预设分类，常用的排在前面
- 中英文分类搜索，自定义分类可新增、删除，常用分类按最近使用排序
- 删除已使用的自定义分类时，二次确认后把相关支出迁移到“杂项”
- 金额、分类、内容、日期，日期支持 Today / Yesterday 快捷选择，禁止未来日期
- 流水按月查看、按天分组，显示日小计和本月总额
- 点击编辑，左滑删除并支持撤销
- 周报 / 月报：总额、笔数、日均、分类占比、趋势柱；月报按 W1–W5 聚合，点击柱子查看金额

### 通用

- 默认英文界面，可在设置页切换 English / 中文
- 外观支持跟随系统、浅色、深色
- 手机底部导航 / 桌面侧栏导航：待办 / 习惯 / 记账 / 设置
- 本地 `localStorage` 持久化，无账号、无后端、无云同步
- 设置页支持 JSON 导出、导入恢复和清空所有数据
- 支持 PWA 安装和离线使用

## 技术栈

- React 19 + TypeScript 7
- Vite 8 + Tailwind CSS 4
- `vite-plugin-pwa` / Workbox
- Capacitor Android

## 本地数据

| Key | 内容 |
|---|---|
| `flow.todos.v1` | 待办 |
| `flow.habits.v1` | 习惯 |
| `flow.habitCheckins.v1` | 习惯打卡 |
| `flow.expenses.v1` | 支出 |
| `flow.customExpenseCategories.v1` | 自定义分类 |
| `flow.locale.v1` | 语言 |
| `flow.appearance.v1` | 外观 |

数据只在当前浏览器 / WebView 中。APK 和浏览器 PWA 的数据相互独立。建议换设备或清理浏览器前，在设置页导出 JSON 备份。

## 开发

```bash
npm install
npm run dev
```

生产构建与本地预览：

```bash
npm run build
npm run preview
```

只做类型检查：

```bash
npm run typecheck
```

Android 工程位于 `android/`，同步前端产物：

```bash
npm run android:sync
```

CI 配置见 `.github/workflows/android.yml`。

## 项目结构

```
src/
  components/     # 待办、习惯、记账、设置等界面
  hooks/          # 外观、滚动锁
  i18n/           # 中英文文案与 Provider
  lib/            # 存储、日期、待办、习惯、记账、报表
  App.tsx         # 路由、导航和跨模块状态
docs/             # 功能需求与实现记录
```

## 发布前检查

1. 确认以下版本号一致：
   - `package.json`
   - `package-lock.json`
   - `src/i18n/messages.ts` 的 About 版本
   - `android/app/build.gradle` 的 `versionCode` / `versionName`
2. `npm run typecheck`
3. `npm run build`
4. 本地检查 `npm run preview`
5. Android：`npm run android:sync`，由 CI 使用 release 签名构建 APK
6. 提交后打 tag：`v2.0.0`
7. 已安装的 PWA 关闭重开一两次，等待 service worker 更新

Android APK 使用 release 签名，需要配置 `ANDROID_KEYSTORE_FILE`、`ANDROID_KEYSTORE_PASSWORD`、`ANDROID_KEY_ALIAS`、`ANDROID_KEY_PASSWORD`。安装时需要允许“安装未知来源应用”。

## 设计

界面使用系统字体栈、中性灰阶和一个品牌绿。文案默认英文，支持和中文互切，日期、金额和分类名称会跟随语言变化。主题和语言集中在设置页。记账页使用单层 `Records / Weekly / Monthly` 标签，避免叠加选择器；金额与货币符号、卡片和列表留出呼吸感，标签滑块、报表柱状图和底部导航带轻量动效。各模块保持独立数据，删除或修改一个模块不会影响另外两个。

## 已知边界

- 只记支出，没有收入、预算、多币种和提醒
- 自定义分类暂不支持改名和排序
- 记账金额固定人民币 `¥`
- 习惯修改周期会重新计算历史计划日
- 没有云同步；换设备需要自行迁移数据
