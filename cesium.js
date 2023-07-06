// document.getElementById('sidebar-toggle').addEventListener('click', function() {
//     var sidebar = document.getElementById('sidebar');
//     var button = document.getElementById('sidebar-toggle');
//     if (sidebar.classList.contains('open')) {
//         sidebar.classList.remove('open');
//         button.classList.remove('open');
//     } else {
//         sidebar.classList.add('open');
//         button.classList.add('open');
//     }
// });

        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODhiN2NhYi02NzgxLTQ2OWQtOTAzMi02ZTgwYmNjMGJmYjYiLCJpZCI6MTM4NjUzLCJpYXQiOjE2ODQxMTUyNDV9.yzVSoiedb3diO7rOG9kd9Luuamx4Wjnieson-zb3vvk";

        Cesium.GoogleMaps.defaultApiKey = "AIzaSyDV0rBF5y2f_xsSNj32fxvhqj3ZErTt6HQ";

        const viewer = new Cesium.Viewer("cesiumContainer", {
            globe: false,
        });


    async function createGooglePhotorealistic3DTileset() {
        try {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset();
        window.tileset = tileset;
        viewer.scene.primitives.add(tileset);

        fetchAllData();

        } catch (error) {
        console.log(`Failed to load tileset: ${error}`);
        }
    }


    createGooglePhotorealistic3DTileset();

    function addMore() {
        console.log("hey")
        var moreButton = document.getElementById("moreButton");
        
        if(moreButton.textContent == "More...") {
        document.getElementById("more").style.display = "block";
        document.getElementById("moreButton").textContent = "Less...";
        } else {
        document.getElementById("more").style.display = "none";
        document.getElementById("moreButton").textContent = "More...";
        }
    }

async function plotPoint(tileset, lat, lng, fireData) {
    console.log(tileset, lat, lng, fireData)
    const position = Cesium.Cartesian3.fromDegrees(lng, lat, 10000); // Assume initial altitude of 10,000m

    const ray = new Cesium.Ray(position, Cesium.Cartesian3.negate(Cesium.Cartesian3.fromDegrees(lng, lat), new Cesium.Cartesian3()));
    
    const intersection = viewer.scene.pickFromRay(ray, [tileset]);

    if (Cesium.defined(intersection)) {
        const clampPosition = intersection.position;
        clampPosition.z -= 30;
        clampPosition.y += 30;
        clampPosition.x += 20;

        let billboardEntity = viewer.entities.add({
            position: clampPosition,
            billboard: {
                image: 'https://smartcity.tacc.utexas.edu/FireIncident/assets/images/fire.png',
                scale: 0.1,
                pixelSize: 10,
                outlineWidth: 3,

                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },

        });



        let billboardId = billboardEntity.id;

const action = {
    remove: (popup) => {
        console.log(popup, "The popup was removed");
        // Translate to english: "The popup was removed"
    },
    onChange: (popup) => {
        console.log(popup, "The popup was moved");
        // Translate to english: "The popup was moved"
    },
    editAttr: (popup) => {
        console.log(popup, "The popup needs to edit attributes！");
        // Translate to english: "The popup needs to edit attributes"
        popup.setContent("My content has been changed！")
        // Translate to english: "My content has been changed!"
    }
}

console.log(fireData);
let link = fireData.link;
let longNLatString = link.replace('http://maps.google.com/maps?q=', '');
url = 'https://api.weather.gov/points/' + longNLatString;


var response = await fetch(url);
var api = await response.json();
var hourlyApiUrl = api.properties.forecastHourly;
var response = await fetch(hourlyApiUrl);
var hourlyData = await response.json();
hourlyData1 = hourlyData.properties.periods[0];

let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(function(click) {
    let pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && pickedObject.id.id === billboardId) {
        const cartesian33 = clampPosition;
        const html3 = `
        <button class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</button>
        <div>
            <span>
        <div style="
            font-size: xx-large;
            font-family: sans-serif;
            text-align: center;
            border-color: green;
            border-radius: 20px;
            color: black;
        ">
        <div class="location-info"> <span>${fireData.title}</span><BR>
        </div>
        </div>
            Location: ${fireData.description.split('|')[0]}<br>
            Publish Date: ${fireData.pubDate}<br>
            <a id="moreButton" href="#" onclick="addMore()">More...</a>
            <div id="more" style="display:none">
                Temperature: ${hourlyData1.temperature}℉<br>
                Forecast: ${hourlyData1.shortForecast}<br>
                Wind Speed: ${hourlyData1.windSpeed}<br>
                Wind Direction: ${hourlyData1.windDirection}<br>
            </div>
        </div>
        `;
        var newpopup = new CesiumPopup(viewer, {
            position: cartesian33, 
            html: html3, 
            className: "earth-popup-common1", 
            popPosition: "bottom"
        }, action)
        // Attach a close event to the button in the popup
        document.querySelector('.mapboxgl-popup-close-button').addEventListener('click', () => {
            newpopup.remove();
        });
        // Clicking anywhere off the popup when it is open will close it
        viewer.screenSpaceEventHandler.setInputAction(() => {
            newpopup.remove();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } 
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);



    } else {
        console.log('No intersection found');
        // Do it again in 1 second
        setTimeout(() => plotPoint(tileset, lat, lng, fireData), 1000);

    }
}



var originalPosition = Cesium.Cartesian3.fromDegrees(-97.739720, 30.285337);

var offset = new Cesium.Cartesian3(-250, -80, -200); // Adjust this offset to get the right position.
var position = Cesium.Cartesian3.add(originalPosition, offset, new Cesium.Cartesian3());

var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

var entity = viewer.entities.add({
    position : position,
    orientation : orientation,
    model : {
        uri : '30.285337,-97.7397203.glb',
        minimumPixelSize : 12,
        maximumScale : 20,
        scale : 0.005,
        color: new Cesium.Color(0, 0, 0, 0.9), // Black color with 0.5 alpha
        colorBlendMode : Cesium.ColorBlendMode.MIX,
        colorBlendAmount : 0.5,
        opacity : 0.4,
    }
});


function fetchAllData() {

fetch('https://smartcity.tacc.utexas.edu/FireIncident/data/2022-08-08-FireMap.json')
    .then(response => response.json())
    .then(data => {

        let items = data.rss.channel.item;
        console.log(items);

        for (let item of items) {
            let link = item.link;
            console.log(link);
            let latLng = link.replace("http://maps.google.com/maps?q=", "");
            let [lat, lng] = latLng.split(",");
            console.log(lat, lng);

            plotPoint(window.tileset, parseFloat(lat), parseFloat(lng), item);

            let modelUrl = `${latLng}.glb`;
            let position = Cesium.Cartesian3.fromDegrees(parseFloat(lng), parseFloat(lat));
            let offset = new Cesium.Cartesian3(-250, -80, -200); 
            let finalPosition = Cesium.Cartesian3.add(position, offset, new Cesium.Cartesian3());
            let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(finalPosition, hpr);

            viewer.entities.add({
                position : finalPosition,
                orientation : orientation,
                model : {
                    uri : modelUrl,
                    minimumPixelSize : 12,
                    maximumScale : 20,
                    scale : 0.005,
                    color: new Cesium.Color(0, 0, 0, 0.9),
                    colorBlendMode : Cesium.ColorBlendMode.MIX,
                    colorBlendAmount : 0.5,
                    opacity : 0.4,
                }            
            })

        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    mapPurpleAirData(window.tileset);

}


    function graphPurpleAirPoint(sensorKey, lat, lng, color, description,tileset) {
        console.log(sensorKey, lat, lng, color, description);
        console.log(tileset)

            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lng, lat,150),
                billboard: {
                    image: './circle.png',  // You should create and use a circular image
                    color: Cesium.Color.fromCssColorString(color),
                    scale: 0.05, // This will need to be adjusted
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                id: sensorKey
            });

    }


    var runGetPurpleAirOnce = false;
    var runGetMicrosoftAirOnce = false;
    var airData = [];

    async function mapPurpleAirData(tileset) {

        if (runGetPurpleAirOnce) {
            return;
        }
        runGetPurpleAirOnce = true;

        let sampleData = [
            {
                "link": "https://map.purpleair.com/1/mAQI/a10/p604800/cC0?key=4Z0L6SM6TMMYSTX0&select=27519#14/30.28559/-97.73693",
                "active_status": "yes"
            },
            {
                "link": "https://map.purpleair.com/1/mAQI/a10/p604800/cC0?key=4Z0L6SM6TMMYSTX0&select=27569#13.69/30.28233/-97.72709",
                "active_status": "yes"
            },
        ];


        if(airData.length == 0) {
            let cities = {
                "":[30.747879,29.978325,-98.056977,-97.357011],
            };

            rawwData = [];

            for(city in cities) {
                let latlng = cities[city];
                let jsonUrl = 'https://api.purpleair.com/v1/sensors?api_key=81D9ACDC-966F-11EC-B9BF-42010A800003&nwlat=' + 
                latlng[0] + '&selat=' + latlng[1] + '&nwlng=' + latlng[2] + '&selng=' + latlng[3] + '&fields=latitude,longitude,altitude,pm2.5_10minute';
                let response = await fetch(jsonUrl);
                let currentData = await response.json();

                rawwData = rawwData.concat(currentData.data);
            }
            airData = rawwData;

            console.log(airData);

        }

        for (let i = 0; i < airData.length; i++) {
            let data = airData[i];
            let sensorKey = data[0];
            let longNLatArray = [data[1], data[2]]; //fetched like [index,long,lat,alt,pm25]...
            var pm10Mins = data[4];
            let colorNDes = getPMDescription(pm10Mins)
            var color = colorNDes[0];
            var description = colorNDes[1];
            
            let lat = longNLatArray[0];
            let lng = longNLatArray[1];

            graphPurpleAirPoint(sensorKey, lat, lng, color, description,tileset);

        }

let newpopup = null;

let closePopupHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
closePopupHandler.setInputAction(() => {
    if (newpopup) {
        newpopup.remove();
        newpopup = null;
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

viewer.screenSpaceEventHandler.setInputAction(function (event) {
    var pickedObjects = viewer.scene.drillPick(event.position);
    for (let i = 0; i < pickedObjects.length; i++) {
        if (pickedObjects[i].primitive instanceof Cesium.Billboard) {
            let sensorKey = pickedObjects[i].primitive.id._id;
            console.log(sensorKey);
            let airApiUrl = 'https://api.purpleair.com/v1/sensors/' + sensorKey + '?api_key=81D9ACDC-966F-11EC-B9BF-42010A800003';
            fetch(airApiUrl).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                var description = "";  
                try {
                var popupHtml = buildAirDataPopup(pickedObjects[i].primitive, data.sensor, description);
                } catch {
                    console.log("error")
                    return
                }
                const action = {
                    remove: (popup) => {
                        console.log(popup, "The popup was removed");
                    },
                    onChange: (popup) => {
                        console.log(popup, "The popup was moved");
                    },
                    editAttr: (popup) => {
                        console.log(popup, "The popup needs to edit attributes！");
                        popup.setContent("My content has been changed！")
                    }
                }
                
                if (newpopup) {
                    newpopup.remove();
                }

                newpopup = new CesiumPopup(viewer, {
                    position: pickedObjects[i].primitive.position, 
                    html: popupHtml, 
                    className: "earth-popup-common1", 
                    popPosition: "bottom"
                }, action);

                document.querySelector('.mapboxgl-popup-close-button').addEventListener('click', () => {
                    if (newpopup) {
                        newpopup.remove();
                        newpopup = null;
                    }
                });
                
            });
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);



        function buildAirDataPopup(marker, popupData, description) {

        var sensorKey = popupData.sensor_index; //sensor index

        description = getPMDescription(popupData.stats["pm2.5_10minute"])[1];

        let unixTimestamp = popupData.last_modified;
        var a = new Date(unixTimestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + ' ' + date + ', ' + year;

        var airMarkerPopup = `
        <button class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</button>
        <span>
        <div style="
            font-size: xxx-large;
            font-family: sans-serif;
            text-align: center;
            border-color: green;
            border-radius: 20px;
            color: black;
        ">${popupData.stats["pm2.5_10minute"]}
        </div>
        <b>
        ${description} 
        `;


        var pmLength = popupData.stats["pm2.5_10minute"].toString().length;

        airMarkerPopup += `
        <span style="
            font-size: small;
            color: grey;
            position: absolute;
            top: 50px;
            right: 10px;
        "> μg/m <sup>3</sup>
        </span>`

        airMarkerPopup += `</div>`;

        airMarkerPopup += buildAirTable(popupData.stats);

        airMarkerPopup += `<a id="moreButton" href="#" onclick="addMore()">More...</a>`

        airMarkerPopup += `<div id="more" style="display:none">
        <div class="air-info">
        <span><b>Time:</b> ${time} </span><BR>
        <span><b>Latitude:</b> ${popupData.latitude} </span><BR>
        <span><b>Longitude:</b> ${popupData.longitude} </span><BR>
        <span><b>Altitude:</b> ${popupData.altitude} </span><BR>
        </div>
        `;

        console.log(airMarkerPopup);

        return airMarkerPopup;

    }

    // build air table for next 5 hours
    function buildAirTable(pmData) {
        var data = `
                <tr>
                    <td>${pmData["pm2.5"]}</td>
                    <td>${pmData["pm2.5_10minute"]}</td>
                    <td>${pmData["pm2.5_30minute"]}</td>
                    <td>${pmData["pm2.5_60minute"]}</td>
                    <td>${pmData["pm2.5_6hour"]}</td>
                    <td>${pmData["pm2.5_24hour"]}</td>
                    <td>${pmData["pm2.5_1week"]}</td>
                </tr>
                `;


        var table = `
        <table style="
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 0.9em;
        font-family: sans-serif;
        min-width: 210px;
        min-height: 30px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    ">
        <thead style="
        text-align: center;
        padding: 10px 40px;
        font-size: smaller;
        background-color: #009375;
        color: #ffffff;
        text-align: center;
    ">
            <tr>
                <th>Now</th>
                <th>10 Min</th>
                <th>30 Min</th>
                <th>1 hr</th>
                <th>6 hr</th>
                <th>1 Day</th>
                <th>1 Week</th>
            </tr>
        <thead>
        <tbody>
            ${data}
        </tbody>
        <table/>
        `;
        return table;
    }


        function getPMDescription(pm10Mins, AQI = false) {
            let description = "";
            let color = "";
            if ((AQI && pm10Mins <= 50) || pm10Mins <= 12) {
                color = '#00e400';
                description = '<span>0-12: Air quality is satisfactory, and air pollution poses little or no risk with 24 hours of exposure.</span><BR>';
            } else if ((AQI && pm10Mins <= 100) || pm10Mins <= 35) {
                color = '#fdff01';
                description = '<span>12.1-35.4: Air quality is acceptable. However, there may be a risk for some people with 24 hours of exposure, particularly those who are unusually sensitive to air pollution.</span><BR>';
            } else if ((AQI && pm10Mins <= 150) || pm10Mins <= 55) {
                color = '#ff7e01';
                description = '<span>35.5-55.4: Members of sensitive groups may experience health effects. The general public is less likely to be affected.</span><BR>';
            } else if ((AQI && pm10Mins <= 200) || pm10Mins <= 150) {
                color = '#ff0100';
                description = '<span>55.5-150.4: Some members of the general public may experience health effects: members of sensitive groups may experience more serious health effects.</span><BR>';
            } else if ((AQI && pm10Mins <= 300) || pm10Mins <= 250) {
                color = '#8f3f97';
                description = '<span>150.5-250.4: Health Alert: The risk of health effects is increased for everyone.</span><BR>';

            } else if ((AQI && pm10Mins <= 301) || pm10Mins <= 350) {
                color = '#7e0023';
                description = '<span>250.5-350.4: Health Warning: Health warning of emergency conditions: everyone is more likely to be affected.</span><BR>';

            } else {
                color = '#7e0023';
                description = '<span>>=350.5: Health Warning: Health warning of emergency conditions: everyone is more likely to be affected.</span><BR>';

            }
            return [color, description];
        }

    }



    viewer.flyTo(entity, {
        offset : new Cesium.HeadingPitchRange(0.0, -0.5, 2000.0)
    });

    var scene = viewer.scene;
    var canvas = viewer.canvas;
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    var annotations = scene.primitives.add(new Cesium.LabelCollection());
    document.getElementsByClassName("cesium-viewer-toolbar")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-animationContainer")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-timelineContainer")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-fullscreenContainer")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-geocoderContainer")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-infoBoxContainer")[0].style.display = "none";
    document.getElementsByClassName("cesium-viewer-selectionIndicatorContainer")[0].style.display = "none";

