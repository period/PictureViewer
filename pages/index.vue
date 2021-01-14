<template>
  <div class="container">
    <div>
      <h1>Welcome to pics.thomas.gg!</h1>
      <!---
      <b-jumbotron
        header="pics.thomas.gg"
        lead="A collection of pictures of planes both low and high that I take whilst out and about. Nothing special, really."
      >
      </b-jumbotron>
      -->
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      <h5>Featured photos</h5>
      <b-carousel
        v-model="slide"
        controls
        indicators
        fade
      >
        <b-carousel-slide
          v-for="photo in featured"
          :key="photo.uuid"
          :caption="photo.registration"
          :text="photo.caption"
          :img-src="'https://pics.thomas.gg/storage/full/'+photo.uuid+'.jpg'"
        />
      </b-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      slide: 0,
      featured: []
    }
  },
  async mounted() {
    await this.$axios
        .$get("https://pics.thomas.gg/api/featured", {})
        .then(res => {
          this.featured = res;
        })
        .catch(res => {});
  }
};
</script>