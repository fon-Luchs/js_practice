function AbstractProduct(args = {}) {
    if (this.constructor === AbstractProduct) {
        throw new Error('Cannot instantiate abstractclass');
    }

    this.id          = (new Date()).getTime();
    this.name        = args.name        || 'empty';
    this.description = args.description || ' ';
    this.price       = args.price       || 0.0;
    this.images      = validatesImagesArray(args.images);
    
    function validatesImagesArray(array) {
            if (Array.isArray(array)){
                    let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
                    let regex = expression;
            
                    array.forEach(function(el){
                            if(!(isString(el) && regex.test(el))) {
                                    return Products.defaultImages;
                                }
                            });
                    
            } else {
                    return AbstractProduct.defaultImages;
                }
            
                return array;
            }
};

AbstractProduct.defaultImages = [
    'http://scp-ru.wdfiles.com/local--files/scp-603/603.png',
    'http://scp-ru.wdfiles.com/local--files/scp-603/603.png'
];

AbstractProduct.searchProduct = function(products_array = [], string = '') {
    let mathces =  products_array.filter(item => item.name.indexOf(string) !== -1);
    return mathces;
};

AbstractProduct.sortProducts = function(products_array = [], key = '', order = '') {
    if (key === 'price' || key === 'name' || key === 'id') {
        let sorted_array = [ ...products_array ];
        return order === 'asc' ? sortByAsc(sorted_array, key) : sortByDesc(sorted_array, key);
    }
    
    return 'invalid key';
};

AbstractProduct.sortCurrentProductsArray = function(products_array = [], key = '') {
    if (key === 'price' || key === 'name' || key === 'id') {
        return products_array;
    }
};

AbstractProduct.prototype.getPriceForQuantiry = function(count) {
    return '$' + this.price * +count;
}

AbstractProduct.prototype.getFullInformation = function() {
    return '-' + this.id   + '-' + '\n' +
           '-' + this.name + '-' + '\n' +
           '-' + this.description + '-' + '\n' +
           '-' + this.images      + '-' + '\n' + this.resourceFields();
};

function Electronics(args = {}) {
    AbstractProduct.apply(this, arguments);

    this.warranty = validateWarranty(this.warranty) || 0;
    this.power    = args.power || 0;

    function validateWarranty(warranty) {
        if(warranty) {
            return (warranty < 0 || warranty === 0) ? 0 : warranty;
        }
    }
}

_extend(Electronics, AbstractProduct);

function Clothers(args = {}) {
    AbstractProduct.apply(this, arguments);

    this.material = args.material || 'unknow';
    this.color    = args.color    || 'unknow' 
}

_extend(Clothers, AbstractProduct);

Clothers.prototype.resourceFields = function() {
    return '-' + this.material + '-' + '\n' +
           '-' + this.color    + '-' + '\n'
}

let tst = new Clothers({
    material: 'TEST',
    color: 'Black',
    price: 12.21
})

console.log(tst.getFullInformation());

function _extend(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    subClass.superClass = superClass.prototype;
};

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
