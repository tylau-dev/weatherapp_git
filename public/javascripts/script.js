var mymap = L.map('mapid', {
    center: [48.866667, 2, 333333],
    zoom: 4,
});


var city = document.getElementsByClassName("list-group-item")

var customIcon = L.icon({
    iconUrl: '/images/leaf-green.png',
    shadowUrl: '/images/leaf-shadow.png',

    iconSize: [38, 95],
    shadowSize: [50, 64],

    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],

    popupAnchor: [-3, -76]
})


for (i = 0; i < city.length; i++) {
    var lon = parseFloat(city[i].dataset.lon)
    var lat = parseFloat(city[i].dataset.lat)
    var marker = L.marker([lat, lon], { icon: customIcon }).addTo(mymap)
    marker.bindPopup(`<b>${city[i].dataset.name}</b>`)
}


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(mymap);