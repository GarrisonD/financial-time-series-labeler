import React from "react";
import * as d3 from "d3";

const MARGINS = { top: 10, right: 15, bottom: 20, left: 35 };

const OHLCChart = ({ name: title, records }: OHLCFile) => {
  const containerRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;

    const width = container.clientWidth - MARGINS.left - MARGINS.right;
    const height = container.clientHeight - MARGINS.top - MARGINS.bottom;

    const svg = d3
      .select(container)
      .append("g")
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

    svg
      .append("g")
      .attr("class", "x-axis")
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

    svg.append("g").attr("class", "y-axis").call(yAxis);

    const candlesContainer = svg.append("g").attr("class", "candles-container");

    // TODO: merge rect.candle and g.whisker into one

    candlesContainer
      .selectAll("rect.candle")
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

    candlesContainer
      .selectAll("g.whisker")
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
  }, [records]);

  return (
    <svg className="d3-container" ref={containerRef} style={{ flex: 1 }} />
  );
};

export default React.memo(OHLCChart);
