<script setup lang="ts">
import { ref } from "vue";
import { uid } from "uid";
import { supabase } from "@/supabase/init";
import { useRouter } from "vue-router";
const router = useRouter();

const workoutName = ref<string>("");
const workoutType = ref<"select-workout" | "strength" | "cardio">(
  "select-workout"
);
const exercises = ref<Array>([]);
const statusMsg = ref<string>("");
const errorMsg = ref<string>("");

function addExercise() {
  if (workoutType.value === "strength") {
    exercises.value.push({
      id: uid(),
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
    });
    return;
  }
  exercises.value.push({
    id: uid(),
    cardioType: "",
    distance: "",
    duration: "",
    pace: "",
  });
}

function deleteExercise(id: string) {
  if (exercises.value.length > 1) {
    exercises.value = exercises.value.filter(
      (exercise: object) => exercise.id !== id
    );
    return;
  }
  errorMsg.value = "Can't remove, need to at least have one exercise";
  setTimeout(() => (errorMsg.value = ""), 5000);
}

function workoutChange() {
  exercises.value = [];
  addExercise();
}

async function createWorkout() {
  const { error } = await supabase
    .from("workouts")
    .insert([
      {
        workoutName: workoutName.value,
        workoutType: workoutType.value,
        exercises: exercises.value,
      },
    ])
    .select();

  statusMsg.value = "Success: Workout Created";
  workoutName.value = "";
  workoutType.value = "select-workout";
  exercises.value = [];
  setTimeout(() => (statusMsg.value = ""), 5000);
  setTimeout(() => router.push({ name: "Home" }), 1000);

  if (error) {
    errorMsg.value = error.message;
    setTimeout(() => (errorMsg.value = ""), 5000);
  }
}
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CreateView",
});
</script>

<template>
  <div class="max-w-screen-md mx-auto px-4 py-10">
    <div
      v-if="statusMsg || errorMsg"
      class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
    >
      <p class="text-at-light-green">{{ statusMsg }}</p>
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div class="p-8 flex items-start bg-light-grey rounded-md shadow-lg">
      <form
        @submit.prevent="createWorkout"
        class="flex flex-col gap-y-5 w-full"
      >
        <h1 class="text-2xl text-at-light-green">Record Workout</h1>

        <!-- Workout Name -->
        <div class="flex flex-col">
          <label for="workout-name" class="mb-1 text-sm text-at-light-green"
            >Workout Name</label
          >
          <input
            type="text"
            required
            class="p-2 text-gray-500 focus:outline-none"
            id="workout-name"
            v-model="workoutName"
          />
        </div>

        <!-- Workout Type -->
        <div class="flex flex-col">
          <label for="workout-type" class="mb-1 text-sm text-at-light-green"
            >Workout Type</label
          >
          <select
            required
            class="p-2 text-gray-500 focus:outline-none"
            id="workout-type"
            @change="workoutChange"
            v-model="workoutType"
          >
            <option value="select-workout">Select Workout</option>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        <!-- Strength Training Inputs -->
        <div v-if="workoutType === 'strength'" class="flex flex-col gap-y-4">
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row"
            v-for="(item, index) in exercises"
            :key="index"
          >
            <div class="flex flex-col md:w-1/3">
              <label
                for="exercise-name"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Exercise</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.exercise"
              />
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="sets"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Sets</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.sets"
              />
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="reps"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Reps</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.reps"
              />
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="weight"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Weight (LB's)</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.weight"
              />
            </div>

            <img
              @click="deleteExercise(item.id)"
              src="@/assets/images/trash-light-green.png"
              class="h-4 w-auto absolute -left-5 cursor-pointer"
              alt=""
            />
          </div>
          <button
            @click="addExercise"
            type="submit"
            class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
          >
            Add Exercise
          </button>
        </div>

        <!-- Cardio Inputs -->
        <div v-if="workoutType === 'cardio'" class="flex flex-col gap-y-4">
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row"
            v-for="(item, index) in exercises"
            :key="index"
          >
            <div class="flex flex-col md:w-1/3">
              <label
                for="cardio-type"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Type</label
              >
              <select
                id="cardio-type"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.cardioType"
              >
                <option value="#">Select Type</option>
                <option value="run">Run</option>
                <option value="walk">Walk</option>
              </select>
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="distance"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Distance</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.distance"
              />
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="duration"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Duration</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.duration"
              />
            </div>

            <div class="flex flex-col flex-1">
              <label
                for="pace"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Pace</label
              >
              <input
                required
                type="text"
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.pace"
              />
            </div>

            <img
              @click="deleteExercise(item.id)"
              src="@/assets/images/trash-light-green.png"
              class="h-4 w-auto absolute -left-5 cursor-pointer"
              alt=""
            />
          </div>
          <button
            @click="addExercise"
            type="button"
            class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
          >
            Add Exercise
          </button>
        </div>

        <button
          type="submit"
          class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
        >
          Record Workout
        </button>
      </form>
    </div>
  </div>
</template>