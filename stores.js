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