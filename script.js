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

// var type = "";
// $(".button").on("click", function() {
//   type = $(this).text();
// })

$("#searchButton").on("click", function () {
  var queryURL = "http://makeup-api.herokuapp.com/api/v1/products.json?";
  var makeup = $("#makeup-input").val();
  var type = "blush";
console.log("makeup: " + makeup);
// console.log("type: " + type);
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
  console.log(queryURL);
  getMakeupInfo(queryURL);
});


function showMakeupDetail(record) {
  return function(){
    var modalEl = $("#product-details");
      modalEl.html("");
      var dataIndex = $(this).attr("data-index");
    // }
      
  
  //    Return anonymous function tied to record detail

    var makeupFromStorage = JSON.parse(localStorage.getItem("makeupObject"));
    console.log(makeupFromStorage);
    var imgTag = $("<img>").attr({
        "src": record.image_link,
        "class": "modal-image"});
    var detailName = $("<h3>").text(record.name).attr("id", "detail-name");
    var brandCaps = record.brand.toUpperCase();
    var detailBrand = $("<p>").text(brandCaps).attr("id", "detail-brand");
    var mapDiv = $("<div>").attr({
        "id": "myMap",
        "class": "modal-map",
    });

    modalEl.append(imgTag);
    modalEl.append(detailName);
    modalEl.append(detailBrand);
    modalEl.append(mapDiv);
    getLocation();
    }
}

function getMakeupInfo(queryURL) {
  //code here for ajax call and dynamic element creation

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    localStorage.setItem("makeupObject", JSON.stringify(response));

    //can resize the for loop to however long we want
    for (var i = 0; i < 10; i++) {
        var newRow = $("<div>").attr("class", "grid-x");
        var newCol = $("<div>").attr("class", "results-line cell");
        
        // imageRow = $("<div>").addClass("grid-x");
        var imgTag = $("<img>").attr({
            "src": response[i].image_link,
            "class": "results-image"});
        // imageRow.append(imgTag);
        newCol.append(imgTag);

      //add data item to name or image?
      nameEl = $("<h3>").addClass("names").text(response[i].name);
      priceEl = $("<p>").addClass("prices").text("$" + response[i].price);
      descriptionEl = $("<p>").addClass("description").text(response[i].description);
      newCol.append(nameEl);
      newCol.append(priceEl);
      newCol.append(descriptionEl);
      newRow.append(newCol);

      //creating a button that we can select for the modal to pop up w/ product details
        var viewBtn=$("<button>").attr({
            class:"button filter-btn results-btn",
            id:"details-" + i,
            "data-open":"product-details",
            value:"view details"})
            .text("Product Details");
        newCol.append(viewBtn);

      // creating an on click for modal pop-up to be triggered

      viewBtn.on("click", showMakeupDetail(response[i]));


      //appending to body, but can also append to a class or id
      $("#results-col").append(newRow);
    }
  });
}

