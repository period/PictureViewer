<template>
  <b-progress class="mt-2" :max="calculateTotal()" show-value>
    <b-progress-bar v-b-tooltip.hover :title="this.states['PHOTOGRAPHED'] + ' aircraft - Amount of aircraft in this collection that I have good photos of'" :value="this.states['PHOTOGRAPHED']" variant="success" :label="'Photographed (' + Math.round((this.states['PHOTOGRAPHED'] / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.states['NEEDS_RETAKE'] + ' aircraft - Amount of aircraft in this collection that I have a photo of, but I am not happy with (e.g. unable to read registration clearly)'" :value="this.states['NEEDS_RETAKE']" variant="info" :label="'Needs retake (' + Math.round((this.states['NEEDS_RETAKE'] / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.states['NOT_PHOTOGRAPHED'] + ' aircraft - Amount of aircraft in this collection that I do not have a photo of at all'" :value="this.states['NOT_PHOTOGRAPHED']" variant="warning" :label="'Not Photographed (' + Math.round((this.states['NOT_PHOTOGRAPHED'] / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.states['IMPOSSIBLE'] + ' aircraft - Amount of aircraft in this collection that have been retired and do not have a photograph'" :value="this.states['IMPOSSIBLE']" variant="danger" :label="'Impossible (' + Math.round((this.states['IMPOSSIBLE'] / calculateTotal())*100)+'%)'"></b-progress-bar>
  </b-progress>
</template>
<script>
export default {
  name: "CollectionProgress",
  props: {
    states: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      total: 0
    };
  },
  methods: {
    calculateTotal() {
      return this.states["PHOTOGRAPHED"] + this.states["NEEDS_RETAKE"] + this.states["NOT_PHOTOGRAPHED"] + this.states["IMPOSSIBLE"];
    }
  }
};
</script>
