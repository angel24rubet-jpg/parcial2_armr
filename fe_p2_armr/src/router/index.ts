import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/recintos",
      name: "recintos",
      component: () => import("../views/RecintosView.vue"),
    },
    {
      path: "/eventos",
      name: "eventos",
      component: () => import("../views/EventosView.vue"),
    },
  ],
});

export default router;
