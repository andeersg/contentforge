const striptags = require('striptags');

function generateExcerpt(input, length = 80) {
  let stripped = striptags(input);

  if (stripped.includes('.')) {
    stripped =findSentencesInsideLimit(stripped, length);
  }

  if (stripped.length > length) {
    stripped = stripped.substr(0, length);
  }

  return stripped;
}

function findSentencesInsideLimit(input, limit) {
  const dotIndex = findDotBefore(input, input.length, limit);
  
  return input.substr(0, dotIndex + 1);
}

function findDotBefore(input, prevIndex, limit) {
  const dotIndex = input.lastIndexOf('.', prevIndex);

  if (dotIndex > limit) {
    return findDotBefore(input, dotIndex - 1, limit);
  }
  return dotIndex;
}

module.exports = generateExcerpt;