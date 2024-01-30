<!-- insights -->
<template>
  <div id="insights">
    <div id="insight-center-container">
      <center></center>
      <div class="insight-right-page">
        <div id="point-chart">

        </div>
      </div>
    </div>
    <div class="footer">
      <div class="left-arr arrow" @click="arrowChange(-1)">&lt;</div>
      <div :class="item.flag ? 'footer-line' : 'footer-point'" v-for="(item, index) in foot" @click="footerChange(index)">
      </div>
      <div class="right-arr arrow" @click="arrowChange(1)">&gt;</div>
    </div>
  </div>
</template>

<script>
import center from './center/center.vue'

import * as d3 from 'd3'
export default {
  data() {
    return {
      foot: [
        { flag: true },
        { flag: false }
      ]
    }
  },
  components: {
    center
  },
  methods: {
    footerChange: function (index) {
      for (let i = 0; i < 2; i++) {
        if (index == i) {
          this.foot[i].flag = true;
        }
        else {
          this.foot[i].flag = false;
        }
      }
      document.getElementById('insight-center-container')
        .setAttribute('style', `left : ${index == 0 ? 0 : (-100)}vw`)
    },
    arrowChange: function (d) {
      for (let i = 0; i < 2; i++) {
        if (this.foot[i].flag == true) {
          if (d == 1 && i != 1) {
            this.foot[i].flag = false;
            this.foot[i + 1].flag = true;
          }
          else if (d == -1 && i != 0) {
            this.foot[i].flag = false;
            this.foot[i - 1].flag = true;
          }
          break;
        }
      }
      document.getElementById('insight-center-container')
        .setAttribute('style', `left : ${this.foot[0].flag ? 0 : (-100)}vw`)
    }
  },
  mounted() {
    // setTimeout(() => require('./spots'), 200)
    // 修改这里的文件路径
    var jsonFilePath = './json/holoceneLatest(1).json';

    d3.json(jsonFilePath).then(function (data) {
      console.log("Data:", data); // 添加此行日志
      // let width = 1200;
      let width = document.getElementById("point-chart").offsetWidth;
      // let height = 800;
      let height = document.getElementById("point-chart").offsetHeight;

      var padding = { top: 50, right: 50, bottom: 50, left: 50 };

      var svg = d3.select("body").select("#point-chart")
        .append("svg")
        .attr("width", width).attr("height", height);

      /*定义地理投影*/
      var projection = d3.geoMercator()
        .scale(100)
        .translate([width / 2, height / 2])
      // .center(0, 0);

      /*创建路径生成器*/
      var path = d3.geoPath()
        .projection(projection);

      /*绘制经度和纬度方格线*/
      function drawGrid() {
        // 绘制经度方格线
        var selectedLongitudes = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
        svg.selectAll(".vline")
          .data(selectedLongitudes)
          .enter().append("line")
          .attr("class", "grid vline")
          .attr("x1", d => xScale(d) + padding.left)
          .attr("x2", d => xScale(d) + padding.left)
          .attr("y1", padding.top)
          .attr("y2", height - padding.bottom)
          .style("stroke", "rgb(91, 9, 9)")
          .style("stroke-opacity", 0.7);

        // 绘制纬度方格线
        var selectedLatitudes = [90, 70, 50, 30, 10, -10, -30, -50, -70, -90];
        svg.selectAll(".hline")
          .data(selectedLatitudes)
          .enter().append("line")
          .attr("class", "grid hline")
          .attr("x1", padding.left)
          .attr("x2", width - padding.right)
          .attr("y1", d => yScale(d) + padding.top)
          .attr("y2", d => yScale(d) + padding.top)
          .style("stroke", "rgb(91, 9, 9)")
          .style("stroke-opacity", 0.7);
      }


      /*定义比例尺*/
      var xScale = d3.scaleLinear()
        .domain([-180, 180])
        .range([0, width - padding.left - padding.right]);

      var yScale = d3.scaleLinear()
        .domain([-90, 90])
        .range([height - padding.bottom - padding.top, 0]);

      drawGrid();  // 在初始化时调用一次


      /* 绘制圆点 */
      function drawCircle() {
        var circleUpdate = svg.selectAll("circle").data(data);

        // update处理
        circleUpdate.transition().duration(500)
          .attr("cx", function (d) {
            return xScale(d.location.coordinates[0]) + padding.left;
          })
          .attr("cy", function (d) {
            return yScale(d.location.coordinates[1]) + padding.top;
          })
          .attr("r", 2)

        // enter处理
        circleUpdate.enter().append("circle")
          .attr("cx", function (d) {
            return xScale(d.location.coordinates[0]) + padding.left;
          })  // 此处的括号没有正确关闭
          .attr("cy", function (d) {
            return yScale(d.location.coordinates[1]) + padding.top;
          })
          .attr("r", 1.2)
          .style("fill", "black")
          .style("stroke", "rgba(233, 22, 16, 0.7)")
          .style("stroke-width", "12")
          .style("stroke-opacity", 0.1)
          .style("opacity", 1);

        // exit处理
        circleUpdate.exit()
          .remove();
      }
      // 添加标题
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - padding.bottom / 4) // 调整位置
        .attr("text-anchor", "middle")
        .style("font-size", "1.2vw")
        .style("font-family", "semibold")
        .text("Scatter plot of volcano distribution");

      // 添加坐标轴标题
      svg.append("text")
        .attr("x", padding.left / 2)
        .attr("y", padding.left / 3 * 2) // 调整位置
        .attr("text-anchor", "middle")
        .style("font-size", "1vw")
        .style("font-family", "regular")
        .text("North");

      svg.append("text")
        .attr("x", padding.left / 2)
        .attr("y", height - padding.left * 4 / 3) // 调整位置
        .attr("text-anchor", "middle")
        .style("font-size", "1vw")
        .style("font-family", "regular")
        .text("South");

      svg.append("text")
        .attr("x", padding.left / 2)
        .attr("y", height - padding.left / 3) // 调整位置
        .style('writing-mode', 'vertical-lr')
        .attr("text-anchor", "middle")
        .style("font-size", "1vw")
        .style("font-family", "regular")
        .text("West");

      svg.append("text")
        .attr("x", width - padding.left / 2)
        .attr("y", height - padding.left / 3) // 调整位置
        .style('writing-mode', 'vertical-lr')
        .attr("text-anchor", "middle")
        .style("font-size", "1vw")
        .style("font-family", "regular")
        .text("East");

      /* 添加坐标轴 */
      function drawScale() {
        var selectedLongitudes = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
        var selectedLatitudes = [90, 70, 50, 30, 10, -10, -30, -50, -70, -90];
        var xAxis = d3.axisBottom(xScale).tickValues(selectedLongitudes);
        var yAxis = d3.axisLeft(yScale).tickValues(selectedLatitudes);

        svg.append("g").attr("class", "axis")
          .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
          .call(xAxis);


        svg.append("g").attr("class", "axis")
          .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
          .call(yAxis);
      }

      // 初始化
      drawScale();


      // 添加一个数组以存储每个方格内火山的数量
      var gridCounts = [];
      // 创建一个数组用于存储每个矩形的信息
      var rectanglesInfo = [];
      var selectedLongitudes = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
      var selectedLatitudes = [90, 70, 50, 30, 10, -10, -30, -50, -70, -90];

      // 用于统计每个网格单元内火山数量的函数
      function countVolcanoesInGrid() {
        // 使用零初始化gridCounts数组
        gridCounts = Array.from({ length: selectedLatitudes.length - 1 }, () =>
          Array(selectedLongitudes.length - 1).fill(0)
        );

        // 遍历每个火山并增加相应网格计数
        data.forEach(function (d) {
          for (var i = 0; i < selectedLatitudes.length - 1; i++) {
            for (var j = 0; j < selectedLongitudes.length - 1; j++) {
              if (
                d.location.coordinates[1] >= selectedLatitudes[i + 1] &&
                d.location.coordinates[1] < selectedLatitudes[i] &&
                d.location.coordinates[0] >= selectedLongitudes[j] &&
                d.location.coordinates[0] < selectedLongitudes[j + 1]
              ) {
                gridCounts[i][j]++;
              }
            }
          }
        });

        // 绘制填充效果
        drawFillEffect();
      }
      // 绘制填充效果
      function drawFillEffect() {
        var selectedLongitudes = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
        var selectedLatitudes = [90, 70, 50, 30, 10, -10, -30, -50, -70, -90];
        console.log(selectedLongitudes.length, selectedLatitudes.length)
        var cellWidth = ((width - padding.left - padding.right) / (selectedLongitudes.length - 1));
        var cellHeight = ((height - padding.top - padding.bottom) / (selectedLatitudes.length - 1));
        // console.log(cellWidth);
        // console.log(cellHeight);
        // 修改 fillOpacity 的计算方式
        var exponent = 0.5; // 可以根据需要调整指数

        for (var i = 0; i < selectedLatitudes.length - 1; i++) {
          for (var j = 0; j < selectedLongitudes.length - 1; j++) {
            var fillValue = gridCounts[i][j];

            // 使用新的 fillOpacity 计算方式
            var fillOpacity = Math.pow(fillValue / getMaxGridCount(), exponent);

            // 绘制矩形
            svg.append("rect")
              .attr("x", Math.floor(j * cellWidth) + padding.left)
              .attr("y", Math.floor(i * cellHeight) + padding.top)
              .attr("width", cellWidth)
              .attr("height", cellHeight)
              .style("fill", "rgba(164, 6, 6, 0.564)")
              .style("fill-opacity", fillOpacity);
          }
        }

      }

      // 定义存储矩形信息的数组
      var rectanglesInfo = [];

      // 计算矩形信息
      for (var i = 0; i < selectedLatitudes.length - 1; i++) {
        for (var j = 0; j < selectedLongitudes.length - 1; j++) {
          var rectWidth = xScale(selectedLongitudes[j + 1]) - xScale(selectedLongitudes[j]);
          var rectHeight = yScale(selectedLatitudes[i]) - yScale(selectedLatitudes[i + 1]);

          var rectX = xScale(selectedLongitudes[j]) + padding.left;
          var rectY = yScale(selectedLatitudes[i + 1]) + padding.top;

          // 将矩形信息添加到数组
          rectanglesInfo.push({
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight
          });
        }
      }

      // 打印矩形信息数组
      // console.log(rectanglesInfo);



      // 获取最大格子数量，用于计算透明度
      function getMaxGridCount() {
        var maxCount = 0;
        for (var i = 0; i < selectedLatitudes.length - 1; i++) {
          for (var j = 0; j < selectedLongitudes.length - 1; j++) {
            maxCount = Math.max(maxCount, gridCounts[i][j]);
          }
        }
        return maxCount;
      }


      // 在绘制圆点后调用countVolcanoesInGrid函数

      countVolcanoesInGrid();
      drawCircle();
    });

  },
  watch: {
    // "foot"(val) {
    //   console.log(val)
    //   document.getElementById('insight-center-container')
    //     .setAttribute('style', 'left : -100vw')
    // },
    // deep: true,
    // immediate: true
  }

}
</script>

<style  scoped>
#insights {
  height: 92vh;

  /* background-color: beige; */
}

#insight-center-container {
  width: 200vw;
  height: 85vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  left: -0vw;
  transition: left 1s;
}

.insight-right-page {
  width: 100vw;
  height: 85vh;
  /* background-color: #dadada; */
}

#point-chart {
  margin-top: 5vh;
  width: 90vw;
  margin-left: 5vw;
  margin-right: 5vw;
  height: 80vh;
  background-color: #fff;
}

.footer {
  height: 7vh;
  width: 40vw;
  margin: auto;
  /* line-height: 7vh; */
  /* background-color: rebeccapurple; */
  display: flex;
  justify-content: center;
}

.arrow {
  /* font-weight: 700; */
  cursor: pointer;
  font-size: 1.2vw;
  line-height: 7vh;
  height: 7vh;
  margin-left: 1.8vw;
  margin-right: 1.8vw;
}

.footer-point,
.footer-line {
  cursor: pointer;
  background-color: #fff;
  border-radius: 0.8vw;
  height: .8vw;
  margin-top: auto;
  margin-bottom: auto;
  box-shadow: 0 0 2px 2px #dadada;
  margin-left: 1.8vw;
  margin-right: 1.8vw;
  transition: width 0.4s ease-out;
}

.footer-point {
  width: .8vw;
}

.footer-line {
  width: 3vw;
}
</style>

<style>
/* 坐标样式 */
.axis path,
.axis line {
  fill: none;
  stroke: rgb(0, 0, 0);
  shape-rendering: crispEdges;
}

.axis text {
  color: #000;
  /* font-family: sans-serif; */
  font-size: 11px;
}

/* 网格线样式 */
.grid line {
  stroke: rgba(228, 16, 16, 0.564);
  stroke-opacity: 0.7;
}
</style>