# Sentily - Hybrid Sentiment Analysis Dashboard Design System

## 🎨 Complete Design Documentation

### 📋 Component Architecture Overview

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.jsx          # Authentication context & state management
│   │   └── LoginPage.jsx             # Dual-role login interface
│   ├── charts/
│   │   ├── BarChart.jsx              # Platform comparison stacked bars
│   │   ├── LineChart.jsx             # Sentiment trends over time
│   │   └── PieChart.jsx              # Sentiment distribution circle
│   ├── Dashboard.jsx                 # Main analytics dashboard
│   ├── FeedbackExplorer.jsx          # Advanced data table with filters
│   ├── Header.jsx                    # Top navigation with search & profile
│   ├── Sidebar.jsx                   # Role-based navigation menu
│   └── StatsCard.jsx                 # Metric display cards
├── data/
│   └── mockData.js                   # Sentiment analysis datasets
├── App.jsx                           # Main application router
└── main.jsx                          # React entry point
```

### 🎨 Primary Color Palette

#### Core Brand Colors
- **Primary Blue**: `#3B82F6` (rgb(59, 130, 246))
- **Primary Purple**: `#8B5CF6` (rgb(139, 92, 246))
- **Secondary Blue**: `#6366F1` (rgb(99, 102, 241))

#### Semantic Colors
- **Success Green**: `#10B981` (rgb(16, 185, 129))
- **Warning Yellow**: `#F59E0B` (rgb(245, 158, 11))
- **Error Red**: `#EF4444` (rgb(239, 68, 68))
- **Info Cyan**: `#06B6D4` (rgb(6, 182, 212))
- **Orange Alert**: `#F97316` (rgb(249, 115, 22))

#### Background System
- **Primary Background**: `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`
- **Card Background**: `bg-white/10` (10% white opacity)
- **Glassmorphism**: `backdrop-blur-xl border border-white/20`
- **Hover States**: `hover:bg-white/15`
- **Active States**: `bg-blue-500/20`

#### Text Color Hierarchy
- **Primary Text**: `text-white` (#FFFFFF)
- **Secondary Text**: `text-gray-300` (#D1D5DB)
- **Muted Text**: `text-gray-400` (#9CA3AF)
- **Disabled Text**: `text-gray-500` (#6B7280)

### 📐 Design System Specifications

#### Typography Scale
- **Display**: `text-3xl font-bold` (30px, 700 weight)
- **Heading 1**: `text-2xl font-bold` (24px, 700 weight)
- **Heading 2**: `text-xl font-semibold` (20px, 600 weight)
- **Heading 3**: `text-lg font-semibold` (18px, 600 weight)
- **Body**: `text-sm font-medium` (14px, 500 weight)
- **Caption**: `text-xs` (12px, 400 weight)

#### Spacing System
- **Component Padding**: `p-6` (24px)
- **Card Padding**: `p-4` (16px)
- **Button Padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Section Spacing**: `space-y-6` (24px vertical gap)
- **Element Spacing**: `space-x-3` (12px horizontal gap)

#### Border Radius & Shadows
- **Card Radius**: `rounded-xl` (12px)
- **Button Radius**: `rounded-lg` (8px)
- **Input Radius**: `rounded-lg` (8px)
- **Avatar Radius**: `rounded-full`
- **Card Shadow**: `shadow-2xl`
- **Border**: `border border-white/20`

#### Animations & Transitions
- **Standard Transition**: `transition-all duration-200`
- **Extended Transition**: `transition-all duration-300`
- **Hover Scale**: `hover:scale-110`
- **Pulse Animation**: `animate-pulse`

---

## 🔧 Component-by-Component Breakdown

### 1. 🔐 LoginPage.jsx
**Purpose**: Dual-role authentication interface with glassmorphism design

**Color Scheme**:
- Background: `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`
- Card: `bg-white/10 backdrop-blur-xl border border-white/20`
- Logo Background: `bg-gradient-to-r from-blue-500 to-purple-600`
- Client Role Button: `bg-blue-500/20 border-blue-400 text-blue-300`
- Admin Role Button: `bg-purple-500/20 border-purple-400 text-purple-300`
- Input Fields: `bg-white/10 border border-white/20 text-white`
- Submit Button: `bg-gradient-to-r from-blue-500 to-purple-600`
- Error Messages: `bg-red-500/20 border border-red-500/50 text-red-300`

**Key Design Elements**:
- Glassmorphism card with backdrop blur
- Role selection with visual feedback
- Gradient logo container
- Social login option
- Demo credentials display

### 2. 📊 Dashboard.jsx
**Purpose**: Main analytics overview with metrics and visualizations

**Color Scheme**:
- Background: Inherits from App gradient
- Stats Cards: Individual color schemes per metric
- Chart Containers: `bg-white/10 backdrop-blur-xl border border-white/20`
- Export Button: `bg-blue-500 hover:bg-blue-600`
- Activity Indicators: Green/Red/Blue dots for status

**Layout Structure**:
- 4-column stats grid on desktop
- 2-column chart layout
- Recent activity feed
- Responsive breakpoints

### 3. 📈 StatsCard.jsx
**Purpose**: Individual metric display with trend indicators

**Color Variations**:
- **Total Feedback**: `bg-blue-500` icon background
- **Positive Sentiment**: `bg-green-500` icon background
- **Negative Sentiment**: `bg-red-500` icon background
- **High Priority**: `bg-orange-500` icon background

**Interactive States**:
- Hover: `hover:bg-white/15 group-hover:scale-110`
- Card Background: `bg-white/10 backdrop-blur-xl`
- Trend Colors: Green for up, Red for down

### 4. 🔍 FeedbackExplorer.jsx
**Purpose**: Advanced data table with filtering and search

**Color Scheme**:
- Filter Section: `bg-white/10 backdrop-blur-xl`
- Table Header: `bg-white/5 border-b border-white/20`
- Row Hover: `hover:bg-white/5`
- Sentiment Badges:
  - Positive: `bg-green-500/20 text-green-400 border-green-500/30`
  - Negative: `bg-red-500/20 text-red-400 border-red-500/30`
  - Neutral: `bg-yellow-500/20 text-yellow-400 border-yellow-500/30`
- Urgency Badges:
  - High: `bg-red-500/20 text-red-400`
  - Medium: `bg-yellow-500/20 text-yellow-400`
  - Low: `bg-green-500/20 text-green-400`

**Interactive Elements**:
- Search Input: `bg-white/10 border border-white/20`
- Filter Dropdowns: Same styling as search
- Pagination: `bg-white/10 border border-white/20`
- Active Page: `bg-blue-500 text-white`

### 5. 🧭 Header.jsx
**Purpose**: Top navigation with search, notifications, and user profile

**Color Scheme**:
- Background: `bg-white/10 backdrop-blur-xl border-b border-white/20`
- Logo Container: `bg-gradient-to-r from-blue-500 to-purple-600`
- Search Input: `bg-white/10 border border-white/20`
- Icon Buttons: `text-gray-400 hover:text-white`
- User Dropdown: `bg-white/10 backdrop-blur-xl border border-white/20`
- Notification Badge: `bg-red-500` (3px circle)

**Layout Elements**:
- Logo and title on left
- Centered search bar (max-width: 24rem)
- Actions and profile on right
- Dropdown menu with dividers

### 6. 📋 Sidebar.jsx
**Purpose**: Role-based navigation with collapsible design

**Color Scheme**:
- Background: `bg-white/5 backdrop-blur-xl border-r border-white/20`
- Menu Items: `text-gray-400 hover:text-white hover:bg-white/10`
- Active Item: `bg-blue-500/20 text-blue-300 border border-blue-500/30`
- Dark Mode Toggle: `bg-blue-500` (active state)
- Status Indicator: `bg-green-500/10 border border-green-500/20`
- Online Dot: `bg-green-500 animate-pulse`

**Navigation States**:
- Collapsed: `w-16` (64px width)
- Expanded: `w-64` (256px width)
- Transition: `transition-all duration-300`

### 7. 📊 Chart Components

#### LineChart.jsx (Sentiment Trends)
**Color Palette**:
- Negative Line: `#EF4444` (Red)
- Neutral Line: `#F59E0B` (Yellow)
- Positive Line: `#10B981` (Green)
- Grid Lines: `rgba(255,255,255,0.1)`
- Axis Text: `rgba(255,255,255,0.6)`
- Tooltip: `bg-gray-900/90 backdrop-blur-xl border border-white/20`

#### PieChart.jsx (Sentiment Distribution)
**Color Mapping**:
- Positive: `#10B981` (Green)
- Negative: `#EF4444` (Red)
- Neutral: `#F59E0B` (Yellow)
- Labels: White text with percentage
- Legend: Color-matched text

#### BarChart.jsx (Platform Comparison)
**Stacked Colors**:
- Positive (bottom): `#10B981` (Green)
- Neutral (middle): `#F59E0B` (Yellow)
- Negative (top): `#EF4444` (Red, rounded corners)
- Grid: `rgba(255,255,255,0.1)`

---

## 🎯 Responsive Design Breakpoints

### Mobile (< 768px)
- Single column layout
- Collapsed sidebar by default
- Stacked stats cards
- Horizontal scroll for tables

### Tablet (768px - 1024px)
- 2-column stats grid
- Sidebar remains expanded
- Charts stack vertically

### Desktop (> 1024px)
- Full 4-column stats layout
- Side-by-side chart layout
- All interactive elements visible

---

## 🔄 Interactive States & Animations

### Hover Effects
- Cards: `hover:bg-white/15 transition-all duration-300`
- Buttons: `hover:bg-blue-600 transition-colors`
- Icons: `hover:scale-110 transition-transform duration-200`

### Focus States
- Inputs: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`
- Buttons: `focus:outline-none focus:ring-2 focus:ring-blue-500`

### Loading States
- Spinner: Blue gradient rotation
- Skeleton: Pulsing gray placeholders
- Disabled: 50% opacity with cursor-not-allowed

---

## 🎨 Usage Guidelines

### Color Usage Rules
1. **Primary Blue/Purple**: Brand elements, CTAs, active states
2. **Green**: Success, positive sentiment, completed actions
3. **Red**: Errors, negative sentiment, urgent items
4. **Yellow**: Warnings, neutral sentiment, pending states
5. **Gray Scale**: Text hierarchy, borders, backgrounds

### Accessibility Considerations
- Minimum contrast ratio: 4.5:1 for normal text
- Color is not the only indicator of state
- Focus indicators are clearly visible
- Text remains readable at 200% zoom

### Component Reusability
- All components use consistent spacing tokens
- Color classes are semantic, not hardcoded
- Responsive patterns are standardized
- Animation durations are consistent

---

This design system ensures visual consistency, accessibility, and maintainability across the entire Sentily dashboard application.