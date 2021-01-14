<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark" v-bind:class="{'animate-nav-in': fadeIn, 'animate-nav-out': fadeOut, 'noanimate': noAnimate}">
    <div class="container">
      <n-link to="/" class="navbar-brand">pics.thomas.gg</n-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav ml-auto my-2">
          <li class="nav-item" v-bind:class="{'active': $nuxt.$route.name == 'albums'}">
            <n-link to="/albums" class="nav-link">Albums</n-link>
          </li>
          <li class="nav-item" v-bind:class="{'active': $nuxt.$route.name == 'collections'}">
            <n-link to="/collections" class="nav-link">Collections</n-link>
          </li>
          <li class="nav-item" v-bind:class="{'active': $nuxt.$route.name == 'info'}">
            <n-link to="/info" class="nav-link">About</n-link>
          </li>
          <li class="nav-item" v-bind:class="{'active': $nuxt.$route.name == 'search'}">
            <n-link to="/search" class="nav-link"><fa :icon="['fas', 'search']" /></n-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.noanimate {
    background-color: rgb(79,102,115);
}
.animate-nav-in {
    animation-name: fadeIn;
    animation-duration: 1.5s;
    animation-fill-mode: both;
}
@keyframes fadeIn {
   0% {background-color: rgba(79,102,115,0);}
   100% {background-color: rgba(79,102,115,1);}
} 
.animate-nav-out {
    animation-name: fadeOut;
    animation-duration: 1.5s;
    animation-fill-mode: both;
}
@keyframes fadeOut {
   0% {background-color: rgba(79,102,115,1);}
   100% {background-color:rgba(79,102,115,0);}
} 
</style>
<script>
export default {
  name: "Navbar",
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  data() {
      return {
          fadeIn: false,
          fadeOut: false,
          previousScroll: 0,
          noAnimate: $nuxt.$route.name != "index"
      }
  },
  watch: {
    $route () {
      this.onScroll();
    }
  },
  methods: {
      onScroll() {
        if($nuxt.$route.name != "index")  {
            this.noAnimate = true;
            this.fadeIn = false;
            this.fadeOut = false;
            return;
        }
        this.noAnimate = false;
        let currentPosition = window.pageYOffset || document.documentElement.scrollTop;
        let isScrollDown = false;
        if(currentPosition > this.previousScroll) isScrollDown = true;
        this.previousScroll = currentPosition;

        if(isScrollDown && currentPosition >= 60) {
            this.fadeIn = true;
            this.fadeOut = false;
        }
        if(!isScrollDown && currentPosition >= 60) {
            this.fadeIn = false;
            this.fadeOut = true;
        }
      }
  }
};
</script>
