# Global UI Component Reusability & Zero-Duplication Rule

## 1. Core Principle

Maintain a **clean, modular, highly reusable, and scalable UI architecture** throughout the entire FindnSeekh project.

Code duplication must be avoided at all costs, especially when developing UI components.

Before creating any new UI component, always inspect the existing project structure and identify whether a similar or equivalent component already exists.

**Never create a duplicate component when an existing reusable component can fulfill the requirement.**

## 2. Mandatory Component Reusability Rules

Follow these rules whenever creating, modifying, or implementing UI components:

1. **Check Before Creating:** Before creating a new UI component, thoroughly inspect the existing global/shared components directory.

2. **Reuse Existing Components:** If a suitable component already exists globally, reuse it instead of creating another implementation.

3. **Promote Before Duplicating:** If a required component already exists within a feature-specific module but is needed by multiple modules, evaluate whether it should be extracted into the global/shared component directory. Refactor it into a reusable global component when appropriate, then reuse it wherever required.

4. **Global Component First:** If a required component does not exist anywhere in the project, create it in the appropriate global/shared components directory first, provided it has genuine reuse potential. Then use it in the relevant feature.

5. **No Feature-Level Duplicates:** Do not independently recreate globally available components inside individual feature modules.

6. **Extend Instead of Duplicating:** If an existing component lacks a required feature, extend its functionality through configurable properties rather than creating a separate component with nearly identical functionality.

## 3. Highly Customizable Component Architecture

Every shared UI component must be designed with maximum practical flexibility and customization in mind.

Components should support configurable properties wherever relevant, including:

- Width and height.
- Padding and margin.
- Background and foreground colors.
- Border radius and border properties.
- Typography (font size, weight, family, and color).
- Icons and icon positioning.
- Loading, disabled, and error states.
- Alignment and positioning.
- Optional prefixes and suffixes.
- Callbacks and interaction handlers.
- Animations and transitions.
- Responsive behavior.
- Custom child widgets or content slots.
- Optional visibility and styling configurations.

These properties should be implemented only when relevant to the component. Avoid unnecessarily complicating simple components.

**Important:** Components must have sensible default values so they can be used without passing every customization property.

## 4. Global Component Organization

Keep all genuinely reusable UI components in a centralized global/shared directory.

Organize components logically by their responsibilities rather than placing everything into a single file or folder:

```text
src/app/
├── core/
│   ├── config/
│   ├── constants/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
│
├── shared/
│   ├── components/
│   │   ├── button/
│   │   ├── combo-field/
│   │   ├── custom-close-outlined-button/
│   │   ├── custom-modal/
│   │   ├── custom-primary-button/
│   │   ├── custom-status-pill/
│   │   ├── custom-textfield/
│   │   ├── loader/
│   │   ├── location-permission-modal/
│   │   ├── logo/
│   │   └── repaint-boundary/
│   ├── directives/
│   ├── models/
│   ├── pipes/
│   └── utils/
│
├── features/
│   ├── auth/
│   ├── home/
│   └── profile/
│
└── layouts/
```

Follow the project's established architecture.

## 5. Component Development Standards

Every reusable component must follow these standards:

- **Single Responsibility Principle**: Each component should have one clearly defined responsibility.
- **Reusability**: Components must not depend unnecessarily on a specific screen or feature.
- **Customizability**: Allow feature-specific styling and behavior through well-designed properties.
- **Maintainability**: Keep implementation clean, readable, and easy to modify.
- **Consistency**: Maintain consistent design patterns throughout the application.
- **Responsiveness**: Components must adapt appropriately to different screen sizes.
- **Type Safety**: Use appropriate types instead of loosely typed parameters.
- **Null Safety**: Handle optional properties and default values safely.
- **Documentation**: Add meaningful documentation for complex or non-obvious component properties.

## 6. Avoid Overengineering

Reusability does not mean making every small widget a global component.

Follow these guidelines:

- Extract components when they have genuine reuse potential.
- Keep highly specific UI elements inside their respective feature modules when they have no meaningful reuse outside that feature.
- Do not introduce unnecessary abstractions.
- Do not create multiple components with slightly different names but identical responsibilities.
- Prefer composition and configuration over inheritance and duplicated implementations.

## 7. Mandatory Workflow Before Every UI Implementation

Before implementing any UI requirement, follow this workflow:

1. Analyze the requested UI.
2. Inspect existing global/shared components.
3. Search feature modules for existing implementations that could be reused.
4. Identify components that can be reused directly.
5. Identify components that require additional configurable properties.
6. Extend existing components where appropriate.
7. Create new global components only when necessary.
8. Implement the requested UI using reusable components.
9. Verify that no unnecessary duplicate components or styles have been introduced.
10. Ensure existing screens and components continue functioning correctly after shared component modifications.

## 8. Refactoring Existing Components

When modifying an existing component:

- Preserve its existing functionality unless a change is explicitly required.
- Avoid breaking existing implementations.
- Check all existing usages before changing its public API.
- Update affected usages when necessary.
- Maintain backward compatibility wherever practical.
- Consolidate duplicate implementations when discovered.
- Do not create another component simply to avoid modifying an existing reusable component.

## 9. Final Non-Negotiable Rules

1. No unnecessary duplicate UI components.
2. No unnecessary duplicated UI styling or business-independent presentation logic.
3. Always inspect before creating.
4. Always reuse existing global components.
5. Promote genuinely reusable feature components to the global/shared layer when appropriate.
6. Extend existing components instead of creating near-identical alternatives.
7. Every shared component must be highly customizable and reusable.
8. Maintain a single source of truth for shared UI elements.
9. Keep the architecture clean, scalable, consistent, and maintainable.
10. Apply these rules to all existing and future UI development.

