<template>
  <b-card>
    <b-card-title>{{ collection.name }}</b-card-title>
    <b-card-img-lazy
      :src="
        'https://pics.thomas.gg/storage/thumbnails/' + collection.header + '.jpg'
      "
      top
    ></b-card-img-lazy>
    <template v-slot:footer>
      <collection-progress :states="collection.states"></collection-progress>
      <b-button class="float-right" style="margin-top:5px" variant="primary" :to="'/collection/' + collection.id">View</b-button>
    </template>
  </b-card>
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
