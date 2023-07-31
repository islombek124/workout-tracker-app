import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { supabase } from "@/supabase/init.js";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CreateView from "@/views/CreateView.vue";
import WorkoutView from "@/views/WorkoutView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Home",
      auth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Login",
      auth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      title: "Register",
      auth: false,
    },
  },
  {
    path: "/create",
    name: "Create",
    component: CreateView,
    meta: {
      title: "Create",
      auth: true,
    },
  },
  {
    path: "/workout/:id",
    name: "WorkoutView",
    component: WorkoutView,
    meta: {
      title: "View Workout",
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Active Tracker`;
  next();
});

router.beforeEach((to, from, next) => {
  const user = supabase.auth.getUser();
  if (to.matched.some((res) => res.meta.auth)) {
    if (user) {
      next();
      return;
    }
    next({ name: "Login" });
    return;
  }

  next();
});

export default router;
