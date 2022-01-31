function getImageSrc(toolType, part, material) {
  return require.context('@/assets/textures')(
    `./${toolType}/${part}_tconstruct_${material}.png`
  );
}

module.exports = { getImageSrc };
