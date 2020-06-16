  
<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">pics.thomas.gg</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
          <b-nav-item to="/albums" :active="$nuxt.$route.name == 'albums'">Albums</b-nav-item>
          <b-nav-item to="/collections" :active="$nuxt.$route.name == 'collections'">Collections</b-nav-item>
          <b-nav-item to="/info" :active="$nuxt.$route.name == 'info'">Info</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-button to="/search">Search</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "Navbar"
};
</script>