<template>
<div class="container">
    <div class="row py-2">
      <div class="col-12 py-4">
        <h1>Collections</h1>
      </div>
      <div v-for="collection in collections" :key="collection.id" class="col-6">
        <collection-item :collection="collection"></collection-item>
      </div>
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
