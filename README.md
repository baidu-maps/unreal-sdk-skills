# CloudRenderEngine Skill for Claude

> [中文版本 (Chinese Version)](./README_zh.md)

> **Version**: 1.6.0
> **Purpose**: Help Claude AI understand and use mapv-cloudrenderengine (Baidu Maps Cloud Rendering Engine) for 3D digital twin visualization development

---

## Overview

This is a knowledge base skill designed for Claude AI assistant, enabling Claude to:

- Guide developers in using the mapv-cloudrenderengine API
- Generate complete, runnable 3D geographic visualization code
- Answer questions about engine initialization, object creation, event handling, etc.
- Provide best practices and common problem solutions

### Use Cases

Claude will automatically activate this skill when developers ask about:

- "use mapv-cloudrenderengine"
- "create 3D visualization / map markers / trajectory lines / heatmaps"
- "add particle effects / weather control / camera animations"
- "handle clickLocation events / get click coordinates"
- "integrate autonomous vehicles / traffic lights / road condition data"
- "building growth animation / building decomposition / level switching"
- Any technical questions about the cloud rendering engine

### Core Capabilities

| Category | Features |
|----------|----------|
| **Basic Objects** | Point markers, lines, polygons, cluster points, text labels |
| **Visualization** | Heatmaps, dynamic lines, OD lines, Polygons |
| **Traffic** | Road conditions, traffic lights, vehicles, parking lots, tidal lanes |
| **Effects** | Particles, radar, ripples, explosions, light beams |
| **City** | Building growth, building decomposition, information boards |
| **Environment** | Weather, time, light points, Decal textures |
| **Advanced** | WebRTC monitoring, level switching, 3DTiles |
| **Animation** | Sequencer timeline animation system |

---

## Directory Structure

```
.claude/skills/cloudrenderengine/
├── SKILL.md                    # Core knowledge base (Claude's main learning content)
│                               # Contains complete API docs, code templates, best practices
│
├── examples/                   # Complete code examples
│   ├── basic-usage.js          # Basic usage: initialization, camera, events, common objects
│   └── visualization.js        # Visualization examples: heatmaps, dynamic lines, effects, etc.
│
└── references/                 # Categorized reference documentation
    ├── api-reference.md        # API overview (classes, methods, properties)
    ├── class-details.md        # Detailed class documentation (complete API for all classes)
    ├── examples-base.md        # Basic examples summary
    ├── examples-data.md        # Data visualization examples
    ├── examples-effect.md      # Effects examples
    ├── examples-traffic.md     # Traffic object examples
    ├── examples-city.md        # City feature examples
    └── coordinate-system.md    # Coordinate system details
```

### File Purpose

- **SKILL.md**: The core document Claude reads first, containing a summary of all key information
- **examples/**: Provides complete runnable code examples to help Claude generate correct code
- **references/**: Detailed categorized reference docs for in-depth API queries

---

## How to Use This Skill

### Installation

#### Step 1: Clone the Repository

```bash
# Using SSH (recommended)
git clone git@github.com:baidu-maps/unreal-sdk-skills.git

# Or using HTTPS
git clone https://github.com/baidu-maps/unreal-sdk-skills.git
```

#### Step 2: Copy Skill to Configuration Directory

**Option A: Configure as Global Skill (Recommended)**

Copy the Skill to the `.claude/skills/` directory under your home folder, making it available for all projects:

```bash
# Create global skills directory (if not exists)
mkdir -p ~/.claude/skills

# Copy cloudrenderengine skill
cp -r unreal-sdk-skills/.claude/skills/cloudrenderengine ~/.claude/skills/
```

**Option B: Configure as Project-Level Skill**

Copy the Skill to a specific project's `.claude/skills/` directory, making it available only for that project:

```bash
# Navigate to your project directory
cd /path/to/your-project

# Create project skills directory (if not exists)
mkdir -p .claude/skills

# Copy cloudrenderengine skill
cp -r /path/to/unreal-sdk-skills/.claude/skills/cloudrenderengine .claude/skills/
```

#### Step 3: Verify Installation

After installation, the directory structure should look like:

```
~/.claude/skills/                    # Global configuration
└── cloudrenderengine/
    ├── SKILL.md                     # Core knowledge base
    ├── examples/                    # Code examples
    └── references/                  # Reference documentation

# Or

your-project/.claude/skills/         # Project-level configuration
└── cloudrenderengine/
    ├── SKILL.md
    ├── examples/
    └── references/
```

### Activation

Simply mention relevant keywords in the conversation, and Claude will automatically use this skill. No special commands required.

### Example Prompts

#### 1. Basic Initialization
```
"Help me initialize a cloud rendering engine with mapv-cloudrenderengine,
using dispatch server mode, and set the camera position to Beijing Tiananmen"
```

#### 2. Add Visualization Objects
```
"Add some point markers on the map showing several landmarks in Beijing,
using red icons, display names when clicked"
```

#### 3. Create Animation Effects
```
"Create a dynamic trajectory line from start to end,
with color gradient from blue to red, with flowing animation"
```

#### 4. Event Handling
```
"Listen for map click events, get the latitude and longitude of the click position,
and output to console"
```

#### 5. Advanced Features
```
"Connect to real-time road condition data, show congestion on the map,
and add autonomous vehicle trajectory playback"
```

---

## Skill Content Overview

### Core API Categories

| Category | Main Classes | Purpose |
|----------|--------------|---------|
| **Core** | `CloudRenderEngine`, `CloudRenderApp` | Engine initialization, configuration management |
| **Point Objects** | `IconPoint`, `BasicLabel`, `ClusterPoint` | Point markers, labels, cluster points |
| **Line Objects** | `Line`, `ODLine`, `MeasureLine` | Regular lines, OD lines, measurement lines |
| **Polygon Objects** | `Polygon`, `MeasureArea` | Polygons, area measurement |
| **Visualization** | `HeatMap`, `Radar`, `Ripple` | Heatmaps, radar, ripples |
| **Traffic** | `CarPark`, `TrafficLight`, `AutoVehicle` | Parking lots, traffic lights, vehicles |
| **Effects** | `Particle`, `Beam`, `Explosion` | Particles, light beams, explosions |
| **City** | `BuildingGrow`, `BuildingExplode` | Building animations, decomposition |
| **Environment** | `Weather`, `TimeOfDay`, `LightPoint` | Weather, time, lighting |
| **Camera** | `Camera.flyTo()`, `Camera.roam()` | Camera flight, roaming |
| **Animation** | `BaseSequencer`, `SequencerEarthCity*` | Timeline animation system |

### Key Concepts Quick Reference

#### Coordinate System
- **Standard**: WGS84 latitude/longitude coordinate system
- **Position**: `{ x: longitude, y: latitude, z: altitude(meters) }`
- **Rotation**: `{ roll, pitch, yaw }` (degrees)

#### Data Formats
- **GeoJSON**: Data input format for all visualization objects
- **Color**: `{ r, g, b }` (0-1 range) or `#RRGGBB`
- **Time**: Unix timestamp (milliseconds)

#### Class Inheritance
```
EventDispatcher
  └── Object3D (add, remove, removeFromScene)
        └── Shape (setData, setStyle, update)
              ├── Point series (IconPoint, TextPoint, BasicLabel, ClusterPoint)
              ├── Line series (Line, ODLine, MeasureLine)
              └── Polygon series (Polygon, MeasureArea)
```

#### Lifecycle Methods
- `setData()`: Set/update data
- `addToScene()`: Add Object to Scene
- `removeFromScene()`: Destroy object and release resources

---

## Reference Resource Guide

### How to Find Specific API Documentation

1. **Quick Start** → Read the "Quick Start" section of `SKILL.md`
2. **Complete Examples** → Check `examples/basic-usage.js` and `visualization.js`
3. **API Overview** → Refer to `references/api-reference.md`
4. **Detailed Class Docs** → Consult `references/class-details.md`
5. **Specific Scenarios** → Find `references/examples-*.md` categorized examples

### Reference File Location Guide

| File | Content | Use Case |
|------|---------|----------|
| `api-reference.md` | API overview, class list, method quick reference | Quickly find a class or method |
| `class-details.md` | Complete documentation for all classes | Deep dive into all properties and methods |
| `examples-base.md` | Initialization, camera, event basic examples | Learn engine basics |
| `examples-data.md` | Points, lines, polygons, heatmap data visualization | Data display needs |
| `examples-effect.md` | Particles, radar, ripple effects | Visual effect enhancement |
| `examples-traffic.md` | Road conditions, traffic lights, vehicle traffic | Traffic domain applications |
| `examples-city.md` | Buildings, monitoring, info boards city features | Smart city scenarios |
| `coordinate-system.md` | Coordinate conversion, altitude handling | Coordinate system issues |

---

## Maintenance Guide

### How to Update This Skill

1. **Update Core Documentation**
   - Modify `SKILL.md`, this is Claude's main learning source
   - Maintain document structure: Installation → Core Concepts → API → Examples → Best Practices

2. **Add New Examples**
   - Add complete runnable code files in `examples/`
   - Add categorized explanations in `references/examples-*.md`

3. **Update API Documentation**
   - `api-reference.md`: Update class list and method signatures
   - `class-details.md`: Add detailed class documentation

4. **Version Management**
   - Update the `version` field in the frontmatter at the top of `SKILL.md`
   - Record major changes in the update notes

### Version Information Location

- **Current Version**: See `version: 1.5.0` at the top of `SKILL.md`
- **Changelog**: Currently inline in `SKILL.md`

### Documentation Writing Principles

1. **Completeness**: Provide directly runnable code examples
2. **Accuracy**: All API calls must match the actual library
3. **Practicality**: Prioritize common scenarios and best practices
4. **Clarity**: Use comments and step-by-step explanations
5. **Timeliness**: Promptly update deprecated APIs and new features

---

## Learning Path Suggestions

### For Developers

1. Read this README first to understand the overall structure
2. Run `examples/basic-usage.js` to understand basic usage
3. Consult categorized documents in `references/` as needed
4. Reference code templates in `SKILL.md` for actual projects

### For Claude AI

- Prioritize reading `SKILL.md` to get the complete knowledge system
- Locate specific documents in `references/` based on user questions
- Reference `examples/` to generate correct code
- Combine `coordinate-system.md` for coordinate-related issues

---

## Related Resources

- **Official Documentation**: [Baidu Maps Digital Twin Platform](https://dtmap.baidu.com/)
- **npm Package**: `mapv-cloudrenderengine`
- **Technical Support**: Contact Baidu Maps Open Platform Technical Support Team

---

**Last Updated**: 2026-02-10
**Maintained by**: Baidu Maps Open Platform Digital Infrastructure Team
