<template>
  <div class="container">
    <div>
      <b-card-group>
          <div v-for="photo in photos" :key="photo.uuid">
            <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
          </div>
      </b-card-group>
    </div>
  </div>
</template>
<script>
import AlbumContentItem from "../../components/AlbumContentItem";
export default {
  name: "SearchResults",
  components: { AlbumContentItem },
  mounted() {
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      await this.$axios
        .$post("https://pics.thomas.gg/api/search/query", JSON.parse(atob(this.$route.params.query)))
        .then(res => {
          this.photos = res;
          if(this.$route.hash) {
            this.$nextTick(() => {
              document.getElementById(this.$route.hash.replace("#", "")).scrollIntoView(true);
            })
          }
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      photos: []
    };
  }
};
</script>
