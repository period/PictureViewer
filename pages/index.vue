<template>
    <div>
        <div class="container-fluid">
            <div class="background-header-holder">
                <div class="background-header-image">
                    <div class="background-header-text">
                        <h1>Welcome to pics.thomas.gg!</h1>
                    </div>
                </div>
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
        background-image: url(https://pics.thomas.gg/storage/full/77de94b1-dfb2-4dc0-8a9b-d5d1bb74dfeb.jpg);
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
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
            };
        },
        async mounted() {
            await this.$axios
                .$get("https://pics.thomas.gg/api/featured", {})
                .then(res => {
                    this.featured = res;
                })
                .catch(res => { });
        }
    };
</script>