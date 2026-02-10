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

展示建筑分层拆解效果。

```javascript
import { LayerBuilding } from 'mapv-cloudrenderengine';

const layerBuilding = new LayerBuilding({
    // 建筑配置
    floors: 10,                      // 楼层数
    floorHeight: 3,                  // 每层高度 (米)

    // 拆解动画
    separationDistance: 5,           // 分离距离 (米)
    animationDuration: 2000,         // 动画时长 (毫秒)
});

// 设置建筑位置
layerBuilding.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.404, 39.915, 0],
                [116.405, 39.915, 0],
                [116.405, 39.916, 0],
                [116.404, 39.916, 0],
                [116.404, 39.915, 0]
            ]]
        }
    }]
});

engine.addToScene(layerBuilding);

// 触发拆解动画
layerBuilding.explode();

// 恢复原状
layerBuilding.collapse();

// 展示指定楼层
layerBuilding.showFloor(5);  // 显示第5层
```

---

## BuildingPickup 建筑拾取

启用建筑物点击拾取功能。

```javascript
import { BuildingPickup } from 'mapv-cloudrenderengine';

const buildingPickup = new BuildingPickup({
    highlightColor: { r: 0, g: 1, b: 1 },   // 高亮颜色
    highlightOpacity: 0.8,
});

engine.addToScene(buildingPickup);

// 监听建筑点击
buildingPickup.addEventListener('mousedown', (event) => {
    console.log('点击建筑:', event);
    if (event.buildingInfo) {
        console.log('建筑ID:', event.buildingInfo.id);
        console.log('建筑高度:', event.buildingInfo.height);
        console.log('建筑名称:', event.buildingInfo.name);
    }
});

// 开启/关闭拾取功能
buildingPickup.enable = true;
buildingPickup.enable = false;
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

// 监听加载完成
tileLayer.addEventListener('ready', () => {
    console.log('3DTiles 加载完成');
});

// 显示/隐藏
tileLayer.visible = true;
tileLayer.visible = false;
```

---

## RoutePlan 路线规划

显示路线规划结果。

```javascript
import { RoutePlan } from 'mapv-cloudrenderengine';

const routePlan = new RoutePlan({
    lineWidth: 8,
    lineColor: { r: 0, g: 0.5, b: 1 },
    arrowColor: { r: 1, g: 1, b: 1 },
    showArrow: true,
    arrowSpeed: 0.5,
});

// 设置路线点
routePlan.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.400, 39.910, 0],
                [116.405, 39.912, 0],
                [116.410, 39.915, 0],
                [116.415, 39.920, 0],
                [116.420, 39.925, 0]
            ]
        }
    }]
});

engine.addToScene(routePlan);

// 沿路线移动相机
function followRoute() {
    const points = [
        { x: 116.400, y: 39.910, z: 50 },
        { x: 116.405, y: 39.912, z: 50 },
        { x: 116.410, y: 39.915, z: 50 },
        { x: 116.415, y: 39.920, z: 50 },
        { x: 116.420, y: 39.925, z: 50 },
    ];

    engine.pathNavigation(points, {
        duration: 30,
        loop: false,
        lookAt: true
    });
}
```
