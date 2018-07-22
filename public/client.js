// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started.');
  // variables, setup, shared functions

  
  // application
  var chart = new Chartist.Line('.ct-chart', {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    // Naming the series with the series object array notation
    series: [{
      name: 'series-1',
      data: [5, 2, -4, 2, 0, -2, 5, -3]
    }, {
      name: 'series-2',
      data: [4, 3, 5, 3, 1, 3, 6, 4]
    }, {
      name: 'series-3',
      data: [2, 4, 3, 1, 4, 5, 3, 2]
    }]
  }, {
    fullWidth: true,
    // Within the series options you can use the series names
    // to specify configuration that will only be used for the
    // specific series.
    series: {
      'series-1': {
        lineSmooth: Chartist.Interpolation.step()
      },
      'series-2': {
        lineSmooth: Chartist.Interpolation.simple(),
        showArea: true
      },
      'series-3': {
        showPoint: false
      }
    }
  }, [
    // You can even use responsive configuration overrides to
    // customize your series configuration even further!
    ['screen and (max-width: 320px)', {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.none()
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.none(),
          showArea: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.none(),
          showPoint: true
        }
      }
    }]
  ]);

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