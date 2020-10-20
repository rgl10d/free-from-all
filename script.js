function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  localStorage.setItem("lat", JSON.stringify(position.coords.latitude));
  localStorage.setItem("lon", JSON.stringify(position.coords.longitude));
  GetMap();
}
// getLocation();

var APIKey = "&rapidapi-key=092293fd7emshf39e0f6436d8314p1ad470jsnee116871f2d1";
// $(document).ready(function() {


function GetMap() {
  var latFromStorage = JSON.parse(localStorage.getItem("lat"));
  var lonFromStorage = JSON.parse(localStorage.getItem("lon"));
  if (!latFromStorage || !lonFromStorage) {
    console.log("Please enable geolocation");
  } else {
        var centerPoint = new Microsoft.Maps.Location(
        latFromStorage,
        lonFromStorage
        );
        var map = new Microsoft.Maps.Map("#myMap", {
        center: centerPoint,
        });
    
        var infobox = new Microsoft.Maps.Infobox(centerPoint, {
            visible: false
        })

        infobox.setMap(map);

        var userLoc = new Microsoft.Maps.Location(latFromStorage, lonFromStorage);
        var pin = new Microsoft.Maps.Pushpin(userLoc, {
        title: "You",
        color: "red",
        visible: true,
        });
        map.entities.push(pin);
        // pin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });

        map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: centerPoint,
        zoom: 11,
        });

        var storeURL =
        "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=DepartmentStores&userLocation=" +
        latFromStorage +
        "," +
        lonFromStorage +
        ",10&key=AizLYVCVmDtzFe35OyVFF6FoMBjJuPA96Bc_pPQ50KQ9oMiNl4Pr89MbxB6FbzG9";

        $.ajax({
            url: storeURL,
            method: "GET",
        }).then(function (response) {
            var array = response.resourceSets[0].resources;
            console.log(array);
            
            for (var i = 0; i < array.length; i++) {
                var loc = new Microsoft.Maps.Location(
                    array[i].point.coordinates[0],
                    array[i].point.coordinates[1]
                );
                
                var pin = new Microsoft.Maps.Pushpin(loc, {
                //   icon: 45,
                visible: true,
                color: "blue",
                title: array[i].name
                });

                pin.metadata = {
                    title: array[i].name,
                    description: array[i].Address.formattedAddress + "\n" + array[i].PhoneNumber
                };
                Microsoft.Maps.Events.addHandler(pin, "mouseover", pushpinHover);
                map.entities.push(pin);
            }
        });   
    }
    function pushpinHover(e) {
        if (e.target.metadata) {
            infobox.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                description: e.target.metadata.description,
                visible: true
            });
        }
    }
}


$(".searchButton, .button").on("click", function () {
  var type = "";
  if ($(this).hasClass("button")) {
    var type = $(this).text();
  }
  console.log(type);
  var queryURL = "http://makeup-api.herokuapp.com/api/v1/products.json?";
  var makeup = $("#makeup-input").val();
  // var type = "blush";
console.log("makeup: " + makeup);
// console.log("type: " + type);
  if (makeup !== "") {
    var temp = "brand=" + makeup;
    makeup = temp;
    queryURL += makeup;
  } else if (makeup.indexOf(" ") !== -1) {
    var temp = makeup.split(" ");
    makeup = "";
    for (var i = 0; i < temp.length; i++) {
      if (i == temp.length - 1) {
        makeup += temp[i];
      } else {
        makeup += temp[i] + "+";
      }
    }
  }
  if (type !== "") {
    var temp = "&product_type=" + type;
    type = temp;
    queryURL += type;
  }

  //need to create model function that will add results
  queryURL += APIKey;
  console.log(queryURL);
  getMakeupInfo(queryURL);
});


// function showMakeupDetail(record) {
  $(document).on("click", "#details", function() {
    // if (event.matches("button")) {
      var dataIndex = $(this).attr("data-index");
      console.log(dataIndex);
    // }
      
  
  //    Return anonymous function tied to record detail

  var makeupFromStorage = JSON.parse(localStorage.getItem("makeupObject"));
  console.log(makeupFromStorage);

    var imgTag = $("<img>")
      .attr("src", makeupFromStorage[dataIndex].image_link)
      .attr("height", "30px")
      .attr("width", "30px")

      .attr("class", "images");
    $(".popup-content").append(imgTag);
    $(".popup-content").html("").append(imgTag);
    var name = $("<div>").text("Name: " + makeupFromStorage[dataIndex].name);
    $(".popup-content").append(name);
    // var description = $("<div>").text("Description: " + makeupFromStorage[dataIndex].description);
    // $(".popup-content").append(description);
    var mapDiv = $("<div>").attr("id", "myMap");
    mapDiv.css({
      "position": "relative",
      "height": "400px",
      "width": "400px",
      "left": "50%"
    });
    $(".popup-content").append(mapDiv);
    var latFromStorage = JSON.parse(localStorage.getItem("lat"));
    var lonFromStorage = JSON.parse(localStorage.getItem("lon"));
    if (!latFromStorage || !lonFromStorage) {
      getLocation();
    } else {
      GetMap();
    }
    $(".popup, .popup-content").addClass("active");
    $("#close, .popup-overlay").on("click", function() {
      $(".popup-overlay, .popup-content").removeClass("active");
    });
    
})

function getMakeupInfo(queryURL) {
  //code here for ajax call and dynamic element creation

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(response[0].name);
    console.log(response[0].price);
    console.log(response[0].image_link);
    localStorage.setItem("makeupObject", JSON.stringify(response));

    //can resize the for loop to however long we want
    for (var i = 0; i < 10; i++) {
      var newRow = $("<div>").addClass("row");
      var newCol = $("<div>").addClass("col-sm-12");

      imageRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12");
      var imgTag = $("<img>")
        .attr("src", response[i].image_link)
        .attr("height", "30px")
        .attr("width", "30px")
        .attr("class", "images")
        .attr("data-index", i);
      imageRow.append(imgTag);
      newCol.append(imageRow);

      //add data item to name or image?
      nameRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12 names")
        .attr("data-index", i)
        .text("Name: " + response[i].name);
      newCol.append(nameRow);
      priceRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12 prices")
        .attr("data-index", i)
        .text("Price: " + response[i].price);
      newCol.append(priceRow);
      newRow.append(newCol);

      //creating a button that we can select for the modal to pop up w/ product details
      buttonRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12")
        .attr("data-index", i);
      var viewBtn = $("<button>")
        .addClass("details btn btn-secondary btn-sm")
        .attr("id", "details")
        .attr("data-index", i)
        .attr("type", "button")
        .text("View Details");
      buttonRow.append(viewBtn);
      newCol.append(buttonRow);

      // creating an on click for modal pop-up to be triggered

      // viewBtn.on("click", showMakeupDetail(response[i]));


      //appending to body, but can also append to a class or id
      $("#results-col").append(newRow);
    }
  });
}

