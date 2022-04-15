const jwt = require('jsonwebtoken');
const API_ROUTE = process.env.VUE_APP_API_ROUTE;

function getImageSrc(toolType, part, material) {
  let fullPart = part.split('_')[1];
  let numberedPart = +part.split('_').pop();

  try {
    if (!isNaN(numberedPart) && !isBroad(toolType)) {
      if (numberedPart == 1) return require(`../assets/textures/sword/guard_tconstruct_${material}.png`);
      return require(`../assets/textures/sword/handle_tconstruct_${material}.png`);
    }

    if (toolType == 'mattock' && fullPart == 'axe')
      return require(`../assets/textures/mattock/axe_tconstruct_${material}.png`);
    if (toolType == 'mattock' && fullPart == 'head')
      return require(`../assets/textures/mattock/pick_tconstruct_${material}.png`);
    if (toolType == 'dagger' && fullPart == 'handle')
      return require(`../assets/textures/dagger/crossguard_tconstruct_${material}.png`);

    if (toolType == 'kama' && fullPart == 'blade') fullPart = 'head';

    if (!isBroad(toolType)) {
      if (toolType != 'mattock' && ['axe', 'pick'].includes(fullPart)) fullPart = 'head';
      if (fullPart == 'handle') toolType = 'pickaxe';
    }

    if (isBroad(toolType)) {
      if (fullPart == 'blade') fullPart = 'head';
      if (part.startsWith('tough')) fullPart = 'handle';
      if (fullPart == 'plate' && toolType == 'cleaver') fullPart = 'shield';
      if (fullPart == 'axe') fullPart = 'blade';
      if (toolType == 'broad_axe' && fullPart == 'head') fullPart = 'back';

      if (!isNaN(numberedPart)) {
        if (numberedPart == 1) {
          if (fullPart == 'handle' && toolType == 'cleaver') fullPart = 'guard';
          if (fullPart == 'handle' && toolType == 'scythe') fullPart = 'accessory';
          if (fullPart == 'plate' && toolType == 'excavator') fullPart = 'head';
          if (fullPart == 'handle' && toolType == 'excavator') fullPart = 'grip';
          if (fullPart == 'plate') fullPart = 'front';
        } else {
          if (fullPart == 'guard') fullPart = 'handle';
          if (fullPart == 'plate' && toolType == 'excavator') fullPart = 'binding';
          if (fullPart == 'plate') fullPart = 'back';
        }
      }

      if (part == 'pickaxe_head' && toolType == 'vein_hammer') fullPart = 'back';
      if (fullPart == 'plate' && toolType == 'vein_hammer') fullPart = 'front';
    }

    return require(`../assets/textures/${toolType}/${fullPart}_tconstruct_${material}.png`);
  } catch (e) {
    console.error(e.message);
  }
}

const isBroad = (item) => {
  return ['cleaver', 'broad_axe', 'scythe', 'excavator', 'sledge_hammer', 'vein_hammer'].includes(item);
};

/**
 * Returns full query string
 * path doesn't need to start with a slash
 * @param {String} path api path to backend
 * @returns query
 */
const getApi = (path, params) => {
  if (!params) return `${API_ROUTE}/${path}`;
  return `${API_ROUTE}/${path}?${new URLSearchParams(params).toString()}`;
};

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
