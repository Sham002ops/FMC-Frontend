import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
	extend: {
    scrollbar: {
      hide: {
        /* Hide scrollbar for Chrome, Safari and Opera */
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '-ms-overflow-style': 'none', /* IE and Edge */
        'scrollbar-width': 'none',    /* Firefox */
      },
    },
  colors: {
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    gradientStart: "#2B3A67", // Updated to Royal Blue
    gradientEnd: "#2E8B57",   // Updated to Green

    // Theme Colors - Meaningfully defined
    primary: {
      DEFAULT: "#4169E1", // विश्वास - Royal Blue
      foreground: "#FFFFFF", // White text on primary
    },
    secondary: {
      DEFAULT: "#2E8B57", // विकास - Green
      foreground: "#FFFFFF",
    },
    accent: {
      DEFAULT: "#DAA520", // समृद्धी - Gold
      foreground: "#4169E1",
    },
    energy: {
      DEFAULT: "#FFA500", // ऊर्जा - Orange
      foreground: "#FFFFFF"
    },
    clean: {
      DEFAULT: "#FFFFFF", // स्वच्छता - White
      foreground: "#2B3A67"
    },

    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))'
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))'
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))'
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))'
    },
    sidebar: {
      DEFAULT: 'hsl(var(--sidebar-background))',
      foreground: 'hsl(var(--sidebar-foreground))',
      primary: "#2B3A67",
      'primary-foreground': "#FFFFFF",
      accent: "#DAA520",
      'accent-foreground': "#2B3A67",
      border: 'hsl(var(--sidebar-border))',
      ring: 'hsl(var(--sidebar-ring))'
    },

    // Optional: You can keep the "event" color group or adjust to use the above
    'event': {
      'primary': '#2B3A67',   // Replaces purple with Royal Blue
      'secondary': '#2E8B57', // Green
      'accent': '#DAA520',    // Gold
      'light': '#FFFFFF',
      'dark': '#1A1A1A',
    },
  },
  // ... other extensions unchanged
}
  },

  plugins: [tailwindcssAnimate],
} 
