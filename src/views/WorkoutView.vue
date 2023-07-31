<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { supabase } from "@/supabase/init";
import { useRoute, useRouter } from "vue-router";
import store from "@/store";
import { uid } from "uid";
const route = useRoute();
const router = useRouter();
const user = computed(() => store.state.user);

const data = ref();
const dataLoaded = ref<boolean>(false);
const errMsg = ref<string>("");
const statusMsg = ref<string>("");
const currentId = route.params.id;

async function getData() {
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", currentId);
  if (error) {
    errMsg.value = error.message;
    setTimeout(() => (errMsg.value = ""), 5000);
  }
  data.value = workouts[0];
  dataLoaded.value = true;
  console.log(data.value);
}

async function deleteWorkout() {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", currentId);

  if (error) {
    errMsg.value = error.message;
  }

  router.push({ name: "Home" });
}

const edit = ref<boolean>(false);

function editMode() {
  edit.value = !edit.value;
}

function addExercise() {
  if (data.value.workoutType === "strength") {
    data.value.exercises.push({
      id: uid(),
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
    });
    return;
  }
  data.value.exercises.push({
    id: uid(),
    cardioType: "",
    distance: "",
    duration: "",
    pace: "",
  });
}

function deleteExercise(id: string) {
  if (data.value.exercises.length > 1) {
    data.value.exercises = data.value.exercises.filter(
      (exercise: object) => exercise.id !== id
    );
    return;
  }
  errMsg.value = "Can't remove, need to at least have one exercise";
  setTimeout(() => (errMsg.value = ""), 5000);
}

async function updateWorkout() {
  const { error } = await supabase
    .from("workouts")
    .update({
      workoutName: data.value.workoutName,
      exercises: data.value.exercises,
    })
    .eq("id", currentId);

  if (error) {
    errMsg.value = error.message;
    setTimeout(() => (errMsg.value = ""), 5000);
  }
  edit.value = false;
  statusMsg.value = "Success: Workout Updated!";
  setTimeout(() => (statusMsg.value = ""), 5000);
  setTimeout(() => router.push({ name: "Home" }), 2000);
}

onMounted(() => getData());
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkoutView",
});
</script>

<template>
  <div v-auto-animate class="max-w-screen-sm mx-auto px-4 py-10">
    <div
      v-if="statusMsg | errMsg"
      class="mb-10 p-4 rounded-md shadow-md bg-light-grey"
    >
      <p class="text-at-light-green">
        {{ statusMsg }}
      </p>
      <p class="text-red-500">
        {{ errMsg }}
      </p>
    </div>

    <div v-if="dataLoaded" v-auto-animate>
      <div
        class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative"
      >
        <div v-if="user" class="flex absolute left-2 top-2 gap-x-2">
          <div
            class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-at-light-green shadow-lg"
            @click="editMode"
          >
            <img
              class="h-3.5 w-auto"
              src="@/assets/images/pencil-light.png"
              alt=""
            />
          </div>
          <div
            @click="deleteWorkout"
            class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-at-light-green shadow-lg"
          >
            <img
              class="h-3.5 w-auto"
              src="@/assets/images/trash-light.png"
              alt=""
            />
          </div>
        </div>

        <img
          v-if="data.workoutType === 'cardio'"
          class="h-24 w-auto"
          src="@/assets/images/running-light-green.png"
          alt=""
        />

        <img
          v-else
          class="h-24 w-auto"
          src="@/assets/images/dumbbell-light-green.png"
          alt=""
        />

        <span
          class="mt-6 py-1.5 px-5 text-xs text-white bg-at-light-green rounded-lg shadow-md"
        >
          {{ data.workoutType }}
        </span>

        <div class="w-full mt-6">
          <input
            v-if="edit"
            type="text"
            class="p-2 w-full text-gray-500 focus:outline-none"
            v-model="data.workoutName"
          />
          <h1 v-else class="text-at-light-green text-2xl text-center">
            {{ data.workoutName }}
          </h1>
        </div>
      </div>

      <!--  -->
      <div
        class="mt-10 p-8 rounded-md flex flex-col items-center bg-light-grey shadow-md"
      >
        <div
          v-if="data.workoutType === 'strength'"
          class="flex flex-col gap-y-4 w-full"
        >
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row"
            v-for="(item, index) in data.exercises"
            :key="index"
          >
            <div class="flex flex-2 flex-col md:1/3">
              <label
                for="cardioType"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Exerice</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="cardioType"
                v-model="item.exercise"
              />
              <p v-else>{{ item.exercise }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="sets"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Sets</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="sets"
                v-model="item.sets"
              />
              <p v-else>{{ item.sets }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="reps"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Reps</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="reps"
                v-model="item.reps"
              />
              <p v-else>{{ item.reps }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="weight"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Weight (LB's)</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="weight"
                v-model="item.weight"
              />
              <p v-else>{{ item.weight }}</p>
            </div>

            <img
              @click="deleteExercise(item.id)"
              v-if="edit"
              class="absolute h-4 w-auto -left-5 cursor-pointer"
              src="@/assets/images/trash-light-green.png"
              alt=""
            />
          </div>
          <button
            @click="addExercise"
            v-if="edit"
            class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
            type="button"
          >
            Add Exercise
          </button>
        </div>

        <div v-else class="flex flex-col gap-y-4 w-full">
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row"
            v-for="(item, index) in data.exercises"
            :key="index"
          >
            <div class="flex flex-2 flex-col md:1/3">
              <label
                for="cardioType"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Type</label
              >
              <select
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="cardioType"
                v-model="item.cardioType"
              >
                <option value="#">Select Type</option>
                <option value="run">Run</option>
                <option value="walk">Walk</option>
              </select>
              <p v-else>{{ item.cardioType }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="distance"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Distance</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="distance"
                v-model="item.distance"
              />
              <p v-else>{{ item.distance }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="duration"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Duration</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="duration"
                v-model="item.duration"
              />
              <p v-else>{{ item.duration }}</p>
            </div>

            <div class="flex flex-2 flex-col">
              <label
                for="pace"
                class="mb-1 text-sm text-at-light-green whitespace-nowrap"
                >Pace</label
              >
              <input
                v-if="edit"
                class="p-2 w-full text-gray-500 focus:outline-none"
                type="text"
                id="pace"
                v-model="item.pace"
              />
              <p v-else>{{ item.pace }}</p>
            </div>

            <img
              @click="deleteExercise(item.id)"
              v-if="edit"
              class="absolute h-4 w-auto -left-5 cursor-pointer"
              src="@/assets/images/trash-light-green.png"
              alt=""
            />
          </div>
          <button
            v-if="edit"
            class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
            type="button"
          >
            Add Exercise
          </button>
        </div>
        <button
          @click="updateWorkout"
          v-if="edit"
          class="mt-10 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
          type="submit"
        >
          Update Workout
        </button>
      </div>
    </div>

    <img
      v-else
      class="w-14 absolute z-50 top-1/2 left-1/2 -translate-1/2"
      src="@/assets/images/loader.svg"
    />
  </div>
</template>