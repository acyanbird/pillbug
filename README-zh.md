#### [English](./README.md)
## 如何运行
```bash
git clone git@github.com:acyanbird/pillbug.git
cd pillbug
npm install
npx vite # 或者 npm run dev
```
然后浏览器应该会自动打开并显示演示。
或者在浏览器中访问 http://localhost:4000。

## 如何部署
```bash
npm run build # 或者 npx vite build
```
输出文件将位于 `dist` 文件夹中。查看 https://vitejs.dev/guide/static-deploy.html 获取更多信息。
此在线演示已部署在 GitHub Pages 上。您可以使用工作流配置文件作为参考。

## 在线演示
https://acyanbird.github.io/pillbug/

## 待办事项
- [ ] 减少单个文件中的重复代码
- [ ] 通过创建 common.js 减少重复代码
- [ ] 加载页面
- [ ] CSS 溢出问题
- [ ] 使用 tween(?) 或其他库进行动画
- [ ] 在白天等级添加太阳
- [ ] 主页适配
- [ ] 移动模式？虚拟按钮？