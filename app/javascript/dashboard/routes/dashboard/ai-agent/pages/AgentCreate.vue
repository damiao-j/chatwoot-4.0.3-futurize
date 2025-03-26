<template>
  <div class="column content-box">
    <woot-button
      color-scheme="secondary"
      class-names="button--fixed-right-top"
      icon="arrow-left"
      @click="goBack"
    >
      {{ $t('GENERAL.BACK') }}
    </woot-button>

    <div class="row">
      <div class="small-12 columns">
        <h1 class="page-title">
          {{ $t('AI_AGENT.ADD.TITLE') }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <form @submit.prevent="createAgent">
          <div class="row">
            <div class="small-12 medium-8 columns">
              <woot-input
                v-model="agentForm.name"
                :label="$t('AI_AGENT.FORM.NAME.LABEL')"
                :placeholder="$t('AI_AGENT.FORM.NAME.PLACEHOLDER')"
                :error="$v.agentForm.name.$error ? $t('AI_AGENT.FORM.NAME.ERROR') : ''"
                @blur="$v.agentForm.name.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 medium-8 columns">
              <woot-input
                v-model="agentForm.description"
                :label="$t('AI_AGENT.FORM.DESCRIPTION.LABEL')"
                :placeholder="$t('AI_AGENT.FORM.DESCRIPTION.PLACEHOLDER')"
                :error="$v.agentForm.description.$error ? $t('AI_AGENT.FORM.DESCRIPTION.ERROR') : ''"
                @blur="$v.agentForm.description.$touch"
                required
                multiline
                :rows="4"
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 medium-8 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.FORM.STATUS.LABEL') }}
                <div class="checkbox-wrap">
                  <input
                    v-model="agentForm.active"
                    type="checkbox"
                  />
                  <span class="checkbox-label">
                    {{ $t('AI_AGENT.FORM.STATUS.ACTIVE') }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-button
                :is-loading="uiFlags.isCreatingAgent"
                :disabled="$v.agentForm.$invalid"
                color-scheme="success"
                type="submit"
              >
                {{ $t('AI_AGENT.ADD.SUBMIT') }}
              </woot-button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  name: 'AgentCreate',
  data() {
    return {
      agentForm: {
        name: '',
        description: '',
        active: true,
        settings: {},
      },
    };
  },
  validations: {
    agentForm: {
      name: { required },
      description: { required },
    },
  },
  computed: {
    ...mapGetters({
      uiFlags: 'aiAgent/getUIFlags',
    }),
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ai_agents' });
    },
    async createAgent() {
      this.$v.agentForm.$touch();
      if (this.$v.agentForm.$invalid) {
        return;
      }

      try {
        const agent = await this.$store.dispatch('aiAgent/createAgent', this.agentForm);
        this.showAlert(this.$t('AI_AGENT.ADD.SUCCESS'), 'success');
        this.$router.push({
          name: 'ai_agent_edit',
          params: { agentId: agent.id },
        });
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.ADD.ERROR'));
      }
    },
    showAlert(message, type = 'error') {
      this.$store.dispatch('notifications/create', {
        type,
        message,
      });
    },
  },
};
</script>
