<!-- earth -->
<template>
    <div id="earth">
        <div id="earth-container">

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {

    },
    props: [],
    mounted() {
        setTimeout(() => require('./earth'), 200)
    }
}
</script>
  
<style>
#earth {
    position: relative;
    height: auto;
    width: 39vw;
}

#earth-container {
    margin-top: calc(15vh - 1px);
    margin-bottom: calc(15vh - 1px);
    margin-left: calc(5vw - 1px);
    margin-right: calc(5vw - 1px);
    height: 62vh;
    width: 29vw;
}

#earth-g .graticule {
    fill: none;
    /* fill: #fff; */
    /* stroke: #000; */
    stroke-width: .5px;
    stroke-opacity: .5;
    pointer-events: all;
}

#earth-g .countries {
    fill: #000;
    /* stroke: #fff; */
    stroke-width: 1;
}


#earth-g .map-volcano {
    /* fill: #992020; */
    stroke: #fff;

}

.earth-back {
    fill: #fff;
}
</style>
  