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
