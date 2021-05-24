function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samplesArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var desiredSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var initialSample = desiredSample[0];
    
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIDS = initialSample.otu_ids;
      var otuLabels = initialSample.otu_labels;
      var sampleValues = initialSample.sample_values;
        // console.log(`IDS ` + otuIDS)
        // console.log(`labels ` + otuLabels)
        // console.log(`samples ` + sampleValues)
        console.log(initialSample)

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 

      var yticks = otuIDS.sort((a,b) => b.sampleValues - a.sampleValues);
      var slicedY = yticks.slice(0,10);
      reversedY = slicedY.reverse();
      yString = reversedY.map(object => 'OTU ' + object.toString())
      console.log(yString)
      var xticks = sampleValues.slice(0,10).reverse();

      //console.log(otuIDS)  
      //console.log(`sorted ` + yticks)
      //console.log (reversedY)
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: xticks,
        y: yString,
        type: 'bar',
        orientation: 'h',
        text: otuLabels
      }
        
      ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
          title: 'Top 10 Bacteria Cultures Found'

       
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
      console.log('samples below');
      console.log(sampleValues)
      console.log(otuIDS)
      // DELIVERABLE 2 BUBBLE CHART
      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otuIDS,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIDS
        }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        hovermode:'closest',
        title: 'Bacteria Cultures Per Sample',
        xaxis: {title: "OTU ID"},
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }

      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
    
    // DELIVERABLE 3
    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // 3. Create a variable that holds the washing frequency.
   washFreq = result.wfreq;
    console.log(`washing ` + typeof washFreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        domain: {x:[0,1], y:[0,1]},
        value: washFreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge:{
            axis: { range: [null, 10]},
            bar: {color: "black"},
            steps: [
                {range: [0,2], color: "red"},
                {range: [2,4], color: "orange"},
                {range: [4,6], color: "yellow"},
                {range: [6,8], color: "limegreen"},
                {range: [8,10], color: "green"}
            ]
        }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData);
  });
  }