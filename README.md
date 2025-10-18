# SafeBite - Smart Food Allergen Scanner

**SafeBite** is a mobile app created for entry into the TICTA 2025 competition. It uses AI to scan food menus and identify potential allergens, helping people with food allergies make safer dining decisions.

## 🌟 Features

- **📸 Smart Menu Scanning**: Point camera at menus for instant analysis
- **🤖 AI-Powered Analysis**: Uses Google Gemini AI to detect ingredients and allergens
- **⚠️ Allergen Detection**: Personalized alerts based on your allergy profile
- **📊 Comprehensive Results**: Detailed breakdown of ingredients and allergens
- **🗂️ History Tracking**: Save and review your menu analysis history
- **🌍 Multi-language Support**: English and Thai

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+) or Bun
- Expo CLI
- Google Gemini API key

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/Th4phat/SafeBite.git
   cd safebite
   npm install # or bun install
   ```

2. **Set up environment**
   Create `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start development**
   ```bash
   npm start
   npm run android  # or npm run ios / npm run web
   ```

## 🛠️ Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform
- **TypeScript** - Type-safe development
- **Google Gemini AI** - Menu analysis
- **AsyncStorage** - Local data persistence
- **i18n-js** - Internationalization

## 📱 Platform Support

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phones & Tablets)
- ✅ Web

## 📁 Key Components

- **Camera Scanner** (`app/(tabs)/camera.tsx`) - Menu scanning interface
- **Analysis Results** (`components/Analysis.tsx`) - Results display
- **Allergy Profile** (`app/(tabs)/explore.tsx`) - User profile management
- **History** (`app/history.tsx`) - Analysis history tracking

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### App Details
- **Name**: SafeBite
- **Bundle ID**: com.safebite.app
- **Version**: 1.0.0
- **Orientation**: Portrait

## 🚀 Building for Production

```bash
# Using Expo EAS Build
npm install -g eas-cli
eas login
eas build --platform android  # or ios
```

## 📊 Data Storage

All data is stored locally on the device:
- **Analysis History**: Scanned menus and results
- **User Profile**: Allergens, preferences, emergency contacts
- **Settings**: Language and app preferences

## 🔒 Privacy

- All data stored locally (no cloud storage)
- No personal information sent externally
- Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## 📄 License
MIT License - see LICENSE file for details.

