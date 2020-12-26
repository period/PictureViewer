<template>
  <b-progress class="mt-2" :max="calculateTotal()" show-value>
    <b-progress-bar v-b-tooltip.hover :title="this.getAmountWithState('PHOTOGRAPHED') + ' aircraft - Amount of aircraft in this collection that I have good photos of'" :value="this.getAmountWithState('PHOTOGRAPHED')" variant="success" :label="'Photographed (' + Math.round((this.getAmountWithState('PHOTOGRAPHED') / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.getAmountWithState('NEEDS_RETAKE') + ' aircraft - Amount of aircraft in this collection that I have a photo of, but I am not happy with (e.g. unable to read registration clearly)'" :value="this.getAmountWithState('NEEDS_RETAKE')" variant="info" :label="'Needs retake (' + Math.round((this.getAmountWithState('NEEDS_RETAKE') / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.getAmountWithState('NOT_PHOTOGRAPHED') + ' aircraft - Amount of aircraft in this collection that I do not have a photo of at all'" :value="this.getAmountWithState('NOT_PHOTOGRAPHED')" variant="warning" :label="'Not Photographed (' + Math.round((this.getAmountWithState('NOT_PHOTOGRAPHED') / calculateTotal())*100)+'%)'"></b-progress-bar>
    <b-progress-bar v-b-tooltip.hover :title="this.getAmountWithState('IMPOSSIBLE') + ' aircraft - Amount of aircraft in this collection that have been retired and do not have a photograph'" :value="this.getAmountWithState('IMPOSSIBLE')" variant="danger" :label="'Impossible (' + Math.round((this.getAmountWithState('IMPOSSIBLE') / calculateTotal())*100)+'%)'"></b-progress-bar>
  </b-progress>
</template>
<script>
export default {
  name: "CollectionProgress",
  props: {
    progress: {
    }
  },
  data() {
    return {
      total: 0
    };
  },
  methods: {
    getAmountWithState(state) {
      if(this.progress == null) return 0;
      for(let i = 0; i < this.progress.length; i++) if(this.progress[i].state == state) return this.progress[i].count;
      return 0;
    },
    calculateTotal() {
      return this.getAmountWithState("PHOTOGRAPHED") + this.getAmountWithState("NEEDS_RETAKE") + this.getAmountWithState("NOT_PHOTOGRAPHED") + this.getAmountWithState("IMPOSSIBLE");
    }
  }
};
</script>
