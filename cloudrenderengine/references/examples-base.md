# 基础控制与数据加载 API 参考

## 基础控制

### 场景坐标拾取 (clickLocation)

监听场景点击事件，获取点击位置的经纬度坐标。

```javascript
// 监听点击位置事件
engine.camera.addEventListener('clickLocation', (event) => {
    console.log('点击位置:', event);

    // 获取坐标
    if (event.content && event.content.Location) {
        const loc = event.content.Location;
        console.log('经度:', loc.longitude);
        console.log('纬度:', loc.latitude);
        console.log('高度:', loc.altitude);
    }
});
```

### 相机位置获取 (Camera)

实时获取相机的位置和姿态信息。

```javascript
// 获取相机位置
const position = engine.camera.position;
console.log('经度:', position.x);
console.log('纬度:', position.y);
console.log('高度:', position.z);

// 获取相机姿态
console.log('滚转角 (roll):', engine.camera.roll);
console.log('俯仰角 (pitch):', engine.camera.pitch);
console.log('偏航角 (yaw):', engine.camera.yaw);

// 定时获取相机位置
setInterval(() => {
    const pos = engine.camera.position;
    // 更新显示...
}, 400);
```

---

## 数据加载

### 3DTiles 数据加载控制

控制 3DTiles 数据图层的显示/隐藏。

```javascript
// 启用/禁用指定名称的 3DTiles
engine.enable3DTilesByName({
    enable: true,           // true 显示, false 隐藏
    tilesName: 'BuildingTiles'  // Tiles 名称
});
```

**可用 Tiles 类型:**
| tilesName | 说明 |
|-----------|------|
| `BuildingTiles` | 建筑 |
| `TerrainTiles` | 地形 |
| `TreeTiles` | 树木 |
| `RoadTiles` | 道路 |

### AssetLayer 动态资产

从资产管理平台加载动态模型资产。

```javascript
// 1. 设置模型信息源
engine.setupModelInfo(
    'http://your-server/api/searchModelInfos',
    {
        all: 1.0,
        common: 1.0,
        project_id: 'your-project-id'
    }
);

// 2. 创建资产图层
const assetLayer = new Engine.AssetLayer({
    url: 'http://your-server/api/getDeviceListByRadius',
    body: {
        project_id: 'your-project-id',
        radius: 500,
        type: 'online',
        status: 1
    },
    deviceAutoUpdate: true,    // 自动更新设备
    renderNum: 2               // 渲染数量
});

// 3. 添加到场景
engine.addToScene(assetLayer);

// 4. 监听资产点击事件
assetLayer.addEventListener('mousedown', (event) => {
    console.log('点击的资产:', event);
});

// 5. 控制可见性
assetLayer.visible = true;  // 或 false
```

**AssetLayer 参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | 数据接口地址 |
| `body` | object | 请求体参数 |
| `body.project_id` | string | 项目 ID |
| `body.radius` | number | 加载半径 |
| `body.type` | string | 类型 (如 'online') |
| `deviceAutoUpdate` | boolean | 是否自动更新设备 |
| `renderNum` | number | 渲染数量 |

### 情报板内容修改

修改资产的情报板显示内容。

```javascript
// 生成文字图片
const textImage = Engine.drawTextToImage('显示内容', {
    backgroundColor: 'rgba(0,0,0,1)',
    textColor: 'rgba(255,0,0,1)',
    fontSize: 14,
    width: 0,      // 0 表示自动计算
    height: 20
});

// 更新情报板
const content = selectedAsset;
content.params = {
    map: textImage,    // Base64 图片内容
    scroll: 1,         // 滚动设置
    speed: 0.3         // 滚动速度
};
assetLayer.updateChild(content);
```

### 骨骼动画控制

控制资产的骨骼动画播放。

```javascript
// 播放骨骼动画
const content = selectedAsset;
content.params = {
    animationIndex: 2,      // 动画索引
    animationLoop: true,    // 是否循环播放
    animationSpeed: 1       // 动画速度
};
assetLayer.updateChildAnimation(content);

// 停止动画
content.params = {
    animationIndex: -1,     // -1 表示停止
    animationLoop: false,
    animationSpeed: 0
};
assetLayer.updateChildAnimation(content);
```

---

## 相机移动 (moveTo)

移动相机到指定位置。

```javascript
engine.moveTo(
    // 目标位置 (经度, 纬度, 高度)
    {
        x: 106.619,
        y: 26.649,
        z: 10
    },
    // 相机姿态 (角度)
    {
        roll: 0,
        pitch: -15,
        yaw: -88
    },
    // 动画选项
    {
        zoom: 1500,              // 缩放级别
        duration: 1,             // 动画时长 (秒)
        preload: true,           // 预加载
        endLineDetect: false,    // 终点检测
        detectLength: 0,         // 检测长度
        flyOverLongitude: true,  // 曲线飞行
        callback: () => {        // 完成回调
            console.log('移动完成');
        }
    }
);
```

**moveTo 参数说明:**
| 参数 | 类型 | 说明 |
|------|------|------|
| `zoom` | number | 缩放级别 |
| `duration` | number | 动画时长 (秒) |
| `preload` | boolean | 是否预加载目标区域 |
| `endLineDetect` | boolean | 终点线检测 |
| `detectLength` | number | 检测长度 |
| `flyOverLongitude` | boolean | 是否曲线跨越飞行 |
| `callback` | function | 完成回调函数 |
