# 交通行业 API 参考

## TrafficLayer 车辆轨迹孪生

实时显示车辆轨迹，支持车辆追踪和标签显示。

```javascript
import { TrafficLayer } from 'mapv-cloudrenderengine';

// 创建车辆轨迹图层
const trafficLayer = new TrafficLayer({
    url: 'ws://your-websocket-server/traffic',  // WebSocket 数据源
    eventName: 'trafficData',                    // 事件名称
    labelVisible: true,                          // 显示车牌标签
    labelGroup: 'traffic',                       // 标签组
    carRenderDistance: 500,                      // 渲染距离(米)
});

engine.addToScene(trafficLayer);

// 追踪特定车辆
trafficLayer.followTraffic({
    isFollow: true,
    carId: 'car_001',
    plateNumber: '京A12345',
    color: { r: 1, g: 0, b: 0 },  // 高亮颜色
});

// 停止追踪
trafficLayer.followTraffic({
    isFollow: false,
    carId: 'car_001',
});

// 监听车辆点击
trafficLayer.addEventListener('mousedown', (event) => {
    console.log('点击车辆:', event);
});
```

**TrafficLayer 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | WebSocket 数据源地址 |
| `eventName` | string | 数据事件名称 |
| `labelVisible` | boolean | 是否显示车牌标签 |
| `labelGroup` | string | 标签分组 |
| `carRenderDistance` | number | 车辆渲染距离(米) |

---

## MockCarStream 模拟车流

在指定路线上生成模拟车流动画。

```javascript
import { MockCarStream } from 'mapv-cloudrenderengine';

// 创建模拟车流
const carStream = new MockCarStream({
    speed: 30,      // 车流速度
    density: 0.5,   // 车流密度 (0-1)
});

// 设置路线数据
carStream.setData({
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [116.400, 39.910, 0],
                [116.405, 39.912, 0],
                [116.410, 39.915, 0],
                [116.415, 39.918, 0]
            ]
        }
    }]
});

engine.addToScene(carStream);

// 控制显隐
carStream.visible = true;  // 或 false
```

**MockCarStream 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `speed` | number | 车流速度 |
| `density` | number | 车流密度 (0-1) |

---

## CarPark 倒车动画

显示车辆倒车入库动画。

```javascript
import { CarPark } from 'mapv-cloudrenderengine';

// 创建倒车动画
const carPark = new CarPark({
    carType: 'sedan',       // 车辆类型
    animationSpeed: 1,      // 动画速度
    loop: true,             // 循环播放
});

// 设置停车位位置
carPark.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 90 }  // 停车方向
        }
    }]
});

engine.addToScene(carPark);
```

---

## ConstructionLayer 施工区域

显示道路施工区域标记。

```javascript
import { ConstructionLayer } from 'mapv-cloudrenderengine';

// 创建施工区域
const construction = new ConstructionLayer({
    color: { r: 1, g: 0.5, b: 0 },  // 警示颜色
    opacity: 0.7,
    animateType: 'flash',           // 闪烁动画
});

// 设置施工区域范围
construction.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [116.404, 39.915, 0],
                [116.406, 39.915, 0],
                [116.406, 39.916, 0],
                [116.404, 39.916, 0],
                [116.404, 39.915, 0]
            ]]
        }
    }]
});

engine.addToScene(construction);
```

---

## TriangleWarning 三角警示牌

在指定位置放置三角警示牌模型。

```javascript
import { TriangleWarning } from 'mapv-cloudrenderengine';

// 创建三角警示牌
const warning = new TriangleWarning({
    scale: { x: 1, y: 1, z: 1 },
    rotation: { roll: 0, pitch: 0, yaw: 0 },
});

// 设置位置
warning.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        }
    }]
});

engine.addToScene(warning);
```

---

## TrafficCone 交通锥

放置交通锥模型。

```javascript
import { TrafficCone } from 'mapv-cloudrenderengine';

// 创建交通锥
const cone = new TrafficCone({
    scale: { x: 1, y: 1, z: 1 },
});

// 批量放置交通锥
cone.setData({
    type: 'FeatureCollection',
    features: [
        {
            geometry: {
                type: 'Point',
                coordinates: [116.404, 39.915, 0]
            }
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [116.405, 39.915, 0]
            }
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [116.406, 39.915, 0]
            }
        }
    ]
});

engine.addToScene(cone);
```

---

## RoadCondition 路况显示

显示道路拥堵状态。

```javascript
import { RoadCondition } from 'mapv-cloudrenderengine';

// 创建路况图层
const roadCondition = new RoadCondition({
    width: 8,          // 路况线宽度
    opacity: 0.8,
});

// 设置路况数据
roadCondition.setData({
    type: 'FeatureCollection',
    features: [
        {
            properties: {
                status: 1  // 1-畅通(绿), 2-缓行(黄), 3-拥堵(红), 4-严重拥堵(深红)
            },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.400, 39.910, 0],
                    [116.405, 39.912, 0]
                ]
            }
        },
        {
            properties: {
                status: 3  // 拥堵
            },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [116.405, 39.912, 0],
                    [116.410, 39.915, 0]
                ]
            }
        }
    ]
});

engine.addToScene(roadCondition);
```

**路况状态值:**
| status | 颜色 | 说明 |
|--------|------|------|
| 1 | 绿色 | 畅通 |
| 2 | 黄色 | 缓行 |
| 3 | 红色 | 拥堵 |
| 4 | 深红 | 严重拥堵 |

---

## TrafficLightLayer 红绿灯图层

显示和控制交通信号灯。

```javascript
import { TrafficLightLayer } from 'mapv-cloudrenderengine';

// 创建红绿灯图层
const trafficLight = new TrafficLightLayer({
    scale: { x: 1, y: 1, z: 1 },
});

// 设置红绿灯位置
trafficLight.setData({
    type: 'FeatureCollection',
    features: [{
        properties: {
            lightState: 'green',  // 'red' | 'yellow' | 'green'
            countdown: 30         // 倒计时秒数
        },
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        }
    }]
});

engine.addToScene(trafficLight);

// 更新红绿灯状态
function updateLightState(state, countdown) {
    trafficLight.setData({
        type: 'FeatureCollection',
        features: [{
            properties: {
                lightState: state,
                countdown: countdown
            },
            geometry: {
                type: 'Point',
                coordinates: [116.404, 39.915, 0]
            }
        }]
    });
}
```

---

## TrafficShape 交通参与者

显示各类交通参与者（行人、非机动车等）。

```javascript
import { TrafficShape } from 'mapv-cloudrenderengine';

// 创建交通参与者
const pedestrian = new TrafficShape({
    type: 'pedestrian',  // 'pedestrian' | 'bicycle' | 'motorcycle'
    animationName: 'walk',
    animationLoop: true,
});

pedestrian.setData({
    type: 'FeatureCollection',
    features: [{
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        },
        properties: {
            rotation: { roll: 0, pitch: 0, yaw: 45 }
        }
    }]
});

engine.addToScene(pedestrian);
```

---

## AutonomousVehicleLayer 自动驾驶车辆

显示自动驾驶车辆及其感知范围。

```javascript
import { AutonomousVehicleLayer } from 'mapv-cloudrenderengine';

// 创建自动驾驶车辆图层
const avLayer = new AutonomousVehicleLayer({
    showSensorRange: true,   // 显示传感器范围
    sensorColor: { r: 0, g: 1, b: 0 },
    sensorOpacity: 0.3,
});

avLayer.setData({
    type: 'FeatureCollection',
    features: [{
        properties: {
            vehicleId: 'av_001',
            speed: 30,
            heading: 90
        },
        geometry: {
            type: 'Point',
            coordinates: [116.404, 39.915, 0]
        }
    }]
});

engine.addToScene(avLayer);

// 实时更新车辆位置
function updateVehiclePosition(lng, lat, heading) {
    avLayer.setData({
        type: 'FeatureCollection',
        features: [{
            properties: {
                vehicleId: 'av_001',
                heading: heading
            },
            geometry: {
                type: 'Point',
                coordinates: [lng, lat, 0]
            }
        }]
    });
}
```

---

## UAVSwarm 无人机集群（低空飞行）

根据 json 数据动态创建一组无人机，沿路径飞行并绘制轨迹（箭头 / 虚线 / 管道），支持按 id 增删改、相机跟随、座舱内外视角切换、顶部信息标签。适合低空经济、无人机编队巡检、物流配送等场景。

```javascript
import { UAVSwarm } from 'mapv-cloudrenderengine';

const swarm = new UAVSwarm({
    speedKmh: 30,                   // 全局飞行速度(km/h)
    finishMode: 'stop',             // 跑完行为: stop/pingpong/restart/destroy
    trajectoryStyle: 'arrow',       // 轨迹样式: arrow/dashed/pipeline/none
    lineColor: [0, 0.6, 1, 1],      // 轨迹颜色 [R,G,B,A], 0~1
    lineWidth: 1.5,                 // 箭头/虚线线宽(米)
    dropMeters: 8,                  // 轨迹在路径正下方的落差(米)
    pipeRadius: 3,                  // 管道半径(米, 仅 pipeline 样式)
    followDistance: 15,             // 三人称跟随距离(米, 2~300)
    followPitch: -15,               // 三人称俯角(度, -85~-5)
    cockpitOffset: [-0.22, -0.35, 1.475], // 座舱相机相对机身 [前,右,上](米)
    data: [
        {
            id: 1,                  // 必填: 无人机id(同时是轨迹id)
            // 必填: 扁平坐标 [经度,纬度,高度(米), ...], 长度为3的倍数且至少2个点
            path: [113.3168, 23.5132, 175, 113.3180, 23.5146, 200, 113.3192, 23.5158, 190],
            speedKmh: 40,           // 单机覆盖全局
            lineColor: [1, 0.55, 0, 1],
            finishMode: 'pingpong',
            lineStyle: { tileSpacing: 4, scrollSpeed: 1.0 },
        },
        { id: 2, path: [113.3162, 23.5156, 160, 113.3182, 23.5168, 185], trajectoryStyle: 'dashed' },
        { id: 3, path: [113.3180, 23.5140, 180, 113.3200, 23.5150, 190], showTrajectory: false },
    ],
});

engine.addToScene(swarm);
```
**运行期操作（各方法内部修改 `option`，下一帧以 `Gis_UpdateCommonGISLayer` 下发）:**

```javascript
// 全量替换无人机列表, UE 按 id diff(新 id 新增 / 缺失的旧 id 移除 / 已有 id 更新)
swarm.updateList([
    { id: 1, path: [113.3168, 23.5132, 175, 113.3195, 23.5160, 195] },
    { id: 4, path: [113.3150, 23.5120, 170, 113.3170, 23.5135, 185] },  // 新增一架
]);
// 只修改 1 号机参数(id 不存在则追加一架)
swarm.updateDrone(1, { speedKmh: 60, lineColor: [1, 0, 0, 1] });

// 相机跟随与视角切换
swarm.followById(2);        // 相机跟随 2 号机
swarm.viewChange(true);     // 进入座舱内(一人称)视角
swarm.viewChange(false);    // 回到座舱外(三人称跟随)视角
swarm.unFollow();           // 停止跟随

// 无人机顶部信息标签(widget): type 决定描边色(info 蓝 / warning 黄 / error 红)
swarm.showLabels([
    { ids: [1, 3], type: 'warning', title: '低电量告警', content: '电量 18%\n预计 3 分钟后返航' },
    { id: 2, type: 'error', title: '链路中断', content: '已失联 12 秒' },
    { id: 4, type: 'info', title: '巡检中', content: 'B 区第 3 航段', size: [200, 70] },
]);

// 清空全部无人机
swarm.updateList([]);
```
**全局配置（构造时传入，构造后只读）:**
| 参数 | 默认 | 说明 |
|------|------|------|
| `speedKmh` | 30 | 飞行速度(km/h) |
| `finishMode` | 'stop' | stop 停终点 / pingpong 折返 / restart 回起点 / destroy 移除 |
| `continueTolerance` | 2 | 路线更新容差(米)，当前位置离新路线≤该值则续飞，否则从起点 |
| `trajectoryStyle` | 'arrow' | arrow 箭头带 / dashed 虚线带 / pipeline 管道 / none |
| `lineColor` | [0,0.6,1,1] | 轨迹颜色 [R,G,B(,A)]，0~1 |
| `lineWidth` | 1.5 | 箭头/虚线线宽(米) |
| `dropMeters` | 8 | 轨迹在路径正下方落差(米) |
| `pipeRadius` | 3 | 管道半径(米) |
| `followDistance` | 15 | 三人称跟随距离(米，2~300) |
| `followPitch` | -15 | 三人称俯角(度，-85~-5) |
| `cockpitOffset` | [-0.22,-0.35,1.475] | 座舱相机相对机身 [前,右,上](米) |

> **lineStyle 子字段:** `tileSpacing`(单元间隔米,默认5)、`scrollSpeed`(流速单元/秒,默认0.5)、`headSlope`(箭头尖锐,0.3)、`bodyThickness`(0.4)、`edgeSoftness`(0.08)、`dashRatio`(0.5)、`emissiveIntensity`(1.0)；约束 `headSlope+bodyThickness+edgeSoftness≤1`。
>
> **标签 label 字段:** `id`/`ids`(必填其一)、`title`、`content`(支持 \n)、`type`(info/warning/error)、`color`(优先于 type)、`size`([宽,高])。标签样式由构造参数 `labelDuration/labelSize/labelOffset/labelMaxDistance/labelTypeColors` 等控制。

---

## UAVGrid 民航无人机网格（空域网格）

按 MH/T 4063.1 在指定经纬度与高度范围内生成空域网格，单元 ID 为「平面码-高度码」。支持全局外观、按单元 ID 着色、跟随视角动态生成与左键点击拾取。适合民航空域管理、无人机航路规划、低空网格化监管等场景。经纬度为 CGCS2000(度)，高度为大地高(米，-512~15872)。

```javascript
import { UAVGrid } from 'mapv-cloudrenderengine';

const grid = new UAVGrid({
    // 网格范围(必填), 实际会向外对齐到完整标准单元
    range: {
        west: 113.278507, east: 113.338507,
        south: 23.500739, north: 23.560739,
        bottomHeight: 2, topHeight: 1064,     // 大地高(米)
    },
    planeLevel: 9,                  // 必填: 平面级别 整数1~16, 越大格子越小
    heightLevel: 8,                 // 必填: 高度级别 整数1~15, 层厚=16384/2^heightLevel 米
    autoDegrade: false,             // 超预算(50万顶点/256块)时自动调粗平面级别
    clickPick: true,                // 左键点击拾取
    style: {
        lineColor: { r: 0, g: 1, b: 0.2, a: 0.7 },          // 网格线色
        cellFillColor: { r: 0.2, g: 0.9, b: 0.4, a: 0.15 }, // 格子面色(a=0 只剩线)
        drawOnTop: true,            // 穿透地形和建筑始终可见
    },
    // 点中格子回调: code 可直接用于 setCellStyles / clearCellStyles
    onCellClick: e => console.log('点中单元', e.content.code, e.content.center),
});

engine.addToScene(grid);
```
**运行期操作（各方法内部修改 `option`，网格后台生成期间命令会被拒绝 Busy，需等生成完成）:**

```javascript
// 修改全局外观(立即生效, 不重建网格)
grid.setGlobalStyle({ lineColor: { r: 0, g: 0.8, b: 1, a: 0.9 }, lineEmissive: 2.0 });

// 按单元 ID 着色(mode: 'merge' 默认增量 / 'replace' 先清空)
grid.setCellStyles([
    { ids: [code1, code2], lineColor: { r: 1, g: 0, b: 0, a: 1 }, fillColor: [1, 0, 0, 0.5] },
]);
grid.clearCellStyles([code1]);   // 清除指定 ID 着色(不传=全部)

// 按新范围/级别重建(未传的 range/级别沿用当前值)
grid.createGrid({ planeLevel: 10 });

// 跟随视角: 以相机为中心生成窗口网格, 按高度从 lodBands 选级别
grid.followTarget({
    radiusMeters: 1500, heightBelow: 60, heightAbove: 120,
    lodBands: [
        { minHeight: 0, maxHeight: 1000, planeLevel: 11, heightLevel: 10 },
        { minHeight: 1000, maxHeight: 15872, planeLevel: 8, heightLevel: 8 },
    ],
});
grid.setLodBands([{ minHeight: -512, maxHeight: 15872, planeLevel: 8, heightLevel: 8 }]); // 只换 LOD 表
grid.unFollow();                 // 停止跟随(停在最后窗口)
grid.setClickPick(false);        // 关闭点击拾取
grid.clearGrid();                // 清空网格(保留图层, 可 createGrid 重建)
```

> **style 字段:** `lineColor`、`cellFillColor`(a=0 只剩线)、`highlightColor`/`highlightLineColor`(点中高亮)、`drawOnTop`(穿透遮挡,默认true)、`lineEmissive`(线亮度,默认2.0)。颜色支持 `{r,g,b,a}` 或 `[r,g,b,a]`(0~1)。
>
> **onCellClick 回调** `e.content`: `code`(单元ID)、`planeLevel`/`heightLevel`、`center`/`min`/`max`({lon,lat,height})、`sizeMeters`({eastWest,northSouth,height})。
>
> **约束:** `planeLevel`/`heightLevel` 不能带小数；UE 严格校验，出现未知字段整条命令被拒。`setCellStyles` 单条最多 256 组、合计 20000 个 ID。

## MassUAV 海量实时无人机（万级实时态势）

海量实时无人机图层，适用于万级无人机集群的宏观态势展示与近景细节查看：远景约 1 万架圆点、近景最多 1000 架模型，支持 WebSocket 实时数据流、按时间戳平滑播放、线性/曲线插值、按类型配色缩放、选中高亮、视野裁剪、点击拾取与断线重连。适合空中交通监控、无人机编队、应急调度、城市低空态势。

```javascript
import { MassUAV } from 'mapv-cloudrenderengine';

const layer = new MassUAV({
    url: 'ws://127.0.0.1:18765', // WebSocket 地址, 入场后自动连接
    capacity: 16384,             // 最大点数
    clock: 'server',             // 播放时钟 'server'(服务器时间) | 'receive'(接收时间)
    interpMode: 'linear',        // 插值 'linear' | 'catmullRom'(曲线)
    pixelSize: 6,                // 远景圆点直径(px)
    selectedColor: '#ffd400',    // 选中色
    selectedScale: 1.6,          // 选中点放大倍数
    microDistanceM: 300,         // 进入近景(模型呈现)的距离(米)
    maxMicroCount: 1000,         // 近景模型数量上限
    types: [                     // 按 type 配色与缩放
        // { type: 'patrol', color: '#00ff88', scale: 1.2 },
    ],
});

engine.addToScene(layer); // 入场自动连接后端 ws 获取数据
```

**运行期操作:**

```javascript
layer.connect('ws://127.0.0.1:18766'); // 切换地址并连接(不传=用构造/上次地址)
layer.disconnect();                      // 断开并停止自动重连, 点位停在最后位置
layer.select(['UAV-0001', 'UAV-0002']);  // 选中(替换当前选中集, 空数组清空)
layer.clearSelection();                  // 清空选中
layer.addEventListener('mousedown', e => console.log('点中', e.content)); // 点击拾取获取 id
layer.visible = false;                   // 显隐
engine.destoryObject(layer);             // 销毁
```

> **关键参数:** `delayFactor`(显示延迟系数, linear 1.4 / catmullRom 2.4)、`defaultColor`(未配置 type 的统一色)、`lodHz`(近景筛选频率5)、`pickRadiusPx`(拾取半径8)、`pickOcclusionTest`(遮挡检测true)、`selectOnClick`(点击即单选true)、`reconnectIntervalSec`(重连间隔3秒)、`rebaseDistanceM`(近景原点跟随阈值20000)。
