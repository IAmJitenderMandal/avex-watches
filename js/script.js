// feather icon usage
feather.replace();

// swiper initialization
var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

//getting json data from local file
function getProducts(callback) {
    // creation of request Object
    const request = new XMLHttpRequest();

    // adding an readyStatechange event listener to check all the state changes
    request.addEventListener('readystatechange', function () {

        // if we are getting data from that request or not
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);
            callback(undefined, data);
        } else if (request.readyState === 4 && request.status !== 200) {
            callback('sorry data could not fetch', undefined)
        }
    })

    request.open('GET', '../data/data.json');
    request.send();
}

// gettting products
getProducts(function (err, data) {
    if (err) {
        console.log(err);
    } else if (data) {

        // select all filter elements from document
        var filters = document.querySelectorAll('#watchType , #gender, #max-price, #min-price, #color, #dialType, #materialType, #shape, #movement, #collection');
        // converting nodlist to an array
        filters = Array.from(filters);
        console.log(filters);

        var filterVals = [];
        for (var i = 0; i < filters.length; i++) {

            // filter id
            var filterID = filters[i].id;

            // puting each filter related value in an array
            data.forEach(function (eachDataObj) {
                filterVals.includes(eachDataObj[filterID]) ? null : filterVals.push(eachDataObj[filterID]);
            })

            //now settiing dynamically all those option in filters according to the options we have in our data
            filterVals.forEach(function (filterval) {
                for (var i = 0; i < filters.length; i++) {
                    if (filters[i].id === filterID && filterID !== 'price') {
                        filters[i].innerHTML += '<option value=' + filterval + '>' + filterval + '</option>';
                    }
                }
            });
            // making filtervals empty again so it would not have old data again
            filterVals = [];
        }

        // setup event listener on filter elements
        document.querySelector('.filters').addEventListener('change', filterization);

        // making copy of original data
        var modiefiedData = data.slice();

        function filterization() {
            // variables to store filters value
            var watchType = document.querySelector('#watchType').value,
                gender = document.querySelector('#gender').value,
                minPrice = document.querySelector('#min-price').value === '' ? 0 : document.querySelector('#min-price').value,
                maxPrice = document.querySelector('#max-price').value === '' ? 200000 : document.querySelector('#max-price').value,
                color = document.querySelector('#color').value,
                dialType = document.querySelector('#dialType').value,
                material = document.querySelector('#materialType').value,
                shape = document.querySelector('#shape').value,
                movement = document.querySelector('#movement').value,
                collection = document.querySelector('#collection').value;

            if (watchType !== 'all') {
                modiefiedData = data.filter(function (el) {
                    return el.watchType === watchType;
                })
            } else if (watchType === 'all') {
                showProducts(modiefiedData);
            }
            //invoking showProducts for filterd data
            showProducts(modiefiedData)
        }

        console.log(modiefiedData)
        // show data on page
        function showProducts(dataToShow) {
            var products = document.querySelectorAll('.each-product');
            products = Array.from(products);

            products.forEach(function (product, index) {
                // removing loading status
                if (product.querySelector('.img-loading') && product.querySelector('.name-loading') && product.querySelector('.price-loading')) {
                    product.querySelector('.img-loading').classList.remove('active')
                    product.querySelector('.name-loading').classList.remove('active')
                    product.querySelector('.price-loading').classList.remove('active')
                }

                console.log(index)

                // inserting data to html elements
                product.querySelector('.product-img img').setAttribute('src', 'img/' + dataToShow[index].img);
                product.querySelector('.product-name').textContent = dataToShow[index].name;
            });
        }
        showProducts(modiefiedData);
    }
});