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
        <div class="row">
          <div class="col-md-9">
            <h3>Missing/Needs retake:</h3>
          </div>
          <div class="col-md-3">
            <div class="float-right">
              <label>Include photographed? <input type="checkbox" v-model="include_photographed" /></label>
            </div>
          </div>
        </div>
        <div v-if="airlines.length == 0"><p>None! :)</p></div>
        <div v-else>
          <div v-for="airline in airlines.filter((airline) => { return all_grouped[airline].aircraft.filter((aircraft) => {return (include_photographed && aircraft.state == 'PHOTOGRAPHED') || aircraft.state != 'PHOTOGRAPHED'}).length > 0})" :key="airline.icao">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ all_grouped[airline].name }}</h5>
                <div class="row card-text">
                  <div class="col-sm-2" v-for="aircraft in all_grouped[airline].aircraft.filter((aircraft) => {return (include_photographed && aircraft.state == 'PHOTOGRAPHED') || aircraft.state != 'PHOTOGRAPHED'})" :key="aircraft.registration">
                    <p :class="getClassFromState(aircraft.state)">{{ aircraft.registration }}<span v-if="!aircraft.is_ground">*</span><span v-if="aircraft.is_bad_camera">^</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <small>* denotes high altitude; ^ denotes non-Z7 photo</small>
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
    getClassFromState(state) {
      return {
        "PHOTOGRAPHED": "text-success",
        "NEEDS_RETAKE": "text-info",
        "NOT_PHOTOGRAPHED": "text-warning",
        "IMPOSSIBLE": "text-danger"
      }[state]
    },
    async getPhotos() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/collections/view?id=" + this.$route.params.id, {})
        .then(res => {
          this.collection = res;
          this.photos = res.aircraft.filter(aircraft => aircraft.photo!=null)
          this.all_grouped = res.all_grouped;
          this.airlines = Object.keys(res.all_grouped);
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
      all_grouped: [],
      airlines: [],
      loaded: false,
      include_photographed: false
    };
  }
};
</script>
