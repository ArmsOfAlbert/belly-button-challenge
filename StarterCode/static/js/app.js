// Fetch data including both sample data and metadata
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Function to update the bar chart
function updateBarChart(sampleData) {
    const data = sampleData[0];
    const sampleValues = data.sample_values.slice(0, 10);
    const otuIds = data.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const otuLabels = data.otu_labels.slice(0, 10);
  
    // Combine sample values, OTU IDs, and labels into an array of objects
    const combinedData = sampleValues.map((value, index) => ({
      sampleValue: value,
      otuId: otuIds[index],
      otuLabel: otuLabels[index]
    }));
  
    // Sort the combined data array by sample values in descending order
    combinedData.sort((a, b) => b.sampleValue - a.sampleValue);
  
    // Extract sorted values into separate arrays
    const sortedSampleValues = combinedData.map(item => item.sampleValue);
    const sortedOtuIds = combinedData.map(item => item.otuId);
    const sortedOtuLabels = combinedData.map(item => item.otuLabel);
  
    // Reverse the arrays to display the highest value at the top of the chart
    sortedSampleValues.reverse();
    sortedOtuIds.reverse();
    sortedOtuLabels.reverse();
  
    const trace = {
      x: sortedSampleValues,
      y: sortedOtuIds,
      text: sortedOtuLabels,
      type: 'bar',
      orientation: 'h'
    };
  
    const layout = {
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };
  
    const dataTrace = [trace];
    Plotly.newPlot('bar', dataTrace, layout);
  }
  
  // Function to update the bubble chart
  function updateBubbleChart(sampleData) {
    const data = sampleData[0];
    const otuIds = data.otu_ids;
    const sampleValues = data.sample_values;
    const otuLabels = data.otu_labels;
  
    const trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth',
        opacity: 0.7
      }
    };
  
    const layout = {
      title: 'Sample Biodiversity' ,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };
  
    const dataTrace = [trace];
    Plotly.newPlot('bubble', dataTrace, layout);
  }
  
  // Function to update the sample metadata
  function updateMetadata(metadata) {
    console.log('Received metadata:', metadata);
    const metadataPanel = d3.select('#sample-metadata');
    console.log('Metadata panel:', metadataPanel); // Check if metadata panel selection is successful

    metadataPanel.html('');
  
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append('p').text(`${key}: ${value}`);
    });
  }
  
  // Fetch data and populate dropdown menu
  d3.json(url).then(data => {
    const sampleNames = data.names;
    const dropdownMenu = d3.select('#selDataset');
  
    // Populate dropdown menu with sample names
    sampleNames.forEach(sample => {
      dropdownMenu.append('option').text(sample).property('value', sample);
    });
  
    // Initial charts and metadata for the first sample
    const initialSample = sampleNames[0];
    const initialSampleData = data.samples.find(sample => sample.id === initialSample);
    const initialSampleMetadata = data.metadata.find(metadata => metadata.id === parseInt(initialSample));
    updateBarChart([initialSampleData]); // Pass as array for consistency with other functions
    updateBubbleChart([initialSampleData]); // Pass as array for consistency with other functions
    updateMetadata(initialSampleMetadata);
  });
  
  // Event listener for dropdown change
  function optionChanged(newSample) {
    d3.json(url).then(data => {
      const sampleData = data.samples.filter(sample => sample.id === newSample);
      const metadata = data.metadata.find(metadata => metadata.id === parseInt(newSample));
      updateBarChart(sampleData);
      updateBubbleChart(sampleData);
      updateMetadata(metadata);
    });
  }
