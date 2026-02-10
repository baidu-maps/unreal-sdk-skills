# mapv-cloudrenderengine 类详细说明

## 基类继承层次

### EventDispatcher
事件分发器基类，提供事件监听和触发机制。

```javascript
// 添加事件监听
object.addEventListener(type, callback);

// 移除事件监听
object.removeEventListener(type, callback);

// 触发事件
object.dispatchEvent({ type: 'eventName', ...data });

// 检查是否有监听器
object.hasEventListener(type);
```

### Object3D
3D 对象基类，继承自 EventDispatcher，提供位置、旋转、缩放等基础属性。

**属性:**
| 属性 | 类型 | 说明 |
|------|------|------|
| uuid | string | 唯一标识符 |
| name | string | 对象名称 |
| type | string | 对象类型 |
| visible | boolean | 可见性 |
| position | Vector3 | 位置 {x, y, z} |
| rotation | Euler | 旋转 {roll, pitch, yaw} |
| scale | Vector3 | 缩放 {x, y, z} |
| parent | Object3D | 父对象 |
| children | Array | 子对象列表 |

### Shape
几何形状基类，继承自 Object3D，所有可视化对象的基类。

**通用属性:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| color | Color | {r:1,g:1,b:1} | 主颜色 |
| color2 | Color | 同color | 渐变目标色 |
| opacity | number | 1.0 | 透明度 |
| brightness | number | 0 | 发光强度 |
| brightnessColor | Color | {r:1,g:1,b:1} | 发光颜色 |
| map | string | null | 贴图URL |
| size | number | 10 | 尺寸(像素) |
| sizeAttenuation | boolean | true | 尺寸衰减 |
| speed | number | 0.2 | 动画速度 |
| roughness | number | 1.0 | 粗糙度 |
| metallic | number | 0.0 | 金属度 |
| offset | Vector3 | {0,0,0} | 偏移(米) |
| uvRotateSpeed | number | 0 | UV旋转速度 |

**通用方法:**
```javascript
// 设置数据
shape.setData(geojsonData);

// Transform动画
shape.animate(options);
shape.stopAnimate(fadeOutTime);

// JSON序列化
shape.toJSON();
```

## 点类详解

### Point 基础点
最基本的点对象，支持 Transform 动画。

```javascript
new Point({
    color: { r: 1, g: 0, b: 0 },
    size: 20,
    sizeAttenuation: false,
});
```

### IconPoint 图标点
用于显示自定义图标的点标记。

```javascript
new IconPoint({
    texture: 'data:image/png;base64,...',  // 必须是Base64
    width: 50,
    height: 50,
    pivot: { x: 0.5, y: 1 },   // 底部中心
    scaleNum: 2,
    fadeIn: true,
    hideText: true,
    renderType: 0,
});
```

**renderType 值:**
- `0`: 默认渲染
- `1`: 始终面向相机
- `2`: 固定朝向

### TextPoint 文字点
显示文字标注。

```javascript
new TextPoint({
    fontSize: 14,
    fontColor: { r: 1, g: 1, b: 1 },
    fontFamily: 'Arial',
    backgroundColor: { r: 0, g: 0, b: 0 },
    backgroundOpacity: 0.7,
    borderWidth: 1,
    borderColor: { r: 1, g: 1, b: 1 },
    width: 100,
    height: 30,
    offset: { x: 0, y: 0, z: 10 },
});
```

数据中通过 `properties.text` 设置显示内容:
```javascript
{
    type: 'Feature',
    properties: { text: '显示文字' },
    geometry: { type: 'Point', coordinates: [116.4, 39.9, 0] }
}
```

### BasicLabel 自定义标签
完全自定义内容的标签，可渲染任意 Canvas/图片。

```javascript
import { drawTextToImage, drawCanvas } from 'mapv-cloudrenderengine';

// 绘制自定义内容
const texture = drawCanvas({
    width: 200,
    height: 100,
    draw: (ctx, canvas) => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 200, 100);
        ctx.fillStyle = '#fff';
        ctx.fillText('自定义内容', 10, 50);
    }
});

new BasicLabel({
    texture: texture,
    width: 200,
    height: 100,
    pivot: { x: 0.5, y: 1 },
});
```

### ClusterPoint 点聚合
大量点数据的聚合显示，提升性能。

```javascript
new ClusterPoint({
    clusterRadius: 60,          // 聚合半径(像素)
    minClusterSize: 2,          // 最小聚合数量
    maxClusterZoom: 18,         // 最大聚合层级
    texture: '...',             // 点图标
    clusterTexture: '...',      // 聚合图标
    width: 40,
    height: 40,
});
```

### WebViewPoint Web视图点
在场景中渲染 Web 内容。

```javascript
new WebViewPoint({
    url: 'https://example.com',
    width: 400,
    height: 300,
    opacity: 0.9,
});
```

### Light 光源
场景光源对象。

```javascript
new Light({
    type: 'point' | 'spot' | 'directional',
    color: { r: 1, g: 1, b: 0.9 },
    intensity: 1000,
    radius: 100,                // 影响范围
    castShadow: true,
});
```

## 线类详解

### Line 线条
支持多种样式的线条。

```javascript
new Line({
    // 线型样式
    style: 'solid',             // solid|dashed|arrow|gradient
    splineType: 'Curve',        // Linear|Curve|Constant
    direction: 'center',        // center|stand|side

    // 尺寸
    width: 5,                   // 宽度(米)

    // 外观
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.8,
    brightness: 0.5,

    // 动画 (用于流动效果)
    speed: 0.5,
    tilling: 30,

    // 贴图 (style为gradient时有效)
    map: 'texture-url',
});
```

**style 说明:**
- `solid`: 实线
- `dashed`: 虚线
- `arrow`: 带箭头方向指示
- `gradient`: 渐变线（需配合 map 使用）

**splineType 说明:**
- `Linear`: 直线连接
- `Curve`: 曲线平滑
- `Constant`: 阶梯状

**direction 说明:**
- `center`: 中心对齐
- `stand`: 竖直站立
- `side`: 侧边偏移

### ODLine OD线
起点到终点的连接线，适合展示流向关系。

```javascript
new ODLine({
    color: { r: 0, g: 1, b: 1 },
    color2: { r: 1, g: 0, b: 1 },  // 终点颜色
    width: 3,
    height: 100,                   // 弧线高度
    speed: 1,
    opacity: 0.8,
});
```

数据格式使用 LineString，两点一组:
```javascript
{
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [
            [起点经度, 起点纬度, 起点高度],
            [终点经度, 终点纬度, 终点高度]
        ]
    }
}
```

### LargeRoadCondition 大规模路况
高性能路况显示，适合城市级别路网。

```javascript
new LargeRoadCondition({
    // 数据源
    dataUrl: 'https://...',

    // 颜色映射
    colorMap: {
        1: { r: 0, g: 1, b: 0 },    // 畅通
        2: { r: 1, g: 1, b: 0 },    // 缓行
        3: { r: 1, g: 0.5, b: 0 },  // 拥堵
        4: { r: 1, g: 0, b: 0 },    // 严重拥堵
    },
});
```

## 面类详解

### Polygon 多边形
自定义区域面。

```javascript
new Polygon({
    // 填充样式
    fillStyle: 'Stripe',        // Empty|Stripe|Matrix|Custom

    // 外观
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.5,
    brightness: 0.2,

    // 拉伸 (3D效果)
    height: 50,                 // 拉伸高度(米)

    // 贴图 (fillStyle为Custom时)
    map: 'texture-url',
});
```

**fillStyle 说明:**
- `Empty`: 无填充，仅边框
- `Stripe`: 条纹填充
- `Matrix`: 网格填充
- `Custom`: 自定义贴图

## 几何形状详解

所有几何形状继承自 Shape，共享通用属性。

### Cone 圆锥
```javascript
new Cone({
    radius: 10,                 // 底部半径(米)
    height: 30,                 // 高度(米)
    color: { r: 1, g: 0, b: 0 },
});
```

### Cube 立方体
```javascript
new Cube({
    width: 10,
    height: 10,
    depth: 10,
    color: { r: 0, g: 1, b: 0 },
});
```

### Cylinder 圆柱体
```javascript
new Cylinder({
    radius: 5,
    height: 20,
    sizeAttenuation: false,     // 固定像素大小
});
```

### Sphere 球体
```javascript
new Sphere({
    radius: 10,
    color: { r: 0, g: 0, b: 1 },
});
```

### Circle 平面圆
```javascript
new Circle({
    radius: 20,
    color: { r: 1, g: 1, b: 0 },
    map: 'texture-url',         // 支持贴图

    // UV动画
    uvRotateSpeed: 1,           // 旋转速度
});
```

### Plane 平铺面
```javascript
new Plane({
    width: 100,
    height: 100,
    map: 'texture-url',
});
```

### Torus 圆环体
```javascript
new Torus({
    radius: 20,                 // 环半径
    tube: 5,                    // 管半径
});
```

### Tube 圆管体
沿路径生成的管状几何体。

```javascript
new Tube({
    radius: 2,
    // 使用LineString数据定义路径
});
```

### Bucket 无顶圆柱
```javascript
new Bucket({
    radius: 10,
    height: 30,
});
```

### QuadPyramid 四面椎体
```javascript
new QuadPyramid({
    width: 10,
    height: 20,
});
```

### QuadPyramidTop 视椎体
截顶的四面椎，常用于表示视锥范围。

```javascript
new QuadPyramidTop({
    topWidth: 5,
    bottomWidth: 20,
    height: 30,
});
```

## 特效类详解

### Particle 粒子系统
内置多种预设粒子效果。

```javascript
new Particle({
    kind: 'P_Fire_Small',
    scale: { x: 5, y: 5, z: 5 },
});
```

**可用粒子类型:**
| kind | 说明 |
|------|------|
| P_Fire_Small | 小火焰 |
| P_Fire_Big | 大火焰 |
| P_Flamethrower | 火焰喷射 |
| P_Smoke_A/B/C/D | 各种烟雾 |
| P_Sparks_E | 火花 |
| P_Mass_Fog | 团雾 |
| NS_Firefly | 萤火虫 |
| NS_Spark | 烟花 |

### Radar 雷达扫描
扫描效果，常用于探测范围显示。

```javascript
new Radar({
    radius: 100,
    speed: 1,
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.6,
});
```

### Ripple 扩散波纹
涟漪扩散效果。

```javascript
new Ripple({
    radius: 50,
    count: 3,                   // 波纹数量
    speed: 0.5,
    color: { r: 0, g: 0.8, b: 1 },
});
```

### Decal 贴花
贴附在地面的效果。

```javascript
new Decal({
    map: 'texture-url',
    width: 30,
    height: 30,

    // 动画类型
    animateType: 'expand',      // expand|breath

    speed: 1,
});
```

### Heatmap 热力图
支持平面和粒子两种模式。

```javascript
// 平面热力图
new Heatmap({
    type: 'plane',
    radius: 50,
    intensity: 1,
    gradient: {
        0.4: 'blue',
        0.6: 'green',
        0.8: 'yellow',
        1.0: 'red'
    },
});

// 粒子热力图
new Heatmap({
    type: 'particle',
    radius: 30,
});
```

数据格式:
```javascript
{
    type: 'FeatureCollection',
    features: [{
        properties: { weight: 0.8 },  // 权重
        geometry: { type: 'Point', coordinates: [lng, lat, 0] }
    }]
}
```
