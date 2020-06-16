<template>
  <div class="container">
    <div>
      <b-overlay :show="!loaded">
        <b-card-group>
            <div v-for="collection in collections" :key="collection.id">
              <collection-item :collection="collection"></collection-item>
            </div>
        </b-card-group>
      </b-overlay>
    </div>
  </div>
</template>
<script>
import CollectionItem from "../components/CollectionItem";
export default {
  name: "Collections",
  components: { CollectionItem },
  mounted() {
    this.getCollections();
  },
  methods: {
    async getCollections() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/collections/list", {})
        .then(res => {
          this.collections = res;
          this.loaded = true;
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      loaded: false,
      collections: []
    };
  }
};
</script>
