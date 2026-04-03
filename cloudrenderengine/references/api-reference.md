# mapv-cloudrenderengine API 完整参考

## 安装

```bash
npm install mapv-cloudrenderengine
```

```javascript
import * as Engine from 'mapv-cloudrenderengine';
import { CloudRenderEngine, Line, IconPoint } from 'mapv-cloudrenderengine';
```

## 导出类清单

```javascript
import {
    // 核心类
    CloudRenderEngine,      // 主渲染引擎
    UltralDynamicSky,       // 时间天气系统
    CommonConstant,         // 常量定义
    LevelManage,            // 关卡管理
    VersionInfo,            // 版本信息

    // 点类 (Point)
    Point,                  // 基础点
    IconPoint,              // 图标点
    TextPoint,              // 文字点
    BasicLabel,             // 自定义标签
    ClusterPoint,           // 点聚合
    WebViewPoint,           // Web视图点
    Light,                  // 光源

    // 线类 (Line)
    Line,                   // 线
    ODLine,                 // OD线 (起点-终点)
    LargeRoadCondition,     // 大规模路况

    // 面类 (Polygon)
    Polygon,                // 多边形

    // 几何形状 (Shape)
    Shape,                  // 形状基类
    Cone,                   // 圆锥
    Cube,                   // 立方体
    Cylinder,               // 圆柱体
    Sphere,                 // 球体
    Circle,                 // 平面圆
    Plane,                  // 平铺面
    Torus,                  // 圆环体
    Tube,                   // 圆管体
    Bucket,                 // 无顶圆柱
    QuadPyramid,            // 四面椎体
    QuadPyramidTop,         // 视椎体(截顶)
    DiamondSign,            // 倒三角标记

    // 特效类 (Effects)
    Particle,               // 粒子系统
    Radar,                  // 雷达扫描
    Ripple,                 // 扩散波纹
    Decal,                  // 贴花
    Heatmap,                // 热力图

    // 交通行业 (Traffic)
    TrafficLayer,           // 车辆轨迹孪生
    TrafficLightLayer,      // 红绿灯图层
    RoadCondition,          // 路况
    ConstructionLayer,      // 施工区域
    MockCarStream,          // 模拟车流
    CarPark,                // 倒车动画
    TriangleWarning,        // 三角警示牌
    TrafficCone,            // 交通锥
    TrafficShape,           // 交通参与者
    AutonomousVehicleLayer, // 自动驾驶车辆

    // 模型类 (Models)
    FlashCar,               // 发光车辆
    FlashCarCrash,          // 发光事故车
    FlashPeople,            // 发光人物
    Diamond,                // 钻石模型
    Soil,                   // 遗撒

    // 数据加载 (Data Loading)
    I3DTileLayer,           // 3DTiles数据
    AssetLayer,             // 动态资产
    RoadPile,               // 动态路桩
    RoadDataManager,        // 高精动态数据

    // 分析工具 (Analysis)
    Skyline,                // 天际线分析
    VisualField,            // 可视域分析
    SlopeAnalysis,          // 坡度分析
    Inundation,             // 淹没分析
    LayerBuilding,          // 楼宇拆解
    BuildingPickup,         // 建筑拾取

    // 离线渲染 (Sequencer)
    SequencerEarthRoadCondition,
    SequencerEarthCityRank,
    SequencerEarthCityHeatmap,
    SequencerEarthPersonLine,
    AdvancedFade,

    // 其他
    IndoorMap,              // 室内地图
    RoadName,               // 路名
    InfoLightLayer,         // 信息灯光
    RoutePlan,              // 路线规划

    // 工具函数
    loadImageAsBase64,      // 加载图片为Base64
    convertCanvas2Base64,   // Canvas转Base64
    drawCanvas,             // 绘制Canvas
    drawTextToImage,        // 文字转图片
    TextUtils,              // 文字工具
} from 'mapv-cloudrenderengine';
```

## CloudRenderEngine 核心 API

### 构造函数

```javascript
// 云渲染模式 (默认，通过 WebRTC 连接远程服务器)
new CloudRenderEngine({
    renderMode: 'cloud',           // 'cloud' | 'inner'
    wsUrl: string,                 // WebSocket服务地址
    matchmakerIP: string,          // 调度服务IP
    matchmakerPort: string,        // 调度服务端口 (默认'90')
    projectName: string,           // 项目名 (默认'default')
    matchViewportResolution: boolean, // 自适应分辨率 (默认false)
    connectOnLoad: boolean,        // 自动连接 (默认true)
    isReconnection: boolean,       // 开启重连 (默认false)
    forceTURN: boolean,            // 使用TURN服务器 (默认false)
    resolution: [number, number],  // 分辨率 [宽,高]
    printStats: boolean,           // 打印状态信息
    UDSParams: object,             // 天气系统默认参数
    isSequencer: boolean,          // 离线渲染场景 (默认false)
})

// 本地渲染模式 (突破 4K 分辨率限制，需要高性能客户端)
new CloudRenderEngine({
    renderMode: 'inner',           // 只需这一个参数
})
```

### 渲染模式说明

| 模式 | renderMode | 说明 | 适用场景 |
|------|------------|------|----------|
| 云渲染 | 'cloud' (默认) | 通过 WebRTC 连接远程 UE5 服务器 | **推荐**，大多数场景，支持移动端 |
| 本地渲染 | 'inner' | 直接在本地机器运行 UE5 | 特殊需求，超高分辨率场景 |

**重要：一般情况下使用云渲染模式即可，本地渲染模式仅适用于特殊的超高分辨率需求。**

**本地渲染模式特点：**
- 不需要 `<div id="player"></div>`
- 不需要配置调度服务
- 突破浏览器 4K 分辨率限制
- API 使用方式与云渲染完全相同
- 对客户端性能要求高，不支持移动端

### 场景管理

```javascript
// 添加对象到场景
engine.addToScene(object);

// 销毁对象 (从场景移除并释放内存)
engine.destoryObject(object);

// 移除对象 (等同于 destoryObject)
engine.removeFromScene(object);


// 遍历场景对象
engine.scene.traverse((obj) => {
    console.log(obj);
});
```

### 3DTiles 控制

```javascript
// 按名称开关3DTiles
engine.enable3DTilesByName({
    enable: true,        // 是否启用, 默认true
    tilesName: 'name',   // 瓦片名称
});

// 隐藏3DTiles中的部分元素
engine.hidden3DTilesItem({
    hiddenList: ['item1', 'item2'],  // 隐藏列表
    tilesName: 'name',               // 瓦片名称
});
```

### 图层控制

```javascript
// 按名称开关数据层
engine.enableDataLayerByName(dataLayerName: string, visible: boolean);

// 设置场景中心点位置
engine.setWorldCenterPoint(longitude, latitude, altitude?);

// 设置非球面视角POI显示模式
engine.SetPlanePOIMode({
    enable: false,
    cullingScale: 2.0,
    aspectRatio: 1.777778,
    cameraFov: 90,
    maxTilesCullingDistance: 1000,
    maxPOICullingDistance: 2000,
    poiSimplifyDistance: 1500,
    maxLoadedPoiTilesNum: 5,
});
```

### 绘制与量测

```javascript
// 开始绘制/量测
engine.enableEdit(
    'draw' | 'measure',                   // 模式
    'point' | 'line' | 'polygon' |        // 类型
    'measurearea' | 'measureline' |
    'locationpoint' | 'surfaceline',
    style                                  // 样式配置
);

// 关闭绘制/量测
engine.closeEdit('draw' | 'measure');

// 清空绘制结果
engine.clearEdit('draw' | 'measure');
```

### 相机控制

```javascript
// 移动到指定位置
engine.moveTo(
    { x: 116.404, y: 39.915, z: 500 },  // 位置: 经度,纬度,高度
    { roll: 0, pitch: -45, yaw: 0 },     // 旋转: 翻滚角,俯仰角,偏航角
    {
        duration: 2.0,              // 动画时长(秒), 默认1.0
        zoom: 1500,                 // 缩放级别(cm), -1表示不调整
        flyOverLongitude: true,     // 曲线跳跃, 默认false
        preload: true,              // 预加载, 默认false
        endLineDetect: false,       // 末端射线检测, 默认false
        detectLength: 50000,        // 末端射线检测距离(cm), 默认50000
        number: 0,                  // 标记序号, 默认0
        isGlobalMove: false,        // 是否球面移动, 默认false
        globalCityCenter: null,     // 球面城市中心点(球面模式)
        callback: () => {}          // 完成回调
    }
);

// 路径巡航 (navigateByKeypoints)
engine.navigateByKeypoints(
    [
        [116.40, 39.91, 20, 0, -30, 160],  // [经度, 纬度, 高度, roll, pitch, yaw]
        [116.41, 39.92, 30, 0, -40, 130],
        [116.40, 39.93, 40, 0, -50, 100],
    ],
    {
        speed: 36,                  // 巡航速度(km/h), 默认36, <0时用时间控制
        time: 0,                    // 巡航时间(秒), speed>0时优先用速度
        lockAll: true,              // 锁定rotation和zoom, 默认true
        ignoreLag: false,           // 忽略摄像机平滑延迟, 默认false
        name: '',                   // 巡航名字
        patrolType: 'default',      // 巡游类型: 'default' | 'Car'
        followRotation: { Roll: false, Pitch: false, Yaw: false },
        rayDetectionDistance: 1000, // 地面射线检测距离(cm), 默认1000
        finishDestory: true,        // 结束后销毁车辆(Car模式)
        startCallback: () => {},    // 巡航开始回调
        finishCallback: () => {},   // 巡航结束回调
    }
);

// 暂停/继续/停止巡航
engine.pauseNavigation({ patrolType: 'default' });
engine.resumeNavigation({ patrolType: 'default' });
engine.stopNavigation({ patrolType: 'default', delayTime: 100 });

// 移动/旋转摄像机
engine.moveCamera({ multiplier: 1, x: 0, y: 0 });      // x,y: [-1,1]
engine.rotateCamera({ multiplier: 1, yaw: 0, pitch: 0 }); // yaw,pitch: [-1,1]

// 缩放
engine.zoomIn(multiplier?: number);   // 缩进, 默认倍数1
engine.zoomOut(multiplier?: number);  // 缩远, 默认倍数1

// 修改分辨率
engine.changeResolution(width: number, height: number);

// 修改码率
engine.changeRenderBitrate(bitrate: number);

// 坐标转换
engine.project({ x, y, z }, callback);    // 世界坐标 -> 屏幕坐标
engine.unproject({ x, y }, callback);     // 屏幕坐标 -> 世界坐标

// 获取指定坐标高程
engine.getAltitudeFromCoordinate(
    { coordinate: { x, y }, detectLength: 100 },
    callback
);

// 重启关卡
engine.restartLevel();
engine.restartGame();
```

### WebRTC 状态监听

```javascript
// 监听 WebRTC 连接状态 (详细统计)
engine.onWebRtcConnectionStats((stats) => {
    // 基础指标
    console.log('帧率:', stats.framerate);           // 当前FPS
    console.log('码率:', stats.bitrate);             // 当前码率 (bps)
    console.log('延迟:', stats.roundTripTime);       // RTT延迟 (ms)
    console.log('丢包:', stats.packetsLost);         // 累计丢包数
    console.log('QP值:', stats.quantizationParameter); // 视频QP值 (越低越好)
    console.log('分辨率:', stats.resolution);        // {width, height}

    // 诊断信息 (diagnosis)
    if (stats.diagnosis) {
        console.log('网络状态:', stats.diagnosis.status);
        console.log('是否拥堵:', stats.diagnosis.isCongested);
        console.log('瞬时丢包:', stats.diagnosis.instantPacketLoss);
    }

    // 原始详细数据 (originData)
    if (stats.originData) {
        console.log('渲染延迟:', stats.originData.receiveToCompositeMs, 'ms');
        console.log('平均帧率:', stats.originData.avgframerate);
        console.log('最低帧率:', stats.originData.lowFramerate);
        console.log('最高帧率:', stats.originData.highFramerate);
        console.log('丢帧数:', stats.originData.framesDropped);
        console.log('丢帧率:', stats.originData.framesDroppedPercentage, '%');
        console.log('平均码率:', stats.originData.avgBitrate / 1000, 'Mbps');
        console.log('总接收:', stats.originData.bytesReceived / 1024 / 1024, 'MB');
    }
});
```

### 调度服务 (DispatchServer)

```javascript
import * as Engine from 'mapv-cloudrenderengine';

// 配置调度服务
// ⚠️ 重要：以下为示例配置，请替换为实际的服务器地址和凭证
Engine.CloudRenderEngine.DispatchServer.host = 'https://your-dispatch-server.example.com';
Engine.CloudRenderEngine.DispatchServer.username = 'your-username';
Engine.CloudRenderEngine.DispatchServer.password = 'your-password';
Engine.CloudRenderEngine.DispatchServer.tag = '';  // 可选标签

// 获取项目列表
const projects = await Engine.CloudRenderEngine.DispatchServer.GetProjectCommon();

// 获取集群容量
const capacity = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacity();
const capacityInfo = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacityInfo();
```

### 加载连接

```javascript
// 加载并连接 (使用调度服务模式)
engine.load(
    (message) => { console.log('成功', message); },
    (error) => { console.error('失败', error); }
);

// 监听画面初始化完成
engine.addEventListener('videoInitialised', () => {
    // 画面加载完毕，可以操作场景
});

// 监听信令服务器错误
engine.addEventListener('signalingServerError', () => {
    console.error('信令服务器连接错误');
});
```

## 天气时间系统 (UDS)

### 天气控制

```javascript
// 通过 engine.UDS 访问天气时间系统
engine.UDS.changeWeather(weatherType);

// 可用天气类型
'clearSkies'      // 晴空
'partlyCloudy'    // 少云
'cloudy'          // 多云
'foggy'           // 雾
'overcast'        // 阴天
'rain'            // 中大雨
'lightRain'       // 小雨
'snow'            // 中大雪
'lightSnow'       // 小雪
'thunderstorm'    // 风暴
'blizzard'        // 暴风雪
'sandDustCalm'    // 扬沙
'sandDustStorm'   // 沙尘暴
```

### 时间控制

```javascript
// 设置时间 (24小时制)
engine.UDS.changeTime(hour, minute);

// 示例
engine.UDS.changeTime(6, 0);    // 日出
engine.UDS.changeTime(12, 0);   // 正午
engine.UDS.changeTime(18, 30);  // 日落
engine.UDS.changeTime(22, 0);   // 夜晚
```

## 几何对象详细参数

### Line 线条

```javascript
new Line({
    // 样式
    style: 'solid' | 'dashed' | 'arrow' | 'gradient',
    splineType: 'Linear' | 'Curve' | 'Constant',
    direction: 'center' | 'stand' | 'side',

    // 尺寸
    width: number,              // 宽度(米)

    // 颜色材质
    color: { r, g, b, a },      // 颜色
    color2: { r, g, b, a },     // 渐变目标色
    opacity: number,            // 透明度 (0-1)
    brightness: number,         // 发光强度

    // 动画
    speed: number,              // 流动速度
    tilling: number,            // 纹理平铺

    // 贴图
    map: string,                // 纹理URL/Base64
});
```

### IconPoint 图标点

```javascript
new IconPoint({
    // 纹理
    texture: string,            // 图标Base64

    // 尺寸
    width: number,              // 宽度(像素)
    height: number,             // 高度(像素)
    scaleNum: number,           // 缩放倍数

    // 定位
    pivot: { x: number, y: number },  // 锚点 (0-1)

    // 渲染
    renderType: number,         // 渲染类型
    sizeAttenuation: boolean,   // 尺寸衰减
    fadeIn: boolean,            // 淡入效果

    // 文字
    hideText: boolean,          // 隐藏文字
});
```

### TextPoint 文字点

```javascript
new TextPoint({
    // 文字样式
    fontSize: number,           // 字体大小
    fontColor: { r, g, b },     // 字体颜色
    fontFamily: string,         // 字体

    // 背景
    backgroundColor: { r, g, b },
    backgroundOpacity: number,

    // 边框
    borderWidth: number,
    borderColor: { r, g, b },

    // 尺寸
    width: number,
    height: number,

    // 偏移
    offset: { x, y, z },
});
```

### BasicLabel 自定义标签

```javascript
new BasicLabel({
    // 内容
    texture: string,            // 自定义纹理Base64

    // 尺寸
    width: number,
    height: number,

    // 定位
    pivot: { x, y },
    offset: { x, y, z },

    // 渲染
    sizeAttenuation: boolean,
    fadeIn: boolean,
});
```

### Polygon 多边形

```javascript
new Polygon({
    // 填充
    fillStyle: 'Empty' | 'Stripe' | 'Matrix' | 'Custom',

    // 颜色
    color: { r, g, b, a },
    opacity: number,
    brightness: number,

    // 尺寸
    height: number,             // 拉伸高度

    // 贴图
    map: string,
});
```

### Particle 粒子系统

```javascript
new Particle({
    // 类型
    kind: string,               // 粒子类型名

    // 变换
    scale: { x, y, z },
    rotation: { roll, pitch, yaw },
    offset: { x, y, z },
});

// 粒子类型列表
const ParticleKinds = [
    'P_Fire_Small',      // 小火焰
    'P_Fire_Big',        // 大火焰
    'P_Flamethrower',    // 火焰喷射
    'P_Smoke_A',         // 烟雾A
    'P_Smoke_B',         // 烟雾B
    'P_Smoke_C',         // 烟雾C
    'P_Smoke_D',         // 烟雾D
    'P_Sparks_E',        // 火花
    'P_Mass_Fog',        // 团雾
    'NS_Firefly',        // 萤火虫
    'NS_Spark',          // 烟花
];
```

### Radar 雷达扫描

```javascript
new Radar({
    radius: number,             // 半径(米)
    color: { r, g, b },
    opacity: number,
    speed: number,              // 扫描速度
});
```

### Ripple 扩散波纹

```javascript
new Ripple({
    radius: number,             // 半径(米)
    color: { r, g, b },
    opacity: number,
    speed: number,              // 扩散速度
    count: number,              // 波纹数量
});
```

### Heatmap 热力图

```javascript
new Heatmap({
    // 类型
    type: 'plane' | 'particle', // 平面/粒子

    // 范围
    radius: number,             // 影响半径

    // 颜色
    gradient: object,           // 颜色梯度

    // 强度
    intensity: number,
    maxIntensity: number,
});
```

### Decal 贴花

```javascript
new Decal({
    // 纹理
    map: string,

    // 尺寸
    width: number,
    height: number,

    // 动画
    animateType: 'expand' | 'breath', // 扩散/呼吸
    speed: number,

    // 颜色
    color: { r, g, b },
    opacity: number,
});
```

## 交通行业类

### TrafficLayer 车辆轨迹孪生

```javascript
new TrafficLayer({
    // 数据源
    url: string,                // WebSocket URL
    eventName: string,          // 事件名称

    // 显示设置
    labelVisible: boolean,      // 标签可见
    labelGroup: string,         // 标签组
    carRenderDistance: number,  // 渲染距离
});

// 追踪车辆
trafficLayer.followTraffic({
    isFollow: boolean,
    carId: string,
    plateNumber: string,
    color: { r, g, b },
});
```

### MockCarStream 模拟车流

```javascript
new MockCarStream({
    // 速度
    speed: number,

    // 密度
    density: number,

    // 路径 (GeoJSON LineString)
});
```

### AutonomousVehicleLayer 自动驾驶车辆

```javascript
const autonomousLayer = new Engine.AutonomousVehicleLayer({
    url: 'ws://server/ws/vehicle',      // WebSocket数据源
    switchScale: true,                   // 是否根据视口高度切换缩放
    minViewPortHeight: 30,               // 最小视口高度
    maxViewPortHeight: 500,              // 最大视口高度
    minScale: 1,                         // 最小缩放
    maxScale: 10,                        // 最大缩放
    labelRenderScale: 1,                 // 标签缩放
    labelRenderType: 0,                  // 标签渲染类型
    labelField: 'testName',              // 标签字段名
    rayDetection: {
        enable: true,
        distance: 100,
    },
});

engine.addToScene(autonomousLayer);

// 事件监听
autonomousLayer.addEventListener('mousedown', (e) => {
    console.log('点击车辆:', e.content.Config.licenseNumber);
});

autonomousLayer.addEventListener('foundV5Apollo', (e) => {
    console.log('发现V5 Apollo车辆:', e);
});

// 切换数据源 (如跟踪单车)
autonomousLayer.url = 'ws://server/ws/singleVehicle?vehicleId=xxx';

// 控制车辆类型显隐
autonomousLayer.controlTypeList = [3, 29];  // 只显示指定类型
autonomousLayer.controlTypeList = null;     // 显示所有类型
autonomousLayer.visible = false;            // 隐藏所有
```

### LargeRoadCondition 大规模路况

```javascript
const roadCondition = new Engine.LargeRoadCondition({
    roadGeoJsonUrl: 'http://server/traffic/',        // 路网GeoJSON数据URL
    roadConditionUrl: 'https://api/linktraffic/',    // 路况数据API
    layerGroupName: 'Beijing',                        // 图层组名称
    colors: {
        1: {r: 0.7059, g: 0, b: 0, a: 1},           // 严重拥堵 (深红)
        2: {r: 0.9098, g: 0.0549, b: 0.0549, a: 1}, // 拥堵 (红)
        3: {r: 0.078125, g: 0.058385, b: 0, a: 1},  // 缓行 (黄)
        4: {r: 0.000207, g: 0.109375, b: 0, a: 1},  // 畅通 (绿)
    },
    brightnessList: [150, 150, 150, 150],            // 各等级颜色亮度
    heightOffset: 10,                                 // 路况线偏移高度(米)
});

engine.addToScene(roadCondition);
```

### InfoLightLayer C端信号灯

```javascript
const infoLight = new Engine.InfoLightLayer({
    url: 'https://your-api-server.example.com/api/traffic-lights?apiKey=your-key',    // 信号灯数据API
    lightAltitude: 3,                        // 灯光高度(米)
    renderScale: 0.2,                        // 渲染缩放
    renderTilesNum: 3,                       // 渲染瓦片数量
    updateCheckInterval: 2,                  // 更新检查间隔(秒)
    rayDetection: {
        enable: true,
        distance: 10,
        displacementHeight: 1.5,
    },
    visible: false,                          // 初始隐藏
});

engine.addToScene(infoLight);

// 控制显隐
infoLight.visible = true;
```

## 关卡管理 (LevelManage)

```javascript
import * as Engine from 'mapv-cloudrenderengine';

// 创建关卡管理器
const levelManage = new Engine.LevelManage(engine);

// 切换关卡
levelManage.switchLevel('NewLevelName');

// 监听关卡加载完成
engine.addEventListener('onUEILevelLoaded', () => {
    console.log('关卡加载完成');
});

// 监听关卡切换事件
engine.addEventListener('switchLevel', (e) => {
    console.log('切换到关卡:', e);
});
```

## 分析工具类

### Skyline 天际线分析

```javascript
new Skyline({
    color: { r, g, b },
    lineWidth: number,
});
```

### VisualField 可视域分析

```javascript
new VisualField({
    // 观察点
    position: { x, y, z },

    // 视野参数
    distance: number,           // 分析距离
    horizontalAngle: number,    // 水平角度
    verticalAngle: number,      // 垂直角度

    // 颜色
    visibleColor: { r, g, b },
    invisibleColor: { r, g, b },
});
```

### SlopeAnalysis 坡度分析

```javascript
new SlopeAnalysis({
    // 分析范围 (Polygon GeoJSON)

    // 颜色梯度
    colors: Array<{ r, g, b }>,

    // 坡度阈值
    thresholds: Array<number>,
});
```

## 数据加载类

### I3DTileLayer 3DTiles数据

```javascript
new I3DTileLayer({
    url: string,                // 数据URL

    // 变换
    position: { x, y, z },
    rotation: { roll, pitch, yaw },
    scale: { x, y, z },
});
```

### AssetLayer 动态资产

> **重要：AssetLayer 的正确使用必须遵循以下步骤，缺一不可！**

#### 步骤1：在 videoInitialised 中配置模型信息 (必须，仅一次)

```javascript
// 在引擎初始化完成后，必须先调用 setupModelInfo
// 这是使用 AssetLayer 的前置条件，只需执行一次
let modelInfoConfigured = false;

engine.addEventListener('videoInitialised', () => {
    if (!modelInfoConfigured) {
        // ⚠️ 重要：API 地址和参数需要根据实际服务配置
        engine.setupModelInfo(
            'https://your-api-server.example.com/api/modelInfo',
            {
                project_id: 'your-project-id',  // 替换为实际项目ID
            },
            {
                Authorization: 'Bearer your-auth-token',  // 替换为实际授权token
            }
        );
        modelInfoConfigured = true;
    }
});
```

#### 步骤2：创建 AssetLayer 实例

```javascript
// 基础用法：从服务端获取设备列表
const assetLayer = new Engine.AssetLayer({
    url: 'https://your-api-server.example.com/api/devices',
    header: {
        Authorization: 'Bearer your-auth-token',
    },
    body: {
        project_id: 'your-project-id',
        radius: 1500,                    // 查询半径(米)
        type: 'online',                  // 设备类型
        x: 116.404,                      // 查询中心经度
        y: 39.915,                       // 查询中心纬度
        status: 1,                       // 设备状态
    },
});
```

#### 步骤3：添加到场景

```javascript
engine.addToScene(assetLayer);
```

#### AssetLayer 构造函数参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | **必填** 设备数据接口URL |
| header | object | 请求头，如 `{ Authorization: 'token' }` |
| body | object | 请求体参数 |
| deviceAutoUpdate | boolean | 是否自动更新设备 (默认 false) |
| deviceAutoUpdateInterval | number | 自动更新间隔(秒) |
| rtEnable | boolean | 启用实时数据推送 |
| rtUrl | string | 实时数据WebSocket URL |
| rtTilelLevel | number | 实时数据瓦片级别 |
| searchMode | string | 搜索模式，如 'mc_grid' |

#### 实时数据接入示例

```javascript
const assetLayerRT = new Engine.AssetLayer({
    url: 'https://your-api-server.example.com/api/devices',
    header: { Authorization: 'Bearer your-token' },
    body: { project_id: 'your-project-id', radius: 500 },
    deviceAutoUpdate: true,
    deviceAutoUpdateInterval: 2,
    rtEnable: true,                             // 启用实时数据
    rtUrl: 'wss://your-websocket-server.example.com/realtime',       // 实时数据WebSocket
    rtTilelLevel: 17,
    searchMode: 'mc_grid',
});
```

#### 事件监听

```javascript
// 点击资产事件
assetLayer.addEventListener('mousedown', (e) => {
    console.log('点击资产:', e.content);
    // e.content 包含 uuid, point_id 等信息
});

// 资产加载完成事件
assetLayer.addEventListener('assetLoadFinish', () => {
    console.log('资产加载完成');
});
```

#### 更新资产样式

```javascript
// 单个资产更新
assetLayer.updateChild({
    uuid: 'asset-uuid',           // 从点击事件 e.content.uuid 获取
    point_id: 'point-id',         // 从点击事件 e.content.point_id 获取
    params: {
        color: {r: 1, g: 1, b: 0, a: 1},
        roughness: 0.001,
        brightness: 100,
        brightnessColor: {r: 1, g: 1, b: 0, a: 1},
    },
});

// 批量更新
assetLayer.updateChild([
    { uuid: 'uuid1', point_id: 'pid1', params: { color: {r:1,g:0,b:0,a:1} } },
    { uuid: 'uuid2', point_id: 'pid2', params: { color: {r:0,g:1,b:0,a:1} } },
]);

// 更新贴图
assetLayer.updateChild({
    uuid: 'asset-uuid',
    point_id: 'point-id',
    params: {
        map: 'https://example.com/texture.png',  // 贴图URL或base64
    },
});
```

#### 播放/停止动画

```javascript
// 播放动画
assetLayer.updateChildAnimation({
    uuid: 'asset-uuid',
    point_id: 'point-id',
    params: {
        animationIndex: 0,          // 动画索引
        animationLoop: true,        // 是否循环
        animationSpeed: 1.0,        // 播放速度
    },
});

// 停止动画 (设置 animationIndex 为 -1)
assetLayer.updateChildAnimation({
    uuid: 'asset-uuid',
    point_id: 'point-id',
    params: { animationIndex: -1 },
});
```

#### 删除资产

```javascript
// 删除单个资产 (content 来自点击事件 e.content)
assetLayer.removeChild(content);
```

#### 控制实时数据

```javascript
assetLayer.rtEnable = false;        // 断开实时数据
assetLayer.rtEnable = true;         // 启用实时数据

// 动态更新请求参数 (触发重新请求)
assetLayer.body = {
    project_id: 'xxx',
    radius: 1500,
    x: newLng,
    y: newLat,
};

// 控制整体显隐
assetLayer.visible = false;

// ========== 情报板编辑 ==========
// 情报板是一种特殊的动态资产，可以动态修改显示内容

// 生成文字贴图 (Base64)
function getTextBase64Content(text, style = {}) {
    return Engine.convertCanvas2Base64(Engine.drawTextToImage(text, {
        backgroundColor: style.backgroundColor || 'rgba(0,0,0,1)',
        textColor: style.textColor || { r: 255, g: 0, b: 0, a: 1 },
        fontSize: style.fontSize || 16,
        width: style.width || 0,   // 0 表示自动计算
        height: style.height || 20,
    }));
}

// 修改情报板内容
function modifyBoardContent(assetLayer, selectedAsset, text, style) {
    const base64Content = getTextBase64Content(text, style);
    const { content } = selectedAsset;

    assetLayer.updateChild({
        uuid: content.uuid,
        point_id: content.point_id,
        params: {
            map: base64Content,    // 贴图内容
            scroll: 1,             // 开启滚动
            speed: 0.3,            // 滚动速度
        },
    });
}
```

## 建筑场景

### 建筑生长动画

```javascript
// 播放建筑生长动画
engine.buildingGrowthAnimate({
    duration: 2000,        // 动画时长(毫秒)
    startHeight: 0,        // 起始高度(米)
    endHeight: 200,        // 结束高度(米)
    state: 'play',         // 'play' 播放动画
});
```

### 楼宇拆解 (LayerBuilding)

```javascript
// 楼宇拆解 - 显隐式/抽屉式
const layerBuilding = new Engine.LayerBuilding({
    // 配置参数
});
engine.addToScene(layerBuilding);
```

## 事件系统

### 支持的事件类型

```javascript
// 动态对象鼠标事件 (所有通过 addToScene 添加的对象上)
'mousedown'     // 鼠标在对象上按下
'mouseup'       // 鼠标在对象上抬起
'mouseover'     // 鼠标移入对象
'mouseleave'    // 鼠标移出对象

// 相机事件 (engine.camera 上)
'cameraChange'     // 相机位置/姿态变化
'clickLocation'    // 鼠标左键点击位置坐标

// 引擎级别事件 (engine 上)
'videoInitialised'      // 画面加载完成 (WebRTC画面就绪)
'signalingServerError'  // 信令服务器错误 (SDK内部事件)
'addToScene'            // 对象创建完成回调
'navigationStart'       // 巡游开始
'navigationFinish'      // 巡游完成
'moveTo'                // moveTo 镜头跳转结束
'switchLevel'           // 关卡开始切换
'onUEILevelLoaded'      // 关卡加载完成 (含关卡切换完成)
'editResult'            // 测量/绘制结果回调
'L2Selected'            // L2建筑选取回调
'FPSState'              // FPS值回调
'POICreateFinish'       // POI渲染完成回调

// scene 对象事件 (engine.scene 上)
'cityChange'            // 引擎级别城市变化

// TrafficLayer 事件
'onConnected'           // 服务连接成功
'onDIsconnected'        // 服务断开连接
'onFail'                // 服务连接失败
'follow'                // 车辆追踪回调
'unfollow'              // 车辆停止追踪回调

// AssetLayer 事件
'assetLoadFinish'       // 当前范围内资产加载完成

// AutonomousVehicleLayer 事件
'foundV5Apollo'         // 发现 V5 Apollo 车辆

// LayerBuilding 事件 (engine.scene 上)
'layerBuildingName'     // 可分层建筑解析完成，返回解析结果

// BasicLabel 事件
'contentLoaded'         // 标签内容加载完成

// BaseSequencer 事件
'createFinish'          // 离线渲染创建完成
'sequencerRenderFinish' // 离线渲染完成
```

### 点击位置事件 (正确方式)

```javascript
// 监听场景点击获取坐标
engine.camera.addEventListener('clickLocation', (event) => {
    console.log('完整事件:', event);
    if (event.content && event.content.Location) {
        const loc = event.content.Location;
        console.log('经度:', loc.longitude);
        console.log('纬度:', loc.latitude);
        console.log('高度:', loc.altitude);
    }
});
```

### 事件对象属性

```javascript
// clickLocation 事件对象结构
{
    content: {
        Location: {
            longitude: number,
            latitude: number,
            altitude: number,
        }
    }
}

// 对象点击事件结构
{
    type: string,               // 事件类型
    target: object,             // 事件目标
    GeographicLocation: {       // 地理位置 (部分事件)
        longitude: number,
        latitude: number,
        altitude: number,
    },
    content: any,               // 点击的数据内容
}
```

## 动画系统

### Transform 动画

```javascript
const tween = object.animate({
    from: {
        position: null,         // null表示当前值
        rotation: null,
        scale: null,
    },
    to: {
        position: { x, y, z },
        rotation: { roll, pitch, yaw },
        scale: { x, y, z },
    },
    duration: 3000,             // 毫秒
    easing: 'Linear' | 'Quadratic' | 'Cubic' | 'Sinusoidal' | 'Exponential',
    loop: boolean,
    yoyo: boolean,
    onComplete: Function,
});

// 停止动画
object.stopAnimate(fadeOutTime?: number);
```

## 工具函数

### 图片处理

```javascript
import { loadImageAsBase64, drawTextToImage } from 'mapv-cloudrenderengine';

// 加载图片为Base64
const base64 = await loadImageAsBase64(imageUrl);

// 文字转图片
const textImage = drawTextToImage({
    text: '标记',
    fontSize: 14,
    fontColor: '#ffffff',
    backgroundColor: '#000000',
});
```
