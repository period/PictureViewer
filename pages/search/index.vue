<template>
  <div class="container">
    <h1>Search</h1>
    <overlay :show="!loaded" :key="deletionKey">
        <div v-for="(ors, orIndex) in query" :key="'or_' + orIndex">
          <div class="card card-border text-center">
          <div v-for="(and, andIndex) in ors" :key="'and_' + andIndex">
            <search-condition class="mb-1" :valueProps="{types: types, airlines: airlines, andIndex: andIndex, orIndex: orIndex}" :field="and.field" :operator="and.operator" :value="and.value" :displayOr="!(orIndex < query.length-1) && !(andIndex < query[orIndex].length-1)" />
          </div>
          </div>
          <div v-if="orIndex < query.length-1" class="text-center separator">
            <b>or</b>
          </div>
        </div>
    </overlay>
    <br>
    <strong>Sort by</strong>
    <div class="row">
      <div class="col-md-3">
        <select class="form-control" @input="generateSQL()" v-model="sort_key">
          <option value="timestamp">Timestamp</option>
          <option value="msn">MSN</option>
          <option value="registration">Aircraft registration</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-control" @input="generateSQL()" v-model="sort_order">
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>
    </div>
    <br>
    <button class="btn btn-primary" @click="search()">Search</button>
    <br><br>
    <p><strong>Generated query: </strong> {{ this.query }}</p>
    <p><strong>Generated SQL: </strong> {{ this.sql }}</p>
    <style scoped>
      .separator:before, .separator:after {
          content:'\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0';
          text-decoration: line-through;
          margin: auto 1em;
      }
    </style>
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
    this.$nuxt.$on("search-remove", (orIndex, andIndex) => {
      console.log("Remove " + andIndex + " from " + orIndex);
      console.log(this.query[orIndex][andIndex]);
      if(this.query.length == 1 && this.query[orIndex].length == 1) { // deleting last remaining condition, so null it
        console.log("Last remaining condition deletion");
        this.query = [[{field: null, operator: null, value: null}]];
      }
      else {
        this.query[orIndex].splice(andIndex, 1);
        if(this.query[orIndex].length == 0) {
          console.log("Removing or index " + orIndex);
          this.query.splice(orIndex, 1); // purge OR block as empty
        }
      }
      this.generateSQL();
      this.$forceUpdate();
      this.deletionKey++;
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
      this.sql += " ORDER BY " + this.sort_key + " " + this.sort_order;
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
      if(condition.operator == "is_null") return condition.field + " IS NULL";
      if(condition.operator == "is_not_null") return condition.field + " IS NOT NULL";
      return "";
    },
    search() {
      this.query.push({is_sort: true, key: this.sort_key, order: this.sort_order})
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
        deletionKey: 0,
        loaded: false,
        sort_key: "timestamp",
        sort_order: "DESC",
        query: [[{field: null, operator: null, value: null}]],
        types: [{value: null, text: "Select an aircraft type"}],
        airlines: [{value: null, text: "Select an airline callsign"}],
        sql: ""
    };
  }
};
</script>
