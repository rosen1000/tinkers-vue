const jwt = require('jsonwebtoken')

function getImageSrc(toolType, part, material) {
  return require.context('@/assets/textures')(
    `./${toolType}/${part}_tconstruct_${material}.png`
  );
}

/**
 * Returns full query string
 * path doesn't need to start with a slash
 * @param {String} path api path to backend
 * @returns query
 */
const getApi = (path) => `http://127.0.0.1:8081/${path}`;

/**
 * Get JWT decoded token
 * @returns {jwt.JwtPayload} token payload
 */
const getToken = () => {
  let token = localStorage.getItem('token');
  return jwt.decode(token);
}

module.exports = { getImageSrc, getApi, getToken };
