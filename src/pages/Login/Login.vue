<template>
  <div class="login">
    <div class="heading">Облачное хранилище</div>
    <div class="wrapper">
      <div class="text">
        Введите свою почту и пароль, чтобы начать работу в облачном хранилище
      </div>
      <form @submit.prevent="onSubmit">
        <div class="inputs">
          <ui-input
            class="firstInput"
            placeholder="Введите вашу почту"
            v-model="vv.email.$model"
            :error-messages="vv.email.$errors"
            :is-error="!!vv.email.$errors.length"
          />
          <ui-input
            placeholder="Введите ваш пароль"
            v-model="vv.password.$model"
            :error-messages="vv.password.$errors"
            :is-error="!!vv.password.$errors.length"
          />
        </div>
        <div class="buttonWrapper">
          <ui-button :disabled="disabledButton" type="submit">Войти</ui-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiInput from "@/common/ui/UiInput.vue";
import { computed, reactive, watch } from "vue";
import { helpers, required } from "@vuelidate/validators";
import type { ValidationRuleWithParams } from "@vuelidate/core";
import useVuelidate from "@vuelidate/core";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";
import UiButton from "@/common/ui/UiButton.vue";

interface Rules {
  email: {
    required: ValidationRuleWithParams;
    wrongEmail?: ValidationRuleWithParams;
  };
  password: {
    required: ValidationRuleWithParams;
    wrongPassword?: ValidationRuleWithParams;
  };
}

const authStore = useAuthStore();
const authStoreData = storeToRefs(authStore);

const state = reactive({
  email: "",
  password: "",
});

const wrong = reactive({
  email: "",
  password: "",
});

const rules = reactive<Rules>({
  email: {
    required: helpers.withMessage("Необходимо ввести почту", required),
  },
  password: {
    required: helpers.withMessage("Необходимо ввести пароль", required),
  },
});

watch([wrong, authStoreData], () => {
  if (authStoreData.errors.value.email) {
    rules.email.wrongEmail = helpers.withMessage(
      authStoreData.errors.value.email,
      () => {
        if (
          authStoreData.errors.value.email &&
          wrong.email &&
          wrong.email === state.email
        ) {
          return false;
        }
        authStoreData.errors.value.email = "";
        return true;
      }
    );
  }

  if (authStoreData.errors.value.password) {
    rules.password.wrongPassword = helpers.withMessage(
      authStoreData.errors.value.password,
      () => {
        if (
          authStoreData.errors.value.password.length &&
          wrong.password &&
          wrong.password === state.password
        ) {
          return false;
        }
        authStoreData.errors.value.password = "";
        return true;
      }
    );
  }
});

const vv = useVuelidate(rules, state);

const disabledButton = computed(() => vv.value.$invalid);

const onSubmit = async () => {
  await authStore.login(state.email, state.password);
  wrong.email = state.email;
  wrong.password = state.password;
};
</script>

<style scoped>
.login {
  margin-top: 175px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading {
  font-weight: 700;
  font-size: 64px;
  line-height: 72px;
  margin-bottom: 58px;
}

.wrapper {
  width: 528px;
}

.text {
  font-weight: 300;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  margin-bottom: 63px;
}

.inputs {
  width: 100%;
}

.firstInput {
  margin-bottom: 26px;
}

.buttonWrapper {
  margin-top: 63px;
  display: flex;
  justify-content: center;
}
</style>
