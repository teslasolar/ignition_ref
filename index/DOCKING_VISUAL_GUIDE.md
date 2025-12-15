# Docking System Visual Guide

## Layout Diagrams

### Default Template Layout

```
┌────────────────────────────────────────────────────────────┐
│ NORTH (60px)                                               │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Title           Controls           [Collapse ▲]        │ │
│ └────────────────────────────────────────────────────────┘ │
├──────────────┬───────────────────────────┬─────────────────┤
│ WEST (250px) │ CENTER (Flex)             │ EAST (300px)    │
│ ┌──────────┐ │ ┌───────────────────────┐ │ ┌─────────────┐ │
│ │Nav [◀]   │ │ │                       │ │ │Props   [▶]  │ │
│ │          │ │ │                       │ │ │             │ │
│ │ • Item 1 │ │ │   Main Content        │ │ │ Name: Value │ │
│ │ • Item 2 │ │ │   Area                │ │ │ Type: Info  │ │
│ │ • Item 3 │ │ │                       │ │ │ Size: 100   │ │
│ │          │ │ │                       │ │ │             │ │
│ │          │ │ │                       │ │ │             │ │
│ └──────────┘ │ └───────────────────────┘ │ └─────────────┘ │
├──────────────┴───────────────────────────┴─────────────────┤
│ SOUTH (40px)                                               │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Status: Online    Connected    Updated: Now   [▼]     │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Dashboard Template Layout

```
┌────────────────────────────────────────────────────────────┐
│ NORTH (50px)                                               │
│ Dashboard Title                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                CENTER (Main Area)                          │
│                                                            │
│            Full Width Dashboard Content                    │
│                                                            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ SOUTH (35px)                                               │
│ Footer Status                                              │
└────────────────────────────────────────────────────────────┘
```

### Split Template Layout

```
┌────────────────────────────────────────────────────────────┐
│ NORTH (50px)                                               │
│ Split View Comparison                                      │
├─────────────────────────────┬──────────────────────────────┤
│ WEST (50%)                  │ EAST (50%)                   │
│                             │                              │
│   Left Panel Content        │   Right Panel Content        │
│                             │                              │
│   • For Comparison          │   • For Comparison           │
│   • Side by Side            │   • Side by Side             │
│                             │                              │
└─────────────────────────────┴──────────────────────────────┘
```

### Fullscreen Template Layout

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                  CENTER (Fullscreen)                       │
│                                                            │
│              No Docks - Pure Content                       │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Collapse States

### West Dock Collapsed

```
┌────────────────────────────────────────────────────────────┐
│ NORTH                                                      │
├─┬──────────────────────────────────────────────┬───────────┤
│W│ CENTER (Expanded)                            │ EAST      │
│e│                                              │           │
│s│                                              │           │
│t│  More space for main content                │           │
│ │                                              │           │
│[│                                              │           │
│▶│                                              │           │
│]│                                              │           │
├─┴──────────────────────────────────────────────┴───────────┤
│ SOUTH                                                      │
└────────────────────────────────────────────────────────────┘
```

### East Dock Collapsed

```
┌────────────────────────────────────────────────────────────┐
│ NORTH                                                      │
├──────────┬───────────────────────────────────────────────┬─┤
│ WEST     │ CENTER (Expanded)                             │E│
│          │                                               │a│
│          │                                               │s│
│          │  More space for main content                  │t│
│          │                                               │ │
│          │                                               │[│
│          │                                               │◀│
│          │                                               │]│
├──────────┴───────────────────────────────────────────────┴─┤
│ SOUTH                                                      │
└────────────────────────────────────────────────────────────┘
```

### All Side Docks Collapsed (Minimal View)

```
┌────────────────────────────────────────────────────────────┐
│ NORTH                                                      │
├─┬────────────────────────────────────────────────────────┬─┤
│W│                                                        │E│
│ │                                                        │a│
│[│                                                        │s│
│▶│          CENTER (Maximum Space)                        │t│
│]│                                                        │ │
│ │          Full Focus on Content                         │[│
│ │                                                        │◀│
│ │                                                        │]│
├─┴────────────────────────────────────────────────────────┴─┤
│ SOUTH                                                      │
└────────────────────────────────────────────────────────────┘
```

## Resize Interaction

### Resizing West Dock

```
Before:                           During Resize:
┌──────┬─────────┐                ┌────────┬───────┐
│ WEST │ CENTER  │                │ WEST → │ CENTER│
│      │         │      ===>      │  Drag  │       │
│ 250px│         │                │  300px │       │
└──────┴─────────┘                └────────┴───────┘
              ↑                              ↑
         Resize Handle               Resize in Progress
         (4px wide)                  (Cursor: col-resize)
```

### Resizing North Dock

```
Before:                           During Resize:
┌─────────────────┐               ┌─────────────────┐
│ NORTH (60px)    │               │ NORTH (80px)    │
│─────────────────│  Drag Down    │                 │
│                 │    ===>       │─────────────────│ ← Dragging
│ CENTER          │               │ CENTER          │
│                 │               │                 │
└─────────────────┘               └─────────────────┘
        ↑
   Resize Handle
```

## Component Placement Examples

### Navigation Tree in West Dock

```
┌──────────────────┐
│ Navigation  [◀]  │
├──────────────────┤
│ • Dashboard      │ ← Button/Link
│ • Process        │ ← Button/Link
│   ├─ Tank 1      │ ← Nested item
│   └─ Tank 2      │ ← Nested item
│ • Equipment      │ ← Button/Link
│ • Trends         │ ← Button/Link
│ • Alarms         │ ← Button/Link
│                  │
└──────────────────┘
```

### Properties Panel in East Dock

```
┌─────────────────────┐
│ Properties     [▶]  │
├─────────────────────┤
│ PROCESS VARIABLES   │ ← Group Title
│─────────────────────│
│ Temperature: 72.5°F │ ← Property Row
│ Pressure:    45 PSI │ ← Property Row
│ Flow:      125 GPM  │ ← Property Row
│                     │
│ EQUIPMENT STATUS    │ ← Group Title
│─────────────────────│
│ Pump 1:     Running │ ← Property Row
│ Pump 2:     Stopped │ ← Property Row
│                     │
└─────────────────────┘
```

### Toolbar in North Dock

```
┌──────────────────────────────────────────────────┐
│ Dashboard Title    [Refresh] [Settings] [Help]   │
└──────────────────────────────────────────────────┘
 ↑                   ↑         ↑          ↑
 Title               Button    Button     Button
```

### Status Bar in South Dock

```
┌──────────────────────────────────────────────────┐
│ ● Online    Connected to Gateway    Last: 12:34  │
└──────────────────────────────────────────────────┘
 ↑           ↑                       ↑
 Indicator   Status Text             Timestamp
```

## Responsive Breakpoints

### Desktop (> 1024px)

```
┌────────────────────────────────────────────┐
│            NORTH (Full)                    │
├──────────┬────────────────┬────────────────┤
│   WEST   │    CENTER      │     EAST       │
│  (Full)  │    (Flex)      │    (Full)      │
├──────────┴────────────────┴────────────────┤
│            SOUTH (Full)                    │
└────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌────────────────────────────────────────────┐
│            NORTH (Full)                    │
├─────────┬─────────────────┬────────────────┤
│  WEST   │    CENTER       │     EAST       │
│(Narrow) │    (Flex)       │   (Narrow)     │
├─────────┴─────────────────┴────────────────┤
│            SOUTH (Full)                    │
└────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌────────────────────────────────────────────┐
│            NORTH (Full)                    │
├────────────────────────────────────────────┤
│                                            │
│            CENTER (Full Width)             │
│         (West & East Hidden)               │
│                                            │
├────────────────────────────────────────────┤
│            SOUTH (Full)                    │
└────────────────────────────────────────────┘
```

## CSS Grid Structure

### Grid Template Areas

```css
.dock-container {
    display: grid;
    grid-template-areas:
        "north north north"
        "west center east"
        "south south south";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
}
```

### Visual Representation

```
    Column 1     Column 2      Column 3
    (auto)       (1fr)         (auto)

Row 1  ┌────────┬──────────┬────────┐
(auto) │ north  │  north   │ north  │
       ├────────┼──────────┼────────┤
Row 2  │ west   │  center  │ east   │
(1fr)  │        │          │        │
       ├────────┼──────────┼────────┤
Row 3  │ south  │  south   │ south  │
(auto) └────────┴──────────┴────────┘
```

## Event Flow Diagram

### Dock Collapse Event Flow

```
User Click         DockingManager        EventBus         UI Update
    │                    │                   │               │
    ├─── onClick() ─────>│                   │               │
    │                    │                   │               │
    │                    ├─ collapseDock() ─>│               │
    │                    │                   │               │
    │                    ├── emit('dock:collapsed') ──>      │
    │                    │                   │               │
    │                    ├──── classList.add('collapsed') ───>│
    │                    │                   │               │
    │                    ├──── updateGridTemplate() ─────────>│
    │                    │                   │               │
    │                    │<──── Animation ───────────────────┤
    │                    │                   │               │
```

### Dock Resize Event Flow

```
Mouse Down         DockingManager        EventBus         UI Update
    │                    │                   │               │
    ├─── mousedown ─────>│                   │               │
    │                    │                   │               │
    │                    ├─ startResize() ──>│               │
    │                    │                   │               │
    ├─── mousemove ─────>│                   │               │
    │                    │                   │               │
    │                    ├──── updateSize() ────────────────>│
    │                    │                   │               │
    │                    ├── emit('dock:resize') ─>          │
    │                    │                   │               │
    ├─── mouseup ───────>│                   │               │
    │                    │                   │               │
    │                    ├─ endResize() ────>│               │
    │                    │                   │               │
    │                    ├─ saveState() ────>│               │
    │                    │                   │               │
```

## Template Selection Flow

```
┌─────────────────────┐
│  Select Template    │
│  (default/process)  │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Load Template      │
│  Configuration      │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Apply Dock Sizes   │
│  & Visibility       │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Render Dock        │
│  Content            │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Update Grid        │
│  Template           │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Emit Events        │
│  dock:template-     │
│  applied            │
└─────────────────────┘
```

## Color Coding Reference

### Dock Region Colors (Default Theme)

- **North**: Surface Light (#3d3d3d)
- **South**: Surface Light (#3d3d3d)
- **East**: Surface (#2d2d2d)
- **West**: Surface (#2d2d2d)
- **Center**: Background (#1e1e1e)

### Status Colors

- **Active**: Success Green (#66bb6a)
- **Inactive**: Text Secondary (#b0b0b0)
- **Error**: Error Red (#ef5350)
- **Warning**: Warning Yellow (#ffca28)
- **Primary**: Primary Blue (#1e88e5)

## Interaction States

### Dock Header States

```
Normal:     ┌─────────────────┐
            │ Title       [◀] │
            └─────────────────┘

Hover:      ┌─────────────────┐
            │ Title       [◀] │ ← Button highlights
            └─────────────────┘

Collapsed:  ┌┐
            ││ ← Vertical text
            │T│
            │i│
            │t│
            └┘
```

### Resize Handle States

```
Normal:     │ (transparent, 4px)

Hover:      ║ (blue, visible, 4px)

Dragging:   ║ (blue, cursor changes)
```

## Legend

```
Symbols Used:
─ ═ ━ │ ║   Box drawing characters
┌ ┐ └ ┘      Corners
├ ┤ ┬ ┴ ┼   T-junctions and cross
▲ ▼ ◀ ▶      Arrows for collapse buttons
[...]         Interactive elements (buttons)
• ─           List items
↑ ↓ → ←       Flow indicators
```

This visual guide provides a comprehensive view of how the docking system looks and behaves in different states and configurations.
