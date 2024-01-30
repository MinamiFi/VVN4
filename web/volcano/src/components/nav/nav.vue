<template>
  <div class="nav">
    <div id="nav-left" class="nav-item">
      {{ nav_left[page] }}
    </div>
    <div id="nav-center" class="nav-item">

    </div>
    <div id="nav-right" class="nav-item">
      <router-link class="nav-right-item router" v-for="(item, index) in nav_right" :id="'nav-right-item' + index"
        :to="item.url" active-class='active_nav' @click.native=changePage(index)>
        {{ item.d }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav',
  props: [],
  data() {
    return {
      nav_left: [
        "Comprehensive Graphic presentation",
        "Individual Volcano Insights Explorer",
        "World Volcano Distribution Map"
      ],
      nav_right: [
        { d: "Volcano Insights Hub", url: "/insights" },
        { d: "Explorer", url: "/explorer" },
        { d: "Global", url: "/global" }
      ],
      nav_right_fullName: [
        "Volcano Insights Hub",
        "Volcano Explorer",
        "Global Volcano Atals",
      ],
      nav_right_shortName: [
        "Insights",
        "Explorer",
        "Global",
      ],
      page: 0
    }
  },
  methods: {
    changePage(index) {
      this.page = index
      for (let i = 0; i < 3; i++) {
        if (i == index) {
          this.nav_right[i].d = this.nav_right_fullName[i]
        }
        else {
          this.nav_right[i].d = this.nav_right_shortName[i]
        }
      }
    }
  },
  mounted() {
    this.page = 2
    let _this = this
    if (this.$route.path == '/insights') {
      this.page = 0
    }
    else if (this.$route.path == '/explorer') {
      this.page = 1
    }
    _this.changePage(this.page)

  }
}
</script>

<style scoped>
.nav {
  height: 8vh;
  /* background-color: white; */
  display: flex;
}

.router {
  text-decoration: none;
  color: #8f8f8f;
}

.nav-item {
  height: 100%;
}

#nav-left {
  width: 43vw;
  border-bottom: 2px solid #adacac;
  border-right: 2px solid #adacac;
  /* border: 0.2vw solid #adacac; */
  border-bottom-right-radius: 15px;
  font-size: 2.2vw;
  text-align: center;
  line-height: calc(8vh - 2px);
  font-family: 'semibold';
}

#nav-center {
  background-color: white;
  width: 3vw;
  height: 4vh;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 6px;
  margin-left: 5vw;
  margin-right: 5vw;
  box-shadow:
    0 0 2px 1px rgb(255, 255, 255);
}

#nav-right {
  width: 43vw;
  background: linear-gradient(#000, #2a2a2a);
  border-bottom-left-radius: 20px;
  /* border-left: 2px solid #adacac; */
  border-bottom: 2px solid #adacac;
  display: flex;
  font-family: 'regular';
}

#nav-right .active_nav {
  color: #fff;
  background: linear-gradient(#000, #565656);
  width: 20vw;
}

.nav-right-item {
  width: 12vw;
  transition: width 0.1s;
  background: linear-gradient(#000, #2e2e2e);
  height: calc(8vh);
  text-align: center;
  line-height: calc(8vh - 2px);
  font-size: 1.5vw;
  font-weight: 100;
  border-left: 2px solid #adacac;
  border-bottom-left-radius: 20px;
  overflow: hidden;
  text-shadow: 1px 0px 10px #000;
}
</style>
