# 调度服务接入快速启动

## 必备前提：id="player" 的 div

云渲染画面输出容器必须存在，且 `id` 固定为 `player`：

```html
<!-- React -->
<div id="player" className={styles.player} />

<!-- Vue -->
<div id="player" class="player" />
```

CSS 样式要求（player 充满全屏，z-index 为 0，让业务 UI 显示在画面上方）：

```css
.player {
  width: 100vw;
  height: 100vh;
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 0;
  background-image: linear-gradient(180deg, rgba(3,23,66,.99) 0%, rgba(3,23,66,.69) 1%, rgba(17,20,36,0) 74%);
}
```

## 接入步骤

### 第 1 步：配置调度服务

```js
import { CloudRenderEngine } from 'mapv-cloudrenderengine';

CloudRenderEngine.DispatchServer.host = 'http://your-server:8017'; // 必须
CloudRenderEngine.DispatchServer.tag = 'all';                       // 可选，空/all = 不指定集群
CloudRenderEngine.DispatchServer.username = 'admin';               // 可选，默认 admin
CloudRenderEngine.DispatchServer.password = 'admin';               // 可选，默认 admin
```

### 第 2 步：检查可用渲染容量（必须 > 0 才能连接）

```js
const capacity = await CloudRenderEngine.DispatchServer.GetAllCapacityInfo();
if (!capacity || capacity.all <= 0) {
    alert('服务器暂无剩余渲染容量');
    return;
}
```

### 第 3 步：创建引擎实例并连接

```js
const engine = new CloudRenderEngine({
    connectOnLoad: true,
    shouldShowPlayOverlay: false,
    projectName: 'your-project-name',  // consul 中配置的英文项目名
});

// 画面就绪后才可操作场景
engine.addEventListener('videoInitialised', () => {
    console.log('画面加载完成');
});

// 连接异常处理
engine.addEventListener('signalingServerError', () => {
    console.error('信令服务器连接失败');
});

engine.load(
    () => console.log('调度成功'),
    (err) => console.error('调度失败:', err)
    // 失败原因可能：权限不足 / 容量不足 / 用户名密码错误 / 已达最大连接数
);
```

### 可选：获取项目列表

```js
const result = await CloudRenderEngine.DispatchServer.GetProjectCommon();
// result.data = [{ name, title, description, image }, ...]
// name 字段即为 projectName 的值
```

## 模板文件位置

- **React**: `assets/templates/react/CloudRenderApp.jsx` + `CloudRenderApp.module.css`
- **Vue**: `assets/templates/vue/CloudRenderApp.vue`

模板中的占位符说明：

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `{{DISPATCH_HOST}}` | 调度服务地址 | `http://127.0.0.1:8017` |
| `{{PROJECT_NAME}}` | 项目名称 | `wxhs` |
| `{{USERNAME}}` | 用户名 | `admin` |
| `{{PASSWORD}}` | 密码 | `admin` |
