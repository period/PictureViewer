<template>
<div>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/glider-js/1.6.6/glider.min.css" integrity="sha512-YM6sLXVMZqkCspZoZeIPGXrhD9wxlxEF7MzniuvegURqrTGV2xTfqq1v9FJnczH+5OGFl5V78RgHZGaK34ylVg==" crossorigin="anonymous" />
  <div class="container-fluid">
    <div class="background-header-holder">
      <div class="glider-contain">
        <div class="glider">
          <div class="background-header-image">
            <img src="https://pics.thomas.gg/storage/full/77de94b1-dfb2-4dc0-8a9b-d5d1bb74dfeb.jpg">
            <div class="background-header-text">
              <h1>Welcome to pics.thomas.gg!</h1>
            </div>
          </div>
        </div>
      </div>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
  </div>
</div>
</template>
<style scoped>
.background-header-holder {
  margin-left: -15px;
  margin-right: -15px;
}
.background-header-image {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  color: white;
}
.background-header-text {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<script>
export default {
  name: "Home",
  data() {
    return {
      slide: 0,
      featured: []
    }
  },
  async mounted() {
    new Glider(document.querySelector('.glider'));
    await this.$axios
        .$get("https://pics.thomas.gg/api/featured", {})
        .then(res => {
          this.featured = res;
        })
        .catch(res => {});
  }
};
</script>