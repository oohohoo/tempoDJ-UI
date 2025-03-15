/**
 * Get the color for a block type
 * @param type Block type (EB, PT, EP, etc.)
 * @returns Color hex code
 */
export const getBlockTypeColor = (type: string): string => {
  switch (type) {
    case "EB":
      return "#10b981"; // emerald/green
    case "PT":
      return "#f97316"; // orange
    case "EP":
      return "#0ea5e9"; // sky blue
    case "ER":
      return "#8b5cf6"; // purple
    case "OP":
      return "#eab308"; // yellow
    case "CL":
      return "#6366f1"; // indigo
    case "QS":
      return "#84cc16"; // lime
    default:
      return "#64748b"; // slate
  }
};

/**
 * Get the color for a bridge type
 * @param type Bridge type (PERFECT, NATURAL, etc.)
 * @returns Color hex code
 */
export const getBridgeTypeColor = (type: string): string => {
  switch (type) {
    case "PERFECT":
      return "#22c55e"; // green
    case "NATURAL":
      return "#3b82f6"; // blue
    case "MODAL":
      return "#a855f7"; // purple
    case "ENERGY":
      return "#f59e0b"; // amber
    case "TENSION":
      return "#ef4444"; // red
    default:
      return "#64748b"; // slate
  }
};

/**
 * Get a human-readable name for a bridge type
 * @param type Bridge type (PERFECT, NATURAL, etc.)
 * @returns Human-readable name
 */
export const getBridgeTypeName = (type: string): string => {
  switch (type) {
    case "PERFECT":
      return "Perfect Match";
    case "NATURAL":
      return "Natural Flow";
    case "MODAL":
      return "Modal Shift";
    case "ENERGY":
      return "Energy Jump";
    case "TENSION":
      return "Tension Bridge";
    default:
      return "Custom Bridge";
  }
};
