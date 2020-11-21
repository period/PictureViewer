<template>
  <div class="container">
    <h1>Photo of {{ photo.aircraft.registration }}</h1>
    <b-button v-if="photo.relative.previous != null" variant="primary" pill class="float-left" :to="'/photo/' + photo.relative.previous"><fa :icon="['fas', 'chevron-left']" /> Last Photo</b-button>
    <b-button  v-if="photo.relative.next != null" variant="primary" pill class="float-right" :to="'/photo/' + photo.relative.next"><fa :icon="['fas', 'chevron-right']" /> Next Photo</b-button>
    <b-img :src="'https://pics.thomas.gg/storage/full/' + this.$route.params.uuid + '.jpg'" fluid id="photo" class="mt-2" @load="imageLoaded()"></b-img>
    <h3 class="mt-2">Metadata</h3>
    <b-overlay :show="!loaded">
      <b-row>
        <b-col md="4">
          <h5><fa :icon="['fas', 'list-ol']" /> UUID</h5>
          <hr>
          {{photo.uuid}}
        </b-col>
        <b-col md="4">
          <h5><fa :icon="['fas', 'clock']" /> Date taken</h5>
          <hr>
          {{ $moment.unix(photo.timestamp).format("MMMM Do YYYY, HH:mm:ss") }} ({{ $moment.unix(photo.timestamp).fromNow() }})
        </b-col>
        <b-col md="4" v-if="photo.caption != null">
          <h5><fa :icon="['fas', 'pencil-alt']" /> Caption</h5>
          <hr>
          <div v-html="this.$parseCaption(photo.caption)"></div>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="4">
          <h5><fa :icon="['fas', 'plane']" /> Aircraft</h5>
          <hr>
          Registration: <b-link :to='generateSearch([{field: "registration", operator: "equals", value: photo.aircraft.registration}])'>{{ photo.aircraft.registration }}</b-link>
          <br>Type: <b-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}])'>{{ photo.aircraft.type }}</b-link>
          <br>MSN: <b-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}, {field: "msn", operator: "equals", value: photo.aircraft.msn}])'>{{ photo.aircraft.msn }}</b-link>
          <br>Airline: <b-link :to='generateSearch([{field: "airline", operator: "equals", value: photo.aircraft.airline}])'>{{ photo.aircraft.airline }}</b-link>
        </b-col>
        <b-col md="4">
          <h5><fa :icon="['fas', 'camera']" /> Camera</h5>
          <hr>
          Camera: <b-link :to='generateSearch([{field: "camera", operator: "equals", value: photo.camera}])'>{{ photo.camera }}</b-link>
          <br>ISO: {{ exif.iso }}
          <br>Shutter speed: 1/{{ exif.shutter }}s
          <br>Aperture: f/{{ exif.aperture }}
        </b-col>
        <b-col md="4">
          <h5><fa :icon="['fas', 'search-plus']" /> Lens</h5>
          <hr>
          Focal length: {{ exif.focalLength }}mm (35mm equiv.)
          <br>Lens: {{ exif.lens }}
        </b-col>
      </b-row>
    </b-overlay>
    <hr>
    <b-overlay :show="!loaded" class="mb-2">
      <h4>This photo is in {{ photo.albums.length + " album" + appendSuffix(photo.albums.length) }}:</h4>
      <b-card-group deck>
        <div v-for="album in photo.albums">
          <b-card no-body class="overflow-hidden" style="max-width: 540px;">
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img :src="'https://pics.thomas.gg/storage/thumbnails/' + album.header + '.jpg'" class="rounded-0"></b-card-img>
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
import EXIF from 'exif-js'
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
    async imageLoaded() {
      if(document.getElementById("photo") == null) return;
      let exifData = await new Promise(resolve =>
        EXIF.getData(document.getElementById("photo"), function() {
          resolve(EXIF.getAllTags(this)); 
        }
      ));
      let crop = 1;
      console.log(exifData);
      if(exifData.Model == "Canon PowerShot SX70 HS") crop = 5.22;
      else if(exifData.Model == "CLT-L09") crop = 4.5;
      this.exif = {iso: exifData.ISOSpeedRatings, shutter: exifData.ExposureTime.denominator, aperture: exifData.FNumber, focalLength: (exifData.FocalLength * crop).toFixed(1), lens: "(unknown)"};
      if(exifData.Model == "NIKON Z 7") this.exif.lens = exifData.undefined;
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
      photo: {aircraft: {}, albums: [], relative: {}},
      exif: {shutter: 0, aperture: 0, focalLength: 0},
      loaded: false
    };
  }
};
</script>
