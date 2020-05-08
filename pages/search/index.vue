<template>
  <div class="container">
    <h1>Search</h1>
    <p>All selected parameters use 'AND' instead of 'OR'. If you don't want to query by a parameter, just leave it blank.</p>
    <hr>
    <b-form-group
        label="Aircraft type:"
        label-for="select-type"
    >
        <b-form-select v-model="selected.type" :options="types" id="select-type"></b-form-select>
    </b-form-group>
    <b-form-group
        label="Airline:"
        label-for="select-airline"
    >
        <b-form-select v-model="selected.airline" :options="airlines" id="select-airline"></b-form-select>
    </b-form-group>
    <b-form-group
        label="Aircraft registration:"
        label-for="input-registration"
    >
        <b-form-input v-model="selected.registration" trim placeholder="Type in the registration of the aircraft"></b-form-input>
    </b-form-group>
    <b-form-group
        label="Aircraft MSN (Manufacturer's Serial Number):"
        label-for="input-msn"
    >
        <b-form-input v-model="selected.msn" trim placeholder="Type in the MSN of the aircraft"></b-form-input>
    </b-form-group>
    <b-button variant="primary" @click="search()">Search</b-button>
  </div>
</template>
<script>
export default {
  name: "Search",
  components: {},
  mounted() {
    this.getProperties();
  },
  methods: {
    search() {
        this.$router.push("/search/" + btoa(JSON.stringify(this.selected, (key, value) => {
            if(value != null) return value;
        })));
    },
    async getProperties() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/search/properties", {})
        .then(res => {
            for(var aircraftType in res.types) this.types.push({value: aircraftType, text: aircraftType + " (" + res.types[aircraftType] + " unique aircraft)"})
          for(var airline in res.airlines) this.airlines.push({value: airline, text: airline+ " (" + res.airlines[airline] + " unique aircraft)"})
        })
        .catch(res => {});
    },
  },
  data() {
    return {
        selected: {type: null, airline: null, registration: null, msn: null},
        types: [{value: null, text: "Select an aircraft type"}],
        airlines: [{value: null, text: "Select an airline callsign"}]
    };
  }
};
</script>
