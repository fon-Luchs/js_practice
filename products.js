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

    //object columns

    this.id          = 'id' + (new Date()).getTime();
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

    this.deleteReview = function(review) {

    };

    this.getAverageRating = function() {

    };
    

    //object properties
    Object.defineProperty(this, "getId", {enumerable: false});
    Object.defineProperty(this, "getName", {enumerable: false});
    Object.defineProperty(this, "getQuantity", {enumerable: false});
    Object.defineProperty(this, "getQuantity", {enumerable: false});
    Object.defineProperty(this, "getDate", {enumerable: false});
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

tst = new Products({name: 'Loller', activeSize: 'lol'});

console.log(tst);
