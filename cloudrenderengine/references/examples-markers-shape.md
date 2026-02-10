# 几何形状类 API 参考

## 通用 Shape 参数

所有几何形状类继承自 Shape 基类，共享以下通用参数：

```javascript
{
    color: { r: 1, g: 0, b: 0 },    // 颜色 (0-1)
    opacity: 1.0,                    // 透明度 (0-1)
    brightness: 0.5,                 // 发光强度
    visible: true,                   // 可见性
    map: 'base64...',               // 贴图纹理
}
```

---

## Cone 圆锥

```javascript
import { Cone } from 'mapv-cloudrenderengine';

const cone = new Cone({
    radius: 10,                      // 底面半径 (米)
    height: 30,                      // 高度 (米)
    color: { r: 1, g: 0, b: 0 },
    brightness: 0.5,
    opacity: 0.8,
});

cone.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.402, 39.914, 0]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 0 }
        }
    }]
});

engine.addToScene(cone);

// 动画效果
cone.animate({
    from: { scale: null },
    to: { scale: { x: 2, y: 2, z: 2 } },
    duration: 2000,
    yoyo: true,
    loop: true,
});
```

**Cone 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `radius` | number | 底面半径 (米) |
| `height` | number | 高度 (米) |
| `segments` | number | 分段数 (越大越平滑) |

---

## Cube 立方体

```javascript
import { Cube } from 'mapv-cloudrenderengine';

const cube = new Cube({
    width: 10,                       // 宽度 (米)
    height: 10,                      // 高度 (米)
    depth: 10,                       // 深度 (米)
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.9,
});

cube.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.403, 39.914, 5]
        }
    }]
});

engine.addToScene(cube);

// 旋转动画
cube.animate({
    from: { rotation: null },
    to: { rotation: { roll: 0, pitch: 0, yaw: 360 } },
    duration: 3000,
    loop: true,
});
```

---

## Cylinder 圆柱体

```javascript
import { Cylinder } from 'mapv-cloudrenderengine';

const cylinder = new Cylinder({
    radius: 8,                       // 半径 (米)
    height: 25,                      // 高度 (米)
    color: { r: 0, g: 0, b: 1 },
    brightness: 0.3,
});

cylinder.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.914, 0]
        }
    }]
});

engine.addToScene(cylinder);
```

---

## Sphere 球体

```javascript
import { Sphere } from 'mapv-cloudrenderengine';

const sphere = new Sphere({
    radius: 8,                       // 半径 (米)
    color: { r: 0, g: 0, b: 1 },
    brightness: 0.3,
    opacity: 0.8,
});

sphere.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.914, 10]
        }
    }]
});

engine.addToScene(sphere);

// 位置动画
sphere.animate({
    from: { position: null },
    to: { position: { x: 116.410, y: 39.920, z: 50 } },
    duration: 5000,
    easing: 'Quadratic',
    loop: true,
    yoyo: true,
});
```

---

## Circle 平面圆

贴地的圆形平面。

```javascript
import { Circle } from 'mapv-cloudrenderengine';

const circle = new Circle({
    radius: 50,                      // 半径 (米)
    color: { r: 1, g: 0.5, b: 0 },
    opacity: 0.6,
    segments: 64,                    // 边数 (越大越圆)
});

circle.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0.5]  // z 稍高于地面避免z-fighting
        }
    }]
});

engine.addToScene(circle);
```

---

## Plane 平铺面

矩形平面，可用于地面标记。

```javascript
import { Plane } from 'mapv-cloudrenderengine';

const plane = new Plane({
    width: 20,                       // 宽度 (米)
    height: 30,                      // 长度 (米)
    color: { r: 0, g: 1, b: 1 },
    opacity: 0.5,
});

plane.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0.5]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 45 }  // 旋转45度
        }
    }]
});

engine.addToScene(plane);
```

---

## Torus 圆环体

```javascript
import { Torus } from 'mapv-cloudrenderengine';

const torus = new Torus({
    radius: 15,                      // 圆环半径 (米)
    tube: 3,                         // 管道半径 (米)
    color: { r: 1, g: 0, b: 1 },
    brightness: 0.5,
});

torus.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.915, 10]
        },
        properties: {
            rotation: { roll: 90, pitch: 0, yaw: 0 }  // 水平放置
        }
    }]
});

engine.addToScene(torus);
```

---

## Tube 圆管体

沿路径生成的管道。

```javascript
import { Tube } from 'mapv-cloudrenderengine';

const tube = new Tube({
    radius: 2,                       // 管道半径 (米)
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.8,
});

// 设置管道路径
tube.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.404, 39.915, 10],
                [116.405, 39.916, 15],
                [116.406, 39.915, 20],
                [116.407, 39.917, 10]
            ]
        }
    }]
});

engine.addToScene(tube);
```

---

## Bucket 无顶圆柱

空心圆柱（类似桶）。

```javascript
import { Bucket } from 'mapv-cloudrenderengine';

const bucket = new Bucket({
    radius: 10,                      // 半径 (米)
    height: 20,                      // 高度 (米)
    thickness: 1,                    // 壁厚 (米)
    color: { r: 0.5, g: 0.5, b: 0.5 },
    opacity: 0.9,
});

bucket.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        }
    }]
});

engine.addToScene(bucket);
```

---

## QuadPyramid 四面椎体

四棱锥形状。

```javascript
import { QuadPyramid } from 'mapv-cloudrenderengine';

const pyramid = new QuadPyramid({
    width: 15,                       // 底面宽度 (米)
    height: 25,                      // 高度 (米)
    color: { r: 1, g: 0.8, b: 0 },
    brightness: 0.3,
});

pyramid.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.406, 39.915, 0]
        }
    }]
});

engine.addToScene(pyramid);
```

---

## QuadPyramidTop 截顶视椎体

截去顶部的四棱锥（视椎体形状）。

```javascript
import { QuadPyramidTop } from 'mapv-cloudrenderengine';

const frustum = new QuadPyramidTop({
    topWidth: 5,                     // 顶面宽度 (米)
    bottomWidth: 15,                 // 底面宽度 (米)
    height: 20,                      // 高度 (米)
    color: { r: 0, g: 0.8, b: 1 },
    opacity: 0.7,
});

frustum.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.407, 39.915, 0]
        }
    }]
});

engine.addToScene(frustum);
```

---

## DiamondSign 倒三角标记

用于标注位置的倒三角标记。

```javascript
import { DiamondSign } from 'mapv-cloudrenderengine';

const diamondSign = new DiamondSign({
    width: 8,                        // 宽度 (米)
    height: 15,                      // 高度 (米)
    color: { r: 1, g: 0, b: 0 },
    brightness: 0.8,
    opacity: 0.9,
});

diamondSign.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 30]  // 悬浮在空中
        }
    }]
});

engine.addToScene(diamondSign);

// 上下浮动动画
diamondSign.animate({
    from: { position: null },
    to: { position: { x: 116.404, y: 39.915, z: 35 } },
    duration: 1000,
    yoyo: true,
    loop: true,
    easing: 'Sinusoidal',
});
```

---

## 动画系统

所有 Shape 类都支持 animate 方法：

```javascript
// 位置动画
shape.animate({
    from: { position: null },                    // null 表示当前位置
    to: { position: { x: lng, y: lat, z: alt } },
    duration: 3000,                              // 毫秒
    easing: 'Linear',                            // 缓动函数
    loop: true,                                  // 循环
    yoyo: true,                                  // 往返
    onComplete: () => {},                        // 完成回调
});

// 旋转动画
shape.animate({
    from: { rotation: null },
    to: { rotation: { roll: 0, pitch: 0, yaw: 360 } },
    duration: 3000,
    loop: true,
});

// 缩放动画
shape.animate({
    from: { scale: null },
    to: { scale: { x: 2, y: 2, z: 2 } },
    duration: 2000,
    yoyo: true,
    loop: true,
});

// 停止动画
shape.stopAnimate(1000);  // 1秒内淡出停止
```

**缓动函数 (easing):**
| 值 | 说明 |
|-----|------|
| `Linear` | 线性 |
| `Quadratic` | 二次方 |
| `Cubic` | 三次方 |
| `Sinusoidal` | 正弦 |
| `Exponential` | 指数 |

---

## 显隐控制

```javascript
// 隐藏
shape.visible = false;

// 显示
shape.visible = true;
```

---

## 销毁对象

```javascript
// 从场景中移除并销毁
engine.destoryObject(shape);
```
