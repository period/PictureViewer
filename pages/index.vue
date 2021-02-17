<template>
    <div>
        <div class="container-fluid">
            <div class="background-header-holder">
                <div class="background-header-image" v-if="featured.uuid != null" v-bind:style="{ backgroundImage: 'url(https://pics.thomas.gg/storage/full/' + featured.uuid + '.jpg)' }">
                    <div class="background-header-text background-header-text-welcome">
                        <h1>Welcome to pics.thomas.gg!</h1>
                    </div>
                    <div class="background-header-text background-header-text-aircraft">
                        <n-link class="nocolour" :to="'/photo/' + featured.uuid"><h5>Featured photo: {{ featured.registration }}</h5></n-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="text-center">
                <h3>Statistics</h3>
                <div class="row">
                    <div class="col-md-4">
                        <h4>{{ stats.registrations }}</h4>
                        <p class="text-muted">unique registrations</p>
                    </div>
                    <div class="col-md-4">
                        <h4>{{ stats.photos }}</h4>
                        <p class="text-muted">photos</p>
                    </div>
                    <div class="col-md-4">
                        <h4>{{ stats.airlines }}</h4>
                        <p class="text-muted">unique airlines</p>
                    </div>
                </div>
                <hr>
                <h3>Recent Photos</h3>
                <div class="card-deck">
                    <div v-for="photo in recent_photos" :key="photo.uuid">
                        <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
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
        margin-top: -72px;
    }

    .background-header-image {
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
        left: 6.5%;
        top: 97.5%;
    }
</style>
<script>
import AlbumContentItem from "~/components/AlbumContentItem";

    export default {
        name: "Home",
        components: {AlbumContentItem},
        data() {
            return {
                featured: {uuid: null, registration: null},
                stats: {registrations: 0, photos: 0, airlines: 0},
                recent_photos: []
            };
        },
        async mounted() {
            window.addEventListener("scroll", this.onScroll);
            await this.$axios
                .$get("https://pics.thomas.gg/api/home", {})
                .then(res => {
                    this.featured = res.featured;
                    this.stats = res.statistics;
                    this.recent_photos = res.recent_photos;
                })
                .catch(res => { });
        },
        methods: {
            async onScroll() {
                let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
                if(bottomOfWindow) {
                    await this.$axios
                        .$get("https://pics.thomas.gg/api/recent?offset=" + this.recent_photos[this.recent_photos.length-1].timestamp, {})
                        .then(res => {
                            this.recent_photos.push(...res);
                        })
                        .catch(res => { });
                }
            }
        }
    };
</script>