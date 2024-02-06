// Endpoint URL
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Creat init function for dashboard
function init() {
  d3.json(url).then(function (data) {
    let dropdown = d3.selectAll("#selDataset");
    for (let i = 0; i < data.names.length; i++) {
      dropdown
        .append("option")
        .attr("value", data.names[i])
        .text(data.names[i]);
    }
    let sample_id = dropdown.property("value");
    genBarChart(sample_id);
    genDemographic(sample_id);
    genBubbleChart(sample_id);
    genGaugeChart(sample_id);
  });
}

// Create function for BarChart generator
function genBarChart(sample) {
  d3.json(url).then(function (data) {
    let samples_data = data.samples;
    let sample_array = samples_data.filter((sd) => sd.id == sample);
    let sample_data = sample_array[0];
    let transData = [];
    for (let i = 0; i < sample_data.otu_ids.length; i++) {
      transData.push({
        otu: `OTU ${sample_data.otu_ids[i]}`,
        label: sample_data.otu_labels[i],
        otuVal: sample_data.sample_values[i],
      });
    }
    transData.sort((a, b) => b.otuVal - a.otuVal);
    let sliced = transData.slice(0, 10);
    let reverseSlice = sliced.reverse();
    let trace1 = {
      x: reverseSlice.map((val) => val.otuVal),
      y: reverseSlice.map((val) => val.otu),
      text: reverseSlice.map((val) => val.label),
      type: "bar",
      orientation: "h",
    };
    let c_data = [trace1];
    let layout = {
      margin: {
        t: 35,
      },
    };
    Plotly.newPlot("bar", c_data, layout);
  });
}
function genDemographic(sample) {
  d3.json(url).then(function (data) {
    let metadata = data.metadata;
    let meta_array = metadata.filter((md) => md.id == sample);
    let meta_data = meta_array[0];
    let div = d3.select("#sample-metadata");
    div.attr("class", "small").attr("align", "center").html("");
    for (let meta in meta_data) {
      div.append().html(`<b>${meta}:</b> \t ${meta_data[meta]} </br>`);
    }
  });
}

// BubbleChart function generator
function genBubbleChart(sample) {
  d3.json(url).then(function (data) {
    let samples_data = data.samples;
    let sample_array = samples_data.filter((sd) => sd.id == sample);
    let sampleData = sample_array[0];
    let transData = [];
    for (let i = 0; i < sampleData.otu_ids.length; i++) {
      transData.push({
        otu: sampleData.otu_ids[i],
        label: sampleData.otu_labels[i],
        otuVal: sampleData.sample_values[i],
      });
    }
    transData.sort((a, b) => b.otuVal - a.otuVal);
    let bubTrace = {
      x: transData.map((val) => val.otu),
      y: transData.map((val) => val.otuVal),
      mode: "markers",
      marker: {
        size: transData.map((val) => val.otuVal * 0.9),
        opacity: 0.95,
        color: transData.map((val) => val.otu),
        colorscale: "Earth",
        line: {
          color: "black",
          width: 0.75,
        },
      },
      text: transData.map((val) => val.label),
    };
    let bubData = [bubTrace];
    let layout = {
      hovermode: "closest",
      hoverdistance: 1,
      showlegend: false,
      height: 450,
      width: 1140,
      margin: {
        autoexpand: true,
        t: 10,
        b: 30,
        l: 25,
        r: 25,
      },
      xaxis: { title: "OTU ID" },
    };
    Plotly.newPlot("bubble", bubData, layout);
  });
}

// Generate Gauge chart
function genGaugeChart(sample) {
  d3.json(url).then(function (data) {
    let metadata = data.metadata;
    let meta_array = metadata.filter((md) => md.id == sample);
    let meta_data = meta_array[0];
    let gaugeTrace = {
      value: meta_data.wfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week",
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          dtick: 1,
          tick0: 1,
          range: [null, 9],
          ticks: "",
          ticklabelstep: 1,
        },
        bar: {
          thickness: 0.08,
          color: "red",
        },
        steps: [
          { range: [0, 1], color: "rgb(248,243,236)" },
          { range: [1, 2], color: "rgb(244,241,229)" },
          { range: [2, 3], color: "rgb(233,231,201)" },
          { range: [3, 4], color: "rgb(229,232,176)" },
          { range: [4, 5], color: "rgb(212,229,154)" },
          { range: [5, 6], color: "rgb(182,205,143)" },
          { range: [6, 7], color: "rgb(138,192,134)" },
          { range: [7, 8], color: "rgb(137,188,141)" },
          { range: [8, 9], color: "rgb(131,181,136)" },
        ],
        threshold: {
          value: meta_data.wfreq,
          line: {
            color: "red",
            width: 2,
          },
          thickness: 1,
        },
      },
    };
    let gaugeData = [gaugeTrace];
    let gaugeLayout = {
      margin: {
        t: 0,
        b: 0,
        r: 30,
        l: 30,
      },
    };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
function optionChanged(sample) {
  console.log(`Subject ID changed: ${sample}`);
  genBarChart(sample);
  genBubbleChart(sample);
  genDemographic(sample);
  genGaugeChart(sample);
  console.log("Charts Updated!");
}

init();
