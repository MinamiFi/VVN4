<!-- global -->
<template>
    <div id="global">
        <Map></Map>
        
        <global_footer :volcanonum="getnum" :choosen="choose"></global_footer>
    </div>
</template>

<script>
import Map from "./center/map.vue";
import global_footer from './footer/footer.vue'

export default {
    data() {
        return {
            choose: [0, 1, 2, 1],
            getnum: 221
        }
    },
    methods: {

    },
    components: {
        Map, global_footer
    },
    mounted() {
        // console.log(this.getnum)
    }

}
</script>

<style  scoped>
#global {
    height: 92vh;
    position: relative;
}
</style>
