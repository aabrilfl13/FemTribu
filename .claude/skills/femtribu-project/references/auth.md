# Auth Architecture — Full Reference

## File Tree (`src/auth/`)

```
src/auth/
├── domain/
│   ├── auth.types.ts               — AuthUser, AuthSession, AuthError, OAuthProvider, etc.
│   └── ports/auth-provider.port.ts — AuthProvider interface (the port)
├── providers/supabase/
│   ├── supabase.provider.ts        — SupabaseAuthProvider (implements AuthProvider)
│   └── supabase-client.ts          — createSupabaseBrowserClient / createSupabaseServerClient
├── infrastructure/container.ts     — DI container; exports all auth functions
├── components/GoogleButton.tsx     — React island for Google OAuth sign-in
└── index.ts                        — Public API barrel export
```

## DI Container Exports (`src/auth/infrastructure/container.ts`)
`signUp` · `signIn` · `signOut` · `signInWithOAuth` · `getUser` · `getSession`

## SSR Auth Pages (`prerender = false`)
| Route | File |
| ----- | ---- |
| `/auth/login` | `src/pages/auth/login.astro` |
| `/auth/register` | `src/pages/auth/register.astro` |
| `/auth/callback` | `src/pages/auth/callback.astro` |
| `/auth/logout` | `src/pages/auth/logout.astro` |
| `/perfil` | `src/pages/perfil/index.astro` |

After login → `/perfil` · After logout → `/`

## Config (`src/config/auth.ts`)
Redirect paths and OAuth callback URLs. When adding new OAuth providers or redirect URLs, also update **Supabase dashboard → Authentication → URL Configuration**.

## OAuth (Google)
- Component: `src/auth/components/GoogleButton.tsx` (React island)
- Supabase stores the OAuth session token; no password stored locally
- User can revoke access from their Google account at any time

## Session Storage
Supabase uses cookies for SSR session management (`sb-*-auth-token`). The browser client uses localStorage as fallback. Auth cookies are essential (no consent required).
