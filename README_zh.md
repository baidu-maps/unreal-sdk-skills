# CloudRenderEngine Skill

> **Version**: 1.9.1
> **Purpose**: 帮助 Claude AI 理解和使用 mapv-cloudrenderengine（百度地图云渲染引擎）进行 3D 数字孪生可视化开发

---

## Skill 简介

这是一个专为 Claude AI 助手设计的知识库 skill，使 Claude 能够：

- 指导开发者使用 mapv-cloudrenderengine API
- 生成完整可运行的 3D 地理可视化代码
- 解答引擎初始化、对象创建、事件处理等问题
- 提供最佳实践和常见问题解决方案

### 适用场景

当开发者询问以下内容时，Claude 会自动激活此 skill：

- "使用 mapv-cloudrenderengine"
- "创建 3D 可视化 / 地图标注 / 轨迹线 / 热力图"
- "添加粒子特效 / 天气控制 / 相机动画"
- "处理 clickLocation 事件 / 获取点击坐标"
- "接入自动驾驶车辆 / 信号灯 / 路况数据"
- "建筑生长动画 / 楼宇拆解 / 关卡切换"
- **"创建云渲染 demo / 快速接入调度服务 / 生成云渲染项目"**（提供调度服务地址和 projectName 即可一键生成可运行组件）
- 任何关于云渲染引擎的技术问题

### 核心能力覆盖

| 类别 | 包含功能 |
|------|---------|
| **基础对象** | 点标注、线、面、集群点、文本标签 |
| **可视化** | 热力图、动态线、OD 线、Polygon |
| **交通** | 路况、信号灯、车辆、停车场、潮汐车道 |
| **特效** | 粒子、雷达、涟漪、爆炸、光柱 |
| **城市** | 建筑生长、楼宇拆解、情报板、信息牌 |
| **环境** | 天气、时间、光照点、Decal 贴图 |
| **高级** | WebRTC 监控、关卡切换、3DTiles |
| **动画** | Sequencer 时间轴动画系统 |

---

## 目录结构说明

```
.claude/skills/cloudrenderengine/
├── SKILL.md                    # 核心知识库 (Claude 的主要学习内容)
│                               # 包含完整 API 文档、代码模板、最佳实践
│
├── examples/                   # 完整代码示例
│   ├── basic-usage.js          # 基础使用：初始化、相机、事件、常用对象
│   └── visualization.js        # 可视化示例：热力图、动态线、特效等
│
└── references/                 # 分类参考文档
    ├── api-reference.md        # API 总览（类、方法、属性）
    ├── class-details.md        # 详细类文档（所有类的完整 API）
    ├── examples-base.md        # 基础示例汇总
    ├── examples-data.md        # 数据可视化示例
    ├── examples-effect.md      # 特效示例
    ├── examples-traffic.md     # 交通对象示例
    ├── examples-city.md        # 城市功能示例
    └── coordinate-system.md    # 坐标系统详解
```

### 文件用途说明

- **SKILL.md**: Claude 首先阅读的核心文档，包含所有关键信息的精华总结
- **examples/**: 提供完整可运行的代码示例，帮助 Claude 生成正确的代码
- **references/**: 详细的分类参考文档，用于深入查询特定 API 细节

---

## 如何使用这个 Skill

### 安装配置

#### 第一步：克隆仓库

```bash
# 使用 SSH（推荐）
git clone git@github.com:baidu-maps/unreal-sdk-skills.git

# 或使用 HTTPS
git clone https://github.com/baidu-maps/unreal-sdk-skills.git
```

#### 第二步：复制 Skill 到配置目录

**方式一：配置为全局 Skill（推荐）**

将 Skill 复制到用户目录下的 `.claude/skills/`，所有项目都可使用：

```bash
# 创建全局 skills 目录（如果不存在）
mkdir -p ~/.claude/skills

# 复制 cloudrenderengine skill
cp -r unreal-sdk-skills/.claude/skills/cloudrenderengine ~/.claude/skills/
```

**方式二：配置为项目级 Skill**

将 Skill 复制到具体项目的 `.claude/skills/` 目录，仅该项目可使用：

```bash
# 进入你的项目目录
cd /path/to/your-project

# 创建项目 skills 目录（如果不存在）
mkdir -p .claude/skills

# 复制 cloudrenderengine skill
cp -r /path/to/unreal-sdk-skills/.claude/skills/cloudrenderengine .claude/skills/
```

#### 第三步：验证安装

安装完成后，目录结构应如下：

```
~/.claude/skills/                    # 全局配置
└── cloudrenderengine/
    ├── SKILL.md                     # 核心知识库
    ├── examples/                    # 代码示例
    └── references/                  # 参考文档

# 或

your-project/.claude/skills/         # 项目级配置
└── cloudrenderengine/
    ├── SKILL.md
    ├── examples/
    └── references/
```

### 触发方式

直接在对话中提及相关关键词，Claude 会自动使用这个 skill。无需特殊命令。

### 典型提示词示例

#### 1. 基础初始化
```
"帮我用 mapv-cloudrenderengine 初始化一个云渲染引擎，
使用调度服务模式，并设置相机位置到北京天安门"
```

#### 2. 添加可视化对象
```
"在地图上添加一些点标注，显示北京的几个地标，
使用红色图标，点击时显示名称"
```

#### 3. 创建动画效果
```
"创建一条从起点到终点的动态轨迹线，
颜色渐变从蓝到红，带流动动画"
```

#### 4. 事件处理
```
"监听地图点击事件，获取点击位置的经纬度坐标，
并在控制台输出"
```

#### 5. 高级功能
```
"接入实时路况数据，在地图上显示拥堵情况，
并添加自动驾驶车辆的轨迹回放"
```

#### 6. 快速生成可运行 Demo
```
"创建一个基础的使用调度服务的云渲染系统，
调度服务的地址是 http://127.0.0.1:8017，projectName 为 wxhs"
```
> 触发关键词：**创建云渲染 demo**、**快速接入调度服务**、**生成云渲染项目**
> 需提供 `调度服务地址` 和 `projectName`，缺少时 Claude 会主动询问。
> 自动检测当前项目框架（React / Vue），空目录默认生成 React 组件。

---

## Skill 内容概览

### 核心 API 类别

| 类别 | 主要类 | 用途 |
|------|--------|------|
| **基础类** | `CloudRenderEngine`, `CloudRenderApp` | 引擎初始化、配置管理 |
| **点对象** | `IconPoint`, `BasicLabel`, `ClusterPoint` | 点标注、标签、聚合点 |
| **线对象** | `Line`, `ODLine`, `MeasureLine` | 普通线、OD 线、测量线 |
| **面对象** | `Polygon`, `MeasureArea` | 多边形、测量面积 |
| **可视化** | `HeatMap`, `Radar`, `Ripple` | 热力图、雷达、涟漪 |
| **交通** | `CarPark`, `TrafficLight`, `AutoVehicle` | 停车场、信号灯、车辆 |
| **特效** | `Particle`, `Beam`, `Explosion` | 粒子、光柱、爆炸 |
| **城市** | `BuildingGrow`, `BuildingExplode` | 建筑动画、拆解 |
| **环境** | `Weather`, `TimeOfDay`, `LightPoint` | 天气、时间、光照 |
| **相机** | `Camera.flyTo()`, `Camera.roam()` | 相机飞行、漫游 |
| **动画** | `BaseSequencer`, `SequencerEarthCity*` | 时间轴动画系统 |

### 关键概念速查

#### 坐标系统
- **标准**: WGS84 经纬度坐标系
- **位置**: `{ x: 经度, y: 纬度, z: 高度(米) }`
- **旋转**: `{ roll, pitch, yaw }` (度)

#### 数据格式
- **GeoJSON**: 所有可视化对象的数据输入格式
- **颜色**: `{ r, g, b }` (0-1 范围) 或 `#RRGGBB`
- **时间**: Unix 时间戳（毫秒）

#### 类继承关系
```
EventDispatcher
  └── Object3D (add, remove)
        └── Shape (setData, setStyle, update)
              ├── Point 系列 (IconPoint, TextPoint, BasicLabel, ClusterPoint)
              ├── Line 系列 (Line, ODLine, MeasureLine)
              └── Polygon 系列 (Polygon, MeasureArea)
```

#### 生命周期方法
- `setData()`: 设置/更新数据
- `addToScene()`: 对象添加到场景
- `removeFromScene()`: 对象从场景移除

---

## 参考资源指引

### 如何查找具体 API 文档

1. **快速入门** → 阅读 `SKILL.md` 的 "快速开始" 部分
2. **完整示例** → 查看 `examples/basic-usage.js` 和 `visualization.js`
3. **API 总览** → 参考 `references/api-reference.md`
4. **详细类文档** → 查阅 `references/class-details.md`
5. **特定场景** → 查找 `references/examples-*.md` 分类示例

### References 文件定位

| 文件 | 内容 | 使用场景 |
|------|------|---------|
| `api-reference.md` | API 总览、类列表、方法速查 | 快速查找某个类或方法 |
| `class-details.md` | 所有类的完整文档 | 深入了解类的所有属性和方法 |
| `examples-base.md` | 初始化、相机、事件等基础示例 | 学习引擎基础使用 |
| `examples-data.md` | 点线面、热力图等数据可视化 | 数据展示需求 |
| `examples-effect.md` | 粒子、雷达、涟漪等特效 | 视觉效果增强 |
| `examples-traffic.md` | 路况、信号灯、车辆等交通 | 交通领域应用 |
| `examples-city.md` | 建筑、监控、信息牌等城市 | 智慧城市场景 |
| `coordinate-system.md` | 坐标转换、海拔处理 | 坐标系统问题 |

---

## 维护说明

### 如何更新这个 Skill

1. **更新核心文档**
   - 修改 `SKILL.md`，这是 Claude 的主要学习来源
   - 保持文档结构：安装 → 核心概念 → API → 示例 → 最佳实践

2. **添加新示例**
   - 在 `examples/` 添加完整可运行的代码文件
   - 在 `references/examples-*.md` 添加分类说明

3. **更新 API 文档**
   - `api-reference.md`: 更新类列表和方法签名
   - `class-details.md`: 添加详细的类文档

4. **版本管理**
   - 在 `SKILL.md` 顶部的 frontmatter 更新 `version` 字段
   - 在更新说明中记录主要变更

### 版本信息位置

- **当前版本**: 查看 `SKILL.md` 顶部的 `version: 1.5.0`
- **更新日志**: 目前在 `SKILL.md` 中内联说明

### 文档编写原则

1. **完整性**: 提供可直接运行的代码示例
2. **准确性**: 所有 API 调用必须与实际库一致
3. **实用性**: 优先覆盖常用场景和最佳实践
4. **清晰性**: 使用注释和分步说明
5. **时效性**: 及时更新已废弃的 API 和新增功能

---

## 学习路径建议

### 对于开发者

1. 先阅读本 README 了解整体结构
2. 运行 `examples/basic-usage.js` 理解基础用法
3. 根据需求查阅 `references/` 中的分类文档
4. 在实际项目中参考 `SKILL.md` 的代码模板

### 对于 Claude AI

- 优先阅读 `SKILL.md` 获取完整知识体系
- 根据用户问题定位到 `references/` 中的具体文档
- 参考 `examples/` 生成正确的代码
- 结合 `coordinate-system.md` 处理坐标相关问题

---

## 相关资源

- **官方文档**: [百度地图开放平台数字孪生官网](https://dtmap.baidu.com/)
- **npm 包**: `mapv-cloudrenderengine`
- **技术支持**: 联系百度地图开放平台技术支持团队

---

**Last Updated**: 2026-02-10
**Maintained by**: 百度地图开放平台数字底座团队
