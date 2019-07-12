// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started. Thank you.');
  // variables, setup, shared functions
}

function doChart(labels, series, seriesOptions) {
  
  new Chartist.Line('.ct-chart', {
    labels: labels || [],
    series: series || [
      {
        name: '', 
        data: []
      }
    ]
  }, {
      width: '100%',
      height: '90%',    
      showArea: true,
      showLine: false,
      showPoint: false,
      fullWidth: true,
      axisX: {
        showLabel: true,
        showGrid: false,
        labelInterpolationFnc: function(value) {
          return value;
        },
        scaleMinSpace: 200         
      },
      axisY: {
        showLabel: true,
        showGrid: true,
        labelInterpolationFnc: function(value) {
          return Math.round(value/1000,2);
        },
        scaleMinSpace: 15        
      },
      fullWidth: true,
      chartPadding: {
        right: 40
      },
      series: seriesOptions || {},    
  });

}
  
function runScenario() {
  
  var rightNow = new Date()
  var startYear = rightNow.getFullYear();
  var yrskip = 5;
  
  // grab scenario data and execute
  var thisScenarioFile = 'public/sampleScenarios.json';
  getScenarios(thisScenarioFile, function (sd) {
    var sdata = sd;    
    // compute time-series DR/CR per item
    
    var currentScenario = sdata["S002"];
    console.log(currentScenario);
    var yearsToAnalyze =  currentScenario.BASELINE.yearstoretirement +
                          currentScenario.BASELINE.yearspastretirement;
    
    var endYear = startYear + yearsToAnalyze;
    var monthsToAnalyze = yearsToAnalyze * 12;
    
    // make labels
    var chartLabels = [];
    for (var m = 1; m <= monthsToAnalyze; m++) { // loop through analysis months
      if(m%12 == 0) { 
        chartLabels.push(m); 
      } else {
        chartLabels.push("");
      }      
    }
    
    // set up initial series and force zero line
    var seriesOptions = {};
    _.set(seriesOptions, ['NetWorth', 'showLine'], true);
    _.set(seriesOptions, ['NetWorth', 'showArea'], false);

    var seriesPlotArray = [{name: "ZERO", data: [0]}];
    var seriesNWArray = [];
    
    // loop scenario items to do networth stacking
    _.forEach(currentScenario, function (value, key) {
      var itemName = key;
      if (value.type == "income") { //do income type
          var thisNWData = [];
          var thisTaxNWData = [];
          var thisAccumulator = 0;
          var thisTaxAccumulator = 0;
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var annualgrowthrate = 1 + ((value.annualgrowthrate) / 100 / 12) || 1;
          var effectivetaxrate = (value.effectivetaxrate) / 100 || 0;
          
          console.log("start m for " + key + ":" + startMonth + " end: " +endMonth+ " ;at monthly of " + monthlyAmount + " - tax rate= " + effectivetaxrate + " - growth= " + annualgrowthrate);
        
          for (var m = 1; m <= monthsToAnalyze; m ++) {
            if (m >= startMonth && m < endMonth) {
                monthlyAmount *= annualgrowthrate;
                thisAccumulator += monthlyAmount;
                thisTaxAccumulator += (monthlyAmount * effectivetaxrate);
                thisNWData.push(thisAccumulator);
                thisTaxNWData.push(thisTaxAccumulator * -1);            
            } else {
                thisNWData.push(null);
                thisTaxNWData.push(null);              
            }

          }
        
          seriesNWArray.push({name: key, data: thisNWData});
          seriesNWArray.push({name: key + ' Taxes', data: thisTaxNWData});
        
          } 
      
      if (value.type == "expense") { //do expense type
          var thisNWData = [];
          var thisAccumulator = 0;
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var annualgrowthrate = 1 + ((value.annualgrowthrate) / 100 / 12) || 1;
          console.log("start m for " + key + ":" + startMonth + " at monthly of " + monthlyAmount)
        
          for (var m = 1; m <= monthsToAnalyze; m ++) {
            if (m >= startMonth && m < endMonth) {
                monthlyAmount *= annualgrowthrate
                thisAccumulator += monthlyAmount;
                thisNWData.push(thisAccumulator * -1);
            } else {
                thisNWData.push(null);
            }

          }
          seriesNWArray.push({name: key, data: thisNWData});
          }     
        if (value.type == "savings") { //do savings type
          var thisNWData = [];
          var thisAccumulator = 0;
          var thisContributionNWData = [];
          var thisContributionAccumulator = 0;          
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var contributionannualgrowthrate = 1 + ((value.contributionannualgrowthrate) / 100 / 12) || 1;
          var investmentannualgrowthrate = 1 + ((value.investmentannualgrowthrate) / 100 / 12) || 1;
          var monthonevalue = value.monthonevalue || 0;
          console.log("start m for " + key + ":" + startMonth + " at monthly of " + monthlyAmount + " - month one: " + monthonevalue + " CAGR:" + contributionannualgrowthrate + " IAGR:" + investmentannualgrowthrate);
          
          thisAccumulator = monthonevalue;
          thisNWData.push(thisAccumulator);
          
          for (var m = 2; m <= monthsToAnalyze; m++) {
            if (m >= startMonth && m < endMonth) {
                monthlyAmount *= contributionannualgrowthrate;
                thisAccumulator += monthlyAmount;
                thisAccumulator *= investmentannualgrowthrate;
                thisNWData.push(thisAccumulator);
                thisContributionAccumulator += monthlyAmount;
                thisContributionNWData.push(thisContributionAccumulator * -1);
            } else {
                thisNWData.push(thisAccumulator *= investmentannualgrowthrate);     
            }
          }
        
          seriesNWArray.push({name: key, data: thisNWData});
          seriesNWArray.push({name: key + ' Contributions', data: thisContributionNWData});  
          
          }           
    });  
    
    // add in Net Worth collected
    // initialize NewWorth data array
    var thisNetWorthData = []; 
    for (var m = 1; m <= monthsToAnalyze; m ++) {
      thisNetWorthData.push(0);
    }

    // add up all series' data
    _.forEach(seriesNWArray, function(value, key) {
      var m=0;
      var prevV = 0;
      var thisSeriesData = [];
      _.forEach(value.data, function(v,k){
        m++;
        thisSeriesData.push(v);
        if (v) {
          thisNetWorthData[m] += v;
          prevV = v || 0;
        } else {
          thisNetWorthData[m] += prevV;
        }
      });
      seriesPlotArray.push({name: value.name, data: thisSeriesData});
      _.set(seriesOptions, [value.name, 'showLine'], true);
      _.set(seriesOptions, [value.name + ' Contributions', 'showLine'], true);      
    });
    
    // push NW array to its series
    seriesPlotArray.push({name: "NetWorth", data: thisNetWorthData});

    // display chart
    console.log('Chart Labels:');
    console.log(chartLabels);
    console.log('Series Array:');
    console.log(seriesPlotArray);    
    console.log('Series Options:');
    console.log(seriesOptions);    
    doChart(chartLabels, seriesPlotArray, seriesOptions);
    doChartJS(chartLabels, seriesPlotArray);
  });
}


function getMonthlyAmount(amt, freq) {
  // convert all amounts to monthly

  if (amt == 0) { return amt; }
  
  if (freq == "m") {
    return amt/1;
  }

  if (freq == "y") {
    return amt/12;
  }

  if (freq == "w") {
    return amt * (52/12);
  }

  if (freq == "h") {
    return amt * 52 * 40;
  }
  
  return 0;
}


function getMonthNumber(querydate){
  if (!querydate) {return false;}
  var dateQueryDate = new Date(querydate);
  var rightNow = new Date();
  var msInMonth = 60 * 60 * 1000 * 24 * (365 / 12);
  if (dateQueryDate <= rightNow) {
      return 1;
  } else {
      return Math.round(((dateQueryDate - rightNow) / msInMonth),0);
  }
}

function tmplrender(tmplDATA, tmplID, destID)  {

  //simple split/join string templating

  //grab template code
  var tmplHTML = document.getElementById(tmplID).innerHTML || "";

  //grab destination node
  var destNode = destID ? document.getElementById(destID) : false;

  //remove comment tokens first 
  tmplHTML = tmplHTML.split('/*').join('').split('*/').join('');

  // in my research over the years, split/join is suprisingly performant
  for (var p in tmplDATA) {
    tmplHTML = tmplHTML.split('{{' + p + '}}').join(tmplDATA[p]);
  }

  if (destNode) {
    destNode.innerHTML = tmplHTML;
  }

  return tmplHTML;
}

function DOMReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function getScenarios(scenarioFileName, callback) {
  console.log('Attempting to load ' + scenarioFileName);
  var request = new XMLHttpRequest();
  request.open('GET', scenarioFileName, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      console.log('Successful scenario load: ' + scenarioFileName);
      var scenarioData = JSON.parse(request.responseText);
    } else {
      // We reached our target server, but it returned an error
      scenarioData = false;
    }
    callback(scenarioData);
  };

  request.onerror = function() {
    // There was a connection error of some sort
    callback(false);
  };

  request.send();
  
}

function randomScalingFactor() {
  return parseInt( Math.random() * 100) + -50;
}

function doChartJS(chartLabels, seriesPlotArray) {

  var zeroData = _.fill(Array(chartLabels.length), 0);
  console.log("ZeroData:");
  console.log(zeroData);
  var config = {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Zero',
        fill: false,
        backgroundColor: window.chartColors.blue,
        borderColor: window.chartColors.blue,
        data: zeroData,
      }, {
        label: seriesPlotArray[1].name,
        fill: false,
        backgroundColor: window.chartColors.green,
        borderColor: window.chartColors.green,
        borderDash: [5, 5],
        data: seriesPlotArray[1].data,
      }, {
        label: 'Filled',
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ],
        fill: true,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Dollars'
          }
        }]
      }
    }
  };

  var ctx = document.getElementById('chartcanvas').getContext('2d');
  window.myLine = new Chart(ctx, config);
}

