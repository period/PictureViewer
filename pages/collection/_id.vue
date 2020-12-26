<template>
  <div class="container">
    <div>
      <b-overlay :show="!loaded">
        <h1>{{collection.name}}</h1>
        <collection-progress :progress="collection.progress"></collection-progress>
        <h3>Photographed:</h3>
        <b-card-group>
            <div v-for="item in photos" :key="item.id">
              <collection-content-item :item="item"></collection-content-item>
            </div>
        </b-card-group>
        <h3>Missing/Needs retake:</h3>
        <div v-if="missing.length == 0"><p>None! :)</p></div>
        <div v-if="missing.length != 0">
          <div v-for="airline in missing_airlines" :key="airline">
            <b-card :title="airline">
              <b-row>
                <b-col sm=2 v-for="aircraft in missing_grouped[airline]" :key="aircraft.registration">
                  <p class="text-danger" v-if="aircraft.state == 'IMPOSSIBLE'">{{ aircraft.registration }}</p>
                  <p class="text-warning" v-if="aircraft.state == 'NOT_PHOTOGRAPHED'">{{ aircraft.registration }}</p>
                  <p class="text-info" v-if="aircraft.state == 'NEEDS_RETAKE'">{{ aircraft.registration }}</p>
                </b-col>
              </b-row>
            </b-card>
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
        .$get("https://pics.thomas.gg/api/v1/collections/" + this.$route.params.id, {})
        .then(res => {
          res = res.data;
          this.collection = res;
          this.photos = res.aircraft.filter(aircraft => aircraft.photo!=null);
          this.missing = res.aircraft.filter(aircraft => aircraft.state != 'PHOTOGRAPHED');
          this.missing_grouped = {};
          for(let i = 0; i < this.missing.length; i++) {
            if(this.missing[i].operator == null) this.missing[i].operator = {icao: null, iata: null, name: "Unknown"};
            if(this.missing_grouped[this.missing[i].operator.name] == null) this.missing_grouped[this.missing[i].operator.name]= [];
            this.missing_grouped[this.missing[i].operator.name].push(this.missing[i]);
          }
          this.missing_airlines = Object.keys(this.missing_grouped);
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
      collection: {progress:[]},
      photos: [],
      missing: [],
      missing_grouped: {},
      missing_airlines: [],
      loaded: false
    };
  }
};
</script>
