# 点标记类 API 参考

## Point 基础点

最基础的点标记，用于简单的位置标注。

```javascript
import { Point } from 'mapv-cloudrenderengine';

const point = new Point({
    color: { r: 1, g: 0, b: 0 },
    size: 10,
    opacity: 1,
});

point.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 10]
        }
    }]
});

engine.addToScene(point);
```

---

## IconPoint 图标点

使用自定义图标的点标记，支持点击事件。

```javascript
import { IconPoint, loadImageAsBase64 } from 'mapv-cloudrenderengine';

// 加载图标
const iconBase64 = await loadImageAsBase64('https://example.com/marker.png');

const iconPoint = new IconPoint({
    texture: iconBase64,        // 图标纹理 (Base64)
    width: 50,                  // 宽度 (像素)
    height: 50,                 // 高度 (像素)
    pivot: { x: 0.5, y: 1 },    // 锚点 (底部中心)
    scaleNum: 2,                // 缩放倍数
    fadeIn: true,               // 淡入效果
    hideText: true,             // 隐藏文字
    sizeAttenuation: false,     // 尺寸衰减 (远近大小不变)
    renderType: 1,              // 渲染类型
});

iconPoint.setData({
    type: 'FeatureCollection',
    features: [
        {
            id: 1,
            properties: {
                text: '地点A',
                customData: { info: '自定义数据' }
            },
            geometry: {
                type: 'Point',
                coordinates: [116.404, 39.915, 10]
            }
        },
        {
            id: 2,
            properties: { text: '地点B' },
            geometry: {
                type: 'Point',
                coordinates: [116.406, 39.917, 10]
            }
        }
    ]
});

// 点击事件
iconPoint.addEventListener('mousedown', (event) => {
    console.log('点击图标:', event);

    // 获取点击位置坐标
    if (event.GeographicLocation) {
        const loc = event.GeographicLocation;
        console.log('坐标:', loc.longitude, loc.latitude, loc.altitude);

        // 移动相机到点击位置
        engine.moveTo(
            { x: loc.longitude, y: loc.latitude, z: 100 },
            { roll: 0, pitch: -45, yaw: 0 },
            { duration: 1, zoom: 1500, flyOverLongitude: true, preload: true }
        );
    }
});

engine.addToScene(iconPoint);
```

**IconPoint 参数:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `texture` | string | - | 图标纹理 (Base64) |
| `width` | number | 32 | 宽度 (像素) |
| `height` | number | 32 | 高度 (像素) |
| `pivot` | object | {x:0.5,y:0.5} | 锚点位置 (0-1) |
| `scaleNum` | number | 1 | 缩放倍数 |
| `fadeIn` | boolean | false | 淡入效果 |
| `hideText` | boolean | false | 隐藏文字标签 |
| `sizeAttenuation` | boolean | true | 尺寸衰减 |
| `renderType` | number | 0 | 渲染类型 |

---

## TextPoint 文字点

带背景框的文字标注。

```javascript
import { TextPoint } from 'mapv-cloudrenderengine';

const textPoint = new TextPoint({
    // 文字样式
    fontSize: 14,
    fontColor: { r: 1, g: 1, b: 1 },
    fontFamily: 'Microsoft YaHei',

    // 背景样式
    backgroundColor: { r: 0, g: 0, b: 0 },
    backgroundOpacity: 0.7,

    // 边框样式
    borderWidth: 1,
    borderColor: { r: 1, g: 1, b: 1 },

    // 尺寸
    width: 100,
    height: 30,

    // 偏移
    offset: { x: 0, y: 0, z: 5 },
});

textPoint.setData({
    type: 'FeatureCollection',
    features: [{
        properties: {
            text: '这是一个标注'  // text 字段显示为标签内容
        },
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.916, 20]
        }
    }]
});

engine.addToScene(textPoint);

// 更新文字内容
function updateText(newText) {
    textPoint.setData({
        type: 'FeatureCollection',
        features: [{
            properties: { text: newText },
            geometry: {
                type: 'Point',
                coordinates: [116.405, 39.916, 20]
            }
        }]
    });
}
```

**TextPoint 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `fontSize` | number | 字体大小 |
| `fontColor` | object | 字体颜色 {r,g,b} |
| `fontFamily` | string | 字体名称 |
| `backgroundColor` | object | 背景颜色 |
| `backgroundOpacity` | number | 背景透明度 |
| `borderWidth` | number | 边框宽度 |
| `borderColor` | object | 边框颜色 |
| `width` | number | 标签宽度 |
| `height` | number | 标签高度 |
| `offset` | object | 偏移量 {x,y,z} |

---

## BasicLabel 自定义标签

使用 Canvas 绘制完全自定义的标签内容。

```javascript
import { BasicLabel, drawTextToImage } from 'mapv-cloudrenderengine';

// 方式1: 使用 drawTextToImage 生成简单文字图片
const textTexture = drawTextToImage({
    text: '自定义\n标签内容',
    fontSize: 16,
    fontColor: '#ffffff',
    backgroundColor: 'rgba(0, 100, 200, 0.8)',
    padding: 10,
    borderRadius: 5,
});

// 方式2: 使用 Canvas 绘制复杂内容
function createCustomTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // 绘制背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.roundRect(0, 0, 200, 100, 10);
    ctx.fill();

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('设备信息', 10, 25);

    // 绘制分割线
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(10, 35);
    ctx.lineTo(190, 35);
    ctx.stroke();

    // 绘制内容
    ctx.font = '14px Arial';
    ctx.fillText('状态: 在线', 10, 55);
    ctx.fillText('温度: 25°C', 10, 75);
    ctx.fillText('更新: 2024-01-01', 10, 95);

    return canvas.toDataURL('image/png');
}

const basicLabel = new BasicLabel({
    texture: createCustomTexture(),  // 或使用 textTexture
    width: 200,
    height: 100,
    pivot: { x: 0.5, y: 1 },         // 底部中心
    offset: { x: 0, y: 0, z: 10 },
    sizeAttenuation: false,
    fadeIn: true,
});

basicLabel.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.914, 30]
        }
    }]
});

engine.addToScene(basicLabel);

// 动态更新标签内容
function updateLabel(newTexture) {
    basicLabel.texture = newTexture;
}
```

**BasicLabel 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `texture` | string | 纹理图片 (Base64) |
| `width` | number | 宽度 (像素) |
| `height` | number | 高度 (像素) |
| `pivot` | object | 锚点 {x,y} |
| `offset` | object | 偏移量 {x,y,z} |
| `sizeAttenuation` | boolean | 尺寸衰减 |
| `fadeIn` | boolean | 淡入效果 |

---

## ClusterPoint 点聚合

大量点位的聚合显示，自动根据缩放级别聚合/展开。

```javascript
import { ClusterPoint, loadImageAsBase64 } from 'mapv-cloudrenderengine';

const iconBase64 = await loadImageAsBase64('https://example.com/marker.png');

const clusterPoint = new ClusterPoint({
    texture: iconBase64,
    width: 40,
    height: 40,
    pivot: { x: 0.5, y: 1 },

    // 聚合配置
    clusterRadius: 80,          // 聚合半径 (像素)
    minClusterSize: 2,          // 最小聚合数量

    // 聚合样式
    clusterColor: { r: 1, g: 0.5, b: 0 },
    clusterOpacity: 0.9,
    showClusterCount: true,     // 显示聚合数量

    // 文字样式
    clusterFontSize: 14,
    clusterFontColor: { r: 1, g: 1, b: 1 },
});

// 设置大量点位数据
clusterPoint.setData({
    type: 'FeatureCollection',
    features: generateRandomPoints(1000)  // 生成1000个随机点
});

engine.addToScene(clusterPoint);

// 监听聚合点击
clusterPoint.addEventListener('mousedown', (event) => {
    if (event.isCluster) {
        console.log('点击了聚合点，包含', event.clusterCount, '个点');
        // 可以选择放大到该区域
    } else {
        console.log('点击了单个点:', event);
    }
});

// 生成随机点的辅助函数
function generateRandomPoints(count) {
    const features = [];
    for (let i = 0; i < count; i++) {
        features.push({
            id: i,
            properties: { name: `点位${i}` },
            geometry: {
                type: 'Point',
                coordinates: [
                    116.4 + Math.random() * 0.1,
                    39.9 + Math.random() * 0.1,
                    0
                ]
            }
        });
    }
    return features;
}
```

**ClusterPoint 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `clusterRadius` | number | 聚合半径 (像素) |
| `minClusterSize` | number | 最小聚合数量 |
| `clusterColor` | object | 聚合点颜色 |
| `clusterOpacity` | number | 聚合点透明度 |
| `showClusterCount` | boolean | 显示聚合数量 |
| `clusterFontSize` | number | 数量字体大小 |
| `clusterFontColor` | object | 数量字体颜色 |

---

## WebViewPoint Web视图点

在场景中嵌入 Web 内容（如网页、图表）。

```javascript
import { WebViewPoint } from 'mapv-cloudrenderengine';

const webViewPoint = new WebViewPoint({
    url: 'https://example.com/chart',  // Web 页面 URL
    width: 400,
    height: 300,
    pivot: { x: 0.5, y: 0 },
    interactive: true,                  // 允许交互
});

webViewPoint.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 50]
        }
    }]
});

engine.addToScene(webViewPoint);

// 更新 URL
function updateWebView(newUrl) {
    webViewPoint.url = newUrl;
}
```

---

## Light 光源

在场景中添加光源效果。

```javascript
import { Light } from 'mapv-cloudrenderengine';

// 点光源
const pointLight = new Light({
    type: 'point',
    color: { r: 1, g: 0.9, b: 0.8 },
    intensity: 1000,
    radius: 50,                         // 影响半径
    castShadow: true,                   // 投射阴影
});

pointLight.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 20]
        }
    }]
});

engine.addToScene(pointLight);

// 聚光灯
const spotLight = new Light({
    type: 'spot',
    color: { r: 1, g: 1, b: 1 },
    intensity: 2000,
    innerAngle: 15,                     // 内锥角度
    outerAngle: 30,                     // 外锥角度
    direction: { x: 0, y: 0, z: -1 },   // 照射方向
});

spotLight.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.916, 30]
        }
    }]
});

engine.addToScene(spotLight);
```

**Light 类型:**
| type | 说明 |
|------|------|
| `point` | 点光源，向所有方向发光 |
| `spot` | 聚光灯，锥形光束 |
| `directional` | 平行光，模拟太阳光 |
