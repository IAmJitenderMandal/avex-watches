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

        // show data on page
        function showProducts(dataToShow) {
            // product html to append
            htmlToappend = '<div class="col-12 col-md-6 col-lg-3"><div class="each-product mb-4"><div class="product-img"><img src="img/%imgPath%" class="w-100 rounded" alt="img"></div><div class="product-name my-1 text-uppercase">%productName%</div> <div class="product-price">%price%</div></div></div>';
            
            // container for product listing
            var productContainer = document.querySelector('.products-listing');
            // replaced html variable
            var replacedHTML;

            dataToShow.forEach(function (product) {
                replacedHTML = htmlToappend.replace('%imgPath%', product.img);
                replacedHTML = replacedHTML.replace('%productName%', product.name);
                replacedHTML = replacedHTML.replace('%price%', 'Rs ' + product.price);

                productContainer.insertAdjacentHTML('afterbegin', replacedHTML);
                
            });
        
        }  showProducts(data);
    }
});