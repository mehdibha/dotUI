const plugin = require("tailwindcss/plugin");

const autoContrast = plugin(function ({ addBase }) {
  addBase({
    ":root": {
      "--on-danger-400": "black",
    },
  });
});

module.exports = autoContrast;
