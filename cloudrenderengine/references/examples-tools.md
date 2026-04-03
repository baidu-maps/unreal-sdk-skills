# 分析工具与模型类 API 参考

## Skyline 天际线分析

显示建筑天际线轮廓。

```javascript
import { Skyline } from 'mapv-cloudrenderengine';

const skyline = new Skyline({
    color: { r: 1, g: 0, b: 0 },     // 轮廓颜色
    lineWidth: 2,                     // 线宽
    enable: true,                     // 启用分析
});

engine.addToScene(skyline);

// 开启/关闭天际线
skyline.enable = true;   // 开启
skyline.enable = false;  // 关闭
```

---

## VisualField 可视域分析

分析从指定观察点能看到的区域。

```javascript
import { VisualField } from 'mapv-cloudrenderengine';

const visualField = new VisualField({
    // 观察点位置
    position: { x: 116.404, y: 39.915, z: 50 },

    // 视野参数
    distance: 500,                   // 分析距离 (米)
    horizontalAngle: 120,            // 水平视角 (度)
    verticalAngle: 90,               // 垂直视角 (度)

    // 视野方向
    direction: { roll: 0, pitch: -30, yaw: 0 },

    // 颜色设置
    visibleColor: { r: 0, g: 1, b: 0 },      // 可见区域 - 绿色
    invisibleColor: { r: 1, g: 0, b: 0 },    // 不可见区域 - 红色
    opacity: 0.5,
});

engine.addToScene(visualField);

// 更新观察点
function updateObserverPosition(lng, lat, alt) {
    visualField.position = { x: lng, y: lat, z: alt };
}

// 更新视野方向
function updateDirection(pitch, yaw) {
    visualField.direction = { roll: 0, pitch: pitch, yaw: yaw };
}
```

**VisualField 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `position` | object | 观察点位置 {x,y,z} |
| `distance` | number | 分析距离 (米) |
| `horizontalAngle` | number | 水平视角 (度) |
| `verticalAngle` | number | 垂直视角 (度) |
| `direction` | object | 视野方向 {roll,pitch,yaw} |
| `visibleColor` | object | 可见区域颜色 |
| `invisibleColor` | object | 不可见区域颜色 |
| `opacity` | number | 透明度 |

---

## SlopeAnalysis 坡度分析

分析地形坡度并可视化显示。

```javascript
import { SlopeAnalysis } from 'mapv-cloudrenderengine';

const slopeAnalysis = new SlopeAnalysis({
    // 坡度阈值 (度)
    thresholds: [0, 15, 30, 45, 60, 90],

    // 对应颜色 (从平缓到陡峭)
    colors: [
        { r: 0, g: 1, b: 0 },        // 0-15° 绿色
        { r: 0.5, g: 1, b: 0 },      // 15-30° 黄绿
        { r: 1, g: 1, b: 0 },        // 30-45° 黄色
        { r: 1, g: 0.5, b: 0 },      // 45-60° 橙色
        { r: 1, g: 0, b: 0 },        // 60-90° 红色
    ],
    opacity: 0.6,
});

// 设置分析范围
slopeAnalysis.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.400, 39.910, 0],
                [116.410, 39.910, 0],
                [116.410, 39.920, 0],
                [116.400, 39.920, 0],
                [116.400, 39.910, 0]
            ]]
        }
    }]
});

engine.addToScene(slopeAnalysis);
```

---

## Inundation 淹没分析

模拟水位上涨的淹没效果。

```javascript
import { Inundation } from 'mapv-cloudrenderengine';

const inundation = new Inundation({
    waterLevel: 10,                  // 初始水位 (米)
    color: { r: 0, g: 0.5, b: 1 },   // 水面颜色
    opacity: 0.7,
    waveSpeed: 0.5,                  // 波浪速度
    waveHeight: 0.5,                 // 波浪高度
});

// 设置淹没分析范围
inundation.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.400, 39.910, 0],
                [116.420, 39.910, 0],
                [116.420, 39.930, 0],
                [116.400, 39.930, 0],
                [116.400, 39.910, 0]
            ]]
        }
    }]
});

engine.addToScene(inundation);

// 模拟水位上涨动画
let currentLevel = 10;
const interval = setInterval(() => {
    currentLevel += 1;
    inundation.waterLevel = currentLevel;
    if (currentLevel >= 50) {
        clearInterval(interval);
    }
}, 500);

// 设置特定水位
function setWaterLevel(level) {
    inundation.waterLevel = level;
}
```

---

## LayerBuilding 楼宇拆解

控制 UE5 场景内建筑的分层拆解与还原效果。

```javascript
import { LayerBuilding } from 'mapv-cloudrenderengine';

const layerBuilding = new LayerBuilding({
    buildingName: 'all',         // 控制的建筑名称，'all' 表示全部，默认 'all'
    layeringHeight: 1500,        // 楼层分解时每层间距 (cm)，默认 500
    layeringBaseHeight: 3000,    // 分解时模型整体抬高高度 (cm)，默认 300
    floorPullDir: { x: 5000, y: 0, z: 0 }, // 楼层抽出方位 (cm)，默认 x:5000
    hiddenDefault: true,         // 分层模型默认是否隐藏，默认 true
});

// 监听楼层解析完成 (挂在 engine.scene 上)
engine.scene.addEventListener('layerBuildingName', (data) => {
    // data.content.content[0].Floors 为楼层名称数组
    if (data && data.content && data.content.content) {
        const floors = data.content.content[0].Floors;
        console.log('可操控楼层列表:', floors);
    }
});

engine.addToScene(layerBuilding);

// 触发分层炸开
layerBuilding.layeringBuilding();

// 还原为整体建筑
layerBuilding.backBuildingToNormal();

// 隐藏指定层号及以上的楼层 (楼层号从 1 开始)
layerBuilding.hideAboveFloor(5);

// 显示所有楼层
layerBuilding.showAll();
```

---

## BuildingPickup 建筑拾取
L2建筑拾取，点击场景中的建筑获取建筑信息。

```javascript
import { BuildingPickup } from 'mapv-cloudrenderengine';

// 注意：第一个参数是 engine 实例
const buildingPickup = new BuildingPickup(engine, {
    enable: true,                             // 启用，默认 false
    rayDetectionDistance: 500000,             // 拾取距离 (cm)，默认 500000
    url: 'http://your-server/building/',      // L2建筑信息服务地址
    enableUI: false,                          // 是否启用默认 UI，默认 true
    onSelected: (event) => {
        // 拾取到建筑时的回调，event 为建筑信息
        console.log('拾取到建筑:', event);
    },
});

// 或者通过引擎事件监听 L2Selected
engine.addEventListener('L2Selected', (event) => {
    console.log('L2建筑选取:', event);
});

// 启用/关闭拾取
buildingPickup.enablePickup();
buildingPickup.disablePickup();
```

---

## FlashCar 发光车辆

带发光效果的车辆模型。

```javascript
import { FlashCar } from 'mapv-cloudrenderengine';

const flashCar = new FlashCar({
    color: { r: 0, g: 1, b: 1 },     // 发光颜色
    brightness: 1.5,                  // 发光强度
    pulseSpeed: 1,                    // 闪烁速度
});

flashCar.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 90 }
        }
    }]
});

engine.addToScene(flashCar);
```

---

## FlashCarCrash 事故车辆

带警示效果的事故车辆模型。

```javascript
import { FlashCarCrash } from 'mapv-cloudrenderengine';

const crashCar = new FlashCarCrash({
    color: { r: 1, g: 0, b: 0 },     // 警示颜色
    flashSpeed: 2,                    // 闪烁速度
});

crashCar.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.916, 0]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 45 }  // 斜向停放
        }
    }]
});

engine.addToScene(crashCar);
```

---

## FlashPeople 发光人物

带发光效果的行人模型。

```javascript
import { FlashPeople } from 'mapv-cloudrenderengine';

const flashPeople = new FlashPeople({
    color: { r: 1, g: 1, b: 0 },     // 发光颜色
    brightness: 1,
    animationName: 'walk',           // 动画名称
    animationLoop: true,
});

flashPeople.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.914, 0]
        }
    }]
});

engine.addToScene(flashPeople);
```

---

## Diamond 钻石模型

装饰性钻石模型。

```javascript
import { Diamond } from 'mapv-cloudrenderengine';

const diamond = new Diamond({
    scale: { x: 5, y: 5, z: 5 },
    color: { r: 0, g: 0.8, b: 1 },
    brightness: 2,
    rotateSpeed: 1,                  // 自动旋转速度
});

diamond.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.915, 30]
        }
    }]
});

engine.addToScene(diamond);
```

---

## Soil 遗撒物

道路遗撒物模型（模拟货物掉落）。

```javascript
import { Soil } from 'mapv-cloudrenderengine';

const soil = new Soil({
    type: 'sand',                    // 遗撒类型
    scale: { x: 3, y: 3, z: 1 },
    spreadRadius: 5,                 // 扩散半径
});

soil.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.406, 39.915, 0]
        }
    }]
});

engine.addToScene(soil);
```

---

## RoadPile 动态路桩

可动态控制升降的路桩。

```javascript
import { RoadPile } from 'mapv-cloudrenderengine';

const roadPile = new RoadPile({
    height: 1,                       // 升起高度 (米)
    color: { r: 1, g: 0.5, b: 0 },
    animationDuration: 500,          // 升降动画时长 (毫秒)
});

roadPile.setData({
    type: 'FeatureCollection',
    features: [{
        properties: { isUp: false }, // 初始状态
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        }
    }]
});

engine.addToScene(roadPile);

// 升起路桩
function raiseRoadPile() {
    roadPile.setData({
        type: 'FeatureCollection',
        features: [{
            properties: { isUp: true },
            geometry: { type: 'Point', coordinates: [116.404, 39.915, 0] }
        }]
    });
}

// 降下路桩
function lowerRoadPile() {
    roadPile.setData({
        type: 'FeatureCollection',
        features: [{
            properties: { isUp: false },
            geometry: { type: 'Point', coordinates: [116.404, 39.915, 0] }
        }]
    });
}
```

---

## I3DTileLayer 3DTiles数据

加载外部 3DTiles 数据。

```javascript
import { I3DTileLayer } from 'mapv-cloudrenderengine';

const tileLayer = new I3DTileLayer({
    url: 'https://example.com/3dtiles/tileset.json',

    // 变换参数
    position: { x: 116.404, y: 39.915, z: 0 },
    rotation: { roll: 0, pitch: 0, yaw: 0 },
    scale: { x: 1, y: 1, z: 1 },
});

engine.addToScene(tileLayer);

// 显示/隐藏
tileLayer.visible = true;
tileLayer.visible = false;
```

---

## RoutePlan 路线规划

显示路线规划结果。RoutePlan 继承自 Line，支持 Line 的所有样式参数。

```javascript
import { RoutePlan } from 'mapv-cloudrenderengine';

const routePlan = new RoutePlan({
    color: { r: 0, g: 0.5, b: 1 },  // 线颜色，继承自 Line
    width: 8,                         // 线宽
    style: 'arrow',                   // 线型，继承自 Line
    speed: 0.5,                       // 动画速度，继承自 Line
    url: 'http://your-server/routeplan', // 路径规划接口地址
});

// 设置路线点 (GeoJSON LineString)
routePlan.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.400, 39.910, 0],
                [116.405, 39.912, 0],
                [116.410, 39.915, 0],
            ]
        }
    }]
});

engine.addToScene(routePlan);
```
