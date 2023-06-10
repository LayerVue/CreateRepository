/**
 * @name colorToRGB 转换颜色rgb
 * @param colorCode
 * @returns { r: number; g: number; b: number } | null
 */
function colorToRGB(colorCode: string): { r: number; g: number; b: number } | null {
  let r = 0,
    g = 0,
    b = 0;

  if (colorCode.startsWith('#')) {
    const hex = colorCode.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error('Invalid hex color code');
    }
  } else if (colorCode.startsWith('rgb')) {
    const match = colorCode.match(/(\d+)/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    } else {
      throw new Error('Invalid RGB color code');
    }
  } else if (colorCode.startsWith('hsl')) {
    const match = colorCode.match(/(\d+)/g);
    if (match && match.length >= 3) {
      const h = parseInt(match[0], 10);
      const s = parseInt(match[1], 10) / 100;
      const l = parseInt(match[2], 10) / 100;
      if (s === 0) {
        r = g = b = Math.round(l * 255);
      } else {
        const hueToRgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = Math.round(hueToRgb(p, q, h / 360 + 1 / 3) * 255);
        g = Math.round(hueToRgb(p, q, h / 360) * 255);
        b = Math.round(hueToRgb(p, q, h / 360 - 1 / 3) * 255);
      }
    } else {
      throw new Error('Invalid HSL color code');
    }
  } else {
    throw new Error('Unsupported color code format');
  }

  return { r, g, b };
}

/**
 * @name GradientText 渐变文字
 * @param text
 * @param startColor
 * @param endColor
 * @returns string
 */
function GradientText(text: string, startColor: string, endColor: string) {
  const steps = text.length;
  const startRGB = colorToRGB(startColor);
  const endRGB = colorToRGB(endColor);
  let result = '';

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ratio);
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ratio);
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ratio);

    result += `\x1b[38;2;${r};${g};${b}m${text[i]}\x1b[0m`;
  }

  return result;
}
const colors = {
  /**
   * 重置
   */
  reset: '\x1b[0m',
  /**
   * 加亮
   */
  bright: '\x1b[1m',
  /**
   * 变暗
   */
  dim: '\x1b[2m',
  /**
   * 下划线
   */
  underscore: '\x1b[4m',
  /**
   * 闪烁
   */
  blink: '\x1b[5m',
  /**
   * 反转
   */
  reverse: '\x1b[7m',
  /**
   * 隐藏
   */
  hidden: '\x1b[8m',
  /**
   * 黑色
   */
  black: '\x1b[30m',
  /**
   * 红色
   */
  red: '\x1b[31m',
  /**
   * 绿色
   */
  green: '\x1b[32m',
  /**
   * 黄色
   */
  yellow: '\x1b[33m',
  /**
   * 蓝色
   */
  blue: '\x1b[34m',
  /**
   * 洋红色
   */
  magenta: '\x1b[35m',
  /**
   * 青色
   */
  cyan: '\x1b[36m',
  /**
   * 白色
   */
  white: '\x1b[37m',
  /**
   * 背景黑色
   */
  bgBlack: '\x1b[40m',
  /**
   * 背景红色
   */
  bgRed: '\x1b[41m',
  /**
   * 背景绿色
   */
  bgGreen: '\x1b[42m',
  /**
   * 背景黄色
   */
  bgYellow: '\x1b[43m',
  /**
   * 背景蓝色
   */
  bgBlue: '\x1b[44m',
  /**
   * 背景洋红色
   */
  bgMagenta: '\x1b[45m',
  /**
   * 背景青色
   */
  bgCyan: '\x1b[46m',
  /**
   * 背景白色
   */
  bgWhite: '\x1b[47m',
};

/**
 * @name Colored 彩色文字
 * @param text
 * @param color
 * @returns string
 */
function Colored(text: string, color: keyof typeof colors) {
  const colorCode = colors[color] || colors.reset;
  return colorCode + text + colors.reset;
}

const colorKeys = Object.keys(colors);
const ColoredText = colorKeys.reduce((prev, cur) => {
  prev[cur] = (text: string) => Colored(text, cur as keyof typeof colors);
  return prev;
}, {} as Record<keyof typeof colors, (text: string) => string>);

export { GradientText, ColoredText };
