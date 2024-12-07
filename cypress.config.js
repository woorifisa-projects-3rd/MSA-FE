const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Next.js 개발 서버 URL
    setupNodeEvents(on, config) {
      // implement node event listeners here (필요하면 추가)
    },
  },
});
