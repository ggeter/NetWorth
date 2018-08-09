// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started.');
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
      width: '90%',
      height: '90%',    
      showArea: true,
      showLine: false,
      showPoint: false,
      fullWidth: true,
      axisX: {
        showLabel: true,
        showGrid: false
      },
      axisY: {
        showLabel: true,
        showGrid: true      
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
  getScenarios(function (sd) {
    var sdata = sd;    
    // compute time-series DR/CR per item
    
    var currentScenario = sdata["S001"];
    
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
          var thisPlotData = [];
          var thisTaxNWData = [];
          var thisTaxPlotData = [];        
          var thisAccumulator = 0;
          var thisTaxAccumulator = 0;
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var annualgrowthrate = 1 + ((value.annualgrowthrate) / 100 / 12) || 1;
          var effectivetaxrate = (value.effectivetaxrate) / 100 || 0;
          
          console.log("start m for " + key + ":" + startMonth + " at monthly of " + monthlyAmount + " - tax rate= " + effectivetaxrate + " - growth= " + annualgrowthrate);
        
          for (var m = 1; m <= monthsToAnalyze; m ++) {
            if (m >= startMonth && m <= endMonth) {
                monthlyAmount *= annualgrowthrate
                thisAccumulator += monthlyAmount;
                thisTaxAccumulator += (monthlyAmount * effectivetaxrate);
                thisNWData.push(monthlyAmount);
                thisPlotData.push(thisAccumulator);
                thisTaxNWData.push(monthlyAmount * effectivetaxrate * -1);
                thisTaxPlotData.push(thisTaxAccumulator * -1);              
            } else {
                thisPlotData.push(null);
                thisNWData.push(0);
                thisTaxPlotData.push(null);
                thisTaxNWData.push(0);              
            }

          }
        
          seriesPlotArray.push({name: key, data: thisPlotData});
          seriesNWArray.push({name: key, data: thisNWData});
          seriesPlotArray.push({name: key + ' Taxes', data: thisTaxPlotData});
          seriesNWArray.push({name: key + ' Taxes', data: thisTaxNWData});
        
          } 
      
      if (value.type == "expense") { //do expense type
          var thisNWData = [];
          var thisPlotData = [];
          var thisAccumulator = 0;
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var annualgrowthrate = 1 + ((value.annualgrowthrate) / 100 / 12) || 1;
          console.log("start m for " + key + ":" + startMonth + " at monthly of " + monthlyAmount)
        
          for (var m = 1; m <= monthsToAnalyze; m ++) {
            if (m >= startMonth && m <= endMonth) {
                monthlyAmount *= annualgrowthrate
                thisAccumulator += monthlyAmount;
                thisNWData.push(monthlyAmount * -1);
                thisPlotData.push(thisAccumulator * -1);
            } else {
                thisPlotData.push(null);
                thisNWData.push(0);
            }

          }
        
          seriesPlotArray.push({name: key, data: thisPlotData});
          seriesNWArray.push({name: key, data: thisNWData});
          }     
        if (value.type == "savings") { //do savings type
          var thisNWData = [];
          var thisPlotData = [];
          var thisAccumulator = 0;
          var thisContributionNWData = [];
          var thisContributionPlotData = [];
          var thisContributionAccumulator = 0;          
          var startMonth = getMonthNumber(value.startdate) || 1;
          var endMonth = getMonthNumber(value.enddate) || monthsToAnalyze;
          var monthlyAmount = getMonthlyAmount(value.amount, value.frequency);
          var contributionannualgrowthrate = 1 + ((value.contributionannualgrowthrate) / 100 / 12) || 1;
          var investmentannualgrowthrate = 1 + ((value.investmentannualgrowthrate) / 100 / 12) || 1;
          var monthonevalue = value.monthonevalue || 0;
          console.log("start m for " + key + ":" + startMonth + " at monthly of " + monthlyAmount)
          
          thisAccumulator = monthonevalue;
          
          for (var m = 1; m <= monthsToAnalyze; m ++) {
            if (m == 1) { 
              thisNWData.push(monthonevalue);
              thisPlotData.push(thisAccumulator);
            }
            if (m > 1 && m >= startMonth && m <= endMonth) {
                monthlyAmount *= contributionannualgrowthrate;
                thisAccumulator += monthlyAmount;
                thisAccumulator *= investmentannualgrowthrate;
                thisNWData.push(monthlyAmount + monthonevalue);
                thisPlotData.push(thisAccumulator + monthonevalue);
                thisContributionNWData.push(monthlyAmount * -1);
                thisContributionAccumulator += monthlyAmount;
                thisContributionPlotData.push(thisContributionAccumulator * -1);
            } else {
                thisContributionNWData.push(0);
                thisContributionPlotData.push(null);              
            }

          }
        
          seriesPlotArray.push({name: key, data: thisPlotData});
          seriesNWArray.push({name: key, data: thisNWData});
          seriesPlotArray.push({name: key + ' Contributions', data: thisContributionPlotData});
          seriesNWArray.push({name: key + ' Contributions', data: thisContributionNWData});  
          
          _.set(seriesOptions, [key, 'showLine'], true);
          _.set(seriesOptions, [key + ' Contributions', 'showLine'], true);
          }           
    });  
    
    // add in Net Worth collected
    // initialize NewWorth data array
    var thisNetWorthData = []; 
    for (var m = 1; m <= monthsToAnalyze; m ++) {
      thisNetWorthData.push(0);
    }

    // add up all series' data
    console.log(seriesNWArray);
    _.forEach(seriesNWArray, function(value, key) {
      var m=0;
      var thisNWAccumulator = 0;
      _.forEach(value.data, function(v,k){
        m++;
        thisNWAccumulator += v;
        thisNetWorthData[m] += thisNWAccumulator;
      });
    });
    
    // push NW array to its series
    seriesPlotArray.push({name: "NetWorth", data: thisNetWorthData});
    
    // display chart
    doChart(chartLabels, seriesPlotArray, seriesOptions);
  });
}

function getMonthlyAmount(amt, freq) {
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

function getScenarios(callback) {
  var request = new XMLHttpRequest();
  request.open('GET', 'sampleScenarios.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
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