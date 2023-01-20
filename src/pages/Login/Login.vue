<script setup lang="ts">
import UiInput from "@/common/ui/UiInput.vue";
import { computed, reactive } from "vue";
import UiButton from "@/common/ui/UiButton.vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import type { ValidationRuleWithParams } from "@vuelidate/core";
import { AuthService } from "@/services/auth.service";
import router from "@/router";

const authService = new AuthService();

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

const state = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  wrongEmail: "",
  emailError: "",
  wrongPassword: "",
  passwordError: "",
});

const rules = computed<Rules>(() => {
  const localRules: Rules = {
    email: {
      required: helpers.withMessage("Необходимо ввести почту", required),
    },
    password: {
      required: helpers.withMessage("Необходимо ввести пароль", required),
    },
  };

  if (errors.emailError) {
    localRules.email.wrongEmail = helpers.withMessage(errors.emailError, () => {
      if (
        errors.emailError.length &&
        errors.wrongEmail &&
        errors.wrongEmail === state.email
      ) {
        return false;
      }
      errors.emailError = "";
      return true;
    });
  }

  if (errors.passwordError) {
    localRules.password.wrongPassword = helpers.withMessage(
      errors.passwordError,
      () => {
        if (
          errors.passwordError.length &&
          errors.wrongPassword &&
          errors.wrongPassword === state.password
        ) {
          return false;
        }
        errors.passwordError = "";
        return true;
      }
    );
  }

  return localRules;
});

const vv = useVuelidate(rules, state);

const disabledButton = computed(() => vv.value.$invalid);

const onSubmit = async () => {
  const data = await authService.login(state.email, state.password);
  if ("errors" in data) {
    errors.emailError = data.errors.login[0];
    errors.wrongEmail = state.email;
    errors.passwordError = data.errors.password[0];
    errors.wrongPassword = state.password;
  } else {
    await router.push("/space");
  }
};
</script>

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
            :error-message="vv.email.$errors[0]?.$message"
            :is-error="!!vv.email.$errors.length"
          />
          <ui-input
            placeholder="Введите ваш пароль"
            v-model="vv.password.$model"
            :error-message="vv.password.$errors[0]?.$message"
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
