adekunle_news_automation/
├── app/
│   ├── (dashboard)/
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── news/
│   │   │   └── page.tsx
│   │   ├── posts/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── social/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── categories/
│   │   ├── CategoryManager.tsx
│   │   ├── CountryManager.tsx
│   │   └── FilterRuleManager.tsx
│   ├── dashboard/
│   │   └── StatCard.tsx
│   ├── layout/
│   │   ├── AuthGuard.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── news/
│   │   ├── NewsDetailModal.tsx
│   │   ├── NewsFilters.tsx
│   │   └── NewsRow.tsx
│   ├── posts/
│   │   ├── PostJobLogViewer.tsx
│   │   └── PostJobTable.tsx
│   ├── settings/
│   ├── social/
│   │   ├── AddPlatformDialog.tsx
│   │   ├── AddTelegramChannelDialog.tsx
│   │   ├── PlatformCard.tsx
│   │   └── TelegramChannelCard.tsx
│   └── ui/
│       ├── alert-dialog.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       └── tabs.tsx
├── hooks/
├── lib/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── buffer.ts
│   │   ├── categories.ts
│   │   ├── countries.ts
│   │   ├── filterRules.ts
│   │   ├── news.ts
│   │   ├── platforms.ts
│   │   ├── posts.ts
│   │   ├── settings.ts
│   │   ├── stats.ts
│   │   └── telegram.ts
│   ├── axios.ts
│   ├── types.ts
│   └── utils.ts
├── store/
│   ├── useAuthStore.ts
│   ├── useBufferStore.ts
│   ├── useCategoryStore.ts
│   ├── useCountryStore.ts
│   ├── useFilterRuleStore.ts
│   ├── useNewsStore.ts
│   ├── usePlatformStore.ts
│   ├── usePostJobStore.ts
│   ├── useSettingsStore.ts
│   ├── useStatsStore.ts
│   ├── useTelegramStore.ts
│   └── useUIStore.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
