import { theme, type ThemeConfig } from 'antd';
const themeConfig: ThemeConfig = {
  token: {
    // Seed Token
    screenXL: 1400,
    borderRadius: 2,
    colorPrimaryActive: 'black'
  },
  components: {
    Button: {
      borderRadius: 4,
      // primary button
      colorPrimary: 'rgba(250, 204, 21, 1)',
      colorPrimaryHover: 'rgba(253, 224, 71, 1)',
      colorPrimaryActive: 'rgba(253, 224, 71, 1)',
      primaryColor: '#171717',
      colorPrimaryText: '#171717',
      colorPrimaryTextHover: '#171717',
      primaryShadow: 'none',
      contentFontSize: 14,
      // controlHeight: 40,
      // controlHeightSM: 32,
      controlPaddingHorizontalSM: 40,
      // default
      textHoverBg: 'transparent',
      algorithm: false
    }
  }
};

export default themeConfig;
