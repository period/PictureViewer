<template>
  <div>
    <navbar></navbar>
    <nuxt />
    <div class="container">
      <small class="text-muted">&copy; pics.thomas.gg</small>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'
export default {
  components: {Navbar }
}
</script>