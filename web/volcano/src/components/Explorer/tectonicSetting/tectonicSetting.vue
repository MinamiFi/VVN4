<!-- tectonicSetting -->
<template>
    <div id="tectonicSetting">
        <div class="thickness">
            {{ getData[1] }}
        </div>
    </div>
</template>
  
<script>
import * as d3 from 'd3';
export default {
    data() {
        return {
            imageData: ["intraplate1.jpg", "rift1.jpg", "subduction1.jpg", 'others.jpg'],
            res: ''
        }
    },
    methods: {

    },
    props: ["getData"],
    mounted() {
        // console.log(this.getData)
    },
    watch: {
        "getData"(val) {
            console.log(val)
            if (val[0] == "Subduction zone") {
                this.res = this.imageData[2]
            }
            else if (val[0] == 'Rift zone') {
                this.res = this.imageData[1]
            }
            else if (val[0] == 'Intraplate') {
                this.res = this.imageData[0]
            }
            else {
                this.res = this.imageData[3]
            }
            document.getElementById("tectonicSetting")
                .setAttribute("style", `background-image: url('./${this.res}');`)
        },
        deep: true,
        immediate: true
    }
}
</script>
  
<style  scoped>
#tectonicSetting {
    height: 45vh;
    width: 29vw;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.thickness {
    margin-top: 1vh;
    width: 15vw;
    margin-left: auto;
    margin-right: auto;
    color: black;
    text-align: center;
    background-color: rgb(255, 77, 0);
    border-radius: .2vw;
    font-size: 1vw;
    font-family: regular;
    padding: .3vw 1vh;
    /* box-shadow: 1px 1px 1px 1px #676161; */
}
</style>
  