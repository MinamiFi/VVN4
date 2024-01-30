<!-- footer -->
<template>
    <div id="global-footer">
        <div class="global-footer-item" v-for="(item, index) in    d   ">
            <div class="global-footer-item-title" :id="'global-footer-item-title' + index">{{ item.title }}</div>
            <div class="global-footer-item-choice-container" :id="'global-footer-item-choice-container' + index">
                <div class="global-footer-item-choice-item" :id="'global-footer-item-choice-item' + index"
                    v-for="(  c, i  ) in item.choice" @click="choiceChange(index, i)">
                    <div class="global-footer-item-choice-item-left">{{ c.name }}</div>
                    <div :class="{ 'global-footer-item-choice-item-right': true, 'active-choice-btn': c.flag }">
                    </div>
                </div>
            </div>
        </div>
        <div class="global-footer-item">
            <div class="global-footer-item-title" id="global-footer-item-title4">Result</div>
            <div class="global-footer-item-choice-container" id="global-footer-item-choice-container4">
                <div class="global-footer-item-choice-item" id="result-volcano-num-container">
                    <b class="result-volcano-num">{{ volcanonum }} </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volcanoes
                    are depicted on the map
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    data() {
        return {
            d: [
                {
                    title: "Geological Epoch",
                    choice: [
                        { name: "Holocene", flag: false },
                        { name: "Pleistocene", flag: false }
                    ]
                },
                {
                    title: "Region",
                    choice: [
                        { name: "All", flag: false },
                        { name: "Africa", flag: false },
                        { name: "Antarctica", flag: false },
                        { name: "Asia", flag: false },
                        { name: "Europe", flag: false },
                        { name: "North America", flag: false },
                        { name: "South America", flag: false },
                        { name: "Oceania", flag: false }
                    ]
                },
                {
                    title: "Volcano Types",
                    choice: [
                        { name: "All", flag: false },
                        { name: "Shield Volcano", flag: false },
                        { name: "Volcano Field", flag: false },
                        { name: "Stratovolcano", flag: false },
                        { name: "Caldera", flag: false }
                    ]
                },
                {
                    title: "Rock Types",
                    choice: [
                        { name: "All", flag: false },
                        { name: "Dacite", flag: false },
                        { name: "Rhyloite", flag: false },
                        { name: "Foidite", flag: false },
                        { name: "Basalt", flag: false },
                    ]
                },
            ],
            nowChoosen: [0, 0, 0, 0]
        }
    },
    props: ["choosen", "volcanonum"],
    methods: {
        getChoiceClass(index, i) {
            if (this.nowChoosen[index] == i)
                return 'global-footer-item-choice-item-right active-choice-btn'
            else
                return 'global-footer-item-choice-item-right'
        },
        choiceChange(i, j) {
            this.d[i].choice[this.nowChoosen[i]].flag = false
            this.nowChoosen[i] = j
            this.d[i].choice[j].flag = true
            this.$forceUpdate();
        }
    },
    mounted() {
        this.nowChoosen = this.choosen
        for (let i = 0; i < 4; i++)
            this.d[i].choice[this.nowChoosen[i]].flag = true

    },
    watch: {
        'nowChoosen'(val) {
            // console.log(val)
        },
        deep: true,
        immediate: true
    }
}
</script>

<style  scoped>
#global-footer {
    height: 25vh;
    display: flex;
    border-radius: 15px;
    border-top: 2px solid #adacac;
    position: absolute;
    font-family: 'light';
}

.global-footer-item {
    width: calc(20vw - 2px);
    height: 25vh;
    /* background-color: beige; */

}

.global-footer-item-title {
    background: linear-gradient(#000, #2e2e2e);
    height: 6vh;
    text-align: center;
    line-height: calc(6vh - 2px);
    border-left: 1px solid #adacac;
    border-right: 1px solid #adacac;
    font-size: 1.2vw;
}

#global-footer-item-title0 {
    border-top-left-radius: 15px;
}

#global-footer-item-title4 {
    background: linear-gradient(#000, #565656);
    border-right: 2px solid #adacac;
    border-top-right-radius: 15px;

    .global-footer-item-choice-item {
        font-size: 10vw;
    }
}

.global-footer-item-choice-container {
    border-top: #abacac solid 1px;
    border-left: #abacac solid 1px;
    height: calc(19vh - 4px);
    overflow-y: scroll;
}

/* 滚动条整体 */
.global-footer-item-choice-container::-webkit-scrollbar {
    height: 19vh;
    width: 1px;
}

/* 两个滚动条交接处 -- x轴和y轴 */
.global-footer-item-choice-container::-webkit-scrollbar-corner {
    background-color: transparent;
}

/* 滚动条滑块 */
.global-footer-item-choice-container::-webkit-scrollbar-thumb {
    /* border-radius: 10px; */
    -webkit-box-shadow: inset 0 0 2px 1px #fff;
    background: #abacac;
}

/* 滚动条轨道 */
.global-footer-item-choice-container::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px #fff; */
    /* border-radius: 10px; */
    /* background: #ededed; */
    background: transparent;
}

/* 滚动条两端按钮 */
.global-footer-item-choice-container::-webkit-scrollbar-button {}


#global-footer-item-choice-container0 {
    overflow-y: auto;
}


.global-footer-item-choice-item {
    display: flex;
    position: relative;
    height: 4vh;
    line-height: 4vh;
    cursor: pointer;
}

.global-footer-item-choice-item-left {
    position: absolute;
    left: 4vw;
    font-size: 1vw;
}

.global-footer-item-choice-item-right {
    /* background-color: aliceblue; */
    position: absolute;
    right: 4vw;
    top: calc((4vh - 1vw)/2);
    width: 1vw;
    height: 1vw;
    border-radius: 20px;
    border: #fff solid 0.5px;
    box-shadow: 0 0 1px 0.5px #6d6d6d;
    transition: all 1s;
}

.active-choice-btn {
    border: 0;
    box-shadow: 0 0 3.5px 2px #6d6d6d;
    background-color: #ffffff;
}

.result-volcano-num {
    position: absolute;
    text-shadow: 1px 0px 5px #fff;
}

#result-volcano-num-container {
    width: 15vw;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3vh;
    font-size: 1.5vw;
}
</style>
