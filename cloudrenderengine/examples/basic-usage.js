/**
 * mapv-cloudrenderengine 基础使用示例
 */

// ============================================
// 0. 安装与导入
// ============================================

// 安装 : npm install mapv-cloudrenderengine

// 导入 (对应上面的安装方式):
import * as Engine from 'mapv-cloudrenderengine';
// 外网: import * as Engine from 'mapv-cloudrenderengine';

// ============================================
// 1. 引擎初始化 (云渲染模式 - 集群调度服务)
// ============================================

// !! 重要: HTML 中必须有 id="player" 的 div 用于显示 UE5 像素流画面
// <div id="player" style="width: 100%; height: 100vh;"></div>

/**
 * 方式一：使用集群调度服务 (推荐生产环境)
 * 调度服务会自动分配可用的渲染节点
 */
async function initWithDispatchServer() {
    // 配置调度服务
    // ⚠️ 重要：以下为示例配置，请替换为实际的服务器地址和凭证
    Engine.CloudRenderEngine.DispatchServer.host = 'https://your-dispatch-server.example.com';
    Engine.CloudRenderEngine.DispatchServer.username = 'your-username';
    Engine.CloudRenderEngine.DispatchServer.password = 'your-password';
    Engine.CloudRenderEngine.DispatchServer.tag = '';  // 可选标签

    // 获取可用项目列表
    const projectList = await Engine.CloudRenderEngine.DispatchServer.GetProjectCommon();
    console.log('可用项目:', projectList.data.data);

    // 获取集群容量信息
    const capacity = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacity();
    const capacityInfo = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacityInfo();
    console.log('集群容量:', capacity);
    console.log('容量详情:', capacityInfo);

    // 创建引擎实例 (使用项目名连接调度服务)
    const engine = new Engine.CloudRenderEngine({
        projectName: 'your-project-name',   // 项目名，调度服务会分配对应渲染节点
        matchViewportResolution: true,       // 自适应分辨率
        connectOnLoad: true,                 // 自动连接
        forceTURN: true,                     // 使用 TURN 服务器穿透 NAT
        isShowTestUI: false,
        shouldShowPlayOverlay: false,
    });

    // 加载并连接
    engine.load(
        (message) => {
            console.log('连接成功:', message);
        },
        (error) => {
            console.error('连接失败:', error);
        }
    );

    // 监听画面加载完成
    engine.addEventListener('videoInitialised', () => {
        console.log('画面加载完毕');

        // 设置码率 (可选，提高画质)
        engine.changeRenderBitrate(35000000);

        // 初始化场景
        initScene(engine);
    });

    // 监听信令服务器错误
    engine.addEventListener('signalingServerError', () => {
        console.error('信令服务器连接错误');
    });

    return engine;
}

/**
 * 方式二：直接连接 WebSocket (适用于开发测试)
 */
function initWithDirectWebSocket() {
    const engine = new Engine.CloudRenderEngine({
        renderMode: 'cloud',
        wsUrl: 'ws://your-signaling-server:80',  // 直接指定信令服务器地址
        matchViewportResolution: true,
        connectOnLoad: true,
    });

    engine.addEventListener('videoInitialised', () => {
        console.log('画面加载完毕');
        initScene(engine);
    });

    return engine;
}

/**
 * 方式三：本地渲染模式 (大尺寸超高分辨率)
 * 直接在部署机器上运行，突破浏览器 4K 分辨率限制
 * 注意：不需要 player div，不需要配置调度服务
 */
function initWithLocalRender() {
    const engine = new Engine.CloudRenderEngine({
        renderMode: 'inner',  // 本地渲染模式，只需这一个参数
    });

    engine.addEventListener('videoInitialised', () => {
        console.log('本地渲染就绪');
        // API 使用方式与云渲染完全相同
        initScene(engine);
    });

    return engine;
}

// ============================================
// 2. 初始化场景环境
// ============================================

function initScene(engine) {
    // 设置天气为少云
    engine.UDS.changeWeather('partlyCloudy');

    // 设置时间为中午12点
    engine.UDS.changeTime(12, 0);
}

// ============================================
// 3. 相机控制
// ============================================

// 移动到指定位置
function moveToLocation(engine, lng, lat, altitude) {
    engine.moveTo(
        { x: lng, y: lat, z: altitude },
        { roll: 0, pitch: -45, yaw: 0 },
        {
            duration: 2.0,
            zoom: 1500,
            flyOverLongitude: true,
            preload: true,
            endLineDetect: false,
            detectLength: 0,
            callback: () => {
                console.log('相机移动完成');
            }
        }
    );
}

// 路径巡航 (使用 navigateByKeypoints)
function startNavigation(engine) {
    // 关键点数组格式: [经度, 纬度, 高度, roll, pitch, yaw]
    engine.navigateByKeypoints(
        [
            [116.39757909, 39.92134082, 20.0, 30, -30, 160],
            [116.40093368, 39.91785323, 30.0, 90, -40, 130],
            [116.39888364, 39.91492297, 40.0, 180, -60, 120],
            [116.39383311, 39.91519456, 50.0, 270, -70, 100],
            [116.39282673, 39.91858221, 10.0, 0, -90, 10],
        ],
        {
            speed: 36,                    // 巡航速度 km/h，默认36，<0时用时间控制
            time: 0,                      // 巡航时间(秒)，speed>0时优先用速度
            lockAll: true,                // 锁定rotation和zoom
            ignoreLag: true,              // 忽略摄像机平滑延迟
            patrolType: 'default',        // 'default' | 'Car'
            startCallback: () => {
                console.log('巡航开始');
            },
            finishCallback: () => {
                console.log('巡航结束');
            },
        }
    );
}

// 停止巡航
function stopNavigation(engine) {
    engine.stopNavigation();
}

// 暂停/恢复巡航
function pauseNavigation(engine) {
    engine.pauseNavigation();
}

function resumeNavigation(engine) {
    engine.resumeNavigation();
}

// 缩放控制
function zoom(engine, direction) {
    if (direction === 'in') {
        engine.zoomIn(1.5);
    } else {
        engine.zoomOut(1.5);
    }
}

// 监听相机变化
function setupCameraListener(engine) {
    engine.camera.addEventListener('cameraChange', (e) => {
        console.log('当前位置:', e.position);
        console.log('当前旋转:', e.rotation);
    });
}

// ============================================
// 4. 天气时间控制
// ============================================

// 天气切换
function changeWeather(engine, weatherType) {
    // 可用天气类型
    const weatherTypes = {
        '晴天': 'clearSkies',
        '少云': 'partlyCloudy',
        '多云': 'cloudy',
        '雾天': 'foggy',
        '阴天': 'overcast',
        '小雨': 'lightRain',
        '中大雨': 'rain',
        '小雪': 'lightSnow',
        '中大雪': 'snow',
        '风暴': 'thunderstorm',
        '暴风雪': 'blizzard',
        '扬沙': 'sandDustCalm',
        '沙尘暴': 'sandDustStorm',
    };

    engine.UDS.changeWeather(weatherTypes[weatherType] || weatherType);
}

// 时间设置 (24小时制)
function setTime(engine, hour, minute) {
    engine.UDS.changeTime(hour, minute);
}

// ============================================
// 5. 场景点击事件 - 获取坐标
// ============================================

// 监听场景点击获取坐标 (正确方式)
function setupClickListener(engine) {
    engine.camera.addEventListener('clickLocation', (event) => {
        console.log('点击事件:', event);

        // 获取点击位置坐标
        if (event.content && event.content.Location) {
            const location = event.content.Location;
            console.log('点击坐标:', {
                经度: location.longitude,
                纬度: location.latitude,
                高度: location.altitude
            });
        }
    });
}

// ============================================
// 6. WebRTC 状态监控
// ============================================

function setupWebRTCMonitor(engine) {
    engine.onWebRtcConnectionStats((stats) => {
        console.log('WebRTC状态:', {
            帧率: stats.framerate,
            码率: stats.bitrate,
            延迟: stats.roundTripTime,
            丢包率: stats.packetsLost
        });
    });
}

// 修改分辨率
function changeResolution(engine, width, height) {
    engine.changeResolution(width, height);
}

// 修改码率
function changeBitrate(engine, bitrate) {
    engine.changeRenderBitrate(bitrate);
}

// ============================================
// 7. 对象生命周期管理
// ============================================

// 存储所有创建的对象
const objects = [];

// 添加对象
function addObject(engine, obj) {
    engine.addToScene(obj);
    objects.push(obj);
}

// 移除单个对象
function removeObject(engine, obj) {
    engine.destoryObject(obj);
    const index = objects.indexOf(obj);
    if (index > -1) {
        objects.splice(index, 1);
    }
}

// 清除所有对象
function clearAllObjects(engine) {
    objects.forEach(obj => {
        engine.destoryObject(obj);
    });
    objects.length = 0;
}

// ============================================
// 8. React 组件示例
// ============================================

/*
import React, { useEffect, useRef, useState } from 'react';
import * as Engine from 'mapv-cloudrenderengine';

export default function CloudRenderComponent() {
    const engineRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // 配置调度服务
        Engine.CloudRenderEngine.DispatchServer.host = 'http://your-server:8017';
        Engine.CloudRenderEngine.DispatchServer.username = 'username';
        Engine.CloudRenderEngine.DispatchServer.password = 'password';

        // 创建引擎实例
        const engine = new Engine.CloudRenderEngine({
            projectName: 'your-project',
            matchViewportResolution: true,
            connectOnLoad: true,
            forceTURN: true,
        });

        engineRef.current = engine;

        // 加载连接
        engine.load(
            () => console.log('连接成功'),
            (err) => console.error('连接失败', err)
        );

        // 监听画面加载
        engine.addEventListener('videoInitialised', () => {
            setIsConnected(true);
            engine.UDS.changeWeather('partlyCloudy');
            engine.UDS.changeTime(12, 0);
        });

        // 清理
        return () => {
            engineRef.current = null;
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {/* 必须有 id="player" 的 div *//*}
            <div id="player" style={{ width: '100%', height: '100%' }}></div>
            {!isConnected && <div>正在连接...</div>}
        </div>
    );
}
*/

// ============================================
// 9. 完整使用流程示例
// ============================================

async function main() {
    // 1. 初始化引擎 (使用调度服务)
    const engine = await initWithDispatchServer();

    // 保存引擎实例供后续使用
    window.cloudEngine = engine;

    // 2. 画面加载完成后的操作在 videoInitialised 事件中处理
}

// 启动
main().catch(console.error);
