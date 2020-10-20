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
getLocation();

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

$("#searchButton").on("click", function () {
  var queryURL = "https://makeup.p.rapidapi.com/products.json?";
  var makeup = ""; //$("#searchField").val();
  var type = "lipstick"; //$("#type").val();

  if (makeup !== "") {
    var temp = "brand=" + makeup;
    makeup = temp;
    queryURL += makeup;
  }
  if (type !== "") {
    var temp = "&product_type=" + type;
    type = temp;
    queryURL += type;
  }

  //need to create model function that will add results
  queryURL += APIKey;
  getMakeupInfo(queryURL);

  // $.ajax({
  //     url: "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road?pushpin=33.980499267578125,-84.21903991699219&pushpin=33.9613151550293,-84.12788391113281&format=jpeg&map&MapMetaData=0&key=AizLYVCVmDtzFe35OyVFF6FoMBjJuPA96Bc_pPQ50KQ9oMiNl4Pr89MbxB6FbzG9",
  //     method: "GET"
  // }).then(function(response) {
  //     $("body").append($("<img>").attr("src", response));
  // })
  $("body").append(
    $("<img>").attr(
      "src",
      "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road?pushpin=33.980499267578125,-84.21903991699219&pushpin=33.9613151550293,-84.12788391113281&format=jpeg&map&MapMetaData=0&key=AizLYVCVmDtzFe35OyVFF6FoMBjJuPA96Bc_pPQ50KQ9oMiNl4Pr89MbxB6FbzG9"
    )
  );

  // Microsoft.Maps.ConfigurableMap.createFromConfig(document.getElementById('myMap'), 'https://bingmapsisdk.blob.core.windows.net/isdksamples/configmap2.json', false, null, successCallback, errorCallback);
  // function successCallback(mapObj) {
  //     document.getElementById('printoutPanel').innerHTML = 'success';
  // }
  // function errorCallback(message) {
  //     document.getElementById('printoutPanel').innerHTML = message;
  // }

  // var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
  // var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
  // map.entities.push(pushpin);
  // pushpin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });
});

//updated class to reflect "product" on html & below in order to have response work
$(document).on("click", ".col-sm-12.product", function () {
  var name = "red lipstick"; //$(this).attr("data-item");

  var searchArray = name.split(" ");
  searchItem = "";
  for (var i = 0; i < searchArray.length; i++) {
    if (i == searchArray.length - 1) {
      searchItem += searchArray[i];
    } else {
      searchItem += searchArray[i] + "+";
    }
  }
  console.log(searchItem);
  // http://api.walmartlabs.com/v1/search?query=red+lipstick&format=json&apiKey=d7hjdvye4sky5cdwmmmtf3bf
  var walmartURL =
    "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?query=" +
    searchItem +
    "&format=json&apiKey=d7hjdvye4sky5cdwmmmtf3bf";
  getWalmartInfo(walmartURL);
  // createModal();
});

function showMakeupDetail(record) {
  //    Return anonymous function tied to record detail
  return function () {
    var imgTag = $("<img>")
      .attr("src", record.image_link)
      .attr("height", "30px")
      .attr("width", "30px")
      .attr("class", "images");
    imageRow.append(imgTag);
    $(".popup-content").html("").append(imgTag);
    $(".popup, .popup-content").addClass("active");
    $("#close, .popup-overlay").on("click", function() {
      $(".popup-overlay, .popup-content").removeClass("active");
    });
  };
}

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
        .attr("class", "images");
      imageRow.append(imgTag);
      newCol.append(imageRow);

      //add data item to name or image?
      nameRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12 names")
        .text("Name: " + response[i].name);
      newCol.append(nameRow);
      priceRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12 prices")
        .text("Price: " + response[i].price);
      newCol.append(priceRow);
      newRow.append(newCol);

      //creating a button that we can select for the modal to pop up w/ product details
      buttonRow = $("<div>")
        .addClass("row")
        .append($("<div>"))
        .addClass("col-sm-12");
      var viewBtn = $("<input/>").attr({
        type: "button",
        class: "btn btn-secondary btn-sm",
        id: "detail",
        value: "view details",
      });
      buttonRow.append(viewBtn);
      newCol.append(buttonRow);

      // creating an on click for modal pop-up to be triggered

      viewBtn.on("click", showMakeupDetail(response[i].description));


      //appending to body, but can also append to a class or id
      $("body").append(newRow);
    }
  });
}

