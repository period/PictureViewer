<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-sm-3 mt-2">
        <n-link :to="'/photo/' + photo.relative.previous"><button v-if="photo.relative.previous != null" class="btn btn-primary float-left"><fa :icon="['fas', 'chevron-left']" /> Last Photo</button></n-link>
      </div>
      <div class="col-lg-6 text-center">
        <h1>Photo of {{ photo.aircraft.registration }}</h1>
      </div>
      <div class="col-sm-3 mt-2">
        <n-link :to="'/photo/' + photo.relative.next"><button  v-if="photo.relative.next != null" class="btn btn-primary float-right" :to="'/photo/' + photo.relative.next"><fa :icon="['fas', 'chevron-right']" /> Next Photo</button></n-link>
      </div>
    </div>
    <img v-if="!zoomable" :src="'https://pics.thomas.gg/storage/full/' + this.$route.params.uuid + '.jpg'" id="photo" class="mt-2 img-fluid" @load="imageLoaded()" @click="zoomable = true">
    <zoom-on-hover v-if="zoomable" :scale="1.1" :img-normal="'https://pics.thomas.gg/storage/full/' + this.$route.params.uuid + '.jpg'" class="mt-2 img-fluid" />
      <div class="row mt-2">
        <div class="col-md-4">
          <h5><fa :icon="['fas', 'list-ol']" /> UUID</h5>
          <hr>
          {{photo.uuid}}
        </div>
        <div class="col-md-4">
          <h5><fa :icon="['fas', 'clock']" /> Date taken</h5>
          <hr>
          {{ $moment.unix(photo.timestamp).format("MMMM Do YYYY, HH:mm:ss") }} ({{ $moment.unix(photo.timestamp).fromNow() }})
        </div>
        <div class="col-md-4" v-if="photo.caption != null">
          <h5><fa :icon="['fas', 'pencil-alt']" /> Caption</h5>
          <hr>
          <div v-html="this.$parseCaption(photo.caption)"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-4">
          <h5><fa :icon="['fas', 'plane']" /> Aircraft</h5>
          <hr>
          Registration: <n-link :to='generateSearch([{field: "registration", operator: "equals", value: photo.aircraft.registration}])'>{{ photo.aircraft.registration }}</n-link>
          <br>Type: <n-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}])'>{{ photo.aircraft.type }}</n-link>
          <br>MSN: <n-link :to='generateSearch([{field: "aircraftType", operator: "equals", value: photo.aircraft.type}, {field: "msn", operator: "equals", value: photo.aircraft.msn}])'>{{ photo.aircraft.msn }}</n-link>
          <br>Airline: <n-link :to='generateSearch([{field: "airline", operator: "equals", value: photo.aircraft.airline}])'>{{ photo.aircraft.airline }}</n-link>
        </div>
        <div class="col-md-4">
          <h5><fa :icon="['fas', 'camera']" /> Camera</h5>
          <hr>
          Camera: <n-link :to='generateSearch([{field: "camera", operator: "equals", value: photo.camera}])'>{{ photo.camera }}</n-link>
          <br>ISO: {{ exif.iso }}
          <br>Shutter speed: 1/{{ exif.shutter }}s
          <br>Aperture: f/{{ exif.aperture }}
        </div>
        <div class="col-md-4">
          <h5><fa :icon="['fas', 'search-plus']" /> Lens</h5>
          <hr>
          Focal length: {{ exif.focalLength }}mm (35mm equiv.)
          <br>Lens: {{ exif.lens }}
        </div>
      </div>
    <hr>
    <div class="mb-2">
      <h4>This photo is in {{ photo.albums.length + " album" + appendSuffix(photo.albums.length) }}:</h4>
      <div class="card-deck">
        <div v-for="album in photo.albums" :key="album.id">
          <album-item :album="album" :photo="'#' + photo.uuid"></album-item>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import AlbumItem from "~/components/AlbumItem";
import ZoomOnHover from "vue-zoom-on-hover";
import Vue from "vue";
Vue.use(ZoomOnHover); // WHY DOES THIS HAVE TO BE SO COMPLICATED LOL WHO MADE THIS COMPONENT 🤡
import CountryFlag from 'vue-country-flag'
import EXIF from 'exif-js'
export default {
  name: "Photo",
  components: { CountryFlag, AlbumItem},
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
      loaded: false,
      zoomable: false
    };
  }
};
</script>
