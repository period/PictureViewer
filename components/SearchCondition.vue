<template>
    <div class="row no-gutters align-center">
        <div class="col-md-3 px-1">
          <select class="form-control" v-model="selectedField" @change="update()">
            <option v-for="field in fields" :value="field.value">{{field.text}}</option>
          </select>
        </div>
        <div class="col-md-3 px-1">
          <select class="form-control" v-model="selectedOperator" :disabled="selectedField == null" @change="update()">
            <option v-for="field in getOperators()" :value="field.value">{{field.text}}</option>
          </select>
        </div>
        <div class="col-md-3 px-1" v-if="getValueDropdownOptions().length > 0">
          <select class="form-control" v-model="selectedValue" :disabled="selectedOperator == null" @change="update()">
            <option v-for="field in getValueDropdownOptions()" :value="field.value">{{field.text}}</option>
          </select>
        </div>
        <div class="col-md-3 px-1" v-if="getValueDropdownOptions().length == 0 && this.selectedField != 'timestamp' && (this.selectedField == 'caption' && this.selectedOperator != null && this.selectedOperator.endsWith('null')) == false">
          <vue-bootstrap-typeahead 
            v-model="selectedValue"
            :data="getTypeaheadData()"
            v-if="this.selectedField == 'registration'"
            @input="update()"
            placeholder="Enter a registration"

          />
          <input v-else class="form-control" v-model="selectedValue" placeholder="Enter a value" :disabled="selectedOperator == null" @input="update()">
        </div>
        <div class="col-md-3 px-1" v-if="this.selectedField == 'timestamp'">
          <date-picker v-model="selectedValue" class="mb-2" @input="update()"></date-picker>
        </div>
        <div class="col-md-1 px-1"><button class="btn btn-secondary w-100" @click="and()">and</button></div>
        <div class="col-md-1 px-1"><button v-if="displayOr" class="btn btn-secondary w-100" @click="or()">or</button></div>
        <div class="col-md-1 px-1"><button class="btn btn-danger w-100" @click="remove()"><fa :icon="['fas', 'trash']" /></button></div>
    </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
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
    indexes: {
        type: Object,
    },
    types: {

    },
    airlines: {

    },
    registrations: {
      type: Array
    },
    displayOr: {
        type: Boolean,
        default: true
    }
  },
  components: {DatePicker, VueBootstrapTypeahead},
  data() {
    return {
        fields: [{value: null, text: "Select field..."}, {value: "registration", text: "Aircraft registration"}, {value: "timestamp", text: "Date taken"}, {value: "aircraftType", text: "Aircraft type"}, {value: "msn", text: "Manufacturer's serial number (MSN)"}, {value: "airline", text: "Airline"}, {value: "camera", text: "Camera"}, {value: "caption", text: "Caption"}],
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
        if(this.selectedField == "registration" && this.selectedOperator == null && this.selectedValue == null) this.selectedOperator = "equals";
        if(this.selectedField == "caption" && this.selectedOperator != null && this.selectedOperator.endsWith("null")) this.selectedValue = " ";
        if(this.selectedField == "timestamp" && this.selectedValue != null) {
            let tmpDate = new Date(this.selectedValue);
            $nuxt.$emit("condition-update", this.indexes.or, this.indexes.and, this.selectedField, this.selectedOperator, tmpDate.getTime() / 1000);
        }
        else $nuxt.$emit("condition-update", this.indexes.or, this.indexes.and, this.selectedField, this.selectedOperator, this.selectedValue);
      },
      and() {
        $nuxt.$emit("search-addand", this.indexes.or, this.indexes.and);
      },
      or() {
        $nuxt.$emit("search-addor", this.indexes.or, this.indexes.and);
      },
      remove() {
        $nuxt.$emit("search-remove", this.indexes.or, this.indexes.and);
      },
      getTypeaheadData() {
        if(this.selectedField == "registration") return this.registrations;
        return [];
      },
      getOperators() {
        if(this.selectedField == null) return [{value: null, text: "Select operator..."}];
        if(this.selectedField == "timestamp") return [{value: null, text: "Select operator..."}, {value: "on", text: "on"}, {value: "less_than", text: "before"}, {value: "greater_than", text: "after"}];
        if(this.selectedField == "caption") return [{value: null, text: "Select operator..."}, {value: "equals", text: "equals"}, {value: "contains", text: "contains"}, {value: "startsWith", text: "starts with"}, {value: "endsWith", text: "ends with"}, {value: "matches", text: "matches pattern"}, {value: "not_equals", text: "doesn't equal"}, {value: "not_contains", text: "doesn't contain"}, {value: "not_startsWith", text: "doesn't start with"}, {value: "not_endsWith", text: "doesn't end with"}, {value: "not_matches", text: "doesn't match pattern"}, {value: "is_null", text: "has no caption"}, {value: "is_not_null", text: "has caption"}]
        else return [{value: null, text: "Select operator..."}, {value: "equals", text: "equals"}, {value: "contains", text: "contains"}, {value: "startsWith", text: "starts with"}, {value: "endsWith", text: "ends with"}, {value: "matches", text: "matches pattern"}, {value: "not_equals", text: "doesn't equal"}, {value: "not_contains", text: "doesn't contain"}, {value: "not_startsWith", text: "doesn't start with"}, {value: "not_endsWith", text: "doesn't end with"}, {value: "not_matches", text: "doesn't match pattern"}]
      },
      getValueDropdownOptions() {
          if(this.selectedField == null) return [];
          if(this.selectedOperator != null && (this.selectedOperator == "equals" || this.selectedOperator == "not_equals")) {
              if(this.selectedField == "aircraftType") return this.types;
              if(this.selectedField == "airline") return this.airlines;
          }
          return [];
      }
  }
};
</script>
