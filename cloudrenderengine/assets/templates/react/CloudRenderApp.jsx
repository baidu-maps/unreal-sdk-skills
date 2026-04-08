import { useEffect, useRef, useState } from 'react';
import * as Engine from 'mapv-cloudrenderengine';
import styles from './CloudRenderApp.module.css';

// =============================================
// 调度服务配置
// =============================================
const DISPATCH_HOST = '{{DISPATCH_HOST}}';
const PROJECT_NAME = '{{PROJECT_NAME}}';
const USERNAME = '{{USERNAME}}';       // 默认 admin
const PASSWORD = '{{PASSWORD}}';       // 默认 admin

export default function CloudRenderApp() {
    const engineRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle | checking | connecting | connected | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                // 1. 配置调度服务
                Engine.CloudRenderEngine.DispatchServer.host = DISPATCH_HOST;
                Engine.CloudRenderEngine.DispatchServer.tag = 'all';
                Engine.CloudRenderEngine.DispatchServer.username = USERNAME;
                Engine.CloudRenderEngine.DispatchServer.password = PASSWORD;

                // 2. 检查可用渲染容量（必须 > 0 才能连接）
                setStatus('checking');
                const capacity = await Engine.CloudRenderEngine.DispatchServer.GetAllCapacityInfo();
                if (cancelled) return;
                if (!capacity || capacity.all <= 0) {
                    setStatus('error');
                    setErrorMsg('服务器暂无剩余渲染容量，请稍后重试');
                    return;
                }

                // 3. 创建引擎实例
                setStatus('connecting');
                const engine = new Engine.CloudRenderEngine({
                    connectOnLoad: true,
                    shouldShowPlayOverlay: false,
                    projectName: PROJECT_NAME,
                });
                engineRef.current = engine;

                // 4. 画面就绪（此后才可操作场景）
                engine.addEventListener('videoInitialised', () => {
                    if (cancelled) return;
                    setStatus('connected');
                    console.log('[CloudRender] 画面加载完成，可以开始操作场景');
                });

                // 5. 连接异常
                engine.addEventListener('signalingServerError', () => {
                    if (cancelled) return;
                    setStatus('error');
                    setErrorMsg('信令服务器连接失败，请检查网络或联系管理员');
                });

                // 6. 发起连接
                engine.load(
                    () => console.log('[CloudRender] 调度成功'),
                    (err) => {
                        if (cancelled) return;
                        console.error('[CloudRender] 调度失败:', err);
                        setStatus('error');
                        setErrorMsg(`调度失败: ${err?.message || String(err)}`);
                    }
                );
            } catch (err) {
                if (cancelled) return;
                setStatus('error');
                setErrorMsg(`初始化异常: ${err.message}`);
            }
        }

        init();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className={styles.container}>
            {/* 云渲染画面输出 - id="player" 为必填，不可更改 */}
            <div id="player" className={styles.player} />

            {/* 加载/错误 覆盖层 */}
            {status !== 'connected' && (
                <div className={styles.overlay}>
                    {status === 'idle' && <p>初始化中...</p>}
                    {status === 'checking' && <p>正在检查渲染容量...</p>}
                    {status === 'connecting' && <p>正在连接云渲染服务...</p>}
                    {status === 'error' && (
                        <div className={styles.errorBox}>
                            <p>⚠ 连接失败</p>
                            <p className={styles.errorMsg}>{errorMsg}</p>
                            <button onClick={() => window.location.reload()}>重新连接</button>
                        </div>
                    )}
                </div>
            )}

            {/* 连接成功后的顶部状态栏 */}
            {status === 'connected' && (
                <header className={styles.header}>
                    <span className={styles.badge}>● 云渲染已连接</span>
                    <span className={styles.meta}>{PROJECT_NAME} · {DISPATCH_HOST}</span>
                </header>
            )}
        </div>
    );
}
