<script setup lang="ts">
import store from "../store/index";
import { computed } from "vue";
import { supabase } from "../supabase/init";
import { useRouter } from "vue-router";
const router = useRouter();

const user = computed(() => store.state.user);

const logout = async () => {
  await supabase.auth.signOut();
  router.push({ name: "Home" });
};
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppNavigation",
});
</script>

<template>
  <header class="bg-at-light-green text-white">
    <nav
      class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row"
    >
      <router-link :to="{ name: 'Home' }">
        <div class="flex items-center gap-x-4">
          <img class="w-14" src="../assets/images/dumbbell-light.png" alt="" />
          <h1 class="text-lg">Active Tracker</h1>
        </div>
      </router-link>
      <ul class="flex flex-1 justify-end gap-x-10">
        <router-link class="cursor-pointer" :to="{ name: 'Home' }">
          Home
        </router-link>
        <router-link
          v-if="user"
          class="cursor-pointer"
          :to="{ name: 'Create' }"
        >
          Create
        </router-link>
        <router-link
          v-if="!user"
          class="cursor-pointer"
          :to="{ name: 'Login' }"
        >
          Login
        </router-link>
        <li v-if="user" @click="logout" class="cursor-pointer">Logout</li>
      </ul>
    </nav>
  </header>
</template>