module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./public/**/*.html"
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
      },
    },
  };