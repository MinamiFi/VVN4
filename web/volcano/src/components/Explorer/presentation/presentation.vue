<!-- presentation -->
<template>
    <div id="presentation">
        <div class="presentation-row" id="presentation-row1">
            <div class="presentation-row-left">
                Volcano Number:
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.id }}
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Volcano Name:
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.name }}
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Volcano Type:
            </div>
            <div class="presentation-row-right" id="volcanoType">
                <div class="volcanoType-item" v-for="(item, index) in volcanoData.volcanoType">
                    &nbsp;{{ item }}&nbsp;
                </div>
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Location:
            </div>
            <div class="presentation-row-right">
                {{ Math.abs(volcanoData.location.coordinates[1]) + '°' + (volcanoData.location.coordinates[1] > 0 ? 'N ' :
                    'S ') + Math.abs(volcanoData.location.coordinates[0]) + '°' + (volcanoData.location.coordinates[0] > 0 ? 'E'
                        : 'W') }}
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Country:
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.country }}
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Rock Types:
            </div>
            <div class="presentation-row-right" id="rock-type">
                <select class="rock-type-select">
                    <option class="rock-type-option">major</option>
                    <option class="rock-type-option" v-if="index != 0" v-for="(item, index) in volcanoData.rockTypes.major">
                        {{
                            item }}
                    </option>
                </select>
                <select class="rock-type-select">
                    <option class="rock-type-option">minor</option>
                    <option class="rock-type-option" v-for="(item, index) in volcanoData.rockTypes.minor">{{ item }}
                    </option>
                </select>
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Elevation
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.elevation }}&nbsp;m
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Tectonic Settings:
            </div>
            <div class="presentation-row-right" id="tectonic-data">
                <select class="tectonic-select">
                    <option v-for="(item, index) in volcanoData.tectonicSetting">{{ item + "" }}</option>
                </select>
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Region:
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.region }}
            </div>
        </div>
        <div class="presentation-row">
            <div class="presentation-row-left">
                Subregion:
            </div>
            <div class="presentation-row-right">
                {{ volcanoData.subregion }}
            </div>
        </div>
    </div>
</template>
  
<script>
import { timeout } from 'd3';

export default {
    data() {
        return {
            volcanoData: {}
        }
    },
    methods: {

    },
    props: ["vData",],
    mounted() {
        // console.log(this.vData)
        this.volcanoData = this.vData
        // console.log(this.volcanoData.location)
        // console.log(this.volcanoData)
    },
    watch: {
        // "allVData"(val) {
        //   console.log(val)
        // },
        "vData"(val) {
            // console.log("vData", val)
            this.volcanoData = this.vData
            // this.$forceUpdate();
        },
        deep: true,
        immediate: true
    }
}
</script>
  
<style  scoped>
#presentation {
    height: 42vh;
    width: 29vw;
}

.presentation-row {
    display: flex;
    height: 3.8vh;
    width: 26vw;
    margin-left: auto;
    margin-right: auto;
    /* background-color: purple; */
    line-height: 3.8vh;
    text-align: left;
}

#presentation-row1 {
    padding-top: 2vh
}

.presentation-row-left {
    color: #d4d4d4;
    width: 8vw;
    font-size: 0.8vw;
    font-family: 'light';
}

.presentation-row-right {
    font-family: 'medium';
    font-size: .95vw;
    width: 19vw;
}

#volcanoType {
    display: flex;
}

#tectonic-data {
    display: flex;
}

.tectonic-select {
    background-color: transparent;
    color: #d4d4d4;
    width: 18vw;
    font-size: 1vw;
    text-indent: 1vw;
    line-height: 3.8vh;
}

.volcanoType-item {
    border: #d4d4d4 1px solid;
    font-size: 0.8vw;
    text-align: center;
}

.rock-type-select {
    background-color: transparent;
    color: #d4d4d4;
    width: 8vw;
    font-size: 1vw;
    text-indent: 2vw;
    line-height: 3.8vh;
}

.rock-type-option {
    color: black;
    line-height: 3.8vh;
    text-indent: 2vw;
    font-size: 1vw;
}
</style>
  