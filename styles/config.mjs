// Constant declarations
const colors = {
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',
  'bricky-brick': '#CC4429',
  'namara-grey': '#7b7b7b',
  'moon-veil': '#8B9BB1',
  'bengala-red': '#932d19',
  grenadier: '#c24e37',
  tabasco: '#A02912',
  unbleached: '#FCFAF5',
  'blue-shimmer': '#b6dce1',
  brilliance: '#fdfdfd',
  'minor-blue': '#b8e0e7',
  'aqua-belt': '#7DCECC',
  'halite-blue': '#0A2A45',
  'lusty-salmon': '#efb4a6',
  'army-canvas': '#5D7261',
  'verve-violet': '#934D7D',
  'trapped-darkness': '#0F1A2C',
  'tangerine-flake': '#E57C5C',
  'bleeding-crimson': '#99170F',
  'birch-strain': '#DDB760',
  'tangerine-cream': '#ffa386',
}

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors['bricky-brick'],
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors['bricky-brick'],
  },
  'bricky-brick': {
    primary: colors['bricky-brick'],
    secondary: colors.black,
    contrast: colors.white,
  },
}

const breakpoints = {
  breakpointMobile: 800,
  breakpointTablet: 1200,
}

const screens = {
  mobile: { width: 375, height: 650 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 816 },
}

/** @type {(keyof typeof themes)[]} */
const themeNames = Object.keys(themes)

const config = {
  themes,
}

export { breakpoints, colors, config, screens, themeNames, themes }
