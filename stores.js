var lat = "33.980499267578125"
var long = "-84.21903991699219";
var storeURL = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=DepartmentStores&userLocation=" + lat + "," + long + ",10&key=AizLYVCVmDtzFe35OyVFF6FoMBjJuPA96Bc_pPQ50KQ9oMiNl4Pr89MbxB6FbzG9";

getNearbyStores(storeURL);
function getNearbyStores(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response.resourceSets[0].resources);
    })
}