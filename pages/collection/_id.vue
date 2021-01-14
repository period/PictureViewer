<template>
  <div class="container">
    <div>
        <h1>{{collection.name}}</h1>
        <div class="row mt-2">
          <div class="col-lg-12">
            <collection-progress :states="collection.states"></collection-progress>
          </div>
        </div>
        <h3>Photographed:</h3>
        <div class="card-deck">
            <div v-for="item in photos" :key="item.id">
              <collection-content-item :item="item"></collection-content-item>
            </div>
        </div>
        <h3>Missing/Needs retake:</h3>
        <div v-if="missingAirlines.length == 0"><p>None! :)</p></div>
        <div v-if="missingAirlines.length != 0">
          <div v-for="airline in missingAirlines" :key="airline.icao">
            <b-card :title="missing[airline].name">
              <b-row>
                <b-col sm=2 v-for="aircraft in missing[airline].aircraft" :key="aircraft.registration">
                  <p class="text-warning" v-if="aircraft.state == 'NOT_PHOTOGRAPHED'">{{ aircraft.registration }}</p>
                  <p class="text-info" v-if="aircraft.state == 'NEEDS_RETAKE'">{{ aircraft.registration }}</p>
                </b-col>
              </b-row>
            </b-card>
          </div>
        </div>
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
          this.missing = res.missing;
          this.missingAirlines = Object.keys(res.missing)
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
      missingAirlines: [],
      loaded: false
    };
  }
};
</script>
