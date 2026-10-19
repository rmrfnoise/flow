# flow

一个本地优先的个人待办 PWA：单一列表、自动 `#标签`、截止时间、完成折叠，以及 6 套霓虹和亮色主题。数据只保存在当前设备。

[下载 Android APK](https://github.com/rmrfnoise/flow/releases/latest)

## 功能

- 输入 `#工作 #生活` 自动生成标签，没有预设标签
- 截止时间支持不设、仅日期、日期和时间
- 点击编辑，左滑删除，完成后自动沉底并折叠
- 本地 `localStorage` 持久化，无账号、无后端、无云同步
- 支持 PWA 安装和离线使用

Android APK 使用 release 签名。APK 和浏览器 PWA 的数据相互独立；安装时需要允许“安装未知来源应用”。

## 开发

```bash
npm install
npm run dev
npm run build
```

Android 工程位于 `android/`，CI 配置见 `.github/workflows/android.yml`。

## 字体

使用 [朱雀仿宋 Zhuque Fangsong](https://github.com/TrionesType/zhuque)，授权为 SIL Open Font License 1.1。授权文本见 [public/fonts/zhuque/OFL.txt](public/fonts/zhuque/OFL.txt)。
