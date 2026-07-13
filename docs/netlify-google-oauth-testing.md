# Netlify + Google OAuth Testing

This repo deploys the Next.js app from `frontend/`.

The root [netlify.toml](/c:/Users/ezrab/OneDrive/Desktop/GitHub/LingoLM/netlify.toml) tells Netlify to:

- use `frontend` as the build base
- run `npm run build`
- deploy the generated Next.js output

## 1. Local test

Create `frontend/.env.local`:

```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
POST_LOGIN_REDIRECT=/
POST_LOGOUT_REDIRECT=/
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Do not set `AUTH_CALLBACK_URL` unless you specifically want to force one callback host.

Run:

```bash
cd frontend
npm install
npm run dev
```

Google OAuth client authorized redirect URIs for local testing:

- `http://localhost:3000/api/auth/callback`

## 2. Netlify branch deploy for shared testing

Use one stable branch deploy first instead of PR previews.

Recommended branch:

- `development`

Branch deploy URLs on Netlify use the branch name as a prefix, for example:

- `https://development--your-site-name.netlify.app`

Google requires the `redirect_uri` to exactly match an authorized redirect URI, so add this exact callback URL to the Google OAuth client:

- `https://development--your-site-name.netlify.app/api/auth/callback`

In Netlify:

1. Create the site from the `CoderHub101/LingoLM` repo in the CoderHub team.
2. Confirm the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Enable branch deploys for `development`.
4. Add environment variables for the site:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `POST_LOGIN_REDIRECT=/`
   - `POST_LOGOUT_REDIRECT=/`
   - `NEXT_PUBLIC_API_URL=https://development--your-site-name.netlify.app/api`
5. Leave `AUTH_CALLBACK_URL` unset unless you want to pin one exact deployed host.
6. Trigger a deploy of the `development` branch.

## 3. Production deploy

When production is ready, add the production callback URL to the same Google OAuth client or to a separate production client:

- `https://your-site-name.netlify.app/api/auth/callback`

If you use a custom domain, also add:

- `https://your-domain.com/api/auth/callback`

For the production Netlify site, set:

- `NEXT_PUBLIC_API_URL=https://your-site-name.netlify.app/api`

## 4. Test checklist

On each environment:

1. Open `/`.
2. Click `Sign in with Google`.
3. Sign in with a Google account.
4. Confirm Google redirects back to `/api/auth/callback`.
5. Confirm the homepage shows:
   - signed-in state
   - email
   - OpenID
6. Refresh the page and confirm the session remains.
7. Click `Log out`.
8. Confirm the session clears and the nav returns to signed-out state.

## 5. Allowing other users to test

This app only requests basic identity scopes: `openid`, `email`, and `profile`.

Google's current OAuth app state guidance says that for an external app in **Testing**, apps using only these basic identity scopes can be accessed by any user without being added to the test-user allowlist. Users may still see Google's testing warning UI.

If you want the cleanest public experience later, move the OAuth consent screen to a published production state and complete any branding steps Google asks for.

## 6. Important limitation for preview URLs

Google OAuth redirect URIs do **not** support a wildcard like `https://*.netlify.app/api/auth/callback`.

That means:

- a stable branch deploy such as `development--your-site-name.netlify.app` is practical
- one production site URL is practical
- PR preview URLs are awkward for Google OAuth unless you register each exact preview callback URL individually

For shared testing, use a stable branch deploy rather than deploy previews.
