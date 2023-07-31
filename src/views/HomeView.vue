<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "../supabase/init";

const data = ref<Array>([]);
const dataLoaded = ref<boolean>(false);

async function getData() {
  const { data: workouts, error } = await supabase.from("workouts").select("*");
  data.value = workouts;
  dataLoaded.value = true;
}

onMounted(() => getData());
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
});
</script>

<template>
  <div v-if="dataLoaded" class="container mt-10 px-4">
    <div v-if="data.length == 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Looks empty here...</h1>
      <router-link
        class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
        :to="{ name: 'Create' }"
      >
        Create Workout
      </router-link>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <router-link
        class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
        :to="{ name: 'WorkoutView', params: { id: workout.id } }"
        v-for="(workout, index) in data"
        :key="index"
      >
        <img
          v-if="workout.workoutType === 'cardio'"
          src="@/assets/images/running-light-green.png"
          class="h-24 w-auto"
          alt=""
        />
        <img
          v-else
          src="@/assets/images/dumbbell-light-green.png"
          class="h-24 w-auto"
          alt=""
        />

        <p
          class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg"
        >
          {{ workout.workoutType }}
        </p>

        <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green">
          {{ workout.workoutName }}
        </h1>
      </router-link>
    </div>
  </div>
  <img
    v-else
    class="w-14 absolute z-50 top-1/2 left-1/2 -translate-1/2"
    src="@/assets/images/loader.svg"
    alt=""
  />
</template>
