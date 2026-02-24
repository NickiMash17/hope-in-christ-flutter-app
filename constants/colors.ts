const Colors = {
  // Official Ministry Colors
  primary: '#5B2C8E',        // Royal Purple
  primaryLight: '#7B4BAE',    // Light Purple
  primaryDark: '#3D1A6E',     // Deep Purple
  accent: '#C0392B',          // Ministry Red
  accentLight: '#E74C3C',     // Light Red
  accentDark: '#922B21',      // Dark Red
  accentBlue: '#2471A3',      // Ministry Blue
  accentBlueLight: '#3498DB', // Light Blue
  accentBlueDark: '#1A5276',  // Deep Blue
  
  // Premium Accent Colors
  gold: '#D4A017',            // Gold for special occasions
  goldLight: '#F0D060',       // Light Gold
  goldDark: '#B8860B',        // Dark Gold
  
  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gradients
  gradients: {
    primary: ['#5B2C8E', '#7B4BAE', '#9B6DD7'],
    accent: ['#C0392B', '#E74C3C', '#EC7063'],
    blue: ['#2471A3', '#3498DB', '#5DADE2'],
    gold: ['#D4A017', '#F0D060', '#F4D03F'],
    hero: ['rgba(91,44,142,0.85)', 'rgba(192,57,43,0.90)', 'rgba(36,113,163,0.95)'],
    glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  },
  
  // Glass morphism effects
  glass: {
    light: {
      background: 'rgba(255,255,255,0.8)',
      border: 'rgba(255,255,255,0.3)',
    },
    dark: {
      background: 'rgba(34,34,46,0.8)',
      border: 'rgba(255,255,255,0.1)',
    },
  },
  
  // Shadow effects
  shadow: {
    light: {
      color: '#000000',
      opacity: 0.1,
      offset: { width: 0, height: 4 },
      radius: 6,
    },
    dark: {
      color: '#000000',
      opacity: 0.3,
      offset: { width: 0, height: 4 },
      radius: 8,
    },
  },
  
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Enhanced theme colors
  backgroundLight: '#F8F6FB',
  backgroundDark: '#0D0D12',
  surfaceDark: '#1A1A24',
  cardDark: '#22222E',
  textDark: '#E8E6ED',
  textMutedDark: '#9894A0',
  
  light: {
    text: '#1A1A2E',
    textSecondary: '#5A5A6E',
    background: '#F8F6FB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    tint: '#5B2C8E',
    tabIconDefault: '#9E9E9E',
    tabIconSelected: '#5B2C8E',
    border: '#E8E4EE',
    shadow: 'rgba(0,0,0,0.1)',
    glass: 'rgba(255,255,255,0.8)',
  },
  dark: {
    text: '#E8E6ED',
    textSecondary: '#9894A0',
    background: '#0D0D12',
    surface: '#1A1A24',
    card: '#22222E',
    tint: '#9B6DD7',
    tabIconDefault: '#5A5A6E',
    tabIconSelected: '#9B6DD7',
    border: '#2A2A3A',
    shadow: 'rgba(0,0,0,0.3)',
    glass: 'rgba(34,34,46,0.8)',
  },
};

export default Colors;
