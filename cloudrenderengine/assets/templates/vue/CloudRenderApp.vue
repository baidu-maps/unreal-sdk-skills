<template>
  <div class="container">
    <!-- 云渲染画面输出 - id="player" 为必填，不可更改 -->
    <div id="player" class="player" />

    <!-- 加载/错误 覆盖层 -->
    <div v-if="status !== 'connected'" class="overlay">
      <p v-if="status === 'idle'">初始化中...</p>
      <p v-else-if="status === 'checking'">正在检查渲染容量...</p>
      <p v-else-if="status === 'connecting'">正在连接云渲染服务...</p>
      <div v-else-if="status === 'error'" class="error-box">
        <p>⚠ 连接失败</p>
        <p class="error-msg">{{ errorMsg }}</p>
        <button @click="reload">重新连接</button>
      </div>
    </div>

    <!-- 连接成功后的顶部状态栏 -->
    <header v-if="status === 'connected'" class="header">
      <span class="badge">● 云渲染已连接</span>
      <span class="meta">{{ projectName }} · {{ dispatchHost }}</span>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as Engine from 'mapv-cloudrenderengine';

// =============================================
// 调度服务配置
// =============================================
const dispatchHost = '{{DISPATCH_HOST}}';
const projectName  = '{{PROJECT_NAME}}';
const username     = '{{USERNAME}}';   // 默认 admin
const password     = '{{PASSWORD}}';   // 默认 admin

const status   = ref('idle');
const errorMsg = ref('');
let engine = null;
let cancelled = false;

onMounted(async () => {
    try {
        // 1. 配置调度服务
        Engine.CloudRenderEngine.DispatchServer.host     = dispatchHost;
        Engine.CloudRenderEngine.DispatchServer.tag      = 'all';
        Engine.CloudRenderEngine.DispatchServer.username = username;
        Engine.CloudRenderEngine.DispatchServer.password = password;

        // 2. 检查可用渲染容量（必须 > 0 才能连接）
        status.value = 'checking';
        const capacity = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacityInfo();
        if (cancelled) return;
        if (!capacity || capacity.all <= 0) {
            status.value = 'error';
            errorMsg.value = '服务器暂无剩余渲染容量，请稍后重试';
            return;
        }

        // 3. 创建引擎实例
        status.value = 'connecting';
        engine = new Engine.CloudRenderEngine({
            connectOnLoad: true,
            shouldShowPlayOverlay: false,
            projectName,
        });

        // 4. 画面就绪（此后才可操作场景）
        engine.addEventListener('videoInitialised', () => {
            if (cancelled) return;
            status.value = 'connected';
            console.log('[CloudRender] 画面加载完成，可以开始操作场景');
        });

        // 5. 连接异常
        engine.addEventListener('signalingServerError', () => {
            if (cancelled) return;
            status.value = 'error';
            errorMsg.value = '信令服务器连接失败，请检查网络或联系管理员';
        });

        // 6. 发起连接
        engine.load(
            () => console.log('[CloudRender] 调度成功'),
            (err) => {
                if (cancelled) return;
                console.error('[CloudRender] 调度失败:', err);
                status.value = 'error';
                errorMsg.value = `调度失败: ${err?.message || String(err)}`;
            }
        );
    } catch (err) {
        if (cancelled) return;
        status.value = 'error';
        errorMsg.value = `初始化异常: ${err.message}`;
    }
});

onUnmounted(() => {
    cancelled = true;
    engine = null;
});

function reload() {
    window.location.reload();
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0e1a;
}

/* id="player" 的容器必须绝对定位全屏，z-index 设为 0 让业务 UI 覆盖在上方 */
.player {
  width: 100vw;
  height: 100vh;
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 0;
  background-image: linear-gradient(
    180deg,
    rgba(3, 23, 66, 0.99) 0%,
    rgba(3, 23, 66, 0.69) 1%,
    rgba(17, 20, 36, 0) 74%
  );
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 26, 0.88);
  color: #8bb8e8;
  font-size: 15px;
}

.error-box {
  text-align: center;
  color: #ff6b6b;
}

.error-msg {
  font-size: 13px;
  margin: 8px 0 16px;
  color: #ffaaaa;
  max-width: 360px;
}

.error-box button {
  padding: 8px 24px;
  background: #1a4a8a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.error-box button:hover {
  background: #2a5aaa;
}

/* 业务 UI 区域：z-index 999 确保显示在画面上方 */
.header {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  color: #4dff91;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 10px;
  border-radius: 12px;
}

.meta {
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
}
</style>
