/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./assets/**/*.{html,js}"],
    theme: {
        extend: {
            // الألوان الأساسية من التصميم
            colors: {
                primary: {
                    50:  "#f2f6fc", // أفتح درجة
                    100: "#e6edf9",
                    200: "#c0d2ef",
                    300: "#99b7e5",
                    400: "#4d82d2",
                    500: "#1B449C", // اللون الأساسي
                    600: "#183d8c",
                    700: "#13306e",
                    800: "#0e2350",
                    900: "#091633", // أغمق درجة
                    DEFAULT: "#1B449C", // لما تكتب bg-primary
                },
                secondary: {
                    DEFAULT: "#1B449C",
                },
            },

            // الخط
            fontFamily: {
                sans: ["Poppins", "ui-sans-serif", "system-ui"],
            },

            // الظلال
            boxShadow: {
                card: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                hover: "0 4px 15px 0 rgba(59, 130, 246, 0.15)",
            },

            // المسافات للـ RTL
            spacing: {
                "rtl-4": "1rem", // سيتم عكسها تلقائياً
                "rtl-8": "2rem",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-in-out",
                "float-slow": "floatSlow 12s ease-in-out infinite",
                "pulse-soft": "pulseSoft 2.2s ease-in-out infinite",
                'float': 'float 6s ease-in-out infinite',
                'float-reverse': 'float-reverse 8s ease-in-out infinite',
                "slide-in-up":
                    "slide-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
                "slide-out-up":
                    "slide-out-up 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19) both",
                "slide-in-right":
                    "slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
                "slide-in-left":
                    "slide-in-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
                "slide-out-right":
                    "slide-out-right 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19) both",
                "slide-out-left":
                    "slide-out-left 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19) both",
                "scale-in":
                    "scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both",
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(2deg)' }
                },
                'float-reverse': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(-2deg)' }
                },
                "slide-in-up": {
                    "0%": { opacity: "0", transform: "translate3d(0, 100%, 0)" },
                    "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                },
                "slide-out-up": {
                    "0%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                    "100%": { opacity: "0", transform: "translate3d(0, -100%, 0)" },
                },
                "slide-in-right": {
                    "0%": { opacity: "0", transform: "translate3d(100%, 0, 0)" },
                    "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                },
                "slide-in-left": {
                    "0%": { opacity: "0", transform: "translate3d(-100%, 0, 0)" },
                    "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                },
                "slide-out-right": {
                    "0%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                    "100%": { opacity: "0", transform: "translate3d(100%, 0, 0)" },
                },
                "slide-out-left": {
                    "0%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
                    "100%": { opacity: "0", transform: "translate3d(-100%, 0, 0)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
                    "50%": { opacity: "1" },
                    "100%": { opacity: "1", transform: "scale3d(1, 1, 1)" },
                },
            },
        },
    },
    plugins: [
        // Plugin للـ RTL Support
        function ({ addUtilities, addComponents, theme, addVariant }) {
            addVariant("rtl", '[dir="rtl"] &');
            addVariant("ltr", '[dir="ltr"] &');
            // RTL Utilities
            addUtilities({
                ".rtl-flip": {
                    transform: "scaleX(-1)",
                },
                ".ltr-only": {
                    '[dir="rtl"] &': {
                        display: "none",
                    },
                },
                ".rtl-only": {
                    '[dir="ltr"] &': {
                        display: "none",
                    },
                },
                // Margin RTL Support
                ".me-4": {
                    '[dir="ltr"] &': {
                        "margin-right": theme("spacing.4"),
                    },
                    '[dir="rtl"] &': {
                        "margin-left": theme("spacing.4"),
                    },
                },
                ".ms-4": {
                    '[dir="ltr"] &': {
                        "margin-left": theme("spacing.4"),
                    },
                    '[dir="rtl"] &': {
                        "margin-right": theme("spacing.4"),
                    },
                },
                ".pe-4": {
                    '[dir="ltr"] &': {
                        "padding-right": theme("spacing.4"),
                    },
                    '[dir="rtl"] &': {
                        "padding-left": theme("spacing.4"),
                    },
                },
                ".ps-4": {
                    '[dir="ltr"] &': {
                        "padding-left": theme("spacing.4"),
                    },
                    '[dir="rtl"] &': {
                        "padding-right": theme("spacing.4"),
                    },
                },
            });

            // RTL Components
            addComponents({
                ".dropdown-rtl": {
                    '[dir="ltr"] &': {
                        left: "0",
                        right: "auto",
                    },
                    '[dir="rtl"] &': {
                        right: "0",
                        left: "auto",
                    },
                },
                ".dropdown-rtl-right": {
                    '[dir="ltr"] &': {
                        right: "0",
                        left: "auto",
                    },
                    '[dir="rtl"] &': {
                        left: "0",
                        right: "auto",
                    },
                },
                ".arrow-rtl": {
                    '[dir="rtl"] &': {
                        transform: "rotate(180deg)",
                    },
                },
            });
        },
    ],
};
