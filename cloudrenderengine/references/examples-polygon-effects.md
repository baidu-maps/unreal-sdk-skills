# 多边形与特效类 API 参考

## Polygon 多边形

绘制闭合多边形区域。

```javascript
import { Polygon } from 'mapv-cloudrenderengine';

// 基础多边形
const polygon = new Polygon({
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.5,
    brightness: 0.2,
});

// 条纹填充
const stripePolygon = new Polygon({
    fillStyle: 'Stripe',
    color: { r: 1, g: 0.5, b: 0 },
    opacity: 0.6,
});

// 网格填充
const matrixPolygon = new Polygon({
    fillStyle: 'Matrix',
    color: { r: 0, g: 0.8, b: 1 },
    opacity: 0.5,
});

// 拉伸多边形 (3D建筑效果)
const extrudedPolygon = new Polygon({
    fillStyle: 'Empty',
    color: { r: 0.5, g: 0.5, b: 1 },
    opacity: 0.8,
    height: 50,                      // 拉伸高度 (米)
});

// 设置多边形数据 (必须闭合)
polygon.setData({
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.404, 39.915, 0],
                [116.406, 39.915, 0],
                [116.406, 39.917, 0],
                [116.404, 39.917, 0],
                [116.404, 39.915, 0]  // 闭合点 (与起点相同)
            ]]
        }
    }]
});

engine.addToScene(polygon);
```

**Polygon 参数:**
| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `fillStyle` | string | Empty/Stripe/Matrix/Custom | 填充样式 |
| `color` | object | - | 颜色 {r,g,b} |
| `opacity` | number | - | 透明度 (0-1) |
| `brightness` | number | - | 发光强度 |
| `height` | number | - | 拉伸高度 (米) |
| `map` | string | - | 贴图纹理 |

**填充样式说明:**
| fillStyle | 说明 |
|-----------|------|
| `Empty` | 纯色填充 |
| `Stripe` | 条纹填充 |
| `Matrix` | 网格填充 |
| `Custom` | 自定义贴图 |

---

## 带孔多边形

```javascript
const polygonWithHole = new Polygon({
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.6,
});

polygonWithHole.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [
                // 外环 (顺时针)
                [
                    [116.400, 39.910, 0],
                    [116.410, 39.910, 0],
                    [116.410, 39.920, 0],
                    [116.400, 39.920, 0],
                    [116.400, 39.910, 0]
                ],
                // 内环/孔洞 (逆时针)
                [
                    [116.403, 39.913, 0],
                    [116.403, 39.917, 0],
                    [116.407, 39.917, 0],
                    [116.407, 39.913, 0],
                    [116.403, 39.913, 0]
                ]
            ]
        }
    }]
});

engine.addToScene(polygonWithHole);
```

---

## Particle 粒子效果

```javascript
import { Particle } from 'mapv-cloudrenderengine';

// 火焰效果
const fire = new Particle({
    kind: 'P_Fire_Small',
    scale: { x: 5, y: 5, z: 5 },
});

// 大火焰
const bigFire = new Particle({
    kind: 'P_Fire_Big',
    scale: { x: 3, y: 3, z: 3 },
});

// 烟雾效果
const smoke = new Particle({
    kind: 'P_Smoke_A',
    scale: { x: 8, y: 8, z: 8 },
});

// 萤火虫效果
const firefly = new Particle({
    kind: 'NS_Firefly',
    scale: { x: 10, y: 10, z: 10 },
});

// 烟花效果
const spark = new Particle({
    kind: 'NS_Spark',
    scale: { x: 5, y: 5, z: 5 },
});

// 团雾效果
const fog = new Particle({
    kind: 'P_Mass_Fog',
    scale: { x: 20, y: 20, z: 20 },
});

// 设置粒子位置
fire.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.913, 0]
        }
    }]
});

engine.addToScene(fire);
```

**粒子类型 (kind):**
| kind | 说明 |
|------|------|
| `P_Fire_Small` | 小火焰 |
| `P_Fire_Big` | 大火焰 |
| `P_Flamethrower` | 火焰喷射 |
| `P_Smoke_A` | 烟雾A |
| `P_Smoke_B` | 烟雾B |
| `P_Smoke_C` | 烟雾C |
| `P_Smoke_D` | 烟雾D |
| `P_Sparks_E` | 火花 |
| `P_Mass_Fog` | 团雾 |
| `NS_Firefly` | 萤火虫 |
| `NS_Spark` | 烟花 |

---

## Radar 雷达扫描

```javascript
import { Radar } from 'mapv-cloudrenderengine';

const radar = new Radar({
    radius: 50,                      // 扫描半径 (米)
    speed: 1,                        // 扫描速度
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.6,
});

radar.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.408, 39.915, 1]  // z 稍高于地面
        }
    }]
});

engine.addToScene(radar);

// 动态调整参数
function setRadarRange(newRadius) {
    radar.radius = newRadius;
}

function setRadarSpeed(newSpeed) {
    radar.speed = newSpeed;
}
```

**Radar 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `radius` | number | 扫描半径 (米) |
| `speed` | number | 扫描速度 |
| `color` | object | 颜色 {r,g,b} |
| `opacity` | number | 透明度 |

---

## Ripple 扩散波纹

```javascript
import { Ripple } from 'mapv-cloudrenderengine';

const ripple = new Ripple({
    radius: 30,                      // 最大扩散半径 (米)
    count: 3,                        // 波纹数量
    speed: 0.5,                      // 扩散速度
    color: { r: 0, g: 0.8, b: 1 },
    opacity: 0.7,
});

ripple.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.407, 39.916, 1]
        }
    }]
});

engine.addToScene(ripple);

// 多个波纹点
const multiRipple = new Ripple({
    radius: 20,
    count: 2,
    speed: 0.8,
    color: { r: 1, g: 0, b: 0 },
    opacity: 0.6,
});

multiRipple.setData({
    type: 'FeatureCollection',
    features: [
        { geometry: { type: 'Point', coordinates: [116.404, 39.914, 1] } },
        { geometry: { type: 'Point', coordinates: [116.406, 39.916, 1] } },
        { geometry: { type: 'Point', coordinates: [116.408, 39.914, 1] } },
    ]
});

engine.addToScene(multiRipple);
```

**Ripple 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `radius` | number | 最大扩散半径 (米) |
| `count` | number | 同时显示的波纹数量 |
| `speed` | number | 扩散速度 |
| `color` | object | 颜色 {r,g,b} |
| `opacity` | number | 透明度 |

---

## Decal 贴花

在地面或建筑表面贴上图案。

```javascript
import { Decal, loadImageAsBase64 } from 'mapv-cloudrenderengine';

const texture = await loadImageAsBase64('https://example.com/decal.png');

// 静态贴花
const decal = new Decal({
    map: texture,
    width: 20,                       // 宽度 (米)
    height: 20,                      // 高度 (米)
    color: { r: 1, g: 1, b: 1 },
    opacity: 0.9,
});

// 扩散动画贴花
const expandDecal = new Decal({
    map: texture,
    width: 30,
    height: 30,
    animateType: 'expand',           // 扩散动画
    speed: 0.5,
});

// 呼吸动画贴花
const breathDecal = new Decal({
    map: texture,
    width: 25,
    height: 25,
    animateType: 'breath',           // 呼吸动画
    speed: 1,
});

decal.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.409, 39.915, 0]
        }
    }]
});

engine.addToScene(decal);
```

**Decal 参数:**
| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `map` | string | - | 贴图纹理 (Base64) |
| `width` | number | - | 宽度 (米) |
| `height` | number | - | 高度 (米) |
| `animateType` | string | expand/breath | 动画类型 |
| `speed` | number | - | 动画速度 |
| `color` | object | - | 颜色叠加 |
| `opacity` | number | - | 透明度 |

---

## Heatmap 热力图

```javascript
import { Heatmap } from 'mapv-cloudrenderengine';

// 平面热力图
const planeHeatmap = new Heatmap({
    type: 'plane',
    radius: 30,                      // 影响半径
    intensity: 1,                    // 强度
});

// 粒子热力图 (3D效果)
const particleHeatmap = new Heatmap({
    type: 'particle',
    radius: 25,
    intensity: 0.8,
    maxIntensity: 2,
});

// 自定义颜色梯度
const customHeatmap = new Heatmap({
    type: 'plane',
    radius: 40,
    intensity: 1,
    gradient: {
        0.0: { r: 0, g: 0, b: 1 },    // 蓝色 (低)
        0.5: { r: 0, g: 1, b: 0 },    // 绿色 (中)
        1.0: { r: 1, g: 0, b: 0 },    // 红色 (高)
    },
});

// 设置热力图数据 (带权重)
planeHeatmap.setData({
    type: 'FeatureCollection',
    features: [
        {
            properties: { weight: 1.0 },     // 权重值 (0-1)
            geometry: { type: 'Point', coordinates: [116.404, 39.915, 0] }
        },
        {
            properties: { weight: 0.8 },
            geometry: { type: 'Point', coordinates: [116.405, 39.915, 0] }
        },
        {
            properties: { weight: 0.6 },
            geometry: { type: 'Point', coordinates: [116.404, 39.916, 0] }
        },
        {
            properties: { weight: 0.4 },
            geometry: { type: 'Point', coordinates: [116.406, 39.914, 0] }
        },
        {
            properties: { weight: 0.9 },
            geometry: { type: 'Point', coordinates: [116.405, 39.916, 0] }
        },
    ]
});

engine.addToScene(planeHeatmap);

// 动态更新热力图数据
function updateHeatmap(newPoints) {
    planeHeatmap.setData({
        type: 'FeatureCollection',
        features: newPoints.map(p => ({
            properties: { weight: p.weight },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat, 0] }
        }))
    });
}
```

**Heatmap 参数:**
| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `type` | string | plane/particle | 热力图类型 |
| `radius` | number | - | 影响半径 |
| `intensity` | number | - | 强度 |
| `maxIntensity` | number | - | 最大强度 |
| `gradient` | object | - | 颜色梯度映射 |

---

## 组合使用示例

```javascript
// 警报效果: 波纹 + 图标 + 标签
async function createAlertPoint(lng, lat, message) {
    // 波纹效果
    const ripple = new Ripple({
        radius: 50,
        count: 3,
        speed: 0.8,
        color: { r: 1, g: 0, b: 0 },
        opacity: 0.6,
    });
    ripple.setData({
        type: 'FeatureCollection',
        features: [{ geometry: { type: 'Point', coordinates: [lng, lat, 1] } }]
    });

    // 图标
    const icon = await loadImageAsBase64('https://example.com/alert-icon.png');
    const iconPoint = new IconPoint({
        texture: icon,
        width: 40,
        height: 40,
        pivot: { x: 0.5, y: 1 },
    });
    iconPoint.setData({
        type: 'FeatureCollection',
        features: [{ geometry: { type: 'Point', coordinates: [lng, lat, 0] } }]
    });

    // 标签
    const textPoint = new TextPoint({
        fontSize: 12,
        fontColor: { r: 1, g: 1, b: 1 },
        backgroundColor: { r: 1, g: 0, b: 0 },
        backgroundOpacity: 0.8,
        width: 150,
        height: 25,
        offset: { x: 0, y: 0, z: 50 },
    });
    textPoint.setData({
        type: 'FeatureCollection',
        features: [{ properties: { text: message }, geometry: { type: 'Point', coordinates: [lng, lat, 0] } }]
    });

    engine.addToScene(ripple);
    engine.addToScene(iconPoint);
    engine.addToScene(textPoint);

    return { ripple, iconPoint, textPoint };
}
```
