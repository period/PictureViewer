<template>
  <div class="container">
    <div>
      <b-card-group>
          <div v-for="photo in photos" :key="photo.uuid">
            <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
          </div>
      </b-card-group>
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
      return sql;
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
    async getPhotos() {
      await this.$axios
        .$post("https://pics.thomas.gg/api/search/query", {sql:this.generateSQL()})
        .then(res => {
          this.photos = res;
          if(this.$route.hash) {
            this.$nextTick(() => {
              document.getElementById(this.$route.hash.replace("#", "")).scrollIntoView(true);
            })
          }
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      photos: [],
      query: []
    };
  }
};
</script>
