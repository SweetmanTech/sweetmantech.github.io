$(document).ready(function(){

  $("#search-button").click(function() {
    $("#results-container").empty();
    var searchTerm = $("#user-text").val();
    $.getJSON(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=` + searchTerm + `&callback=?` ,function(data) {

    console.log(data);

    //loop to create search results
    for(i = 0; i < data[1].length; i++) {
      var openDiv =  "<div class='result-box' id='result" + i + "'>";
      var openLink = "<a href='" + data[3][i] + "' target='#'>";
      var title = "<h3>" + data[1][i] + "</h3>";
      var description = "<p>" + data[2][i] + "</p>";
      var closeTags = "</div></a>";
      $("#results-container").append(openLink + openDiv + title + description + closeTags);
    }


  });
  });

});
