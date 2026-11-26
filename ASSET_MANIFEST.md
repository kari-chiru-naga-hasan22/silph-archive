# SILPH ARCHIVE // ASSET MANIFEST

Generated in **Phase 0: ArtCraft Tool Discovery & Asset Pipeline** before application implementation.

---

## 1. ArtCraft Tool Discovery Audit

| Tool | Status | Transport / Binary | Role & Pipeline Execution Notes |
| :--- | :--- | :--- | :--- |
| **FigCraft** | **ONLINE** | `figcraft` MCP (headless, 645 commands) | Authored `SILPH_SYSTEM` variable tokens & HUD artboards (`Telemetry Drawer`, `Specimen Selector Dock`, `Type Matchup Matrix`, `Audio & Performance Deck`). Exported `.figcraft`, `.fig`, PNG preview, and `design/tokens.json`. |
| **MaterialCraft** | **ONLINE** (Render-Bridge Export) | `materialcraft` MCP (29 atomic nodes) | Built and cooked 6 procedural PBR graphs (`titanium_brushed_v2`, `ceramic_gloss`, `volcanic_basalt`, `wet_slate`, `copper_coil`, `holo_foil`). Note: MCP launcher lacked `--write-root` (`outputs_export` blocked), so 512×512 cooked node outputs (`baseColor`, `normal`, `roughness`, `metallic`) were captured directly via `view_render {view: "2d", full: true}` and saved under `public/assets/textures/pbr/`. |
| **TextureCraft** | **ONLINE** (Render-Bridge Export) | `texturecraft` MCP (175 commands) | Built `pokeball_study` on `builtin:material_ball`, ran GPU curvature/AO baker (`AMD Radeon(TM) Graphics`), applied `Ceramic Shell Coat`, `edgeWear`, `curvature`, `matFinishSanded`, and `Titanium Inner Ring`. Captured 512×512 UV maps via `viewport_render {view: "2d"}` (`--write-root` absent for `textures_export`). |
| **VectorCraft** | **ONLINE** | `vectorcraft` MCP (headless, 966 commands) | Authored and exported geometric `silph-wordmark.svg`, `hud-reticle.svg`, and all **18 Pokémon Type Crests** (`type-*.svg`) plus `.vectorcraft` source files. |
| **PhotoCraft** | **ONLINE** (Render-Bridge Export) | `photocraft` MCP (1005 commands) | Composited and graded 2K/HD atmospheric & studio environment backdrop plates (`env-studio.png`, `env-atmospheric.png`, `bg-charizard.png`, `bg-pikachu.png`, `bg-greninja.png`, `bg-rayquaza.png`) using linear/radial gradients, procedural clouds, spotlight relighting, and film grain. Captured via `render_preview` (`write authority is absent` on `doc_export`). |
| **EffectCraft** | **ONLINE** | `effectcraft` MCP (761 commands) | Rendered transparent RGBA 512×512 VFX particle & aura sprites (`vfx-ember.png`, `vfx-spark.png`, `vfx-mist.png`, `vfx-plasma.png`) via `ec.sim.ccparticlesystems2`, `ec.generate.advancedlightning`, `ec.noise.turbulent`, `ec.generate.cclightrays`, `ec.sim.ccstarburst`, and `ec.stylize.glow`, saved alongside `design/vfx/silph-vfx.ecproj`. |
| **AniCraft** | **OFFLINE** (`NOT_FOUND`) | Fallback Active | Absent from MCP & PATH. Covered via EffectCraft rendered VFX sprites + CSS/Framer Motion/SVG animated badges. |
| **ArtCraft Studio** | **OFFLINE** (`NOT_FOUND`) | Fallback Active | Absent as standalone MCP (`craft-anything` 3D generator prohibits copyrighted character artwork). Covered via intricately sculpted multi-part Three.js specimen totems + custom GLSL field/aura shaders + PhotoCraft environment plates. |
| **SoundCraft** | **OFFLINE** (`NOT_FOUND`) | Fallback Active | Absent from MCP & PATH. Covered via zero-dependency **Web Audio API procedural synthesizer** (`src/audio/soundEngine.ts`) generating mechanical Pokéball latch clicks, release air-hiss, capture pulse resonance, UI ticks, and crossfaded per-biome harmonic ambience with live `AnalyserNode` waveform data. |

---

## 2. Asset Inventory (`design/` & `public/assets/`)

### Design Sources (`design/`)
- `design/silph-archive.figcraft` — Native FigCraft design document
- `design/silph-archive.fig` — Experimental `.fig` export
- `design/tokens.json` — Exported `SILPH_SYSTEM` color, typography, radius, and grid tokens
- `design/previews/figcraft-hud-system.png` — FigCraft HUD frame render (1440×900)
- `design/vectors/hud-reticle.vectorcraft` — Native VectorCraft reticle source
- `design/vectors/silph-crest-sample.vectorcraft` — Native VectorCraft type crest source
- `design/vfx/silph-vfx.ecproj` — EffectCraft motion graphics & particle project

### PBR Textures (`public/assets/textures/pbr/`)
- `titanium_brushed/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `titanium_brushed_v2`)
- `ceramic_gloss/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `ceramic_gloss`)
- `volcanic_basalt/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `volcanic_basalt`)
- `wet_slate/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `wet_slate`)
- `copper_coil/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `copper_coil`)
- `holo_foil/{baseColor,normal,roughness,metallic}.png` (MaterialCraft `holo_foil`)
- `ball_hero/{titanium_uv,ceramic_uv}.png` (TextureCraft GPU-baked `material_ball` UV maps)

### Vector Assets (`public/assets/svg/`)
- `silph-wordmark.svg`, `hud-reticle.svg`
- 18 Elemental Type Crests: `type-normal.svg`, `type-fire.svg`, `type-water.svg`, `type-electric.svg`, `type-grass.svg`, `type-ice.svg`, `type-fighting.svg`, `type-poison.svg`, `type-ground.svg`, `type-flying.svg`, `type-psychic.svg`, `type-bug.svg`, `type-rock.svg`, `type-ghost.svg`, `type-dragon.svg`, `type-dark.svg`, `type-steel.svg`, `type-fairy.svg`

### PhotoCraft Backdrops (`public/assets/backdrops/`)
- `env-studio.png`, `env-atmospheric.png`
- `bg-charizard.png`, `bg-pikachu.png`, `bg-greninja.png`, `bg-rayquaza.png`

### EffectCraft VFX Alpha Sprites (`public/assets/vfx/`)
- `vfx-ember.png`, `vfx-spark.png`, `vfx-mist.png`, `vfx-plasma.png`

### Official Specimen Artwork & Generated 3D Relief Maps (`public/assets/pokemon/`)
- **Canonical High-Res Artwork (13 Evolution & Apex Forms):** `charmander.png`, `charmeleon.png`, `charizard.png`, `mega-charizard-x.png`, `pichu.png`, `pikachu.png`, `raichu.png`, `froakie.png`, `frogadier.png`, `greninja.png`, `ash-greninja.png`, `rayquaza.png`, `mega-rayquaza.png`
- **3D Relief Displacement & Tangent-Space Normal Maps:** `{charizard,pikachu,greninja,rayquaza}_512.png`, `{charizard,pikachu,greninja,rayquaza}_height.png` (Euclidean-spherical relief heightmap), `{charizard,pikachu,greninja,rayquaza}_normal.png` (Sobel tangent-space normal map) driving `SpecimenRelief3D.tsx` in the 4 3D biomes.
