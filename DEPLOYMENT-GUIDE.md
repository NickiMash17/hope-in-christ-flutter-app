# 📱 Hope In Christ - Deployment & Maintenance Guide

## 🚀 Deployment Options

### Option 1: Deploy to App Stores (iOS & Android)

#### **Prerequisites**
1. Create an Expo account: https://expo.dev/signup
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `eas login`

#### **Initial Setup**
```bash
# Initialize EAS in your project
eas build:configure

# This creates eas.json configuration file
```

#### **Build for iOS (App Store)**
```bash
# First build (development)
eas build --platform ios --profile development

# Production build for App Store
eas build --platform ios --profile production
```

**Requirements:**
- Apple Developer Account ($99/year)
- App Store Connect access
- Certificates & provisioning profiles (EAS handles automatically)

#### **Build for Android (Google Play)**
```bash
# First build (development)
eas build --platform android --profile development

# Production build for Play Store
eas build --platform android --profile production
```

**Requirements:**
- Google Play Developer Account ($25 one-time fee)
- App signing key (EAS handles automatically)

#### **Submit to App Stores**
```bash
# Submit to Apple App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

---

### Option 2: Expo Go (Quick Testing - Not for Production)

Users can download **Expo Go** app and scan your QR code:
```bash
npm start
```
- **Pros:** Instant access, no app store approval
- **Cons:** Limited features, requires Expo Go app, not professional

---

### Option 3: Web Deployment (Optional)

Deploy as a Progressive Web App:

```bash
# Build for web
npx expo export --platform web

# Deploy to hosting services:
# - Vercel: vercel deploy
# - Netlify: netlify deploy
# - GitHub Pages
```

---

## 🔄 **Maintaining the App While Users Use It**

### ✨ **Over-The-Air (OTA) Updates - THE MAGIC!**

This is Expo's superpower - **update your app instantly without app store resubmission!**

#### **What Can Be Updated via OTA:**
✅ JavaScript code changes
✅ React components
✅ New sermons/events data
✅ UI/UX improvements
✅ Bug fixes
✅ Text changes
✅ Colors and styles

#### **What CANNOT Be Updated via OTA:**
❌ Native code changes (new libraries)
❌ App icon or splash screen
❌ Permissions (camera, location, etc.)
❌ Expo SDK version changes

---

### 📤 **How to Push OTA Updates**

#### **Method 1: EAS Update (Recommended)**

1. **Make your changes** (add new sermons, fix bugs, etc.)

2. **Publish the update:**
```bash
eas update --branch production --message "Added 5 new sermons"
```

3. **Users get updates automatically!**
   - Next time they open the app
   - Or when they reload
   - Usually within minutes!

#### **Method 2: Classic Expo Publish**

```bash
# Publish update
expo publish

# Or with specific release channel
expo publish --release-channel production
```

---

## 🛠️ **Maintenance Workflow**

### **Adding New Sermons (Common Task)**

1. **Extract new sermon links from Twitter:**
   - Open browser, go to https://x.com/HicfanMin
   - Open browser console (F12)
   - Run the script from `extract-twitter-links.js`
   - Get the links

2. **Update the app:**
   ```bash
   # Edit lib/ministry-data.ts
   # Add new sermons with the Twitter links
   
   # Test locally
   npm start
   ```

3. **Push update to users:**
   ```bash
   # Commit changes
   git add .
   git commit -m "Add new sermons from Feb 24-25"
   git push
   
   # Send OTA update to users
   eas update --branch production --message "New sermons added"
   ```

4. **Done!** Users get new sermons within minutes! 🎉

---

### **Weekly Maintenance Checklist**

📅 **Every Sunday After Service:**
- [ ] Extract new sermon audio link from Twitter
- [ ] Add to `lib/ministry-data.ts`
- [ ] Push OTA update
- [ ] Verify update in app

📅 **Monthly:**
- [ ] Review and update events
- [ ] Check for outdated content
- [ ] Update ministry stats on home screen
- [ ] Test app on different devices

📅 **As Needed:**
- [ ] Fix bugs reported by users
- [ ] Update contact information
- [ ] Add new features
- [ ] Update social media links

---

## 🎯 **Quick Update Commands**

### **Emergency Bug Fix:**
```bash
# 1. Fix the bug in code
# 2. Test locally
npm start

# 3. Push update immediately
eas update --branch production --message "Fixed sermon playback issue"
```

### **Add New Sermons:**
```bash
# 1. Update ministry-data.ts
# 2. Push OTA update
eas update --branch production --message "Added 3 new sermons"
```

### **Update App Store Build (Rare):**
```bash
# Only needed for native changes
eas build --platform all --profile production
eas submit --platform all
```

---

## 📊 **Monitoring & Analytics**

### **Check Update Status:**
```bash
# See all published updates
eas update:list

# View specific update
eas update:view [update-id]
```

### **User Analytics (Optional):**
Consider adding:
- Firebase Analytics
- Expo Analytics
- Sentry for error tracking

---

## 💡 **Best Practices**

### **1. Version Control**
Always commit before pushing updates:
```bash
git add .
git commit -m "Description of changes"
git push
```

### **2. Testing**
Test changes locally before pushing:
```bash
npm start
# Test on your device via Expo Go or emulator
```

### **3. Update Messages**
Use descriptive messages:
```bash
# Good
eas update --message "Added 5 new sermons from Feb 2026"

# Bad
eas update --message "update"
```

### **4. Staging Environment**
Create separate branches for testing:
```bash
# Development updates
eas update --branch development

# Production updates (for users)
eas update --branch production
```

---

## 🚨 **Troubleshooting**

### **Users Not Getting Updates?**
1. Check internet connection
2. Force close and reopen app
3. Check update was published: `eas update:list`

### **App Store Rejection?**
- Review Apple/Google guidelines
- Ensure all metadata is complete
- Test thoroughly before submission

### **Build Failures?**
```bash
# Clear cache and rebuild
eas build --clear-cache --platform [ios|android]
```

---

## 📞 **Support & Resources**

- **Expo Documentation:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Update:** https://docs.expo.dev/eas-update/introduction/
- **Expo Forums:** https://forums.expo.dev/
- **Discord:** https://chat.expo.dev/

---

## 🎉 **Quick Start Deployment**

**First Time Setup:**
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure project
eas build:configure

# 4. Build for both platforms
eas build --platform all --profile production

# 5. Submit to stores
eas submit --platform all
```

**Regular Updates (Most Common):**
```bash
# Make changes to code/sermons/events
# Then push OTA update:
eas update --branch production --message "Your update message"
```

**That's it!** Your users get updates automatically! 🚀

---

## 💰 **Costs**

### **Free Tier:**
- Unlimited OTA updates ✅
- Web hosting ✅
- Development builds ✅

### **Paid Plans:**
- **EAS Build:** $29-99/month (for production builds)
- **Apple Developer:** $99/year (required for iOS)
- **Google Play:** $25 one-time (required for Android)

### **Alternative (Free):**
- Build locally with `npx expo run:ios` and `npx expo run:android`
- Manual submission to app stores
- Still get free OTA updates!

---

## ✅ **Recommended Setup for Hope In Christ**

1. **Start with Web + OTA Updates** (Free, instant)
2. **Add Android to Google Play** ($25 one-time)
3. **Add iOS to App Store** ($99/year)
4. **Use EAS Updates** for all content changes (Free!)

This way, you can update sermons, events, and content **instantly** without waiting for app store approval! 🙌

