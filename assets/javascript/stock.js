// Making variables

var lastStock;
var stock;
$(document).ready(function () {
 $("#reload").on('click', function (event){
   location.reload()
 })

 // Function for checkboxes
  $("#add2").on("click", function (event) {
    if ($('input[name=1]:checked').val()) {
      lastStock.find(".p10").show()
    }
    if ($('input[name=2]:checked').val()) {
      lastStock.find(".p11").show()
    }
    if ($('input[name=3]:checked').val()) {
      lastStock.find(".p12").show()
    }
    if ($('input[name=4]:checked').val()) {
      lastStock.find(".p13").show()
    }
    if ($('input[name=5]:checked').val()) {
      lastStock.find(".p14").show()
    }
    // Automatically uncheck the checkbox on click
    $('input[type=checkbox]').prop('checked', false);
  })

  //Turning numbers into scientific notation and adding the corresponding letter after it,if it is greater than or equal to a certain amount of digits
  function test(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+12
      ? Math.abs(Number(labelValue)) / 1.0e+12 + "T"
      : Math.abs(Number(labelValue)) >= 1.0e+9
        ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
        : Math.abs(Number(labelValue)) >= 1.0e+6
          ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
          : Math.abs(Number(labelValue)) >= 1.0e+3
            ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
            : Math.abs(Number(labelValue)).toFixed(3);
  }
  // On click function to search stocks by symbol 

  $("#add").on("click", function loads(event) {
    $(".card").show('display');
    event.preventDefault();
    var up = $("#user-input").val().trim().toUpperCase();
    $("#user-input").val("");
    // var m=moment()

    var time =moment().format('hh:mm:ss a')
var timeDis=$("<p>")
timeDis.append(time)
$(".timenow").html(timeDis)
   // User input validation part I if textbox is empty
   
    if (up === "") { $(".invalid").show("display") }
    else {
      var queryURL = "https://api.iextrading.com/1.0/stock/" + up + "/batch?types=quote,news,chart&range=1m&last=10"
      $.ajax({
        url: queryURL,
        method: "GET",
        success: function(response){

          // API and ajax call for articles

          var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=1f2c1d3c4445491595f3d3d6846cb91d&q=" +response.quote.companyName + "&begin_date=20181001&sort=newest";
          console.log(response.quote.companyName)
        $.ajax({
          url: url,
          method: 'GET',
        }).then(function(result) {
          for(var i = 0; i < 3; i++){
            
            $("#article-section").append(up + "<p>" +"<b>"+ result.response.docs[i].headline.main + "</b>: <a href='" + result.response.docs[i].web_url + "'target='_blank'>" + result.response.docs[i].web_url + "</a></p>").css('font-weight', 'normal')
            
          };
          // $("#stock-title").prepend("<h2>"+ response.quote.symbol+ "<h2>")
          
          $("#article-section").append('<hr size ="80px"><br>')
        })
     } }).then(function (response) {
        console.log(response);
        console.log()
        // creating col and p to display the stocks
        var stockDiv = $("<div  class='col-sm-3'>")
        var p = $("<p>").append("<h1>" + response.quote.symbol + "</h1><hr>").css('color', 'rgb(59, 59, 206)');
        var p1 = $("<p>").append(response.quote.companyName);
        var p15 = $("<p>").append("▲ " + response.quote.change + " &nbsp; &nbsp; " + ((((response.quote.latestPrice / response.quote.previousClose) - 1) * 100).toFixed(3)) + "%").css({ 'color': 'rgb(94, 207, 18)', 'font-weight': 'bold', 'font-size': '20px' })
        var p16 = $("<p>").append("▼ " + response.quote.change + " &nbsp; &nbsp; " + ((((response.quote.open / response.quote.close) - 1) * 100).toFixed(3)) + "%").css({ 'color': 'red', 'font-weight': 'bolder', 'font-size': '20px' });
       
        if (response.quote.change >= 0) {
          stockDiv.append(p15)
        } else {
          stockDiv.append(p16)
        }
        var volume =response.quote.latestVolume.toLocaleString(undefined, {minimumFractionDigits: 2})
        var p2 = $("<p>").append('Percent Change = ' + ((((response.quote.open / response.quote.close) - 1) * 100).toFixed(3)) + "%") // percent change Day
        var p3 = $("<p>").append('Updated: ' + response.quote.latestTime) //time of last quote
        var p4 = $("<p>").append("Volume: " + response.quote.latestVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })); //daily volume
        var p5 = $("<p>").append("Change Day: " + response.quote.change);
        var p6 = $("<p>").append('&#36;' + (response.quote.close)).css('font-size', '45px') // close price
        var market = response.quote.marketCap;
        var marketTest = test(market);
        stockDiv.append(p, p1, p6);
        if (response.quote.change >= 0) {
          stockDiv.append(p15)
          $("#stock").append(stockDiv);
        } else {
          stockDiv.append(p16)
          $("#stock").append(stockDiv);
        }
        stockDiv.append(p2, p3, p4, p5);
        $("#stock").append(stockDiv);
        var p10 = $("<p class='p10'>").append(("Range Price difference: " + (response.quote.high - response.quote.low).toFixed(2))).hide() //difference between high and low
        var p11 = $("<p class='p11'>").append("Day's Range: " + response.quote.high.toFixed(2) + '-' + response.quote.low).hide()
        var p12 = $("<p class='p12'>").append("Market Cap: " + marketTest).hide()
        var p13 = $("<p class='p13'>").append("Change Week: " + (response.quote.close - response.chart[18].close).toFixed(2)).hide()
        var p14 = $("<p class='p14'>").append("Change Month: " + (response.quote.close - response.chart[0].close).toFixed(2)).hide()
        
        stockDiv.append(p10);
        stockDiv.append(p11);
        stockDiv.append(p12);
        stockDiv.append(p13);
        stockDiv.append(p14);
        
        $("#stock").append(stockDiv)
        lastStock=stockDiv;
        $(".invalids").hide("display");
        $(".invalid").hide("display");

        // User input validation part II if its a invalid stock

           }).fail(function() {
             $(".invalids").show("display");
      })
      };
})
})