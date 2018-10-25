//firebase things
var dt=moment().format('MMM Do YY h:mm:ss a');

var config = {
    apiKey: "AIzaSyD-KUND8H-o2glgukMq1XevhOVtqkzTHr4",
    authDomain: "nodemcu-weather-ac0cf.firebaseapp.com",
    databaseURL: "https://nodemcu-weather-ac0cf.firebaseio.com",
    projectId: "nodemcu-weather-ac0cf",
    storageBucket: "nodemcu-weather-ac0cf.appspot.com",
    messagingSenderId: "551195835447"
};
firebase.initializeApp(config);
var database=firebase.database();

var rootRef=database.ref('weather');
console.log(rootRef.key);
//console.log(firebase);

//normal
let data=[];
var x=document.getElementById('lati');
var y=document.getElementById('longi');
let darkSky=`https://api.darksky.net/forecast/453b6b86d62f88b6cec61505d3629ba7/`;
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
function displayLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition,null,options);
    }
    else
    {
        alert('GeoLocation is not supported by your browser!');
    }
}

function showPosition(position) {
    x.innerHTML= position.coords.latitude;
    y.innerHTML= position.coords.longitude;
}



function getWeatherData(){
    let lat=x.innerHTML,
        long=y.innerHTML;
    darkSky=darkSky+`${x.innerHTML},${y.innerHTML}?units=si`;
    var locationBtn=$('#weather-btn');
    // console.log(darkSky);
    locationBtn.attr('disabled','disabled').text("Fetching data..");

    axios.post('/iot',{url:darkSky}).then( (res) => {
        //console.log(res.data);
        $('#time').html(res.data.timezone);
        $('#temp').html(res.data.temp);
        $('#desc').html(res.data.desc);

        locationBtn.removeAttr('disabled').text('Get weather data');

        //location link updation
        $('#pos-link').text('You are here on Google Maps!');
        $('#pos-link').attr('href',`https://google.com/maps?q=${lat},${long}`);

        res.data.time=dt;
        rootRef.update({
            latitude:lat,
            longitude:long,
            timezone:`${res.data.timezone}`,
            temp:`${res.data.temp}`,
            desc:`${res.data.desc}`,
            time:`${res.data.time}`,
        });
    });
}
