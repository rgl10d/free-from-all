console.log("test");

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
}
  
function showPosition(position) {
    localStorage.setItem("lat", JSON.stringify(position.coords.latitude));
    localStorage.setItem("long", JSON.stringify(position.coords.longitude));
}
getLocation();
var lat = JSON.parse(localStorage.getItem("lat"));
var long = JSON.parse(localStorage.getItem("long"));

console.log("user latitude: " + lat);
console.log("user longitude: " + long);

var APIKey = "&rapidapi-key=092293fd7emshf39e0f6436d8314p1ad470jsnee116871f2d1";
$(document).ready(function() {

 
    $("#searchButton").on("click", function() {

        var queryURL = "https://makeup.p.rapidapi.com/products.json?";
        var makeup = "" //$("#searchField").val();
        var type = "lipstick" //$("#type").val();
        
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
        $("body").append($("<img>").attr("src", "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road?pushpin=33.980499267578125,-84.21903991699219&pushpin=33.9613151550293,-84.12788391113281&format=jpeg&map&MapMetaData=0&key=AizLYVCVmDtzFe35OyVFF6FoMBjJuPA96Bc_pPQ50KQ9oMiNl4Pr89MbxB6FbzG9"));
        
        Microsoft.Maps.ConfigurableMap.createFromConfig(document.getElementById('myMap'), 'https://bingmapsisdk.blob.core.windows.net/isdksamples/configmap2.json', false, null, successCallback, errorCallback);
        function successCallback(mapObj) {
            document.getElementById('printoutPanel').innerHTML = 'success';
        }
        function errorCallback(message) {
            document.getElementById('printoutPanel').innerHTML = message;
        }

        var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
        var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
        map.entities.push(pushpin);
        pushpin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });
        
    })
    
    
    //updated class to reflect "product" on html & below in order to have response work
    $(document).on("click", ".col-sm-12.product", function () {
        var name = "red lipstick" //$(this).attr("data-item");
    
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
        var walmartURL = "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?query=" + searchItem + "&format=json&apiKey=d7hjdvye4sky5cdwmmmtf3bf";
        getWalmartInfo(walmartURL);
        // createModal();
    })

    function getMakeupInfo(queryURL) {
        //code here for ajax call and dynamic element creation

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            console.log(response[0].name);
            console.log(response[0].price);
            console.log(response[0].image_link);

            //can resize the for loop to however long we want
            for (var i = 0; i < 10; i++) {
                
                var newRow = $("<div>").addClass("row");
                var newCol = $("<div>").addClass("col-sm-12");
                
                imageRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12");
                var imgTag = $("<img>").attr("src", response[i].image_link).attr("height", "30px").attr("width", "30px").attr("class", "images");
                imageRow.append(imgTag);
                newCol.append(imageRow);

                //add data item to name or image?
                nameRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12 names").text("Name: " + response[i].name);
                newCol.append(nameRow);
                priceRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12 prices").text("Price: " + response[i].price);
                newCol.append(priceRow);
                newRow.append(newCol);
               
                //creating a button that we can select for the modal to pop up w/ product details 
                buttonRow=$("<div>").addClass("row").append($("<div>")).addClass("col-sm-12");
                var viewBtn=$("<input/>").attr({type:"button",class:"btn btn-secondary btn-sm",id:"detail",value:"view details"});
                buttonRow.append(viewBtn);
                newCol.append(buttonRow);

                // creating an on click for modal pop-up to be triggered

                $("#detail").on("click",function(){
                    $(".popup-content").append(imgTag);
                    $(".popup, .popup-content").addClass("active")});
                    $(".btn.btn-secondary.btn-sm.close, .popup").on("click", function(){
                    $(".popup, .popup-content").removeClass("active");
                });


                //appending to body, but can also append to a class or id
                $("body").append(newRow);
            }
            
        })
    }



    function getWalmartInfo(walmartURL) {
        $.ajax({
            url: walmartURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var name = response.name;
            var brand = response.brandName;
            var price = response.salePrice;
        })
    } 
})