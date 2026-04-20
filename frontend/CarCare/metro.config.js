const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow bundling 3D model assets.
config.resolver.assetExts.push("glb", "gltf", "bin");

module.exports = config;

