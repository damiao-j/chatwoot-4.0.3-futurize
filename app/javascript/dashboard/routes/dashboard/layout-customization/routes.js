import LayoutThemes from './pages/LayoutThemes.vue';
import LayoutThemeEditor from './pages/LayoutThemeEditor.vue';

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
