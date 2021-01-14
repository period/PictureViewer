<template>
  <div class="progress mt-2">
    <div class="progress-bar bg-success" :style="'width: ' + getPercentage('PHOTOGRAPHED') + '%'">Photographed ({{ getPercentage("PHOTOGRAPHED") }}%)</div>
    <div class="progress-bar bg-info" :style="'width: ' + getPercentage('NEEDS_RETAKE') + '%'">Needs Retake ({{ getPercentage("NEEDS_RETAKE") }}%)</div>
    <div class="progress-bar bg-warning" :style="'width: ' + getPercentage('NOT_PHOTOGRAPHED') + '%'">Not Photographed ({{ getPercentage("NOT_PHOTOGRAPHED") }}%)</div>
    <div class="progress-bar bg-danger" :style="'width: ' + getPercentage('IMPOSSIBLE') + '%'">Impossible ({{ getPercentage("IMPOSSIBLE") }}%)</div>
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
