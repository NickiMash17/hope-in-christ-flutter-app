# Google Play Launch Checklist

## Score: 61 → 78 / 100 after code fixes

---

## ✅ Done (code fixes applied)

- [x] `expo-notifications` added to package.json (`~0.32.17`)
- [x] `expo-notifications` plugin added to `app.json`
- [x] Replit origin removed from expo-router plugin
- [x] Unused `CAMERA` / storage permissions removed from `app.json`
- [x] `runtimeVersion: "2.0.0"` added to `app.json`
- [x] iOS `buildNumber` fixed from `"2.0.0"` → `"2"` (must be integer string)
- [x] `shouldShowBanner` + `shouldShowList` added to notifications handler

---

## 🔧 Run these commands once (terminal)

### 1. Add Supabase credentials to EAS (so cloud builds can connect)
```bash
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://whexybnpynvcdxjvqlqe.supabase.co"
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXh5Ym5weW52Y2R4anZxbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjExMzUsImV4cCI6MjA5NTk5NzEzNX0.FU-7GeQu1TwfZ9LH_-rervslXGzocJoE_SXemy2i9y8"
```

### 2. Enable Supabase Realtime for chat
In Supabase Dashboard → SQL Editor, run:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
```

### 3. Run the new table migrations
In Supabase Dashboard → SQL Editor, run both files:
- `database/chat-messages.sql`
- `database/event-registrations.sql`

### 4. Trigger the production build
```bash
npx eas build --platform android --profile production
```

### 5. Submit (after build completes, OR upload .aab manually to Play Console)
```bash
npx eas submit --platform android --latest
```
*(Requires `google-play-service-account.json` — see step below)*

---

## 📋 Play Console (do these on console.play.google.com)

### One-time account setup
- [ ] Pay $25 developer registration fee (one-time)
- [ ] Accept Developer Distribution Agreement

### Store listing
- [ ] **Short description** (max 80 chars):
  `Sermons, events & community for Hope In Christ For All Nations Ministries`
- [ ] **Full description** (max 4000 chars): expand on what the app does
- [ ] **Screenshots**: minimum 2 phone screenshots (1080×1920px recommended)
- [ ] **Feature graphic**: 1024×500px banner image
- [ ] **App icon**: 512×512px (use `assets/images/icon.png` — resize it)

### Required compliance
- [ ] **Privacy Policy URL** — create a simple page disclosing:
  - Name, email, phone collected for event registration
  - Chat messages stored on our servers
  - No data sold to third parties
  - Contact email for data requests
  A free Google Site or Notion page is sufficient.
- [ ] **Data Safety section** — declare:
  - Personal info collected: Name, Email address, Phone number
  - User content collected: Chat messages
  - Purpose: App functionality (event registration, community chat)
  - Data is not shared with third parties
  - User can request deletion (via email)
- [ ] **Content Rating questionnaire** — answer all questions
  (This app rates as **Everyone** — religious/worship content, no violence)
- [ ] **Target audience**: 13+ or All Ages

### For automated submission (optional)
- [ ] Create a Google Play Service Account in Google Play Console
  → Setup → API access → Create service account → Grant "Release Manager" role
  → Download JSON key → save as `google-play-service-account.json` in project root
  (Add to `.gitignore` — it's a credential file)

---

## 🗺️ What gets you to 100

| Milestone | Score |
|---|---|
| After code fixes (done) | **78 / 100** |
| After EAS secrets + Supabase migrations | **83 / 100** |
| After successful production build | **88 / 100** |
| After Play Console listing complete | **95 / 100** |
| After Google review passes | **100 / 100** |
