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
    } else if(data) {
        
        // show data on page
        var products = document.querySelectorAll('.each-product');
        products = Array.from(products);
        products.forEach(function (product, index) {
            // removing loading status
            if (product.querySelector('.img-loading') && product.querySelector('.name-loading') && product.querySelector('.price-loading')) {
                product.querySelector('.img-loading').classList.remove('active')
                product.querySelector('.name-loading').classList.remove('active')
                product.querySelector('.price-loading').classList.remove('active')
            }

            // inserting data to html elements
            product.querySelector('.product-img img').setAttribute('src', 'img/' + data[index].img);
            product.querySelector('.product-name').textContent =  data[index].name;
        });
    }
});