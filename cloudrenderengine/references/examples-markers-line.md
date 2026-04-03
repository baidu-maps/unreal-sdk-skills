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
