<template>
  <div class="layout-theme-editor-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="arrow-left"
            class="mr-2"
            @click="goBack"
          />
          <h1 class="page-title text-xl font-medium">
            {{ theme.name }}
          </h1>
        </div>
        <div class="flex">
          <woot-button
            v-if="!theme.is_active"
            color-scheme="success"
            class="mr-2"
            @click="activateTheme"
            :loading="uiFlags.isActivating"
          >
            {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.ACTIVATE') }}
          </woot-button>
          <woot-button
            color-scheme="primary"
            @click="saveTheme"
            :loading="uiFlags.isUpdating"
          >
            {{ $t('SAVE') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!theme.id" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.NOT_FOUND.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.NOT_FOUND.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="arrow-left"
            @click="goBack"
          >
            {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.GO_BACK') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="flex-1 overflow-y-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Painel de edição -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <h2 class="text-lg font-medium mb-4">{{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.BASIC_INFO') }}</h2>
              
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="theme-name">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEMES.FORM.NAME.LABEL') }}
                </label>
                <input
                  id="theme-name"
                  v-model="themeForm.name"
                  type="text"
                  class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
                  :placeholder="$t('LAYOUT_CUSTOMIZATION.THEMES.FORM.NAME.PLACEHOLDER')"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="theme-site-name">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEMES.FORM.SITE_NAME.LABEL') }}
                </label>
                <input
                  id="theme-site-name"
                  v-model="themeForm.site_name"
                  type="text"
                  class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
                  :placeholder="$t('LAYOUT_CUSTOMIZATION.THEMES.FORM.SITE_NAME.PLACEHOLDER')"
                />
              </div>
            </div>
            
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <h2 class="text-lg font-medium mb-4">{{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.LOGO_AND_ICONS') }}</h2>
              
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.LOGO') }}
                </label>
                
                <div class="flex items-center mb-4">
                  <div v-if="logoPreview || theme.logo" class="w-32 h-32 mr-4 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center overflow-hidden">
                    <img :src="logoPreview || theme.logo.url" :alt="theme.name" class="max-w-full max-h-full object-contain" />
                  </div>
                  <div v-else class="w-32 h-32 mr-4 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center">
                    <span class="text-slate-400 dark:text-slate-500">
                      <i class="icon-image text-4xl"></i>
                    </span>
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      ref="logoInput"
                      class="hidden"
                      accept="image/*"
                      @change="handleLogoUpload"
                    />
                    <woot-button
                      color-scheme="secondary"
                      size="small"
                      class="mb-2"
                      @click="$refs.logoInput.click()"
                    >
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.UPLOAD_LOGO') }}
                    </woot-button>
                    <p v-if="logoPreview || theme.logo" class="text-xs text-slate-500">
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.CHANGE_LOGO') }}
                    </p>
                  </div>
                </div>
                
                <label class="block text-sm font-medium mb-2">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.CUSTOM_ICONS') }}
                </label>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  <div 
                    v-for="icon in customIcons" 
                    :key="icon.id || icon.tempId" 
                    class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center overflow-hidden relative group"
                  >
                    <img :src="icon.url" alt="Custom icon" class="max-w-full max-h-full object-contain" />
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button 
                        type="button" 
                        class="text-white hover:text-red-500"
                        @click="removeIcon(icon)"
                      >
                        <i class="icon-delete text-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    @click="$refs.iconsInput.click()"
                  >
                    <span class="text-slate-400 dark:text-slate-500">
                      <i class="icon-plus text-2xl"></i>
                    </span>
                  </div>
                </div>
                
                <input
                  type="file"
                  ref="iconsInput"
                  class="hidden"
                  accept="image/*"
                  multiple
                  @change="handleIconsUpload"
                />
                
                <p class="text-xs text-slate-500">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.ICONS_HELP') }}
                </p>
              </div>
            </div>
            
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <h2 class="text-lg font-medium mb-4">{{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.COLORS') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div v-for="(color, key) in themeForm.colors" :key="key" class="mb-4">
                  <label class="block text-sm font-medium mb-1" :for="`color-${key}`">
                    {{ $t(`LAYOUT_CUSTOMIZATION.THEME_EDITOR.COLORS_${key.toUpperCase()}`) }}
                  </label>
                  <div class="flex">
                    <input
                      :id="`color-${key}`"
                      v-model="themeForm.colors[key]"
                      type="color"
                      class="w-10 h-10 rounded-l-md border border-slate-300 dark:border-slate-700 px-1 py-1 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
                    />
                    <input
                      v-model="themeForm.colors[key]"
                      type="text"
                      class="flex-1 rounded-r-md border border-l-0 border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
                      :placeholder="$t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.COLOR_CODE')"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <woot-button
                  variant="clear"
                  color-scheme="secondary"
                  @click="resetColors"
                >
                  {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.RESET_COLORS') }}
                </woot-button>
              </div>
            </div>
            
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <h2 class="text-lg font-medium mb-4">{{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.CUSTOM_CSS') }}</h2>
              
              <div class="mb-4">
                <textarea
                  v-model="themeForm.custom_css"
                  class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500 font-mono"
                  rows="10"
                  :placeholder="$t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.CUSTOM_CSS_PLACEHOLDER')"
                ></textarea>
                
                <p class="text-xs text-slate-500 mt-2">
                  {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.CUSTOM_CSS_HELP') }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Painel de visualização -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6 sticky top-4">
              <h2 class="text-lg font-medium mb-4">{{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW') }}</h2>
              
              <div class="preview-container border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                <div class="preview-header p-2 flex items-center" :style="{ backgroundColor: themeForm.colors.primary, color: '#fff' }">
                  <div class="preview-logo w-8 h-8 mr-2 bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img v-if="logoPreview || theme.logo" :src="logoPreview || theme.logo.url" alt="Logo" class="max-w-full max-h-full object-contain" />
                    <span v-else class="text-slate-400">
                      <i class="icon-image text-sm"></i>
                    </span>
                  </div>
                  <div class="preview-site-name font-medium">
                    {{ themeForm.site_name || $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_SITE_NAME') }}
                  </div>
                </div>
                
                <div class="preview-content p-4">
                  <div class="mb-4">
                    <div class="preview-button py-1 px-3 rounded-md text-white text-sm inline-block" :style="{ backgroundColor: themeForm.colors.primary }">
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_PRIMARY') }}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <div class="preview-button py-1 px-3 rounded-md text-white text-sm inline-block" :style="{ backgroundColor: themeForm.colors.success }">
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_SUCCESS') }}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <div class="preview-button py-1 px-3 rounded-md text-white text-sm inline-block" :style="{ backgroundColor: themeForm.colors.danger }">
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_DANGER') }}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <div class="preview-text text-sm" :style="{ color: themeForm.colors.text }">
                      {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_TEXT') }}
                    </div>
                  </div>
                  
                  <div class="preview-icons flex gap-2 mt-4">
                    <div 
                      v-for="(icon, index) in previewIcons" 
                      :key="index"
                      class="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden"
                    >
                      <img :src="icon.url" alt="Icon" class="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
              
              <p class="text-xs text-slate-500 mt-4">
                {{ $t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.PREVIEW_HELP') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutThemeEditor',
  data() {
    return {
      themeForm: {
        name: '',
        site_name: '',
        colors: {
          primary: '#1F93FF',
          secondary: '#3D4853',
          success: '#44CE4B',
          warning: '#FFD700',
          danger: '#FF382D',
          info: '#67AFFF',
          background: '#FFFFFF',
          text: '#3D4853'
        },
        custom_css: '',
      },
      logoFile: null,
      logoPreview: null,
      newIconFiles: [],
      removedIconIds: [],
      customIcons: [],
    };
  },
  computed: {
    ...mapGetters({
      theme: 'layoutCustomization/getCurrentTheme',
      uiFlags: 'layoutCustomization/getUIFlags',
    }),
    themeId() {
      return this.$route.params.themeId;
    },
    previewIcons() {
      // Mostrar até 3 ícones na visualização
      return this.customIcons.slice(0, 3);
    },
  },
  watch: {
    theme: {
      immediate: true,
      handler(newTheme) {
        if (newTheme && newTheme.id) {
          this.initializeForm(newTheme);
        }
      },
    },
  },
  mounted() {
    this.fetchTheme();
  },
  methods: {
    async fetchTheme() {
      try {
        await this.$store.dispatch('layoutCustomization/fetchTheme', this.themeId);
      } catch (error) {
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEME_EDITOR.FETCH_ERROR'), 'error');
      }
    },
    initializeForm(theme) {
      this.themeForm = {
        name: theme.name || '',
        site_name: theme.site_name || '',
        colors: { ...theme.colors },
        custom_css: theme.custom_css || '',
      };
      
      // Inicializar ícones personalizados
      this.customIcons = theme.custom_icons ? [...theme.custom_icons] : [];
    },
    goBack() {
      this.$router.push({ name: 'layout_themes' });
    },
    handleLogoUpl<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>