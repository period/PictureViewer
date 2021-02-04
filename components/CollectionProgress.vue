<template>
  <div class="progress mt-2">
    <div v-tooltip="states['PHOTOGRAPHED'] + '/' + calculateTotal() + ' aircraft that have a good photo'" class="progress-bar bg-success" :style="'width: ' + getPercentage('PHOTOGRAPHED') + '%'">Photographed ({{ getPercentage("PHOTOGRAPHED") }}%)</div>
    <div v-tooltip="states['NEEDS_RETAKE'] + '/' + calculateTotal() + ' aircraft that have a photo but registration not clear'" class="progress-bar bg-info" :style="'width: ' + getPercentage('NEEDS_RETAKE') + '%'">Needs Retake ({{ getPercentage("NEEDS_RETAKE") }}%)</div>
    <div v-tooltip="states['NOT_PHOTOGRAPHED'] + '/' + calculateTotal() + ' aircraft that have not been photo\'d yet'" class="progress-bar bg-warning" :style="'width: ' + getPercentage('NOT_PHOTOGRAPHED') + '%'">Not Photographed ({{ getPercentage("NOT_PHOTOGRAPHED") }}%)</div>
    <div v-tooltip="states['IMPOSSIBLE'] + '/' + calculateTotal() + ' aircraft that have been scrapped before being photo\'d'" class="progress-bar bg-danger" :style="'width: ' + getPercentage('IMPOSSIBLE') + '%'">Impossible ({{ getPercentage("IMPOSSIBLE") }}%)</div>
  </div>
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
    },
    getPercentage(state) {
      return ((this.states[state] / this.calculateTotal())*100).toFixed(1);
    }
  }
};
</script>
