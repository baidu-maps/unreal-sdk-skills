/**
 * mapv-cloudrenderengine 可视化对象示例
 */

import {
    Line,
    ODLine,
    Polygon,
    IconPoint,
    TextPoint,
    BasicLabel,
    Point,
    Cone,
    Cube,
    Cylinder,
    Sphere,
    Circle,
    Particle,
    Radar,
    Ripple,
    Decal,
    Heatmap,
    loadImageAsBase64,
    drawTextToImage,
} from 'mapv-cloudrenderengine';

// 假设 engine 已初始化
// const engine = new CloudRenderEngine({...});

// ============================================
// 1. 线条 Line
// ============================================

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
});

// 流动箭头线 (来自 LineExample.jsx)
const arrowLine = new Line({
    style: 'arrow',
    splineType: 'Curve',       // 曲线插值
    width: 5,
    color: { r: 1, g: 0, b: 1, a: 0.8 },
    brightness: 1,
    tilling: 500,              // 纹理平铺
    renderType: 0,             // 渲染类型
    visible: true,
});

// 添加事件监听
arrowLine.addEventListener('mouseover', (e) => {
    console.log('鼠标悬停:', e);
});

// 设置线数据
arrowLine.setData({
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

engine.addToScene(arrowLine);

// 切换可视性
arrowLine.visible = !arrowLine.visible;

// 删除线
engine.destoryObject(arrowLine);

// ============================================
// 2. OD线 ODLine
// ============================================

const odLine = new ODLine({
    color: { r: 0, g: 1, b: 1 },
    color2: { r: 1, g: 0, b: 1 },
    width: 3,
    height: 100,
    speed: 1,
    opacity: 0.8,
});

odLine.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.400, 39.910, 0],  // 起点
                [116.410, 39.920, 0]   // 终点
            ]
        }
    }]
});

engine.addToScene(odLine);

// ============================================
// 3. 多边形 Polygon
// ============================================

const polygon = new Polygon({
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.5,
    brightness: 0.2,
    fillStyle: 'Stripe',
});

polygon.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.404, 39.915, 0],
                [116.406, 39.915, 0],
                [116.406, 39.917, 0],
                [116.404, 39.917, 0],
                [116.404, 39.915, 0]  // 闭合点
            ]]
        }
    }]
});

engine.addToScene(polygon);

// ============================================
// 4. 图标点 IconPoint (来自 IconPointExample.jsx)
// ============================================

// 屏幕空间图标点
const screenIconPoint = new IconPoint({
    fontSize: 14,
    width: 50,
    height: 80,
    hideText: false,
    iconUrl: 'https://example.com/marker.png',  // 也可以用 iconUrl
});

// 世界空间图标点 (固定大小在3D空间)
const worldIconPoint = new IconPoint({
    fontSize: 14,
    width: 150,
    height: 200,
    hideText: false,
    renderScale: 10,
    renderType: 1,           // 世界空间渲染
    iconUrl: 'https://example.com/marker.png',
});

screenIconPoint.setData({
    type: 'FeatureCollection',
    features: [
        {
            id: 1,
            properties: { text: '地点A' },
            geometry: { type: 'Point', coordinates: [116.404, 39.915, 10] }
        },
        {
            id: 2,
            properties: { text: '地点B' },
            geometry: { type: 'Point', coordinates: [116.406, 39.917, 10] }
        }
    ]
});

// 添加事件监听
screenIconPoint.addEventListener('mousedown', (e) => {
    console.log('点击了图标:', e);
});

screenIconPoint.addEventListener('mouseover', (e) => {
    console.log('鼠标悬停图标:', e);
});

engine.addToScene(screenIconPoint);

// 动态更新图标大小
screenIconPoint.renderScale = 2;

// 删除图标
engine.destoryObject(screenIconPoint);

// ============================================
// 5. 文字点 TextPoint
// ============================================

const textPoint = new TextPoint({
    fontSize: 14,
    fontColor: { r: 1, g: 1, b: 1 },
    backgroundColor: { r: 0, g: 0, b: 0 },
    backgroundOpacity: 0.7,
    borderWidth: 1,
    borderColor: { r: 1, g: 1, b: 1 },
    width: 100,
    height: 30,
});

textPoint.setData({
    type: 'FeatureCollection',
    features: [{
        properties: { text: '这是一个标注' },
        geometry: {
            type: 'Point',
            coordinates: [116.405, 39.916, 20]
        }
    }]
});

engine.addToScene(textPoint);

// ============================================
// 6. 自定义标签 BasicLabel
// ============================================

// 使用 Canvas 绘制自定义内容
const customTexture = drawTextToImage({
    text: '自定义\n标签内容',
    fontSize: 16,
    fontColor: '#ffffff',
    backgroundColor: 'rgba(0, 100, 200, 0.8)',
    padding: 10,
    borderRadius: 5,
});

const basicLabel = new BasicLabel({
    texture: customTexture,
    width: 120,
    height: 60,
    pivot: { x: 0.5, y: 1 },
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

// ============================================
// 7. 几何形状 Shapes
// ============================================

// 圆锥
const cone = new Cone({
    radius: 10,
    height: 30,
    color: { r: 1, g: 0, b: 0 },
    brightness: 0.5,
});

cone.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.402, 39.914, 0]
        }
    }]
});

engine.addToScene(cone);

// 立方体
const cube = new Cube({
    width: 10,
    height: 10,
    depth: 10,
    color: { r: 0, g: 1, b: 0 },
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

// 球体
const sphere = new Sphere({
    radius: 8,
    color: { r: 0, g: 0, b: 1 },
    brightness: 0.3,
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

// ============================================
// 8. 粒子效果 Particle
// ============================================

// 火焰效果
const fire = new Particle({
    kind: 'P_Fire_Small',
    scale: { x: 5, y: 5, z: 5 },
});

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

// 萤火虫效果
const firefly = new Particle({
    kind: 'NS_Firefly',
    scale: { x: 10, y: 10, z: 10 },
});

firefly.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.406, 39.913, 0]
        }
    }]
});

engine.addToScene(firefly);

// ============================================
// 9. 雷达扫描 Radar
// ============================================

const radar = new Radar({
    radius: 50,
    speed: 1,
    color: { r: 0, g: 1, b: 0 },
    opacity: 0.6,
});

radar.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.408, 39.915, 1]
        }
    }]
});

engine.addToScene(radar);

// ============================================
// 10. 扩散波纹 Ripple
// ============================================

const ripple = new Ripple({
    radius: 30,
    count: 3,
    speed: 0.5,
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

// ============================================
// 11. 贴花 Decal
// ============================================

async function createDecal() {
    const texture = await loadImageAsBase64('https://example.com/decal.png');

    const decal = new Decal({
        map: texture,
        width: 20,
        height: 20,
        animateType: 'expand',
        speed: 0.5,
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
}

// ============================================
// 12. 热力图 Heatmap
// ============================================

const heatmap = new Heatmap({
    type: 'plane',
    radius: 30,
    intensity: 1,
});

heatmap.setData({
    type: 'FeatureCollection',
    features: [
        {
            properties: { weight: 1.0 },
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
    ]
});

engine.addToScene(heatmap);

// ============================================
// 13. Transform 动画
// ============================================

// 位置动画
sphere.animate({
    from: { position: null },
    to: {
        position: { x: 116.410, y: 39.920, z: 50 }
    },
    duration: 5000,
    easing: 'Quadratic',
    loop: true,
    yoyo: true,
});

// 旋转动画
cube.animate({
    from: { rotation: null },
    to: {
        rotation: { roll: 0, pitch: 0, yaw: 360 }
    },
    duration: 3000,
    loop: true,
});

// 缩放动画
cone.animate({
    from: { scale: null },
    to: {
        scale: { x: 2, y: 2, z: 2 }
    },
    duration: 2000,
    yoyo: true,
    loop: true,
});

// 停止动画
// sphere.stopAnimate(1000);  // 1秒内淡出停止

// ============================================
// 14. 显隐控制
// ============================================

// 隐藏对象
polygon.visible = false;

// 显示对象
polygon.visible = true;

// ============================================
// 15. 销毁对象
// ============================================

// 销毁单个对象
// engine.destoryObject(solidLine);

// 清理示例
function cleanup() {
    engine.destoryObject(solidLine);
    engine.destoryObject(odLine);
    engine.destoryObject(polygon);
    // ... 销毁其他对象
}
