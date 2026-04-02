# Supabase Local Development

Quick guide to run Supabase locally for FemTribu development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) installed:
  ```bash
  brew install supabase/tap/supabase
  ```

## Initial Setup

1. **Configure environment variables**
   
   Edit `supabase/.env` with your settings (already configured):
   ```bash
   SITE_URL=http://localhost:4321
   ADDITIONAL_REDIRECT_URLS=http://localhost:4321,http://127.0.0.1:4321
   ```

2. **Start Supabase**
   
   From project root:
   ```bash
   supabase start
   ```
   
   First run takes ~2-5 minutes (downloads Docker images).

3. **Get credentials**
   
   After starting, credentials are displayed. To view them again:
   ```bash
   supabase status
   ```
   
   Or export as env vars:
   ```bash
   supabase status --output env
   ```

## Running Services

### Start Supabase
```bash
supabase start
```

Services available at:
- **Studio UI**: http://127.0.0.1:54323
- **API URL**: http://127.0.0.1:54321
- **DB URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Mailpit** (test emails): http://127.0.0.1:54324

### Stop Supabase
```bash
supabase stop
```

### Restart
```bash
supabase stop && supabase start
```

### Check Status
```bash
supabase status
```

## Database Management

### Reset database
```bash
supabase db reset
```
Drops all data and re-runs migrations + seeds.

### Create migration
```bash
supabase migration new <migration_name>
```
Creates a new SQL migration file in `supabase/migrations/`.

### Apply migrations
Migrations auto-apply on `supabase start` or `supabase db reset`.

## Environment Variables

Your Astro app needs these in `.env.local`:

```bash
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these with:
```bash
supabase status --output env
```

## Common Tasks

### View logs
```bash
supabase logs
```

### Access Postgres directly
```bash
supabase db shell
```

### Link to remote project
```bash
supabase link --project-ref <your-project-ref>
```

### Pull remote schema
```bash
supabase db pull
```

### Generate TypeScript types
```bash
supabase gen types typescript --local > ../src/types/database.types.ts
```

## Testing Email Flows

All emails are caught by Mailpit (no real emails sent):

1. Trigger email in your app (signup, password reset, etc.)
2. View at http://127.0.0.1:54324
3. Check email content and links

## Troubleshooting

### Port already in use
```bash
# Stop Supabase first
supabase stop

# If stuck, kill Docker containers
docker ps | grep supabase
docker stop <container_id>
```

### Docker issues
```bash
# Ensure Docker Desktop is running
docker ps

# Restart Docker Desktop if needed
```

### Reset everything
```bash
supabase stop --no-backup
rm -rf .supabase/
supabase start
```

### Template errors
If you get template path errors, check `config.toml` email template paths are relative to `supabase/` directory (e.g., `./templates/invite.html`).

## File Structure

```
supabase/
├── .env              # Local env vars (gitignored)
├── .env.example      # Template for team
├── config.toml       # Supabase configuration
├── templates/        # Custom email templates
│   ├── invite.html
│   ├── sign_up.html
│   └── password_changed_notification.html
├── migrations/       # SQL migrations (auto-created)
├── seed.sql          # Seed data (optional)
└── README.md         # This file
```

## Resources

- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Self-Hosting Supabase](https://supabase.com/docs/guides/self-hosting)
