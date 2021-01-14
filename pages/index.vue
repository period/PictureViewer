<template>
    <div>
        <div class="container-fluid">
            <div class="background-header-holder">
                <div class="background-header-image">
                    <div class="background-header-text background-header-text-welcome">
                        <h1>Welcome to pics.thomas.gg!</h1>
                    </div>
                    <div class="background-header-text background-header-text-aircraft">
                        <h3>Featured photo: 9V-SMF</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <p v-for="i in 10">placeholder</p>
        </div>
    </div>
</template>
<style scoped>

    .background-header-holder {
        margin-left: -15px;
        margin-right: -15px;
        margin-top: -72px;
    }

    .background-header-image {
        background-image: url(https://pics.thomas.gg/storage/full/77de94b1-dfb2-4dc0-8a9b-d5d1bb74dfeb.jpg);
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .background-header-text {
        position: absolute;
        transform: translate(-50%, -50%);
        opacity: 0.85;
        text-align: center;
        color: white;
    }
    .background-header-text-welcome {
        left: 50%;
        top: 20%;
    }
    .background-header-text-aircraft {
        left: 10%;
        top: 97.5%;
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