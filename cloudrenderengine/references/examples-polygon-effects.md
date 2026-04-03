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
    // 注意: Polygon 不支持 height 拉伸参数，3D拉伸效果通过 GeoJSON features 中的 z 坐标控制
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
| `speedX` | number | - | 纹理U方向移动速度 (默认0.25) |
| `speedY` | number | - | 纹理V方向移动速度 (默认0.25) |
| `rotateAngle` | number | - | 纹理旋转角度 0~1 (默认0) |
| `tile` | number | - | 纹理平铺密度 (默认0.5) |
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

// 基础热力图 (texture类型)
const heatmap = new Heatmap({
    kind: 'texture',                 // 热力图类型: texture/cube/cone/particle
    width: 512,                      // 画布宽 (像素)
    height: 512,                     // 画布高 (像素)
    radius: 40,                      // 每个点的作用范围
    blur: 0.85,                      // 模糊度
    opacity: 0.5,
    min: 0,                          // 数据最小值
    max: 100,                        // 数据最大值
    // 数据直接在构造时传入
    data: [
        { longitude: 116.404, latitude: 39.915, value: 80 },
        { longitude: 116.405, latitude: 39.915, value: 60 },
        { longitude: 116.404, latitude: 39.916, value: 40 },
    ],
    // 渐变色配置 (使用CSS颜色字符串，particle类型无效)
    gradient: {
        0.25: 'rgb(0,0,255)',    // 低值 - 蓝色
        0.55: 'rgb(0,255,0)',    // 中值 - 绿色
        0.85: 'yellow',          // 较高 - 黄色
        1.0: 'rgb(255,0,0)',     // 高值 - 红色
    },
});

engine.addToScene(heatmap);

// 粒子热力图 (3D柱状效果)
const particleHeatmap = new Heatmap({
    kind: 'particle',
    width: 512,
    height: 512,
    radius: 40,
    min: 0,
    max: 100,
    data: [
        { longitude: 116.404, latitude: 39.915, value: 80 },
    ],
    particle: {
        maxHeight: 10,           // 粒子最高高度 (单位2dm)
        countX: 400,             // X轴栅格分辨率
        countY: 400,             // Y轴栅格分辨率
        scaleBoxXY: 1,           // 粒子缩放
    },
});

engine.addToScene(particleHeatmap);
```

**Heatmap 参数:**
| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `kind` | string | texture/cube/cone/particle | 热力图类型 (默认texture) |
| `width` | number | - | 画布宽 (像素, 默认512) |
| `height` | number | - | 画布高 (像素, 默认512) |
| `radius` | number | - | 每个点的作用范围 (默认40) |
| `blur` | number | - | 模糊度 (默认0.85) |
| `opacity` | number | - | 整体透明度 |
| `min` | number | - | 数据最小值 |
| `max` | number | - | 数据最大值 |
| `data` | array | - | 数据数组 [{longitude, latitude, value}] |
| `gradient` | object | - | 颜色梯度 (CSS颜色字符串, texture/cube/cone有效) |
| `minOpacity` | number | - | 最小透明度 (默认0) |
| `maxOpacity` | number | - | 最大透明度 (默认1) |
| `duration` | number | - | 数据更新过渡时间 (秒, 默认1) |
| `particle` | object | - | 粒子类型专用配置 |

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
