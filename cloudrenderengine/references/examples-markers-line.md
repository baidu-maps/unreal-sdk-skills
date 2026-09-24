# 线条类 API 参考

## Line 线条

绘制各种样式的线条。

```javascript
import { Line } from 'mapv-cloudrenderengine';

// 实线
const solidLine = new Line({
    style: 'solid',
    width: 5,
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.8,
});

// 虚线
const dashedLine = new Line({
    style: 'dashed',
    width: 3,
    color: { r: 1, g: 1, b: 0 },
    tilling: 5,                // 纹理平铺密度（控制虚线间隔，值越小越密）
});

// 流动箭头线
const arrowLine = new Line({
    style: 'arrow',
    width: 4,
    color: { r: 0, g: 0.8, b: 1 },
    speed: 0.5,                // 流动速度
    brightness: 0.3,           // 发光强度
});

// 渐变线
const gradientLine = new Line({
    style: 'gradient',
    width: 5,
    color: { r: 1, g: 0, b: 0 },      // 起点颜色
    color2: { r: 0, g: 0, b: 1 },     // 终点颜色
});

// 曲线 (平滑插值)
const curveLine = new Line({
    style: 'solid',
    splineType: 'Curve',       // 曲线插值
    width: 3,
    color: { r: 1, g: 0, b: 1 },
});

// 设置线数据
solidLine.setData({
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.404, 39.915, 0],
                [116.405, 39.916, 0],
                [116.406, 39.915, 0],
                [116.407, 39.917, 0]
            ]
        }
    }]
});

engine.addToScene(solidLine);
```

**Line 参数:**
| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `style` | string | solid/dashed/arrow/gradient | 线型样式 |
| `splineType` | string | Linear/Curve/Constant | 插值类型 |
| `direction` | string | center/stand/side | 线条方向 |
| `width` | number | - | 宽度 (米) |
| `color` | object | - | 颜色 {r,g,b} |
| `color2` | object | - | 渐变终点颜色 |
| `opacity` | number | - | 透明度 (0-1) |
| `brightness` | number | - | 发光强度 |
| `speed` | number | - | 流动速度 |
| `tilling` | number | - | 纹理平铺密度 (虚线/箭头线间距) |
| `map` | string | - | 贴图纹理 |
| `openStroke` | boolean | - | 是否描边 |
| `strokeWidth` | number | - | 描边宽度 |

---

## 多条线同时绘制

```javascript
const multiLine = new Line({
    style: 'solid',
    width: 3,
    color: { r: 0, g: 1, b: 0 },
});

multiLine.setData({
    type: 'FeatureCollection',
    features: [
        {
            id: 'line1',
            properties: { name: '路线A' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.400, 39.910, 0],
                    [116.405, 39.912, 0]
                ]
            }
        },
        {
            id: 'line2',
            properties: { name: '路线B' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.406, 39.913, 0],
                    [116.410, 39.918, 0]
                ]
            }
        }
    ]
});

engine.addToScene(multiLine);
```

---

## ODLine OD线

绘制从起点到终点的弧形飞线（Origin-Destination）。

```javascript
import { ODLine } from 'mapv-cloudrenderengine';

const odLine = new ODLine({
    color: { r: 0, g: 1, b: 1 },     // 线颜色
    width: 3,                         // 线宽
    speed: 0.5,                       // 动画速度
    opacity: 0.02,                    // 不透明度 (默认0.02)
    angle: 40,                        // 中间点与起始点高度夹角 (度，默认40)
    circleScale: 50,                  // 起始点扩散圆形尺寸 (默认50)
    brightness: 100,                  // 自发光亮度 (默认100)
    startHide: false,                 // 是否隐藏起始点特效
    endHide: false,                   // 是否隐藏终止点特效
});

odLine.setData({
    type: 'FeatureCollection',
    features: [
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.400, 39.910, 0],  // 起点
                    [116.450, 39.950, 0]   // 终点
                ]
            }
        },
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.400, 39.910, 0],  // 同一起点
                    [116.350, 39.880, 0]   // 另一终点
                ]
            }
        }
    ]
});

engine.addToScene(odLine);
```

**ODLine 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `color` | object | 线颜色 {r,g,b} |
| `width` | number | 线宽 (默认1) |
| `speed` | number | 动画速度 (默认0.5) |
| `opacity` | number | 不透明度 (默认0.02) |
| `angle` | number | 中间点与起始点高度夹角 (度，默认40) |
| `circleScale` | number | 起始点扩散圆形尺寸 (默认50) |
| `brightness` | number | 自发光亮度 (默认100) |
| `startHide` | boolean | 隐藏起始点特效 |
| `endHide` | boolean | 隐藏终止点特效 |
| `renderNum` | number | 每帧渲染的shape数量 (默认10) |

---

## LargeRoadCondition 大规模路况

用于显示城市级别的大规模路况数据。

```javascript
import { LargeRoadCondition } from 'mapv-cloudrenderengine';

const largeRoadCondition = new LargeRoadCondition({
    width: 6,
    opacity: 0.9,
    // 路况颜色映射
    colorMap: {
        1: { r: 0, g: 1, b: 0 },      // 畅通 - 绿
        2: { r: 1, g: 1, b: 0 },      // 缓行 - 黄
        3: { r: 1, g: 0.5, b: 0 },    // 拥堵 - 橙
        4: { r: 1, g: 0, b: 0 },      // 严重拥堵 - 红
    },
});

// 设置大量路况数据
largeRoadCondition.setData({
    type: 'FeatureCollection',
    features: roadConditionData.map(road => ({
        properties: {
            status: road.congestionLevel
        },
        geometry: {
            type: 'LineString',
            coordinates: road.points
        }
    }))
});

engine.addToScene(largeRoadCondition);

// 实时更新路况
function updateRoadCondition(newData) {
    largeRoadCondition.setData({
        type: 'FeatureCollection',
        features: newData
    });
}
```

---

## 带贴图的线条

```javascript
import { Line, loadImageAsBase64 } from 'mapv-cloudrenderengine';

const textureBase64 = await loadImageAsBase64('https://example.com/road-texture.png');

const texturedLine = new Line({
    style: 'solid',
    width: 10,
    map: textureBase64,        // 贴图纹理
    tilling: 5,                // 纹理平铺次数
    color: { r: 1, g: 1, b: 1 },
});

texturedLine.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.404, 39.915, 0],
                [116.410, 39.920, 0]
            ]
        }
    }]
});

engine.addToScene(texturedLine);
```

---

## 3D 立体线条

```javascript
const standLine = new Line({
    style: 'solid',
    direction: 'stand',        // 立体方向 (LineDirectionOptions.STAND)
    width: 5,
    color: { r: 0, g: 0.8, b: 1 },
    opacity: 0.7,
});

standLine.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.404, 39.915, 0],
                [116.406, 39.917, 0],
                [116.408, 39.915, 0]
            ]
        }
    }]
});

engine.addToScene(standLine);
```

---

## 线条点击事件

```javascript
const clickableLine = new Line({
    style: 'solid',
    width: 8,
    color: { r: 1, g: 0, b: 0 },
});

clickableLine.setData({
    type: 'FeatureCollection',
    features: [{
        id: 'route_001',
        properties: {
            name: '主干道',
            length: 1500
        },
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.404, 39.915, 0],
                [116.410, 39.920, 0]
            ]
        }
    }]
});

// 监听点击
clickableLine.addEventListener('mousedown', (event) => {
    console.log('点击线条:', event);
    if (event.content) {
        console.log('线条属性:', event.content.properties);
    }
});

// 高亮点击的线条
clickableLine.addEventListener('mousedown', (event) => {
    clickableLine.color = { r: 1, g: 1, b: 0 };  // 变黄
    setTimeout(() => {
        clickableLine.color = { r: 1, g: 0, b: 0 };  // 恢复
    }, 500);
});

engine.addToScene(clickableLine);
```

---

## 动态更新线条

```javascript
const dynamicLine = new Line({
    style: 'arrow',
    width: 4,
    color: { r: 0, g: 1, b: 0 },
    speed: 0.5,
});

// 初始数据
let lineCoordinates = [
    [116.404, 39.915, 0],
    [116.405, 39.916, 0]
];

dynamicLine.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: lineCoordinates
        }
    }]
});

engine.addToScene(dynamicLine);

// 动态添加点
function addPoint(lng, lat, alt) {
    lineCoordinates.push([lng, lat, alt]);
    dynamicLine.setData({
        type: 'FeatureCollection',
        features: [{
            geometry: {
                type: 'LineString',
                coordinates: lineCoordinates
            }
        }]
    });
}

// 模拟实时轨迹
let step = 0;
setInterval(() => {
    step++;
    const newLng = 116.405 + step * 0.001;
    const newLat = 39.916 + step * 0.0005;
    addPoint(newLng, newLat, 0);
}, 1000);
```

---

## PipeLine 三维管线 (圆管)

沿一组三维坐标点生成圆管，支持分段着色、半径与径向分段数控制。适合管道、隧道、地下管网等三维线状可视化。与 `Line` 不同，`PipeLine` 是真正的三维圆管几何体，可设置半径与径向分段数。

```javascript
import { PipeLine } from 'mapv-cloudrenderengine';

const pipe = new PipeLine({
    pipeline: [                             // 路径点: x=经度 y=纬度 z=高度(米)
        { x: 113.3186558, y: 23.5117344, z: 118.2 },
        { x: 113.3194128, y: 23.5141645, z: 126.0 },
        { x: 113.3198709, y: 23.5172817, z: 136.9 },
        { x: 113.3183403, y: 23.5216069, z: 139.2 },
    ],
    colors: [                               // 分段颜色, 通常为(点数-1)段, 范围[0-1]
        { r: 0, g: 1, b: 1, a: 0.3 },
        { r: 1, g: 0.1, b: 0.1, a: 0.3 },
        { r: 0, g: 1, b: 1, a: 0.3 },
    ],
    color: { r: 1, g: 0, b: 0, a: 0.5 },    // 基础颜色, 默认白色
    brightness: 0.1,                        // 发光强度, 默认0
    radius: 10,                             // 半径(米), 默认1
    radialSegments: -1,                     // 径向分段数, -1 引擎自动
});

// 可选: 获取 UE 回传的 PipeID (位于 content.pipelineID)
pipe.addEventListener('createFinished', (e) => {
    pipe.pipeID = e.content.pipelineID;
});

engine.addToScene(pipe);
```
**运行期更新（均触发 `Gis_UpdateCommonGISLayer`）:**

```javascript
// 批量设置分段颜色
pipe.setColors([
    { r: 0, g: 1, b: 1, a: 0.8 },
    { r: 0, g: 1, b: 1, a: 0.8 },
    { r: 0, g: 1, b: 1, a: 0.8 },
], 0);                                       // 第二参数为目标 pipeID

// 按索引更新单段颜色
pipe.setColorByIndex({ r: 1, g: 1, b: 0, a: 1 }, 0);

// 追加一条管线
pipe.addPipe([
    { x: 113.3200, y: 23.5200, z: 120 },
    { x: 113.3210, y: 23.5210, z: 122 },
]);

// 移除指定管线 / 清空全部
pipe.removePipe(0);
pipe.clear();

// 修改发光强度(会触发更新, 并把 option 复位为空字符串)
pipe.brightness = 0.5;
```

**PipeLine 参数:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pipeline` | Array<{x,y,z}> | [] | 路径点，x=经度 y=纬度 z=高度(米) |
| `colors` | Array<{r,g,b,a}> | [] | 分段颜色，通常(点数-1)段，范围[0-1] |
| `color` | {r,g,b,a} | 白色 | 基础颜色，范围[0-1] |
| `brightness` | number | 0 | 发光强度（修改触发更新，并复位 option） |
| `radius` | number | 1 | 管线半径(米) |
| `radialSegments` | number | -1 | 径向分段数(-1 引擎自动决定) |
| `pipeID` | number | 0 | 管线ID，用于按管线批量更新 |
| `option` | string | '' | 更新操作: clear/removePipe/setColors/setColorByIndex/addPipe |
| `visible` | boolean | true | 显隐 |

> **注意**: `colors` / `pipeline` / `color` / `radius` / `radialSegments` / `pipeID` 为静默属性，直接赋值只改值不触发更新，需配合 `option` 或 `brightness` 的修改一并下发。PipeID 也可由前端自增维护(0,1,2,…)。
