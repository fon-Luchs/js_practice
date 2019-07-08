function Products(args = {}) {

    //static columns

    if (Products.quantity === undefined){
        Products.quantity = 0;
    } else {
        if(Products.quantity > 0) Products.count--;
    }

    Products.defaultImages = [
        'http://scp-ru.wdfiles.com/local--files/scp-603/603.png',
        'http://scp-ru.wdfiles.com/local--files/scp-603/603.png'
    ];

    Products.searchProduct = function(products_array = [], string = '') {
        let mathces =  products_array.filter(item => item.name.indexOf(string) !== -1);
        return mathces;
    };

    Products.sortProducts = function(products_array = [], key = '', order = '') {
        if (key === 'price' || key === 'name' || key === 'id') {
            let sorted_array = [ ...products_array ];

            if(order === 'asc') {
                sortByAsc(sorted_array, key);
            } else if(order === 'desc') {
                sortByDesc(sorted_array, key);
            }

            return sorted_array;
        }

        return 'invalid key';
    };

    Products.sortCurrentProductsArray = function(products_array = [], key = '') {
        if (key === 'price' || key === 'name' || key === 'id') {
            return products_array;
        }
    };

    //object columns

    this.id          = (new Date()).getTime();
    this.name        = args.name || 'empty';
    this.description = args.description || '';
    this.price       = args.price || 0.0;
    this.brand       = args.brand || 'empty';
    this.sizes       = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    this.activeSize  = validatesSize(this.sizes);
    this.quantity    = Products.quantity;
    this.date        = args.date || new Date;
    this.reviews     = [];
    this.images      = validatesImagesArray(args.images);

    //validation functions

    function validatesSize(sizes) {
        if (!args.activeSize) {
            return 'invalid size';
        } else if (sizes.includes(args.activeSize.toUpperCase())) {
            return args.activeSize;
        } else {
            return 'invalid size';
        }
    };

    function validatesImagesArray(array) {
        if (!array) {
            return Products.defaultImages;
        } else if (array.isArray()){
            let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
            let regex = expression;

            for(let i = 0; i < array.length; i++) {
                if (isString(array[i]) && regex.test(array[i]) ) {
                    continue;
                } else {
                    return Products.defaultImages;
                }
            }
        } else {
            return Products.defaultImages;
        }

        return array;
    }

    //object methods

    this.getId = function() {
        return this.id;
    };

    this.getName = function() {
        return this.name;
    };

    this.getDescription = function() {
        return this.description;
    };

    this.getPrice = function() {
        return this.price;
    };

    this.getBrand = function() {
        return this.brand;
    };

    this.getSizes = function() {
        return this.sizes; 
    };

    this.getActiveSize = function() {
        return this.activeSize;
    };

    this.getQuantity = function() {
        return this.quantity;
    };

    this.getDate = function() {
        return this.date;
    };

    this.getReviews = function() {
        return this.reviews;
    };

    this.getReviewById = function(id) {
        let review = function() {
            for(let i = 0; i < this.reviews.length; i++) {
                for(let key in this.reviews[i]){
                    if(reviews[i][key] === id){
                        return review[i][key];
                    }
                }
            }
            if(review){
                return review;
            } else {
                return 'record not found';
            }
        }
    };

    this.getImages = function() {
        return this.images;
    };

    this.getImage = function(image_index = 0) {
        if(image_index > this.images.length || image_index < 0) {
            return this.images[0];
        }

        return this.image[image_index];
    };

    this.setName = function(name) {
        this.name = name;
    };

    this.setDescription = function(description) {
        this.description = description;
    };

    this.setPrice = function(price) {
        this.price = price;
    };

    this.setBrand = function(brand) {
        this.brand = brand;
    };

    this.addSize = function(size) {
        if(this.sizes.includes(size.toUpperCase())) {
            return 'Already exist';
        } else {
            this.sizes.push(sizu.toUpperCase());
        }
    };

    this.deleteSize = function(size_index = 0) {
        if(size_index > this.sizes.length || size_index < 0) {
            return 'Invalid value';
        } else {
            for( let i = 0; i < this.sizes.length; i++){ 
                if ( this.sizes[i] === size_index) {
                    this.sizes.splice(i, 1); 
                }
             }
        }
    };

    this.setActiveSize = function(value) {
        let size = validatesSize(value);
        this.activeSize = size === 'invalid size' ? this.activeSize : size;
    };

    this.setDate = function(date) {
        if (date instanceof Date){
            this.date = date;
        }
    };

    this.addReview = function(args = {}){
        let review = new Review(args);
        this.reviews.push(review);
    };

    this.deleteReview = function(review_id) {
        this.reviews.forEach(function(review, i) {
            if(review.id === review_id){
                this.sizes.splice(i, 1);
            }
        });
    };

    this.getAverageRating = function() {
        return {
            value:   averageRatingsValue(this.reviews, 'value'),
            service: averageRatingsValue(this.reviews, 'service'),
            price:   averageRatingsValue(this.reviews, 'price'),
            quality: averageRatingsValue(this.reviews, 'quality')
        };
    };

    function averageRatingsValue(array = [], rating_type) {
        let sum = 0;

        array.forEach(function(review) {
            sum += review.rating[rating_type];
        });

        if(sum === 0) {
            return sum;
        } else {
            return (sum / array.length).toFixed(2);
        }
    }

    function sortByAsc(sorted_array, key) {
        if(key === 'price') {
            return sorted_array.sort(sortByPriceAsc)
        } else if(key === 'name') {
            return sorted_array.sort(sortByNameAsc);
        } else if(key === 'id') {
            return sorted_array.sort(sortByIdAsc)
        }
    };

    function sortByPriceAsc(a, b) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
    }

    function sortByNameAsc(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
    }

    function sortByIdAsc(a, b) {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
    }

    function sortByDesc(sorted_array, key) {
        return sortByAsc(sorted_array, key).reverse();
    }
}

function Review(args = {}) {
    //object columns

    this.id      = 'id' + (new Date()).getTime();
    this.author  = args.author  || 'incognito';
    this.date    = args.date    || new Date;
    this.comment = args.comment || '';
    this.rating  = args.rating ? new Rating(args.rating) : new Rating;
}

function Rating(args = {}) {
     //object columns

     this.value   = args.value   || 0;
     this.service = args.service || 0;
     this.price   = args.price   || 0;
     this.quality = args.quality || 0;
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

let tst = new Products({name: 'Loller', activeSize: 'lol', price: 2});

let tst_2 =  new Products({name: 'Loller', activeSize: 'lol', price: 4});

for(let i = 0; i < 10; i++) {
    tst.addReview({
        author: 'Banger',
        comment: 'OHHHHHHHHHH',
        rating: {
            value:   Math.floor(Math.random() * 5),
            service: Math.floor(Math.random() * 5),
            price:   Math.floor(Math.random() * 5),
            quality: Math.floor(Math.random() * 5)
        }
    });
}

// console.log(tst.getAverageRating());

// console.log(Products.searchProduct([tst], 'Lol'))

// console.log(Products.sortProducts([tst, tst_2], 'price', 'desc'))
