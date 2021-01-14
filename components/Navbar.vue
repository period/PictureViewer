<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark" v-bind:class="{'animate-nav-in': fadeIn, 'animate-nav-out': fadeOut}">
    <div class="container">
      <a class="navbar-brand" href="#">pics.thomas.gg</a>
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
          <li class="nav-item">
            <a class="nav-link" href="#">Albums</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Collections</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Info</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><fa :icon="['fas', 'search']" /></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.animate-nav-in {
    animation-name: fadeIn;
    animation-duration: 2s;
    animation-fill-mode: both;
}
@keyframes fadeIn {
   0% {opacity: 1;}
   100% {opacity: 0.4;}
} 
.animate-nav-out {
    animation-name: fadeOut;
    animation-duration: 2s;
    animation-fill-mode: both;
}
@keyframes fadeOut {
   0% {opacity: 0.4;}
   100% {opacity: 1;}
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
          previousScroll: 0
      }
  },
  methods: {
      onScroll() {
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
