import React from "react";
import * as d3 from "d3";

const MARGINS = { top: 10, right: 15, bottom: 20, left: 35 };

const OHLCChart = ({ name: title, records }: OHLCFile) => {
  const containerRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;

    const width = container.clientWidth - MARGINS.left - MARGINS.right;
    const height = container.clientHeight - MARGINS.top - MARGINS.bottom;

    const chart = d3
      .select(container)
      .append("g")
      .attr("id", "chart")
      .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

    const timestamps = records.map(
      (record) => new Date(record.Timestamp * 1e3)
    );

    const xBand = d3
      .scaleBand<Date>()
      .domain(timestamps)
      .range([0, width])
      .paddingInner(0.1)
      .paddingOuter(1)
      .align(0.5);

    const xAxis = d3.axisBottom<Date>(xBand).tickValues([timestamps[25]]);

    chart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        d3.min(records.map((record) => record.Low))!,
        d3.max(records.map((record) => record.High))!,
      ])
      .nice();

    const yAxis = d3.axisLeft<number>(yScale);

    chart.append("g").attr("id", "y-axis").call(yAxis);

    const chartBody = chart.append("g").attr("id", "chart-body");

    // This invisible rect is responsible for receiving
    // mouse scroll events from any pixel of the chart
    // (not only when mouse is on one of the candles)
    chartBody
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("pointer-events", "all")
      .attr("fill", "none");

    const candles = chartBody.append("g").attr("id", "candles");

    // TODO: merge rect.candle and g.whisker into one

    candles
      .selectAll(".candle")
      .data(records)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xBand(timestamps[i])!)
      .attr("class", "candle")
      .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
      .attr("width", xBand.bandwidth())
      .attr("height", (d) =>
        d.Open === d.Close
          ? 1
          : yScale(Math.min(d.Open, d.Close)) -
            yScale(Math.max(d.Open, d.Close))
      )
      .attr("fill", (d) =>
        d.Open === d.Close ? "silver" : d.Open > d.Close ? "red" : "green"
      );

    candles
      .selectAll(".whisker")
      .data(records)
      .enter()
      .append("line")
      .attr("class", "whisker")
      .attr("x1", (_, i) => xBand(timestamps[i])! + xBand.bandwidth() / 2)
      .attr("x2", (_, i) => xBand(timestamps[i])! + xBand.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.High))
      .attr("y2", (d) => yScale(d.Low))
      .attr("stroke", (d) =>
        d.Open === d.Close ? "white" : d.Open > d.Close ? "red" : "green"
      );

    const zoom = d3.zoom().on("zoom", () => {
      candles.attr("transform", d3.event.transform);
    });

    chartBody.call(zoom as any);
  }, [records]);

  return <svg ref={containerRef} style={{ flex: 1 }} />;
};

export default React.memo(OHLCChart);
