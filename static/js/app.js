// URL for the samples.json data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the dashboard
function init() {
  // Use D3 to fetch the JSON data
  d3.json(url).then((data) => {
    // Populate the dropdown menu with sample IDs
    const dropdown = d3.select("#selDataset");
    data.names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Use the first sample ID to build the initial plots
    const initialSample = data.names[0];
    buildCharts(initialSample);
    buildMetadata(initialSample);
  });
}

// Function to build the charts
function buildCharts(sample) {
  d3.json(url).then((data) => {
    // Extract data for the selected sample
    const sampleData = data.samples.find((s) => s.id === sample);

    // Build the bar chart
    const barData = [{
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 OTUs",
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Build the bubble chart
    const bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      },
      text: sampleData.otu_labels
    }];

    const bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to display metadata
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    const metadata = data.metadata.find((m) => m.id == sample);
    const panel = d3.select("#sample-metadata");

    // Clear existing metadata
    panel.html("");

    // Display each key-value pair
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to handle dropdown change
function optionChanged(newSample) {
  // Update the charts and metadata with the newly selected sample
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
