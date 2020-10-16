console.log("test");


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
    })
    
    
    //will need to change this class below to reflect the class of products
    $(document).on("click", ".product", function () {
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
        var walmartURL = "http://api.walmartlabs.com/v1/search?query=" + searchItem + "&format=json&apiKey=d7hjdvye4sky5cdwmmmtf3bf";
        getWalmartInfo(walmartURL);
        // createModal();
    })

    function getMakeupInfo(queryURL) {
        //code here for ajax call and dynamic element creation

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // console.log(response);
            // console.log(response[0].name);
            // console.log(response[0].price);
            // console.log(response[0].image_link);

            //can resize the for loop to however long we want
            for (var i = 0; i < 10; i++) {
                
                var newRow = $("<div>").addClass("row");
                var newCol = $("<div>").addClass("col-sm-12");
                
                imageRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12");
                var imgTag = $("<img>").attr("src", response[i].image_link).attr("height", "30px").attr("width", "30px");
                imageRow.append(imgTag);
                newCol.append(imageRow);

                //add data item to name or image?
                nameRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12").text("Name: " + response[i].name);
                newCol.append(nameRow);
                priceRow = $("<div>").addClass("row").append($("<div>")).addClass("col-sm-12").text("Price: " + response[i].price);
                newCol.append(priceRow);
                newRow.append(newCol);

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

