<template>
  <n-link :to="'/collection/' + collection.id" class="nocolour">
    <div class="card mb-4 card-hover">
      <img
        :src="
          'https://pics.thomas.gg/storage/thumbnails/' + collection.header + '.jpg'
        "
        class="card-img-top"
      >
      <div class="card-body">
        <h5 class="card-title">{{ collection.name }}</h5>
        <div class="row d-flex justify-content-center">
          <collection-progress :states="collection.states" />
        </div>
      </div>
    </div>
  </n-link>
</template>
<script>
import CollectionProgress from "../components/CollectionProgress";

export default {
  name: "CollectionItem",
  components: {CollectionProgress},
  props: {
    collection: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      time: ""
    };
  },
  mounted() {

  }
};
</script>
