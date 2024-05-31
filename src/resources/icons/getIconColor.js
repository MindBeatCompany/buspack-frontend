export function getIconColor(type) {
  const COLOR_CODES = {
    primaryIcon: "#F28E2A",
    secondaryIcon: "#9a9a9a",
    tenthIcon: "#ffffff",
  };

  const COLOR_DEFAULT = "#9a9a9a";

  return COLOR_CODES[type] || COLOR_DEFAULT;
}
