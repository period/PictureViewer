<template>
    <div class="container">
      <h1>Search Results</h1>
      <div class="card-deck">
          <div v-for="photo in photos" :key="photo.uuid">
            <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
          </div>
      </div>
  </div>
</template>
<script>
import AlbumContentItem from "../../components/AlbumContentItem";
export default {
  name: "SearchResults",
  components: { AlbumContentItem },
  mounted() {
    this.query = JSON.parse(atob(this.$route.params.query))
    if(this.query[this.query.length-1].hasOwnProperty("is_sort") && this.query[this.query.length-1].is_sort == true) {
      this.sort_key = this.query[this.query.length-1].key;
      this.sort_order = this.query[this.query.length-1].order;
      this.query.splice(this.query.length-1,1);
    }
    this.getPhotos();
  },
  methods: {
    generateSQL() {
      let sql = "(";
      for(let orIndex = 0; orIndex < this.query.length; orIndex++) {
        if(orIndex >= 1) sql += ") OR (";
        for(let andIndex = 0; andIndex < this.query[orIndex].length; andIndex++) {
          sql += this.conditionToSQL(this.query[orIndex][andIndex])
          if(andIndex < this.query[orIndex].length-1) sql += " AND ";
        }
      }
      sql += ")"
      sql += " ORDER BY " + this.sort_key + " " + this.sort_order;
      return sql;
    },
    conditionToSQL(condition) {
      if(condition.field == "registration" && condition.operator == "equals") {
        console.log("Upper casing registration!");
        condition.value = condition.value.toUpperCase();
      }
      
      if(condition.operator == "equals" && condition.value == "Unknown") return condition.field + " IS NULL";
      if(condition.operator == "not_equals" && condition.value == "Unknown") return condition.field + " IS NOT NULL";

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
    getPhotos() {
      if(sessionStorage.getItem("database") == null) this.getData();
      else this.performQuery();
    },
    async getData() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/search/data")
        .then(res => {
          sessionStorage.setItem("database", JSON.stringify(res));
          this.performQuery();
        })
        .catch(res => {});
    },
    performQuery() {

      this.alasql.promise("SELECT * FROM ? WHERE " + this.generateSQL(), [JSON.parse(sessionStorage.getItem("database"))]).then(sqRes => {
            let patched = [];
            for(var i = 0; i < sqRes.length; i++) patched.push({
              uuid: sqRes[i].uuid,
              timestamp: sqRes[i].timestamp,
              camera: sqRes[i].camera,
              aircraft: {registration: sqRes[i].registration, type: sqRes[i].aircraftType, msn: sqRes[i].msn, airline: sqRes[i].airline}
            })
            this.photos = patched;
            if(this.$route.hash) {
              this.$nextTick(() => {
                document.getElementById(this.$route.hash.replace("#", "")).scrollIntoView(true);
              })
            }
          }).catch(sqErr => {
            console.log("Caught " + sqErr);
          })
    }
  },
  data() {
    return {
      photos: [],
      page_items: [],
      query: [],
      sort_key: "timestamp",
      sort_order: "DESC",
      currentPage: 0,
      perPage: 30
    };
  }
};
</script>
