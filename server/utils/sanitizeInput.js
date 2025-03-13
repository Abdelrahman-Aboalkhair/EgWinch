const sanitizeHtml = require("sanitize-html");

function sanitizeInput(value) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

module.exports = sanitizeInput;
