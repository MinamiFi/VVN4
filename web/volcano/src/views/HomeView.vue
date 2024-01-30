<template>
  <div class="home">
    <Nav></Nav>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Nav from '@/components/nav/nav.vue'

export default {
  name: 'HomeView',
  components: {
    Nav
  }
}
</script>
