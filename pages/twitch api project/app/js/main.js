$(document).ready(function() {

  //Returns url of twitch stream status (For JSON call)
  function urlMaker(nameArray) {
    var urls = new Array();
    for (var i = 0; i < userArray.length; i++) {
    var name = nameArray[i];
    //API Query to return JSON status information
    urls[i] = "https://wind-bow.gomix.me/twitch-api/streams/" + name + "?callback=?";
    }
    return urls;
  };

  //Return div element
  function divCreator(status, link) {
    return "<a href='" + link + "' + target='_blank'><div class='result'><h2>" + status + "</h2></div></a>";
  };

  //Main Program
  //Twitch User Array
  var userArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
  //Create array of twitch status urls
  var urlArray = urlMaker(userArray);
  //Get JSON Data Streams
  for(var i = 0; i < urlArray.length; i++) {
    $.getJSON(urlArray[i], function(json) {
      var status;
      var linkToUserPage;
      console.info(json);
      //Updates user status if user is not streaming
      if (json.stream == null) {
        var userName = json._links.channel
        var split = userName.indexOf("channel");
        userName = userName.substring(split + 9,userName.length);
        status = userName + " status: Offline";
        linkToUserPage = "https://www.twitch.tv/" + userName;
        //Otherwise, display which game they are playing
      } else {
        var userName = json.stream.channel.display_name;
        status =  userName +  " status: Online Streaming: " + json.stream.game;
        linkToUserPage = "https://www.twitch.tv/" + userName;
      }
      $("#streamers").append(divCreator(status,linkToUserPage));
      console.log(status);
    });
  }


  //Get array of Status for each streamer
  //Create Array of Div Strings

 });
