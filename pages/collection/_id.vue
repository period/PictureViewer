<template>
  <div class="container">
    <div>
      <b-overlay :show="!loaded">
        <h1>{{collection.name}}</h1>
        <collection-progress :states="collection.states"></collection-progress>
        <h3>Photographed:</h3>
        <b-card-group>
            <div v-for="item in photos" :key="item.id">
              <collection-content-item :item="item"></collection-content-item>
            </div>
        </b-card-group>
        <h3>Missing:</h3>
        <div v-if="missing.length == 0"><p>None! :)</p></div>
        <div v-if="missing.length != 0">
          <div v-for="aircraft in missing" :key="aircraft.registration">
            {{ aircraft.registration }} <b-badge v-if="aircraft.state == 'NOT_PHOTOGRAPHED'" variant="warning">Not Photographed</b-badge><b-badge v-if="aircraft.state == 'IMPOSSIBLE'" variant="danger">Impossible to photograph</b-badge>
          </div>
        </div>
      </b-overlay>
    </div>
  </div>
</template>
<script>
import CollectionContentItem from "../../components/CollectionContentItem";
import CollectionProgress from "../../components/CollectionProgress";
export default {
  name: "Collection",
  components: { CollectionContentItem, CollectionProgress},
  mounted() {
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/collections/view?id=" + this.$route.params.id, {})
        .then(res => {
          this.collection = res;
          this.photos = res.aircraft.filter(aircraft => aircraft.photo!=null)
          this.missing = res.aircraft.filter(aircraft => aircraft.photo == null);
          this.items = res.aircraft;
          this.loaded = true;
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
      collection: {states:{}},
      items: [],
      photos: [],
      missing: [],
      loaded: false
    };
  }
};
</script>
