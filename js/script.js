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

        // converting nodelist to an array
        filters = Array.from(filters);

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

        // data to filter
        var dataToFilter = data.slice();
        var filterdData = dataToFilter;

        // event listener for filters
        document.querySelector('.filters').addEventListener('change', filterization);

        function filterization(event) {
            var watchType = document.querySelector('#watchType').value,
                gender = document.querySelector('#gender').value,
                minPrice = document.querySelector('#min-price').value === '' ? '0' : document.querySelector('#min-price').value,
                maxPrice = document.querySelector('#max-price').value === '' ? '200000' : document.querySelector('#max-price').value,
                color = document.querySelector('#color').value,
                dialType = document.querySelector('#dialType').value,
                material = document.querySelector('#materialType').value,
                shape = document.querySelector('#shape').value,
                movement = document.querySelector('#movement').value,
                collection = document.querySelector('#collection').value;


            if (watchType === 'all' && gender === 'all' && minPrice === '0' && maxPrice === '200000' && color === 'all' && dialType === 'all' && material === 'all' && shape === 'all' && movement === 'all' && collection === 'all') {
                showProducts(dataToFilter);
            } else {

                // filtering data with watchtype, color, gender, price, etc
                filterdData = dataToFilter.filter(function (product) {
                    return parseInt(product.price) >= parseInt(minPrice) && parseInt(product.price) <= parseInt(maxPrice);
                })
                if (watchType !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.watchType === watchType;
                    })
                }
                if (gender !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.gender === gender;
                    })
                }
                if (color !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.color === color;
                    })
                }
                if (dialType !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.dialType === dialType;
                    })
                }
                if (material !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.materialType === material;
                    })
                }
                if (shape !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.shape === shape;
                    })
                }
                if (movement !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.movement === movement;
                    })
                }
                if (collection !== 'all') {
                    filterdData = filterdData.filter(function (product) {
                        return product.collection === collection;
                    })
                }
                // show products according to filterd data
                showProducts(filterdData);
            }
        }

        // show data on page
        function showProducts(dataToShow) {
            // product html to append
            htmlToappend = '<div class="col-12 col-md-6 col-lg-3"><div class="each-product mb-4"><div class="product-img"><img src="img/%imgPath%" class="w-100 rounded" alt="img"></div><div class="product-name my-1 text-uppercase">%productName%</div> <div class="product-price">%price%</div></div></div>';

            // container for product listing
            var productContainer = document.querySelector('.products-listing');
            // replaced html variable
            var replacedHTML;
            // making product container html element empty before inserting new html
            productContainer.innerHTML = '';

            if (dataToShow.length > 0) {
                dataToShow.forEach(function (product) {
                    replacedHTML = htmlToappend.replace('%imgPath%', product.img);
                    replacedHTML = replacedHTML.replace('%productName%', product.name);
                    replacedHTML = replacedHTML.replace('%price%', 'rs ' + product.price);
    
                    productContainer.insertAdjacentHTML('afterbegin', replacedHTML);
                });
            } else {
                productContainer.innerHTML = 'sorry no data found';
            }
        }
        showProducts(dataToFilter);
    }
});