# Wire Room — News Automation Dashboard (Next.js frontend)

Next.js 14 (App Router) + TypeScript + Tailwind + shadcn-style components + Zustand + Axios,
built against your Django/DRF backend.

## 1. One required backend change

Your `api/urls.py` has no JWT **refresh** endpoint, so once the 5-minute-default access
token expires, users get logged out instead of silently refreshed. Add this to
`core/urls.py` (or `api/urls.py`):

```python
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    ...
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

The frontend's Axios interceptor (`lib/axios.ts`) already calls `POST /api/auth/refresh/`
with `{ refresh: <token> }` and expects `{ access: <new_token> }` back — that's SimpleJWT's
default `TokenRefreshView` response shape, so no other backend change is needed.

Optional but recommended, also in `settings.py`, so access tokens don't expire too
aggressively for a dashboard used a few times a day:

```python
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
}
```

## 2. Install & run

```bash
cd frontend
npm install
cp .env.local.example .env.local
# edit .env.local -> NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

Visit http://localhost:3000 — it redirects to `/login`, then to `/dashboard` once
signed in with your Django admin/user credentials.

## 3. What's included

- **`lib/axios.ts`** — single Axios instance. Request interceptor attaches the JWT
  access token; response interceptor catches `401`s, refreshes once (single-flight,
  so concurrent requests don't trigger parallel refreshes), retries the original
  request, and force-logs-out if the refresh itself fails.
- **`lib/api/*.ts`** — one file per DRF resource (news, categories, countries,
  filter-rules, telegram-channels, platforms, posts, stats, settings, auth), typed
  against your serializers in `lib/types.ts`.
- **`store/*.ts`** — one Zustand store per resource. Each store owns its own
  loading state, list/pagination state, and mutations (create/toggle/remove/retry/etc.),
  and shows toast feedback via `sonner` on success/failure.
- **Pages** (`app/(dashboard)/...`):
  - `/dashboard` — live stats, platform success rates, category breakdown, manual
    "fetch news now" trigger.
  - `/news` — paginated feed with category/country/status/search filters, shows
    which platforms each article was already posted to, manual repost.
  - `/categories` — tabs for Categories, Countries, and Filter Rules (include/exclude
    keyword rules applied to incoming articles).
  - `/social` — enable/disable X, Facebook, Instagram + edit their credentials as
    JSON; add/verify/test-post/remove Telegram channels (full add-or-replace flow).
  - `/posts` — post job history with status/platform filters and retry for failed jobs.
  - `/settings` — posting interval, max posts per run, auto-post on/off, hashtags,
    and the post template used when formatting posts.

## 4. Notes on backend shape assumptions

- **Pagination**: `DEFAULT_PAGINATION_CLASS` is `PageNumberPagination` with
  `PAGE_SIZE: 20`, so list endpoints return `{count, next, previous, results}`.
  The frontend's `Pagination` component assumes a fixed page size of 20 — update
  the `PAGE_SIZE` constant in `components/ui/pagination.tsx` if you change it
  server-side.
- **Images**: `News.image` is treated as an absolute URL (DRF's `ImageField`
  returns an absolute URI automatically when `request` is in the serializer
  context, which `ModelViewSet` provides by default).
- **`SocialPlatform.config`**: the serializer exposes this as a free-form
  `DictField`, so the frontend edits it as raw JSON in a dialog. If X/Facebook/
  Instagram end up needing specific credential fields (API key, secret, page ID,
  etc.), it's worth giving each platform its own serializer fields like
  `TelegramChannel` has — happy to build dedicated forms once those fields exist.
- **CORS**: `CORS_ALLOW_ALL_ORIGINS = True` in your settings — fine for
  development. Bearer-token auth (not cookies) is used, so
  `CORS_ALLOW_CREDENTIALS` isn't actually required for this frontend, but it's
  harmless to leave on.

## 5. Suggested next steps

- Add the `TokenRefreshView` route above — without it, sessions won't survive
  past the access token's lifetime.
- Consider adding a `SystemSettings` model (the current `SystemSettingsView`
  derives `posting_interval`/`auto_post_enabled` from `django-celery-beat` but
  hardcodes `max_posts_per_run`, `default_hashtags`, and `post_template` when no
  exception is thrown) so those three fields actually persist.
- Optional: middleware-based route protection (currently the dashboard layout
  guards client-side via `AuthGuard`, which is simplest for a JWT-in-localStorage
  setup but does a one-frame flash before redirecting unauthenticated users).
