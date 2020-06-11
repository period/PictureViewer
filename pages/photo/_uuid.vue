<template>
  <div class="container">
    <h1>Photo of {{ photo.aircraft.registration }}</h1>
    <b-img :src="'https://pics.thomas.gg/storage/full/' + this.$route.params.uuid + '.jpg'" fluid></b-img>
    <h5>Metadata</h5>
    <b-overlay :show="!loaded">
      <b-list-group>
        <b-list-group-item>
          <b-badge variant="primary" pill><fa :icon="['fas', 'list-ol']" /> UUID</b-badge> {{ photo.uuid }}
        </b-list-group-item>
        <b-list-group-item>
          <b-badge variant="primary" pill><fa :icon="['fas', 'plane']" /> Aircraft registration (Type / MSN)</b-badge> <b-link :to='generateSearch([{field: "registration", operator: "equals", value: photo.aircraft.registration}])'>{{ photo.aircraft.registration }}</b-link> (<b-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}])'>{{ photo.aircraft.type }}</b-link> / <b-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}, {field: "msn", operator: "equals", value: photo.aircraft.msn}])'>{{ photo.aircraft.msn }}</b-link>)
        </b-list-group-item>
        <b-list-group-item>
          <b-badge variant="primary" pill><fa :icon="['fas', 'camera']" /> Camera</b-badge> {{ photo.camera }}
        </b-list-group-item>
        <b-list-group-item>
          <b-badge variant="primary" pill><fa :icon="['fas', 'clock']" /> Date taken</b-badge> {{ $moment.unix(photo.timestamp).format("MMMM Do YYYY, HH:mm:ss") }} ({{ $moment.unix(photo.timestamp).fromNow() }})
        </b-list-group-item>
        <b-list-group-item>
          <b-badge variant="primary" pill><fa :icon="['fas', 'flag']" /> Airline</b-badge> <b-link :to='generateSearch([{field: "airline", operator: "equals", value: photo.aircraft.airline}])'>{{ photo.aircraft.airline }}</b-link>
        </b-list-group-item>
      </b-list-group>
    </b-overlay>
    <b-overlay :show="!loaded">
      <h5>This photo is in {{ photo.albums.length + " album" + appendSuffix(photo.albums.length) }}:</h5>
      <b-card-group deck>
        <div v-for="album in photo.albums">
          <b-card no-body class="overflow-hidden" style="max-width: 540px;">
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img-lazy :src="'https://pics.thomas.gg/storage/thumbnails/' + album.header + '.jpg'" class="rounded-0"></b-card-img-lazy>
              </b-col>
              <b-col md="6">
                <b-card-body class="d-flex flex-column h-100" :title="album.name">
                  <b-button variant="primary" class="float-right mt-auto" :to="'/album/' + album.id + '#' + photo.uuid ">View <fa :icon="['fas', 'chevron-right']" /></b-button>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </b-card-group>
    </b-overlay>
  </div>
</template>
<script>
import CountryFlag from 'vue-country-flag'
export default {
  name: "Photo",
  components: { CountryFlag },
  mounted() {
    this.getPhoto();
  },
  methods: {
    generateSearch(searchValues) {
      return "/search/" + btoa(JSON.stringify([searchValues]));
    },
    async getPhoto() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/photo?id=" + this.$route.params.uuid, {})
        .then(res => {
          this.photo = res.photo;
          this.loaded = true;
        })
        .catch(res => {});
    },
    appendSuffix(amount) {
      if(amount == 1) return "";
      return "s";
    }
  },
  data() {
    return {
      photo: {aircraft: {}, albums: []},
      loaded: false
    };
  }
};
</script>
