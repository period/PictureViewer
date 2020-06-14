<template>
  <div class="container">
    <h1>Search</h1>
    <b-overlay :show="!loaded">
        <div v-for="(ors, orIndex) in query" :key="orIndex">
          <b-card class="text-center">
          <div v-for="(and, andIndex) in ors" :key="andIndex">
            <search-condition :valueProps="{types: types, airlines: airlines, andIndex: andIndex, orIndex: orIndex}" :field="and.field" :operator="and.operator" :value="and.value" :displayOr="!(orIndex < query.length-1) && !(andIndex < query[orIndex].length-1)"></search-condition>
          </div>
          </b-card>
          <p v-if="orIndex < query.length-1">OR</p>
        </div>
    </b-overlay>
    <br>
    <b-button variant="primary" @click="search()">Search</b-button>
    <br><br>
    <p><strong>Generated query: </strong> {{ this.query }}</p>
    <p><strong>Generated SQL: </strong> {{ this.sql }}</p>
  </div>
</template>
<script>
import SearchCondition from "../../components/SearchCondition";
export default {
  name: "Search",
  components: {SearchCondition},
  mounted() {
    this.getProperties();
    this.$nuxt.$on("condition-update", (orIndex, andIndex, field, operator, value) => {
      this.query[orIndex][andIndex] = {field: field, operator: operator, value: value};
      this.generateSQL();
      this.$forceUpdate();
    });
    this.$nuxt.$on("search-addand", (orIndex, andIndex) => {
      this.query[orIndex].push({field: null, operator: null, value: null});
      this.generateSQL();
    });
    this.$nuxt.$on("search-addor", (orIndex, andIndex) => {
      this.query.push([{field: null, operator: null, value: null}]);
      this.generateSQL();
    });
  },
  methods: {
    generateSQL() {
      this.sql = "(";
      for(let orIndex = 0; orIndex < this.query.length; orIndex++) {
        if(orIndex >= 1) this.sql += ") OR (";
        for(let andIndex = 0; andIndex < this.query[orIndex].length; andIndex++) {
          this.sql += this.conditionToSQL(this.query[orIndex][andIndex])
          if(andIndex < this.query[orIndex].length-1) this.sql += " AND ";
        }
      }
      this.sql += ")"
    },
    conditionToSQL(condition) {
      if(condition.operator == "equals") return condition.field + " = '" + condition.value + "'";
      if(condition.operator == "contains") return condition.field + " LIKE '%" + condition.value + "%'";
      if(condition.operator == "startsWith") return condition.field + " LIKE '" + condition.value + "%'";
      if(condition.operator == "endsWith") return condition.field + " LIKE '%" + condition.value + "'";
      if(condition.operator == "matches") return condition.field + " LIKE '" + condition.value + "'";
      if(condition.operator == "not_equals") return condition.field + " != '" + condition.value + "'";
      if(condition.operator == "not_contains") return condition.field + " NOT LIKE '%" + condition.value + "%'";
      if(condition.operator == "not_startsWith") return condition.field + " NOT LIKE '" + condition.value + "%'";
      if(condition.operator == "not_endsWith") return condition.field + " NOT LIKE '%" + condition.value + "'";
      if(condition.operator == "not_matches") return condition.field + " NOT LIKE '" + condition.value + "'";
      if(condition.operator == "on") return "(" + condition.field + " >= " + condition.value + " AND " + condition.field + " < " + (condition.value + 86400) + ")";
      if(condition.operator == "less_than") return condition.field + " < " + condition.value;
      if(condition.operator == "greater_than") return condition.field + " > " + condition.value;
      return "";
    },
    search() {
        this.$router.push("/search/" + btoa(JSON.stringify(this.query, (key, value) => {
            if(value != null) return value;
        })));
    },
    async getProperties() {
      if(sessionStorage.getItem("database-properties") == null) {
        await this.$axios
          .$get("https://pics.thomas.gg/api/search/properties", {})
          .then(res => {
              sessionStorage.setItem("database-properties", JSON.stringify(res));
              for(var aircraftType in res.types) this.types.push({value: aircraftType, text: aircraftType + " (" + res.types[aircraftType] + " unique aircraft)"})
              for(var airline in res.airlines) this.airlines.push({value: airline, text: airline+ " (" + res.airlines[airline] + " unique aircraft)"})
              this.loaded = true;
          })
          .catch(res => {});
      }
      else {
        let res = JSON.parse(sessionStorage.getItem("database-properties"));
        for(var aircraftType in res.types) this.types.push({value: aircraftType, text: aircraftType + " (" + res.types[aircraftType] + " unique aircraft)"})
        for(var airline in res.airlines) this.airlines.push({value: airline, text: airline+ " (" + res.airlines[airline] + " unique aircraft)"})
        this.loaded = true;
      }
    }
  },
  data() {
    return {
        loaded: false,
        query: [[{field: null, operator: null, value: null}]],
        types: [{value: null, text: "Select an aircraft type"}],
        airlines: [{value: null, text: "Select an airline callsign"}],
        sql: ""
    };
  }
};
</script>
