# 核心功能与环境控制 API 参考

## 相机导航 (Navigation)

### moveTo 移动到指定位置

```javascript
// 基础用法
engine.moveTo(
    { x: 116.404, y: 39.915, z: 500 },     // 目标位置 (经度, 纬度, 高度)
    { roll: 0, pitch: -45, yaw: 0 },        // 相机姿态 (度)
    {
        duration: 2.0,                       // 动画时长 (秒)
        zoom: 1500,                          // 缩放级别
        flyOverLongitude: true,              // 曲线飞行
        preload: true,                       // 预加载
        callback: () => {                    // 完成回调
            console.log('移动完成');
        }
    }
);

// 完整参数示例
engine.moveTo(
    { x: 116.619, y: 26.649, z: 100 },
    { roll: 0, pitch: -30, yaw: 90 },
    {
        zoom: 1500,
        duration: 3,
        preload: true,
        endLineDetect: false,
        detectLength: 0,
        flyOverLongitude: true,
        callback: () => {
            console.log('抵达目的地');
            // 可以在这里执行后续操作
        }
    }
);
```

**moveTo 参数说明:**

**位置参数 (第一个参数):**
| 属性 | 类型 | 说明 |
|------|------|------|
| `x` | number | 经度 |
| `y` | number | 纬度 |
| `z` | number | 高度 (米) |

**姿态参数 (第二个参数):**
| 属性 | 类型 | 说明 |
|------|------|------|
| `roll` | number | 滚转角 (度) |
| `pitch` | number | 俯仰角 (度), 负值向下看 |
| `yaw` | number | 偏航角 (度), 0为正北 |

**选项参数 (第三个参数):**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zoom` | number | 1500 | 缩放级别 |
| `duration` | number | 1 | 动画时长 (秒) |
| `preload` | boolean | false | 预加载目标区域 |
| `endLineDetect` | boolean | false | 终点线检测 |
| `detectLength` | number | 0 | 检测距离 |
| `flyOverLongitude` | boolean | false | 曲线跨越飞行 |
| `callback` | function | - | 完成回调函数 |

---

### pathNavigation 路径巡航

```javascript
// 定义巡航路径点
const navPoints = [
    { x: 116.400, y: 39.910, z: 100 },
    { x: 116.405, y: 39.912, z: 120 },
    { x: 116.410, y: 39.915, z: 80 },
    { x: 116.415, y: 39.918, z: 100 },
    { x: 116.420, y: 39.920, z: 150 },
];

// 开始巡航
engine.pathNavigation(navPoints, {
    duration: 30,                // 总时长 (秒)
    loop: true,                  // 循环巡航
    lookAt: true,                // 视线跟随路径方向
});

// 停止巡航
// engine.stopPathNavigation();
```

---

### 缩放控制

```javascript
// 放大
engine.zoomIn();           // 默认倍数
engine.zoomIn(1.5);        // 指定倍数

// 缩小
engine.zoomOut();          // 默认倍数
engine.zoomOut(2);         // 指定倍数
```

---

### 相机位置获取

```javascript
// 获取当前相机位置
const position = engine.camera.position;
console.log('经度:', position.x);
console.log('纬度:', position.y);
console.log('高度:', position.z);

// 获取相机姿态
console.log('滚转角:', engine.camera.roll);
console.log('俯仰角:', engine.camera.pitch);
console.log('偏航角:', engine.camera.yaw);

// 监听相机变化
engine.camera.addEventListener('cameraChange', (event) => {
    console.log('相机位置变化:', event.position);
    console.log('相机姿态变化:', event.rotation);
});

// 定时获取相机位置
setInterval(() => {
    const pos = engine.camera.position;
    console.log(`当前位置: ${pos.x}, ${pos.y}, ${pos.z}`);
}, 1000);
```

---

## 场景点击坐标获取 (clickLocation)

**重要**: 获取场景点击位置坐标必须使用 `clickLocation` 事件。

```javascript
// 监听场景点击获取坐标 (正确方式)
engine.camera.addEventListener('clickLocation', (event) => {
    console.log('点击事件:', event);

    // 获取点击位置坐标
    if (event.content && event.content.Location) {
        const location = event.content.Location;
        console.log('经度:', location.longitude);
        console.log('纬度:', location.latitude);
        console.log('高度:', location.altitude);

        // 可以在点击位置添加标记
        addMarkerAt(location.longitude, location.latitude, location.altitude);
    }
});

// 点击位置添加标记的辅助函数
function addMarkerAt(lng, lat, alt) {
    const marker = new IconPoint({
        texture: markerIcon,
        width: 32,
        height: 32,
        pivot: { x: 0.5, y: 1 },
    });
    marker.setData({
        type: 'FeatureCollection',
        features: [{
            geometry: {
                type: 'Point',
                coordinates: [lng, lat, alt]
            }
        }]
    });
    engine.addToScene(marker);
}
```

**clickLocation 事件数据结构:**
```javascript
{
    content: {
        Location: {
            longitude: number,   // 经度
            latitude: number,    // 纬度
            altitude: number     // 高度 (米)
        }
    }
}
```

---

## 天气时间系统 (UDS)

### 天气控制

```javascript
// 通过 engine.UDS 访问天气时间系统
engine.UDS.changeWeather('clearSkies');      // 晴空
engine.UDS.changeWeather('partlyCloudy');    // 少云
engine.UDS.changeWeather('cloudy');          // 多云
engine.UDS.changeWeather('foggy');           // 雾天
engine.UDS.changeWeather('overcast');        // 阴天
engine.UDS.changeWeather('lightRain');       // 小雨
engine.UDS.changeWeather('rain');            // 中大雨
engine.UDS.changeWeather('lightSnow');       // 小雪
engine.UDS.changeWeather('snow');            // 中大雪
engine.UDS.changeWeather('thunderstorm');    // 风暴
engine.UDS.changeWeather('blizzard');        // 暴风雪
engine.UDS.changeWeather('sandDustCalm');    // 扬沙
engine.UDS.changeWeather('sandDustStorm');   // 沙尘暴
```

**天气类型对照表:**
| 值 | 中文名 | 说明 |
|----|--------|------|
| `clearSkies` | 晴空 | 万里无云 |
| `partlyCloudy` | 少云 | 有少量云彩 |
| `cloudy` | 多云 | 云量较多 |
| `foggy` | 雾天 | 能见度降低 |
| `overcast` | 阴天 | 天空阴沉 |
| `lightRain` | 小雨 | 轻微降水 |
| `rain` | 中大雨 | 明显降水 |
| `lightSnow` | 小雪 | 轻微降雪 |
| `snow` | 中大雪 | 明显降雪 |
| `thunderstorm` | 风暴 | 雷暴天气 |
| `blizzard` | 暴风雪 | 大风雪 |
| `sandDustCalm` | 扬沙 | 轻微沙尘 |
| `sandDustStorm` | 沙尘暴 | 严重沙尘 |

---

### 时间控制

```javascript
// 设置时间 (24小时制)
engine.UDS.changeTime(hour, minute);

// 时间示例
engine.UDS.changeTime(6, 0);     // 6:00 日出
engine.UDS.changeTime(9, 0);     // 9:00 上午
engine.UDS.changeTime(12, 0);    // 12:00 正午
engine.UDS.changeTime(15, 0);    // 15:00 下午
engine.UDS.changeTime(18, 30);   // 18:30 日落
engine.UDS.changeTime(21, 0);    // 21:00 夜晚
engine.UDS.changeTime(0, 0);     // 0:00 午夜
```

---

### 时间动画

```javascript
// 模拟日出到日落的时间流逝
function simulateDayNightCycle() {
    let hour = 6;
    let minute = 0;

    const interval = setInterval(() => {
        engine.UDS.changeTime(hour, minute);

        minute += 30;
        if (minute >= 60) {
            minute = 0;
            hour++;
        }
        if (hour >= 20) {
            clearInterval(interval);
        }
    }, 1000);  // 每秒前进30分钟
}

// 天气变化动画
function simulateWeatherChange() {
    const weathers = ['clearSkies', 'partlyCloudy', 'cloudy', 'rain', 'cloudy', 'partlyCloudy', 'clearSkies'];
    let index = 0;

    const interval = setInterval(() => {
        engine.UDS.changeWeather(weathers[index]);
        index++;
        if (index >= weathers.length) {
            clearInterval(interval);
        }
    }, 5000);  // 每5秒切换一次天气
}
```

---

## 3DTiles 数据控制

```javascript
// 启用/禁用指定名称的 3DTiles
engine.enable3DTilesByName({
    enable: true,              // true 显示, false 隐藏
    tilesName: 'BuildingTiles' // Tiles 名称
});

// 隐藏建筑
engine.enable3DTilesByName({
    enable: false,
    tilesName: 'BuildingTiles'
});

// 隐藏树木
engine.enable3DTilesByName({
    enable: false,
    tilesName: 'TreeTiles'
});
```

**可用 Tiles 类型:**
| tilesName | 说明 |
|-----------|------|
| `BuildingTiles` | 建筑物 |
| `TerrainTiles` | 地形 |
| `TreeTiles` | 树木植被 |
| `RoadTiles` | 道路 |

---

## 渲染质量控制

```javascript
// 修改分辨率
engine.changeResolution(1920, 1080);

// 修改码率 (提高画质)
engine.changeRenderBitrate(35000000);  // 35Mbps

// 获取 WebRTC 状态
engine.onWebRtcConnectionStats((stats) => {
    console.log('帧率:', stats.framerate);
    console.log('码率:', stats.bitrate);
    console.log('延迟:', stats.roundTripTime);
    console.log('丢包:', stats.packetsLost);
});
```

---

## 场景对象管理

```javascript
// 添加对象到场景
engine.addToScene(object);

// 销毁对象
engine.destoryObject(object);

// 遍历场景对象
engine.scene.traverse((obj) => {
    console.log('场景对象:', obj);
});

// 批量管理示例
const objects = [];

function addObject(obj) {
    engine.addToScene(obj);
    objects.push(obj);
}

function removeObject(obj) {
    engine.destoryObject(obj);
    const index = objects.indexOf(obj);
    if (index > -1) {
        objects.splice(index, 1);
    }
}

function clearAllObjects() {
    objects.forEach(obj => {
        engine.destoryObject(obj);
    });
    objects.length = 0;
}
```

---

## 完整场景初始化示例

```javascript
import * as Engine from 'mapv-cloudrenderengine';

async function initializeScene() {
    // 1. 配置调度服务
    Engine.CloudRenderEngine.DispatchServer.host = 'http://your-server:8017';
    Engine.CloudRenderEngine.DispatchServer.username = 'username';
    Engine.CloudRenderEngine.DispatchServer.password = 'password';

    // 2. 创建引擎实例
    const engine = new Engine.CloudRenderEngine({
        projectName: 'your-project',
        matchViewportResolution: true,
        connectOnLoad: true,
        forceTURN: true,
    });

    // 3. 加载连接
    engine.load(
        () => console.log('连接成功'),
        (err) => console.error('连接失败', err)
    );

    // 4. 等待画面加载完成
    engine.addEventListener('videoInitialised', () => {
        console.log('画面加载完毕');

        // 5. 设置初始环境
        engine.UDS.changeWeather('partlyCloudy');
        engine.UDS.changeTime(10, 0);

        // 6. 移动到初始位置
        engine.moveTo(
            { x: 116.404, y: 39.915, z: 500 },
            { roll: 0, pitch: -45, yaw: 0 },
            { duration: 0, zoom: 1500 }
        );

        // 7. 设置点击监听
        engine.camera.addEventListener('clickLocation', (event) => {
            if (event.content && event.content.Location) {
                const loc = event.content.Location;
                console.log('点击位置:', loc);
            }
        });

        // 8. 提高画质
        engine.changeRenderBitrate(35000000);
    });

    return engine;
}

// 启动
initializeScene().catch(console.error);
```
