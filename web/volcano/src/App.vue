<template>
  <div id="app">
    <Index></Index>
  </div>
</template>
<script>
import Index from "@/views/HomeView.vue"

export default {
  name: 'nav',
  components: {
    Index
  },
  data() {
    return {
      nav_left: "World Volcano Distribution Map",
      nav_right: [
        { d: "insights" }, { d: "Exployer" }, { d: "Global Volcano Atals" }]
    }
  },
  watch: {
    $route(to, from) {
      // setTimeout(() => window.location.reload(), 100)
      //监测到路由发生跳转时刷新一次页面
    },
  }
}
</script>
<style>
@import './css/init.css';

#app {
  height: 100vh;
}
</style>
