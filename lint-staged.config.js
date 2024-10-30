module.exports = {
  "./src/**/*.{ts,js}": ["prettier --write", "eslint --fix"],
  "*.md": "prettier --list-different"
};
