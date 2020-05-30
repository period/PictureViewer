<template>
    <b-form-row>
        <b-col md="2"><b-form-select v-model="selectedField" :options="fields" @input="update()"></b-form-select></b-col>
        <b-col md="2"><b-form-select v-model="selectedOperator" :options="getOperators()" :disabled="selectedField == null" @input="update()"></b-form-select></b-col>
        <b-col md="6" v-if="getValueDropdownOptions().length > 0"><b-form-select v-model="selectedValue" :options="getValueDropdownOptions()" :disabled="selectedOperator == null" @input="update()"></b-form-select></b-col>
        <b-col md="6" v-if="getValueDropdownOptions().length == 0 && this.selectedField != 'timestamp'"><b-form-input v-model="selectedValue" placeholder="Enter a value" :disabled="selectedOperator == null" @input="update()"></b-form-input></b-col>
        <b-col md="6" v-if="this.selectedField == 'timestamp'"><b-form-datepicker v-model="selectedValue" start-weekday="1" class="mb-2" @input="update()"></b-form-datepicker></b-col>
        <b-col md="1"><b-button variant="secondary" class="w-100" @click="and()">And</b-button></b-col>
        <b-col md="1" v-if="displayOr"><b-button variant="secondary" class="w-100" @click="or()">Or</b-button></b-col>
    </b-form-row>
</template>
<script>
export default {
  name: "SearchCondition",
  props: {
    field: {
        type: String,
        default: null
    },
    operator: {
        type: String,
        default: null
    },
    value: {
        default: null
    },
    valueProps: {
        type: Object,
    },
    displayOr: {
        type: Boolean,
        default: true
    },
  },
  data() {
    return {
        fields: [{value: null, text: "Select field..."}, {value: "registration", text: "Aircraft registration"}, {value: "timestamp", text: "Date taken"}, {value: "aircraftType", text: "Aircraft type"}, {value: "msn", text: "Manufacturer's serial number (MSN)"}, {value: "airline", text: "Airline"}, {value: "camera", text: "Camera"}],
        selectedField: null,
        selectedOperator: null,
        selectedValue: null,
    };
  },
  mounted() {
      this.selectedField = this.field;
      this.selectedOperator = this.operator;
      this.selectedValue = this.value;
  },
  methods: {
      update() {
        if(this.selectedField == "timestamp" && this.selectedValue != null) {
            let tmpDate = new Date(this.selectedValue);
            $nuxt.$emit("condition-update", this.valueProps.orIndex, this.valueProps.andIndex, this.selectedField, this.selectedOperator, tmpDate.getTime() / 1000);
        }
        else $nuxt.$emit("condition-update", this.valueProps.orIndex, this.valueProps.andIndex, this.selectedField, this.selectedOperator, this.selectedValue);
      },
      and() {
        $nuxt.$emit("search-addand", this.valueProps.orIndex, this.valueProps.andIndex);
      },
      or() {
        $nuxt.$emit("search-addor", this.valueProps.orIndex, this.valueProps.andIndex);
      },
      getOperators() {
          if(this.selectedField == null) return [{value: null, text: "Select operator..."}];
          if(this.selectedField != "timestamp") return [{value: null, text: "Select operator..."}, {value: "equals", text: "equals"}, {value: "contains", text: "contains"}, {value: "startsWith", text: "starts with"}, {value: "endsWith", text: "ends with"}, {value: "matches", text: "matches pattern"}, {value: "not_equals", text: "doesn't equal"}, {value: "not_contains", text: "doesn't contain"}, {value: "not_startsWith", text: "doesn't start with"}, {value: "not_endsWith", text: "doesn't end with"}, {value: "not_matches", text: "doesn't match pattern"}]
          if(this.selectedField == "timestamp") return [{value: null, text: "Select operator..."}, {value: "on", text: "on"}, {value: "less_than", text: "before"}, {value: "greater_than", text: "after"}];
      },
      getValueDropdownOptions() {
          if(this.selectedField == null) return [];
          if(this.selectedOperator != null && (this.selectedOperator == "equals" || this.selectedOperator == "not_equals")) {
              if(this.selectedField == "aircraftType") return this.valueProps.types;
              if(this.selectedField == "airline") return this.valueProps.airlines;
          }
          return [];
      }
  }
};
</script>
