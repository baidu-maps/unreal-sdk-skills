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
