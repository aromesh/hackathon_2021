const dropdownData =[
    {
        title: 'Temperature',
        id: 'temp',
        data: '/temp-data'
    },
    {
        title: 'Rainfall',
        id: 'rain',
        data: '/rain-data'
    },
    {
        title: 'Air Quality',
        id: 'air',
        data: '/air-data'
    },
    {
        title: 'Vegetation',
        id: 'veg',
        data: '/veg-data'
    },
]



var value = [];
var myText = 'The SUS App';
document.getElementById('displayOutput').innerText = myText;

function saveID(a) {
    

    for (var i=0; i<1; i++) {
        value[i] = a;
        console.log('saved value: '+value)
    }
    console.log('Title: '+dropdownData[a].title)
    document.getElementById('displayOutput').innerText = dropdownData[a].title;
}




