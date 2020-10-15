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
    
        createModal();
    })

    function getMakeupInfo(queryURL) {
        //code here for ajax call and dynamic element creation

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        })
    }
})

