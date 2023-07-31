<script setup lang="ts">
import Navigation from "./components/Navigation.vue";
import { ref } from "vue";
import { supabase } from "./supabase/init";
import store from "./store/index";

const appReady = ref<boolean | null>(null);

const user = supabase.auth.getUser();

if (!user) {
  appReady.value = true;
}

supabase.auth.onAuthStateChange((_, session) => {
  store.methods.setUser(session);
  appReady.value = true;
});
</script>

<template v-auto-animate>
  <div v-if="appReady" class="min-h-full font-Poppins box-border">
    <Navigation v-auto-animate />
    <router-view v-auto-animate />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");
</style>
