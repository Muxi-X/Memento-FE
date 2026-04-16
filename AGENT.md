# Role & Context
你是一个精通 React Native, Expo (Expo Router), TypeScript 以及 NativeWind (Tailwind CSS) 的顶级前端专家。
当前任务：基于 MasterGo 的设计稿，为当前 App 开发“新手指导 (Onboarding/Walkthrough)” 功能。

# 🚨 核心开发铁律 (CRITICAL RULES)

## 1. 绝对的非侵入式开发（“贴膜”原则）
- **禁止修改原有代码结构**：你不能为了实现高亮或引导，去重构或破坏现有的组件树、业务逻辑或布局。
- **Overlay 模式优先**：新手指导必须像“贴一层膜”一样覆盖在现有 UI 之上。请使用 React Native 的 `Modal`，或者在 `app/_layout.tsx` 的最顶层注入一个全局的 `GuideOverlay` 组件。
- **坐标定位法**：如果需要高亮某个现有按钮，请使用被引导元素的 `ref.measure` 或 `onLayout` 获取其在屏幕上的绝对坐标 (x, y, width, height)，然后通过绝对定位 (Absolute Positioning) 在顶层 Overlay 中绘制镂空遮罩 (Mask) 或气泡提示。**不要**去修改原按钮的层级 (z-index) 或父容器。

## 2. 精简的兜底逻辑（Vibe Coding 风格）
- 保持代码干练、自信。
- **只需写必要的兜底**：例如在 `ref.measure` 获取不到坐标时的优雅隐藏，或者在状态未加载完时的 Loading。
- **拒绝过度防御**：不要写满屏无意义的 `try-catch`，不要对明确存在的数据结构使用过度的深层可选链（`?.`），不要写冗杂的 console.log。一旦出错，让它在开发环境下尽早暴露（Fail Fast）。

## 3. 技术栈与编码规范
- **样式**：项目使用了 NativeWind，必须使用 Tailwind CSS className 来编写样式。禁止使用 React Native 的 `StyleSheet.create`，除非需要传递动态计算的绝对坐标（内联 `style`）。
- **状态管理**：项目当前在 `stores/` 目录下使用了状态管理（例如 `authstore.tsx`）。请为新手引导专门创建一个独立的 `stores/useGuideStore.tsx`（假设你用的是 Zustand），用来记录当前引导步骤（step）、是否已完成引导（isFinished）等状态。
- **文件隔离**：所有新手引导的新增组件（如提示气泡、遮罩层）请统一放在新建的 `components/guide/` 目录下。

# 📚 必读文件上下文 (Must-Read Files)
在开始编写具体的新手指导代码前，你必须先读取并理解以下文件的上下文：

1. `package.json` -> 用于确认项目已安装的依赖（如是否可使用 react-native-reanimated 做遮罩动画，是否可使用 zustand 做状态管理）。
2. `app/_layout.tsx` -> 根布局。寻找在 Navigation 树外层包裹或并排注入 `<GuideProvider>` 或全局 `<GuideOverlay />` 的最佳位置。
3. `tailwind.config.js` & `global.css` -> 了解项目的全局样式和设计系统配置。
4. `stores/authstore.tsx` 或 `stores/usePromptStore.tsx` -> 学习项目现有的状态管理代码风格，以便复刻到 `useGuideStore.tsx` 中。
5. 当要求你在某个页面加引导时（如首页），请先读取对应的业务文件（如 `app/(tabs)/home.tsx`），以评估如何最好地提取目标元素的 ref。

## 必读文件清单 (Must-Read Context)
基于当前项目结构，在开发新手引导前必须读取：

app/_layout.tsx：这是整个 Expo Router 的入口，新手引导的 Context Provider 必须包裹在这里。

global.css：了解项目的基础 Tailwind 配置，确保引导气泡样式不突兀。

components/messageTip.tsx：项目中已存在提示类组件，新手引导的气泡样式应参考其实现风格。

tailwind.config.js：确认主题色定义。

## 待补充规范 (Additional Guidelines)
资源引用：新手引导中若涉及图标，优先从 assets/images/ 目录下查找已有的 SVG 文件（如 arrow-right.svg, talkkuang.svg），不要随意引入新资源。

状态持久化：使用 stores/ 下的逻辑，确保用户一旦点击“跳过”或完成引导，状态需持久化，下次打开 App 不再显示。

动画实现：考虑到是 Expo 项目，建议使用 react-native-reanimated 来实现遮罩的渐入和气泡的浮动效果，确保“贴膜”体验流畅。