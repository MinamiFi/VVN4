<!-- global -->
<template>
    <div id="global">
        <Map :volcanoData="vData" v-if="isShow"></Map>
        <div v-else class="loading"></div>
        <!-- footer -->
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
                        <b class="result-volcano-num">{{ volcanonum }}
                        </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volcanoes
                        are depicted on the map
                    </div>
                </div>
            </div>
        </div>
        <!-- <global_footer :volcanonum="getnum" :choosen="choose"></global_footer> -->
    </div>
</template>

<script>
import Map from "./center/map.vue";
// import global_footer from './footer/footer.vue'
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
            volcanoType: [],
            rockType: [],
            nowChoosen: [0, 0, 0, 0],
            volcanonum: 0,
            AllvData: [],
            vData: [],
            isShow: false
        }
    },
    methods: {
        getChoiceClass(index, i) {
            if (this.nowChoosen[index] == i)
                return 'global-footer-item-choice-item-right active-choice-btn'
            else
                return 'global-footer-item-choice-item-right'
        },
        choiceChange(i, j) {
            let temp = [];//存放筛选后的火山
            let temp_i = 0;
            this.d[i].choice[this.nowChoosen[i]].flag = false
            this.nowChoosen[i] = j
            this.d[i].choice[j].flag = true
            //时代
            //还没有其他数据
            if (this.nowChoosen[0] == 1) {
                this.vData = []
                this.volcanonum = 0
                return;
            }

            //地区region
            let region = this.d[1].choice[this.nowChoosen[1]].name;
            // console.log('region:' + region)

            //VolcanoTypes
            let volcanoType = this.d[2].choice[this.nowChoosen[2]].name;
            // console.log('volcanoType:' + volcanoType)

            //RockTypes
            let rockType = this.d[3].choice[this.nowChoosen[3]].name
            // console.log('rockType:' + rockType)

            this.AllvData.map(x => {
                // console.log(x)
                if (region == 'All') {//地区
                    if (volcanoType == 'All' || x.volcanoType.indexOf(volcanoType)) {//火山类型
                        if (rockType == 'All') {//岩石类型
                            temp[temp_i] = x
                            temp_i++;
                        }
                        else if (x.isDetail == true) {
                            if (x.rockTypes.major.indexOf(rockType) != -1 || x.rockTypes.minor.indexOf(rockType) != -1) {
                                temp[temp_i] = x
                                temp_i++;
                            }
                            else {
                                console.log(x.roc)
                            }
                        }
                    }
                }
                return;
            })

            this.vData = temp
            // console.log(this.vData)
            this.volcanonum = this.vData.length
            this.$forceUpdate();
        }

    },
    components: {
        Map,
        // global_footer
    },
    created() {

    },
    mounted() {
        let _this = this;
        // 将所有火山数据赋值给AllvData
        d3.json('./json/holoceneLatest(1).json').then((result) => {
            _this.AllvData = result
            _this.vData = _this.AllvData
            _this.volcanonum = _this.AllvData.length
            // console.log(_this.AllvData)
            _this.isShow = true
        });
        // console.log(_this.getnum)

        //获得火山类型数据
        d3.json('./json/AllvolcanoType.json').then((result) => {
            _this.volcanoType = result;
            // console.log(_this.volcanoType)
            _this.d[2].choice = _this.volcanoType.map(x => {
                return {
                    name: x,
                    flag: false
                }
            })
            _this.d[2].choice[this.nowChoosen[2]].flag = true
        })

        //获得岩石类型数据
        d3.json('./json/AllrockType.json').then((result) => {
            _this.rockType = result;
            // console.log(_this.volcanoType)
            _this.d[3].choice = _this.rockType.map(x => {
                return {
                    name: x,
                    flag: false
                }
            })
            _this.d[3].choice[this.nowChoosen[2]].flag = true
        })
        for (let i = 0; i < 4; i++)
            _this.d[i].choice[this.nowChoosen[i]].flag = true
    }

}
</script>

<style  scoped>
#global {
    height: 92vh;
    position: relative;
}

.loading {
    height: calc(67vh - 1px);
}

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
