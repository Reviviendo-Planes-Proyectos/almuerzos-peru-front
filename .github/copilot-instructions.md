# Copilot Instructions - Almuerzos Perú Frontend

## 🏗️ Architecture Overview

This is an **Angular 18+ PWA** using **standalone components** with **Clean Architecture** principles:

- **Core Layer**: `src/app/core/` - Services, guards, interceptors, and global configs
- **Shared Layer**: `src/app/shared/` - Reusable components, pipes, modules (UI/Business agnostic)
- **Features Layer**: `src/app/features/` - Domain-specific modules (auth, landings, etc.)
- **SSR Ready**: Express server with `@angular/ssr` for production builds

### Key Architectural Patterns

- **Standalone Components**: All components use `standalone: true` with explicit imports
- **Module Aggregation**: Import from `shared/modules` barrel exports for consistency
- **Lazy Loading**: Features load via `loadComponent()` and `loadChildren()`
- **Clean DI**: Services use `providedIn: 'root'` and follow single responsibility

## 📦 Module System

**Always import from shared module barrels for consistency:**

```typescript
// ✅ Correct - Use barrel imports
import { CoreModule, SharedComponentsModule, MaterialModule } from '../../../shared/modules';

// ❌ Avoid - Direct imports break consistency
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/ui/button';
```

**Module Selection Guide:**

- `SharedModule`: For complex pages needing everything (Core + Material + Components)
- `CoreModule`: Angular essentials (CommonModule, ReactiveFormsModule, RouterModule)
- `MaterialModule`: Only Angular Material components
- `SharedComponentsModule`: Only custom components (ButtonComponent, InputFieldComponent, etc.)

## 🧪 Testing Patterns

**Jest Configuration** (`jest.config.js`):

- Uses `@angular-builders/jest` with preset `jest-preset-angular`
- **Mocking Strategy**: Comprehensive mocks in `src/app/testing/pwa-mocks.ts`
- **Coverage Target**: 85% lines/functions/branches/statements

**Essential Test Setup Pattern:**

```typescript
// Standard component test setup
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ComponentName, CoreModule], // Use modules, not individual imports
    providers: [
      { provide: Router, useValue: mockRouter },
      { provide: LoggerService, useValue: mockLogger }
    ],
    schemas: [NO_ERRORS_SCHEMA] // For components with complex child components
  }).compileComponents();
});
```

**PWA Service Testing**: Use `PWA_TEST_PROVIDERS` from testing/pwa-mocks.ts for any PWA-related tests.

## 🔧 Development Workflows

**Essential Commands:**

```bash
npm start                    # Development server (localhost:4200)
npm run build:serve:ssr     # Build + serve SSR (localhost:4000)
npm test                    # Jest unit tests
npm run test:coverage       # Coverage report
npm run test:e2e           # Playwright E2E tests
npm run lint:fix           # Biome linter + auto-fix
```

**Build Targets:**

- **Development**: Client-only, HMR enabled, PWA disabled
- **Production**: SSR + PWA enabled, optimized bundles
- **Service Worker**: Only registers in production (`!isDevMode()`)

## 🎨 UI Component Patterns

**Shared Components** (`src/app/shared/components/`):

- `ButtonComponent`: Consistent styling with variant support
- `InputFieldComponent`: Form inputs with validation display
- `HeaderWithStepsComponent`: Multi-step form headers
- `PwaPromptComponent`: Install prompt with gradient animations

**Usage Pattern:**

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule], // Always use module imports
  template: `
    <app-header-with-steps [currentStep]="3" [totalSteps]="5" />
    <app-input-field [formControl]="emailControl" label="Email" />
  `
})
```

## 🌐 I18n System

**Translation Service** (`src/app/shared/i18n/`):

- **Injection**: Use `useI18n()` utility or inject `I18nService`
- **Pattern**: Components extend `BaseTranslatableComponent` for reactive translations
- **Files**: `messages/es.json` and `messages/en.json`

```typescript
// Component pattern (RECOMMENDED)
export class FeatureComponent extends BaseTranslatableComponent {
  constructor() {
    super(); // Provides this.i18n and this.t() method
  }
}

// Service injection pattern
constructor(private i18n = useI18n()) {}

// Template usage
{{ 'auth.login.title' | t }}
<h1 appTranslate="auth.login.title"></h1>
```

## 📱 PWA Implementation

**Service Architecture:**

- `PwaService`: Install prompts, update detection, platform detection
- **Auto-detection**: Mobile devices, iOS Safari, standalone mode
- **Update Strategy**: Manual activation via `updateApp()` method

**Key PWA Behaviors:**

- **Development**: Service worker disabled, simulated install prompts on localhost
- **Production**: Full PWA with automatic update checks
- **iOS Support**: Manual installation instructions, no automatic prompts

**Testing PWA Features:**

```typescript
// Use the centralized mocks
import { PWA_TEST_PROVIDERS } from '../testing/pwa-mocks';

TestBed.configureTestingModule({
  providers: [...PWA_TEST_PROVIDERS] // Includes SwUpdate, SwPush, Platform mocks
});
```

## 🛡️ Service Patterns

**Core Services** (`src/app/shared/services/`):

- `LoggerService`: Centralized logging with environment-aware debug
- `ApiService`: HTTP client with base URL from environment
- `PwaService`: PWA lifecycle management
- `ScrollService`: Route-based scroll restoration

**DI Pattern:** All services use `{ providedIn: 'root' }` for tree-shaking and consistency.

## 🔄 State Management

**No Global State Library** - Uses Angular patterns:

- **Services**: BehaviorSubjects for shared state
- **Forms**: Reactive forms with FormBuilder
- **Communication**: Service injection + RxJS observables

**Example Service State:**

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly _state = new BehaviorSubject(initialState);
  public readonly state$ = this._state.asObservable();
}
```

## 🧹 Code Quality & Git Workflow

**Critical Quality Rules:**

- **No console.log**: Only use `LoggerService` for logging (enforced by Biome)
- **English commits**: Conventional commits in English infinitive, capitalized
- **Branch naming**: Only `feature/name-example` format allowed
- **Automatic validation**: Husky hooks run on pre-commit, commit-msg, and pre-push

**Git Hooks (Husky):**

```bash
# Pre-commit: Format, lint, test
npm run format && npm run lint:fix && npm run test:ci && npx lint-staged

# Commit-msg: Validate conventional commits + English language
npx commitlint --edit "$1" + custom Spanish/gerund rejection

# Pre-push: Validate branch name format
# Only allows: feature/name-example
```

**Commit Message Examples:**

```bash
✅ feat(auth): Add social login
✅ fix(menu): Fix display bug
✅ chore(deps): Update Angular version

❌ feat(auth): agregar login social    # Spanish rejected
❌ fix(menu): fixing display bug.      # Gerund + period rejected
❌ Feat(auth): Add social login        # Wrong capitalization
```

**Linting Configuration:**

- **Biome**: Primary linter for TS/HTML/SCSS with auto-fix
- **Prettier**: Secondary formatter for HTML/SCSS
- **lint-staged**: Only runs on staged files for performance
- **LoggerService Exception**: Only place where console.\* is allowed

```typescript
// ❌ Never do this anywhere
console.log('debug info');

// ✅ Always use LoggerService
constructor(private logger: LoggerService) {}
this.logger.info('debug info');

// ✅ Only in LoggerService itself
// biome-ignore lint/suspicious/noConsole: Logger centralizado permitido
console[level](message, ...params);
```

## 📚 Documentation Standards

**Key Documentation Files:**

- `/docs/architecture.md`: Clean Architecture implementation details
- `/docs/code-quality.md`: Complete guide to Husky, Biome, commitlint setup
- `/docs/shared-modules-guide.md`: Module barrel import patterns
- `/docs/i18n-guide.md`: Translation system with BaseTranslatableComponent
- `/docs/pwa-application.md`: PWA configuration and capabilities
- `/docs/gitflow-changelog.md`: GitFlow, branching, and versioning strategy

**Technology Stack** (from docs/technologies-used.md):

- **Angular 18.2.13**: Standalone components, SSR, PWA
- **Jest 29.7.0**: Unit testing with 85% coverage target
- **Playwright 1.54.1**: E2E testing across platforms
- **Biome 2.0.6**: Primary linter and formatter
- **Husky 9.1.7**: Git hooks automation
- **Tailwind CSS 3.4.17**: Utility-first CSS framework

## 🚨 Critical Conventions

1. **Never bypass module system** - Always use shared/modules barrel imports
2. **Component Extensions** - Extend `BaseTranslatableComponent` for i18n-aware components
3. **Mock Usage** - Use centralized mocks from `testing/` directory
4. **Route Structure** - Features organize as `features/{domain}/{pages|components|services}`
5. **Service Registration** - All services use `providedIn: 'root'`, never module providers
6. **PWA Testing** - Always test PWA features with production build (`npm run build:serve:ssr`)
7. **Logging** - Never use console.\* directly, always inject and use `LoggerService`
8. **Commits** - English only, conventional format, no Spanish/gerunds allowed
9. **Branches** - Only `feature/name-example` format accepted by pre-push hook

## 💻 Angular Development Standards

**Standalone Components Only:**

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent extends BaseTranslatableComponent {
  private readonly service = inject(FeatureService);

  async loadData(): Promise<void> {
    try {
      const data = await this.service.getData();
      this.handleSuccess(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
```

**Dependency Injection Best Practices:**

- Use `inject()` function over constructor injection when possible
- All services must use `providedIn: 'root'`
- Never use module providers
- Follow Angular's official DI guidelines

**TypeScript Patterns:**

- Always use `async/await` over callbacks or nested promises
- Explicit typing for all public methods and properties
- No `any` types - use proper interfaces or union types
- Prefer `readonly` for immutable properties

**Component Architecture:**

- Extend `BaseTranslatableComponent` for i18n functionality
- Use reactive forms with proper validation
- Implement OnDestroy for subscription cleanup
- Follow SOLID principles in component design

## 🏗️ Code Quality Standards

**Clean Code Principles:**

- No comments in code - code should be self-documenting
- Single Responsibility Principle for all classes/methods
- Explicit return types for all public methods
- Descriptive variable and method names

**SOLID Implementation:**

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  async getData(): Promise<FeatureData[]> {
    const response = await firstValueFrom(this.http.get<FeatureData[]>('/api/features'));
    this.logger.info('Data loaded successfully');
    return response;
  }
}
```

**Error Handling:**

- Always use try/catch with async/await
- Centralized error logging via LoggerService
- User-friendly error messages in UI
- No silent failures

## 📱 Mobile & PWA Optimization

**Responsive Design:**

- Mobile-first approach with Tailwind CSS
- Touch-friendly interactive elements (min 44px)
- Safe area support for notched devices
- Optimized viewport configuration

**Performance Best Practices:**

- Lazy loading for all feature modules
- OnPush change detection strategy
- Optimized bundle sizes with tree shaking
- Efficient image loading and caching

**PWA Implementation:**

- Service worker for offline functionality
- App manifest with proper icons and metadata
- Install prompts with user preference respect
- Background sync for critical operations

**Accessibility Standards:**

- ARIA labels for screen readers
- Proper semantic HTML structure
- Keyboard navigation support
- Color contrast compliance

## 🎯 Framework Alignment

**Angular Official Guidelines:**

- Follow Angular Style Guide religiously
- Use Angular CLI schematics for generation
- Implement Angular's recommended folder structure
- Leverage Angular's built-in features (pipes, directives, etc.)

**Biome & Prettier Compliance:**

- All code must pass Biome linting
- Automatic formatting with Prettier
- No manual formatting overrides
- Consistent code style across team

**Testing Requirements:**

- 85% minimum test coverage
- Unit tests for all public methods
- Integration tests for complex workflows
- E2E tests for critical user journeys

## 🔧 Development Workflow

**Code Generation:**

- Provide only necessary code for requirements
- No example code or unnecessary fragments
- Focus on solving specific problems
- Minimal viable implementation approach

**Dependency Management:**

- Avoid unnecessary dependencies
- Use Angular's built-in solutions first
- Evaluate bundle impact before adding libraries
- Regular dependency updates and security audits

**Performance Monitoring:**

- Bundle analysis for size optimization
- Runtime performance profiling
- Memory leak detection and prevention
- Core Web Vitals optimization

## 🔗 Key Integration Points

- **Forms**: ReactiveFormsModule via CoreModule, validated with Angular validators
- **Routing**: Lazy-loaded feature routes with preloading strategy
- **HTTP**: Single ApiService with environment-based configuration
- **Animations**: Angular Animations with BrowserAnimationsModule in tests
- **Material**: Consistent theming via Angular Material with custom Tailwind integration
- **SSR**: Express server with hydration for SEO and performance
- **PWA**: Service worker with offline capabilities and install prompts
- **I18n**: Signal-based reactive translations with BaseTranslatableComponent pattern
