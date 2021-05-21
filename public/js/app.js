console.log('client-side javascript is loaded!');

const weatherForm = document.getElementById('weather-form');
const search = document.querySelector('#weather-form input');
const msgOne = document.querySelector('#response p:first-of-type');
const msgTwo = document.querySelector('#response p:last-of-type');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Search value: ' + search.value);

    //fetch is part of BROWSER code (can't use it in backend node.js code)
    fetch('/weather?location=' + search.value).then((response) => {
        //fetch returns a Promise, need to call response.json() to get the actual data returned
        response.json().then((data) => {
            if (data.error) {
                msgOne.innerText = data.error;
                msgTwo.innerText = "";
            } else {
                msgOne.innerText = data.address;
                msgTwo.innerText = data.forecast;
            }
        });
    });
});