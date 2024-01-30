<!-- exployer -->
<template>
  <div id="explorer">
    <div id="explorer-left">
      <div class="explorer-left-row">
        <div class="explorer-left-item explorer-left-item-black">
          <presentation :vData="vData"></presentation>
        </div>
        <div class="explorer-left-item explorer-left-item-white">
          <population :getData="vData.population"></population>
        </div>
      </div>

      <div class="explorer-left-row">
        <div class="explorer-left-item explorer-left-item-white">
          <tectonicSetting :getData="vData.tectonicSetting"></tectonicSetting>
        </div>
        <div class="explorer-left-item explorer-left-item-black">
          <Summary :summaryData="vData.geologicalSummary"></Summary>
        </div>
      </div>
    </div>

    <div id="explorer-right">
      <!-- <earth></earth> -->
      <div id="earth" v-if="isShow">
        <div id="earth-container">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import earth from './earth/earth.vue';
import tectonicSetting from './tectonicSetting/tectonicSetting.vue';
import population from './population/population.vue';
import presentation from './presentation/presentation.vue'
import Summary from './summary/summary.vue';

import * as d3 from 'd3'
import * as topojson from 'topojson'

export default {
  data() {
    return {
      vData: {
        id: "290070",
        region: "Kuril Islands",
        subregion: "Kuril Islands",
        lastKnownEruption: "2013 CE",
        country: "Japan",
        primaryType: "Complex",
        elevation: 1158,
        location: {
          "type": "Point",
          "coordinates": [
            147.871,
            45.012
          ]
        },
        latitude: 45.012,
        longitude: 147.871,
        isNorth: true,
        isEast: true,
        volcanoType: [
          "Complex",
          "Lava dome(s)",
          "Caldera"
        ],
        geologicalSummary: "The Etorofu-Yakeyama (Ivan Grozny) complex is located in the center of Iturup Island. It has a 3-3.5 km diameter caldera open to the south, where a large extrusive andesitic dome was emplaced. Several other lava domes of Holocene age were constructed to the NE; extrusion of these domes has constricted a former lake in the northern side of the caldera to an extremely sinuous shoreline. Recorded eruptions, the first of which took place in 1968, have been from the central Yakeyama (Grozny) dome.",
        isDetail: true,
        rockTypes: {
          isMajor: true,
          isMinor: false,
          major: [
            "Major",
            "Andesite",
            "Basaltic Andesite"
          ],
          minor: []
        },
        tectonicSetting: [
          "Subduction zone",
          "Intermediate crust (15-25 km)"
        ],
        population: [
          0,
          39,
          2417,
          6361
        ],
        name: "Etorofu-Yakeyama [Grozny Group]",
        iseruption: true,
        eruption: 2013
      },
      isShow: true,
      allVData: []
    }
  },
  methods: {

  },
  props: [],
  mounted() {
    let _this = this;
    _this.isShow = true;

    let width = document.getElementById('earth-container').offsetWidth,
      height = document.getElementById('earth-container').offsetHeight,
      scale = 230,
      origin = {
        // x: -105,
        // y: -55
        x: 0,
        y: 0
      };
    let world;
    let Vdata;

    // 选择body、div确定绘制地球位置和宽高
    let svg = d3.select('#earth-container').append('svg')
      .attr('width', width)
      .attr('height', height);

    let group = svg.append("g")
      .datum({ x: 0, y: 0 })
      .attr("id", "earth-g");

    //当作背景的白色圆形
    let backCirle = group.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", scale)
      .attr('class', "earth-back");

    // 定义投影坐标系统
    let projection = d3.geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([origin.x, origin.y])
      .center([0, 0])
      .clipAngle(90);

    // 生成地理投影路径
    let geoPath = d3.geoPath()
      .projection(projection);

    // 创建地球网格
    let graticule = d3.geoGraticule();

    // 地球缩放和拖拽
    svg.call(d3.zoom().on('zoom', zoomed));

    group.call(d3.drag().on('drag', dragged).on('end', dragEnd));

    // code snippet from http://stackoverflow.com/questions/36614251
    let lambda = d3.scaleLinear()
      .domain([-width, width])
      .range([-180, 180])

    let phi = d3.scaleLinear()
      .domain([-height, height])
      .range([90, -90]);
    // 给地球添加网格并定义样式
    group.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', geoPath);

    function dragged(event) {
      let r = {
        x: lambda((event.x)),
        y: phi((event.y))
      };
      // console.log(r);
      projection.rotate([origin.x + r.x, origin.y + r.y]);
      updatePaths(svg, graticule, world, geoPath);
      updateVolcano(svg, Vdata, projection, geoPath, 1);
    };

    function dragEnd(event) {
      let r = {
        x: lambda((event.x)),
        y: phi((event.y))
      };
      origin.x += r.x;
      origin.y += r.y;
    }

    // function zoomed(event) {
    //     let transform = event.transform;
    //     let k = Math.sqrt(100 / projection.scale());
    //     projection.scale(scale * transform.k)
    //     updatePaths(svg, graticule, world, geoPath);
    //     updateVolcano(svg, Vdata, projection, geoPath, scale);
    // };
    function zoomed(event) {
      let transform = event.transform;
      // console.log(transform)
      group.attr('transform', transform)
      // projection.scale(scale * transform.k)
      // updatePaths(group, geojson, pathGenerator);
    };


    function updatePaths(svg, graticule, world, geoPath) {
      // console.log(world)
      svg.selectAll('path.graticule').datum(graticule).attr('d', geoPath);
      svg.selectAll('path.countries').datum(world).attr('d', geoPath);
    };

    function updateVolcano(svg, Vdata, projection, geoPath, scale) {
      // console.log(Vdata)
      // console.log(Vdata)
      svg.selectAll('circle.map-volcano').data(Vdata)
        .attr('cx', d => projection(d.location.coordinates)[0])
        .attr('cy', d => projection(d.location.coordinates)[1]);
    }

    //测试数据
    // Vdata = [{ "type": "Point", "coordinates": [-77, 38] }, { "type": "Point", "coordinates": [116, 39] }]

    // 加载全球json数据，绘制陆地
    d3.json("./json/countries-110m.json").then(function (worldJSON) {
      world = topojson.feature(worldJSON, worldJSON.objects.countries);
      group.append("path")
        .datum(world)
        .attr("class", "countries")
        .attr("d", geoPath);

      d3.json("./json/holoceneLatest(1).json").then(d => {
        _this.allVData = d;
        _this.vData = d[0];
        Vdata = d;
        drawVolcano(projection, geoPath, Vdata);
      })
    });

    let i = 0;

    function redraw() {
      let proj = projection.rotate([0.2 * i, 0, 0]),
        path = d3.geoPath().projection(projection)

      group.selectAll("path")
        .datum(world)
        .attr("class", "land")
        .attr("d", geoPath);

      group.select("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", geoPath);

      i++

      window.requestAnimationFrame(redraw)
    }
    // 调用地球重绘函数
    // window.requestAnimationFrame(redraw)

    //画火山
    function drawVolcano(projection, pathGenerator, Vdata) {
      // let volcanos = group.selectAll('.map-volcano')
      //     .data(Vdata)
      //     .enter()
      //     .append("path")
      //     .attr('d', pathGenerator)
      //     .attr("class", "map-volcano")
      //     .style("transform", "scale(1)")
      let volcanos = group.selectAll('.map-volcano')
        .data(Vdata)
        .enter()
        .append("circle")
        .attr('cx', d => projection(d.location.coordinates)[0])
        .attr('cy', d => projection(d.location.coordinates)[1])
        .attr('r', 1)
        .attr("class", "map-volcano")
        .attr('fill', d => {
          // if (d.location.coordinates[0] > origin.x + 90
          //     || d.location.coordinates[0] < origin.x - 90
          //     || d.location.coordinates[1] > origin.y + 90
          //     || d.location.coordinates[1] > origin.y - 90) {
          //     console.log(d)
          //     return 'none'
          // }
          // console.log(2)
          return '#992020'
        })
        .on('click', function (d) {
          d3.selectAll(".map-volcano")
            .attr('fill', d => {
              // if (d.location.coordinates[0] > origin.x + 90
              //     || d.location.coordinates[0] < origin.x - 90
              //     || d.location.coordinates[1] > origin.y + 90
              //     || d.location.coordinates[1] > origin.y - 90) {
              //     console.log(1)
              //     return 'none'
              // }
              // console.log(2)
              return '#992020'
            })
          d3.select(this)
            .attr('fill', d => {
              // console.log(d)
              // console.log(_this.vData)
              _this.vData = d;
              return "#fff"
            })

        })

    }

  },
  components: {
    earth, tectonicSetting, population, presentation, Summary
  },
  watch: {
    // "allVData"(val) {
    //   console.log(val)
    // },
    // "vData"(val) {
    // console.log("vData", val)
    // this.$forceUpdate();
    // },
    deep: true,
    immediate: true
  }
}
</script>

<style  scoped>
#explorer {
  height: 92vh;
  display: flex;
  background-image: url('@/assets/explorer.webp');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

#explorer-left {
  display: flex;
  width: 60vw;
  height: 92vh;
}

.explorer-left-row {
  width: 39vw;
  height: 92vh;
  margin-left: 1vw;
}

.explorer-left-item {
  width: 29vw;
  margin-top: 1vw;
  border-radius: 1vw;
}

.explorer-left-item-white {
  background-color: rgba(243, 243, 235, 0.922);
  height: 45vh;
  overflow: hidden;
}


.explorer-left-item-black {
  background-color: #000;
  height: 42vh;
}

#explorer-right {
  width: 39vw;
  height: 92vh;
  backdrop-filter: blur(10px);
  background-image: url('@/assets/explorer_right.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* background-color: red; */
}

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
