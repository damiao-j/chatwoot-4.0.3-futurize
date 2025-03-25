import LayoutThemes from './pages/LayoutThemes';
import LayoutThemeEditor from './pages/LayoutThemeEditor';

export default [
  {
    path: 'layout-customization',
    name: 'layout_themes',
    roles: ['administrator'],
    component: LayoutThemes,
  },
  {
    path: 'layout-customization/:themeId',
    name: 'layout_theme_editor',
    roles: ['administrator'],
    component: LayoutThemeEditor,
  },
];
