// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
      let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
      let value = metadata.filter(result => result.id == sample);
      
    // Use d3 to select the panel with id of `#sample-metadata`
      let valueData = value[0];

    // Use `.html("") to clear any existing metadata
      d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

      // Use Object.entries to add each key and value to the panel
      Object.entries(valueData).forEach(([key,value]) => {

      // Log the individual key and value as they are being appended to the metadata panel
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });

  });
}


// Function to build both charts
function buildCharts(sample) {
  // Fetch sample data from the specified URL
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let sampleInfo = data.samples;

    // Filter the samples for the object with the desired sample number
    let value = sampleInfo.filter(result => result.id == sample);

    // Extract otu_ids, otu_labels, and sample_values
    let valueData = value[0];
    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;
    let sample_values = valueData.sample_values;

    // Log extracted data for debugging
    console.log(otu_ids, otu_labels, sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);



 // Build a Bar Chart
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately
  
    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let xticks = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();

   // Build a Bar Chart
    let barTrace = {
      x: xticks,
      y: yticks,
      text: labels,
      type: "bar",
      orientation: "h"
  };

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
  };
    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout)
  });
};




// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Populate select options with sample names
    names.forEach((id) => {
      dropdownMenu.append("option")
        .text(id)
        .property("value", id);
    });

    // Get the first sample from the list
    let sample_one = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(sample_one);
    buildCharts(sample_one);
  // }).catch(error => {
  //   console.error("Error fetching data:", error);
  });
}


// Function for event listener
// Function to update charts and metadata panel when a new sample is selected
function optionChanged(newSample) {

  // Call functions to update dashboard
  buildMetadata(newSample);
  buildCharts(newSample);
}


// Initialize the dashboard
init();