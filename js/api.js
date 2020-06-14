//тестовый API
//const requestURL = 'https://jsonplaceholder.typicode.com/users' 
const apiKey = '24f8fb07c213c7208232c72e84a663c0';

let lat;
let lon;
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function callback (position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    createRequest(lat, lon)
}

function sendRequest (method, url) {
    return fetch(url).then(response =>{
        return response.json()
    })
}

function getData(requestURL) {
    return new Promise ((resolve, reject) =>{

        const xhr = new XMLHttpRequest()
        xhr.open('GET', requestURL)
        xhr.responseType = 'json'
        
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }
        
        xhr.onerror = () => {
            reject(xhr.response)
        }
        
        xhr.send()

    })
}

function hideIcon() {
    let block = document.getElementById('svgIcon');
    block.classList.add('hideItem');
}

function createInfoBlock (data) {

    let headerIcon = document.getElementById('icon');
    let geoCityBlock = document.getElementById('geoCityBlock');
    let geoTempSkyBlock = document.getElementById('geoTempBlock');
    let geoHumidityBlock = document.getElementById('geoHumidityBlock');
    let geoWindBlock = document.getElementById('geoWindBlock');

    let geoCityNameValue = data.timezone.substr(data.timezone.indexOf('/') + 1,) ? data.timezone.substr(data.timezone.indexOf('/') + 1,) : 'Choose city';
    let geoTempValue = Math.round(data.current.temp) ? Math.round(data.current.temp) : '';
    let geoSkyValue = data.current.weather[0].description ? data.current.weather[0].description : '';
    let geoHumidityValue = data.current.humidity ? data.current.humidity : '';
    let geoWindValue = data.current.wind_speed ? data.current.wind_speed : '';
    let geoIctonValue = data.current.weather[0].icon ? data.current.weather[0].icon : '01n';


    geoCityBlock.innerHTML = geoCityNameValue;
    geoTempSkyBlock.innerHTML = `${geoTempValue} &degC, ${geoSkyValue}`;
    geoHumidityBlock.innerHTML = `${geoHumidityValue}%`;
    geoWindBlock.innerHTML = `${geoWindValue}m/s`;

    hideIcon();

    let geoIconLink = `http://openweathermap.org/img/wn/${geoIctonValue}@2x.png`;
    headerIcon.innerHTML = `<img src="${geoIconLink}" class="geoIcon" alt="Weather"/>`;
    //console.log(data)
}

function createRequest (lat, lon) {
    let requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    
    sendRequest('GET', requestURL)
        .then(data => createInfoBlock(data))
        .catch(err => console.log(err))

    getData(requestURL); 
}

function convertUNIXData (unixTimestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unixTimestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    console.log(formattedTime);
}

navigator.geolocation.getCurrentPosition(callback,error,{timeout:10000});