import * as d3 from 'd3'
{
    d3.json('./json/holoceneLatest(1).json').then(data => {
        // console.log(data);
        let originalOrder = [...data];  // 保存原始数据顺序

        let dataset = data.map(x => {
            return {
                "height": x.elevation,
                "name": x.name,
                "id": x.id,
                "primaryType": x.primaryType,
                "country": x.country,
                "eruption": x.eruption,
                "volcanoType": x.volcanoType,
                "coordinates": x.coordinates
            };
        });
        // console.log(dataset);

        let sortedDataset = [...dataset];  // 保存排序后的数据顺序

        // let width = 1200;
        let width = document.getElementById("chart1-container").offsetWidth;
        // let height = 800;
        let height = document.getElementById("chart1-container").offsetHeight;
        let margin = 40;
        let rectWidth = (width - 2 * margin) / dataset.length;

        let svg = d3.select('#chart1-container')  // 选择 #chart1-container 元素
            .append('svg')             // 创建一个新的 svg 元素
            .attr('style', `width: ${width}; height:${height}; background:white`);

        // 定义线性渐变
        let gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        let gradientMinus = svg.append("defs")
            .append("linearGradient")
            .attr("id", "barMinus-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        // 添加渐变色段
        gradient.append("stop")
            .attr("offset", "4%")
            .attr("style", "stop-color: black; stop-opacity: 0");

        gradient.append("stop")
            .attr("offset", "30%")
            .attr("style", "stop-color: purple; stop-opacity: 1");

        gradient.append("stop")
            .attr("offset", "50%")
            .attr("style", "stop-color: red; stop-opacity: 0.8");

        gradient.append("stop")
            .attr("offset", "80%")
            .attr("style", "stop-color: orange; stop-opacity: 0.8");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("style", "stop-color: white; stop-opacity: 1");
        // 海底火山添加渐变色段
        gradientMinus.append("stop")
            .attr("offset", "4%")
            .attr("style", "stop-color: white; stop-opacity: 1");

        gradientMinus.append("stop")
            .attr("offset", "30%")
            .attr("style", "stop-color: orange; stop-opacity: 0.8");

        gradientMinus.append("stop")
            .attr("offset", "50%")
            .attr("style", "stop-color: red; stop-opacity: 0.8");

        gradientMinus.append("stop")
            .attr("offset", "80%")
            .attr("style", "stop-color: purple; stop-opacity: 1");

        gradientMinus.append("stop")
            .attr("offset", "100%")
            .attr("style", "stop-color: black; stop-opacity: 0");


        let yScale = d3.scaleLinear()
            .domain([d3.max(dataset, d => d.height), -d3.max(dataset, d => d.height)])
            .range([margin, height - margin]);

        let xScale = d3.scaleBand()
            .domain(d3.map(dataset, d => d.id))
            .range([margin, width - margin]);

        // 添加x轴
        let xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + (height / 2) + ')')
            .call(d3.axisBottom(xScale).tickValues([]));

        // 设置x轴文本初始时不可见
        xAxis.selectAll('text')
            .style('opacity', 0);

        // 添加y轴
        svg.append('g')
            .attr('transform', 'translate(' + margin + ',0)')
            .call(d3.axisLeft(yScale));

        // 添加y轴标签在顶部
        svg.append('text')
            .attr('y', margin / 3)
            .attr('x', 60)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Elevation');

        // 添加表的名称在顶部
        svg.append('text')
            .attr('y', height - margin - 5)
            .attr('x', width / 2)
            .attr('dy', '1em')
            .style("font-size", '1.3vw')
            .style("font-family", 'semibold')
            .style('text-anchor', 'middle')
            .text('Statistical demonstration of the elevation of Quaternary Holocene volcanoes');

        // 添加x轴标签
        // svg.append('text')
        //     .attr('transform', 'translate(' + (width / 2) + ' ,' + (height - margin + 40) + ')')
        //     .style('text-anchor', 'middle')
        //     .text('Volcano ID');

        // 创建柱形图
        let bars = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.id))
            .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
            .attr('width', rectWidth)
            .attr('height', d => d.height > 0 ?
                ((height - yScale(d.height)) - height / 2) :
                (height / 2 - (height - yScale(d.height))))
            .attr('fill', d => d.height > 0 ? 'url(#bar-gradient)' : 'url(#barMinus-gradient)')
            .attr('class', "volcano-rect")
            .attr('id', d => "volcano-rect" + d.id)
            .on('click', function (d) {
                // 恢复所有矩形的填充为渐变
                d3.selectAll('.volcano-rect')
                    .attr('fill', d => d.height > 0 ? 'url(#bar-gradient)' : 'url(#barMinus-gradient)');

                // 将当前点击的矩形的填充设置为黑色，并添加过渡效果
                d3.select(this)
                    .transition()
                    .duration(50)  // 过渡的持续时间，单位毫秒
                    .attr('fill', 'black');

            });

        // 添加按钮，点击按钮按照 "eruption" 数据重新排序并更新柱形图
        d3.select('#button-container')  // 选择 #chart1-container 元素
            .append('button')
            .text('TimeLine')
            .on('click', function () {
                // 按 "eruption" 数据重新排序
                sortedDataset.sort((a, b) => new Date(a.eruption) - new Date(b.eruption));

                // 更新 x 轴
                xScale.domain(d3.map(sortedDataset, d => d.id));
                xAxis.transition().call(d3.axisBottom(xScale).tickValues([]));

                // 计算过渡延迟时间
                const delay = (d, i) => i * 20;

                // 过渡动画，先将高度设为0，然后改变x位置，最后将高度过渡为正常值
                bars.transition()
                    .duration(1600) // 与原始数据排序的总持续时间相匹配
                    .delay(delay)
                    .attr('y', height / 2)
                    .attr('height', 0)
                    .on('end', function () {
                        // 在高度过渡完成后，改变x位置并过渡为正常高度
                        d3.select(this)
                            .attr('x', d => xScale(d.id))
                            // .attr('height', d => height - margin - yScale(d.height))
                            // .attr('y', d => yScale(d.height))
                            // .attr('height', d => d.height > 0 ?
                            //     ((height - yScale(d.height)) - height / 2) :
                            //     (height / 2 - (height - yScale(d.height))))
                            // .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
                            .attr('y', height / 2)
                            .attr('height', 0)
                            .transition()
                            .duration(500)
                            .delay(delay)
                            // .attr('height', d => height - margin - yScale(d.height))
                            // .attr('y', d => yScale(d.height));
                            .attr('height', d => d.height > 0 ?
                                ((height - yScale(d.height)) - height / 2) :
                                (height / 2 - (height - yScale(d.height))))
                            .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2);
                    });
            });

        // 添加按钮，点击按钮按照原始数据的顺序重新排序并更新柱形图
        d3.select('#button-container')  // 选择 #chart1-container 元素
            .append('button')
            .text('Original')
            .on('click', function () {
                // 恢复原始数据顺序
                sortedDataset = [...dataset];

                // 更新 x 轴和柱形图
                xScale.domain(d3.map(sortedDataset, d => d.id));
                xAxis.call(d3.axisBottom(xScale).tickValues([]));

                // 计算过渡延迟时间
                const delay = (d, i) => i * 20;

                // 过渡动画，先将高度设为0，然后改变x位置，最后将高度过渡为正常值
                bars.transition()
                    .duration(1600)
                    .delay(delay)
                    .attr('y', height / 2)
                    .attr('height', 0)
                    .on('end', function () {
                        // 在高度过渡完成后，改变x位置并过渡为正常高度
                        d3.select(this)
                            .attr('x', d => xScale(d.id))
                            // .attr('height', d => height - margin - yScale(d.height))
                            // .attr('height', d => d.height > 0 ?
                            //     ((height - yScale(d.height)) - height / 2) :
                            //     (height / 2 - (height - yScale(d.height))))
                            // .attr('y', d => yScale(d.height))
                            // .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
                            .attr('y', height / 2)
                            .attr('height', 0)
                            .transition()
                            .duration(500)
                            .delay(delay)
                            // .attr('height', d => height - margin - yScale(d.height))
                            // .attr('y', d => yScale(d.height));
                            .attr('height', d => d.height > 0 ?
                                ((height - yScale(d.height)) - height / 2) :
                                (height / 2 - (height - yScale(d.height))))
                            .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2);
                    });
            });

    });
}