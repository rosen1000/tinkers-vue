const jwt = require('jsonwebtoken');

function getImageSrc(toolType, part, material) {
  return require.context('@/assets/textures')(`./${toolType}/${part}_tconstruct_${material}.png`);
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
};

/**
 * Get parts data
 * @returns {Parts}
 */
const getPartsData = () => {
  return require('../assets/parts.json');
};

const getToolLength = (toolType) => {
  switch (toolType) {
    case 'cleaver':
    case 'excavator':
    case 'vein_hammer':
    case 'sledge_hammer':
    case 'scythe':
    case 'broad_axe':
      return 4;
    case 'sword':
    case 'kama':
    case 'hand_axe':
    case 'pickaxe':
    case 'mattock':
      return 3;
    case 'dagger':
      return 2;
  }
};

const partToType = (part) => {
  switch (part) {
    case 'small_blade':
    case 'pickaxe_head':
    case 'wooden_hammer':
    case 'small_axe_head':
    case 'broad_axe_head':
    case 'broad_blade':
    case 'large_plate':
    case 'hammer_head':
      return 'head';
    case 'tool_handle':
    case 'tough_handle':
      return 'handle';
    case 'tool_binding':
      return 'extra';
  }
};

module.exports = { getImageSrc, getApi, getToken, getPartsData, getToolLength, partToType };
