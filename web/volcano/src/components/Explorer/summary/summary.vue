<!-- summary -->
<template>
    <div id="summary">
        <div class="title">
            Geological Summary
        </div>
        <div class="scroll">
            <div class="content">
                {{ content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            content: "The West Eifel Volcanic Field of western Germany, SW of the city of Bonn, is a dominantly Pleistocene group of 240 scoria cones, maars, and small stratovolcanoes covering an area of about 600 km2. The smaller, but better known, East Eifel Volcanic Field is about 40 km NE. Individual vents spread across a broad NW-SE-trending area extending about 50 km from the towns of Ormont on the NW to Bad Bertrich on the SE. Eruptions originated from a mantle plume through Devonian sedimentary and metamorphic rocks. Two-thirds of the volcanic centers in the field are scoria cones; lava flows have been produced from about half of them. About 30% of the centers are maars or tuff rings, many of which are occupied by lakes. About 230 eruptions have occurred during the past 730,000 years. The latest eruptions formed the Ulmener, Pulvermaar, and Strohn maars around the end of the Pleistocene and the beginning of the Holocene.\n\nThis volcano is located within the Vulkaneifel, a UNESCO Global Geopark property."
        }
    },
    methods: {

    },
    props: ["summaryData"],
    mounted() {
        // console.log(this.content)
        this.content = this.summaryData
    },
    watch: {
        // "allVData"(val) {
        //   console.log(val)
        // },
        "summaryData"(val) {
            this.content = this.summaryData
            // this.$forceUpdate();
        },
        deep: true,
        immediate: true
    }
}
</script>

<style  scoped>
#summary {
    text-align: left;
    height: 42vh;
    width: 29vw;
    /* text-indent: 2vw; */
    overflow-y: hidden;
}

.title {
    margin-left: 2vw;
    padding-top: 2vh;
    padding-bottom: 1.5vh;
    height: 3.5vh;
    line-height: 3.5vh;
    font-size: 1.5vw;
    font-family: 'semibold';
}

.content {
    height: 33.5vh;
    margin-left: 2vw;
    margin-right: 2vw;
    width: 25vw;
    color: #d4d4d4;
    font-family: 'light';
}

.scroll {
    overflow-y: scroll;
    width: 28vw;
}

/* 滚动条整体 */
.scroll::-webkit-scrollbar {
    /* height: 5vh; */
    width: 1.2px;
}

/* 两个滚动条交接处 -- x轴和y轴 */
.scroll::-webkit-scrollbar-corner {
    background-color: transparent;
}

/* 滚动条滑块 */
.scroll::-webkit-scrollbar-thumb {
    /* border-radius: 10px; */
    -webkit-box-shadow: inset 0 0 2px 1px #fff;
    background: #abacac;
}

/* 滚动条轨道 */
.scroll::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px #fff; */
    /* border-radius: 10px; */
    /* background: #ededed; */
    background: transparent;
}

/* 滚动条两端按钮 */
.scroll::-webkit-scrollbar-button {}
</style>
