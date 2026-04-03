---
name: cloudrenderengine
description: This skill should be used when the user asks to "use mapv-cloudrenderengine", "create 3D visualization", "add map markers", "render geographic data", "use cloud rendering engine", "create lines/polygons/points on map", "add particle effects", "control weather/time", "use camera navigation", "初始化云渲染引擎", "添加地图标注", "绘制轨迹线", "创建热力图", "设置天气效果", "相机飞行动画", "获取点击坐标", "clickLocation事件", "动态资产AssetLayer", "自动驾驶车辆", "大规模路况", "信号灯接入", "关卡切换", "WebRTC监控", "建筑生长动画", "情报板编辑", "楼宇拆解", or needs guidance on CloudRenderEngine API, class inheritance, data formats, and best practices.
version: 1.6.0
---

# mapv-cloudrenderengine 开发指南

mapv-cloudrenderengine 是百度地图开放平台提供的云渲染引擎库，基于 Unreal Engine 5 提供高品质的 3D 地理可视化能力。通过 WebRTC 像素流技术，将 UE5 渲染结果实时传输到浏览器端。

## 安装

```bash
npm install mapv-cloudrenderengine
```

```javascript
import * as Engine from 'mapv-cloudrenderengine';
```

## 关键前提

**HTML 中必须有 `id="player"` 的 div 元素** (云渲染模式需要)：
```html
<div id="player" style="width: 100%; height: 100vh;"></div>
```

## 核心概念

### 坐标与数据格式
- **坐标系**: WGS84 经纬度
- **位置**: `{ x: 经度, y: 纬度, z: 高度(米) }`
- **旋转**: `{ roll, pitch, yaw }` (度)
- **颜色**: `{ r, g, b }` (0-1 范围)
- **数据**: 所有可视化对象使用 **GeoJSON** 格式

### 类继承关系
```
EventDispatcher → Object3D → Shape
                           ├── Point, IconPoint, TextPoint, BasicLabel, ClusterPoint
                           ├── Line, ODLine
                           ├── Polygon
                           ├── Cone, Cube, Cylinder, Sphere, Circle...
                           └── Particle, Radar, Ripple, Decal, Heatmap...
```

## 引擎初始化

### 云渲染模式 (默认推荐)

通过 WebRTC 连接远程 UE5 服务器，适用于大多数场景，支持移动端。

```javascript
import * as Engine from 'mapv-cloudrenderengine';

// 1. 配置调度服务
// ⚠️ 重要：以下为示例配置，请替换为实际的服务器地址和凭证
Engine.CloudRenderEngine.DispatchServer.host = 'https://your-dispatch-server.example.com';
Engine.CloudRenderEngine.DispatchServer.username = 'your-username';
Engine.CloudRenderEngine.DispatchServer.password = 'your-password';

// 2. 创建引擎实例
const engine = new Engine.CloudRenderEngine({
    projectName: 'your-project-name',
    matchViewportResolution: true,
    connectOnLoad: true,
    forceTURN: true,
});

// 3. 加载并监听画面就绪
engine.load(
    (msg) => console.log('连接成功'),
    (err) => console.error('连接失败', err)
);

engine.addEventListener('videoInitialised', () => {
    // 画面就绪后再操作场景
    engine.UDS.changeWeather('partlyCloudy');
    engine.UDS.changeTime(12, 0);
});
```

### 本地渲染模式 (特殊场景)

直接在部署机器上运行，突破浏览器 4K 分辨率限制。**一般情况下不推荐使用**，仅适用于超高分辨率需求且有高性能客户端的场景。

```javascript
const engine = new Engine.CloudRenderEngine({
    renderMode: 'inner',  // 本地渲染模式
});
// 不需要 player div，不需要配置调度服务，API 与云渲染相同
```

## 核心 API 模式

### 添加/移除对象
```javascript
const line = new Engine.Line({ color: {r:0,g:1,b:0}, width: 5 });
line.setData(geojsonData);
engine.addToScene(line);
engine.destoryObject(line);      // 移除单个对象
```

### 相机控制
```javascript
// 飞行到指定位置
engine.moveTo(
    { x: 116.404, y: 39.915, z: 500 },
    { roll: 0, pitch: -45, yaw: 0 },
    { duration: 2.0, zoom: 1500, flyOverLongitude: true, callback: () => {} }
);

// 路径巡航 (关键点数组: [经度, 纬度, 高度, roll, pitch, yaw])
engine.navigateByKeypoints(
    [[116.40, 39.91, 20, 0, -30, 160], [116.41, 39.92, 30, 0, -40, 130]],
    { speed: 36, lockAll: true, startCallback: () => {}, finishCallback: () => {} }
);

// 巡航控制
engine.pauseNavigation();
engine.resumeNavigation();
engine.stopNavigation();

// 缩放
engine.zoomIn(1.5);
engine.zoomOut(1.5);
```

### 3DTiles 控制
```javascript
engine.enable3DTilesByName({ enable: true, tilesName: 'building' });
engine.hidden3DTilesItem({ hiddenList: ['item1'], tilesName: 'building' });
```

### 天气时间系统
```javascript
engine.UDS.changeWeather('clearSkies');   // 晴天
engine.UDS.changeWeather('rain');         // 中大雨
engine.UDS.changeWeather('snow');         // 中大雪
engine.UDS.changeTime(14, 30);            // 下午2:30
```

### 建筑生长动画
```javascript
engine.buildingGrowthAnimate({
    duration: 2000,        // 动画时长(毫秒)
    startHeight: 0,        // 起始高度
    endHeight: 200,        // 结束高度
    state: 'play',         // 'play' 播放
});
```

### 获取点击坐标 (重要)
```javascript
engine.camera.addEventListener('clickLocation', (event) => {
    if (event.content && event.content.Location) {
        const loc = event.content.Location;
        console.log(loc.longitude, loc.latitude, loc.altitude);
    }
});
```

### AssetLayer 动态资产 (重要)

> **AssetLayer 必须按以下步骤使用，否则无法正常工作！**

```javascript
// 步骤1: 在 videoInitialised 中配置模型信息 (必须先执行，仅一次)
// ⚠️ 重要：API 地址和参数需要根据实际服务配置
let modelInfoConfigured = false;
engine.addEventListener('videoInitialised', () => {
    if (!modelInfoConfigured) {
        engine.setupModelInfo(
            'https://your-api-server.example.com/api/modelInfo',
            { project_id: 'your-project-id' },
            { Authorization: 'Bearer your-token' }
        );
        modelInfoConfigured = true;
    }
});

// 步骤2: 创建 AssetLayer (在 setupModelInfo 之后)
const assetLayer = new Engine.AssetLayer({
    url: 'https://your-api-server.example.com/api/devices',
    header: { Authorization: 'Bearer your-token' },
    body: {
        project_id: 'your-project-id',
        radius: 1500,
        x: 116.404,
        y: 39.915,
    },
});

// 步骤3: 添加到场景
engine.addToScene(assetLayer);

// 事件监听
assetLayer.addEventListener('mousedown', (e) => {
    console.log('点击资产:', e.content);
});
```

## 常用类速查

| 类 | 用途 | 关键参数 |
|----|------|----------|
| **点类** | | |
| IconPoint | 图标点 | texture, width, height, pivot |
| TextPoint | 文字点 | fontSize, fontColor, backgroundColor |
| BasicLabel | 自定义标签 | texture, width, height |
| ClusterPoint | 点聚合 | 聚合距离、样式 |
| WebViewPoint | 场景空间渲染web元素 | url, width, height |
| **线类** | | |
| Line | 线条 | style(solid/dashed/arrow), width, speed |
| ODLine | OD线 | 起终点样式 |
| **面类** | | |
| Polygon | 自定义区域 | fillStyle(Empty/Stripe/Matrix), height |
| Circle | 平面圆 | radius, 贴图动画 |
| Plane | 平铺面 | width, height, map |
| **体类** | | |
| Cone | 圆锥 | radius, height |
| Cube | 立方体 | width, height, depth |
| Cylinder | 圆柱体 | radius, height |
| Sphere | 球体 | radius |
| Torus | 圆环体 | radius, tube |
| Tube | 圆管体 | path, radius |
| **特效类** | | |
| Particle | 粒子系统 | kind(P_Fire_Small/NS_Firefly), scale |
| Radar | 雷达扫描 | radius, speed, color |
| Ripple | 扩散波纹 | radius, count, speed |
| Decal | 贴花 | map, animateType(expand/breath) |
| Heatmap | 热力图 | type(plane/particle), radius, intensity |
| **交通行业** | | |
| TrafficLayer | 车辆轨迹孪生 | url, eventName |
| MockCarStream | 模拟车流 | speed, density |
| CarPark | 倒车动画 | 路径 |
| ConstructionLayer | 施工区域 | 区域数据 |
| TriangleWarning | 三角警示牌 | position |
| TrafficCone | 交通锥 | position |
| TrafficShape | 交通参与者 | type |
| **模型类** | | |
| FlashCar | 发光车辆 | color, brightness |
| FlashCarCrash | 发光事故车 | color |
| FlashPeople | 发光人物 | color |
| Diamond | 钻石模型 | scale |
| Soil | 遗撒 | position, scale |
| **数据加载** | | |
| AssetLayer | 动态资产 | url, header, body (**必须先调用 setupModelInfo**) |
| I3DTileLayer | 3DTiles数据 | url |
| **分析工具** | | |
| Skyline | 天际线分析 | color, lineWidth |
| VisualField | 可视域分析 | position, distance, angle |
| SlopeAnalysis | 坡度分析 | colors, thresholds |
| LayerBuilding | 楼宇拆解 | 显隐式/抽屉式 |

## GeoJSON 数据格式

```javascript
// Point
{ type: 'FeatureCollection', features: [{
    properties: { text: '标记' },
    geometry: { type: 'Point', coordinates: [116.404, 39.915, 10] }
}]}

// LineString
{ type: 'FeatureCollection', features: [{
    geometry: { type: 'LineString', coordinates: [[lng1,lat1,0], [lng2,lat2,0]] }
}]}

// Polygon (必须闭合)
{ type: 'FeatureCollection', features: [{
    geometry: { type: 'Polygon', coordinates: [[[lng1,lat1,0], [lng2,lat2,0], ..., [lng1,lat1,0]]] }
}]}
```

## 开发最佳实践

1. **必须有 player div** - 云渲染模式必须包含 `<div id="player"></div>`
2. **等待 videoInitialised** - 在该事件触发后再操作场景
3. **对象生命周期管理** - 使用完毕后调用 `engine.destoryObject()` 释放资源
4. **颜色格式** - 使用 0-1 范围的 RGB 值，如 `{r: 1, g: 0, b: 0}` 表示红色
5. **WebRTC 监控** - 使用 `engine.onWebRtcConnectionStats()` 监控连接质量
6. **AssetLayer 前置条件** - 使用 AssetLayer 前**必须**在 `videoInitialised` 事件中调用 `engine.setupModelInfo()` 配置模型信息，且仅执行一次。**不配置 setupModelInfo 将无法使用 AssetLayer！**

## 常见问题

**画面不显示？** 检查 `<div id="player"></div>` 是否存在，调度服务配置是否正确。

**对象不显示？** 检查 `visible` 属性、坐标范围、GeoJSON 格式。

**获取点击坐标？** 使用 `engine.camera.addEventListener('clickLocation', ...)` 事件。

**网络卡顿？** 通过 `onWebRtcConnectionStats` 监控 RTT、丢包率、码率等指标诊断问题。

## 参考文档

### 核心参考
- **`references/api-reference.md`** - 完整 API 参考（导出类清单、构造函数参数）
- **`references/class-details.md`** - 类详细说明和参数

### 分类 API 参考
- **`references/examples-core.md`** - 核心功能（相机导航、clickLocation、天气时间、3DTiles）
- **`references/examples-base.md`** - 基础控制与数据加载
- **`references/examples-markers-point.md`** - 点标记类
- **`references/examples-markers-line.md`** - 线条类
- **`references/examples-markers-shape.md`** - 几何形状类
- **`references/examples-polygon-effects.md`** - 多边形与特效
- **`references/examples-traffic.md`** - 交通行业
- **`references/examples-tools.md`** - 分析工具与模型

### 示例代码
- **`examples/basic-usage.js`** - 基础使用示例（含调度服务、React组件）
- **`examples/visualization.js`** - 可视化对象示例（全部类型）
