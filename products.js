function AbstractProduct(args = {}) {
  if (this.constructor === AbstractProduct) {
      throw new Error('Cannot instantiate abstractclass');
  }

  this._id          = (new Date()).getTime();
  this._name        = args.name        || 'empty';
  this._description = args.description || ' ';
  this._price       = +args.price      || 0.0;
  this._images      = validatesImagesArray(args.images);
  this._brand       = args.brand || 'empty';
  this._quantity    = AbstractProduct.quantity;
  this._reviews     = [];
  this.date         = args.date || new Date;
  
  function validatesImagesArray(array) {
    if (Array.isArray(array)) {
      let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      let regex = expression;

      array.forEach(function(el) {
        if(!(isString(el) && regex.test(el))) {
                return Products.defaultImages;
            }
      });
                  
    } else {
      return AbstractProduct.defaultImages;
    }
  
    return array;
  }

  Object.defineProperty(AbstractProduct.prototype, 'id', {
    get: () => { return this._id }
  });
  
  Object.defineProperty(AbstractProduct.prototype, 'name', {
    get: () => { return this._name; },
  
    set: (name) => { this._name = name; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'description', {
    get: () => { return this._description; },
  
    set: (description) => { this._description = description; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'price', {
    get: () => { return this._price },

    set: (price) => { this._price = price; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'images', {
    get: () => { return this._images; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'brand', {
    get: () => { return this._brand; },

    set: (brand) => { this._brand = brand; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'data', {
    get: () => { return this._data; },

    set: (date) => { if (date instanceof Date) this._date = date; }
  });
  
  Object.defineProperty(AbstractProduct.prototype, 'quantity', {
    get: () => { return this._quantity }
  });

  Object.defineProperty(AbstractProduct.prototype, 'reviews', {
    get: () => { return this._reviews }
  });
};

if (AbstractProduct.quantity === undefined){
    AbstractProduct.quantity = 0;
} else {
    if(AbstractProduct.quantity > 0) AbstractProduct.count--;
}

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

AbstractProduct.searchProduct = function(products_array = [], string = '') {
  let mathces =  products_array.filter(item => (item.name.indexOf(string) !== -1) || item.description.indexOf(string) !== -1);
  return mathces;
};

AbstractProduct.sortProducts = function(products_array = [], key = '', order = '') {
  if (key === 'price' || key === 'name' || key === 'id') {
      let sorted_array = [ ...products_array ];

      if(order === 'asc') {
          AbstractProduct.sortByAsc(sorted_array, key);
      } else if(order === 'desc') {
          AbstractProduct.sortByDesc(sorted_array, key);
      }

      return sorted_array;
  }

  return 'invalid key';
};

AbstractProduct.sortCurrentProductsArray = function(products_array = [], key = '') {
  if (key === 'price' || key === 'name' || key === 'id') {
      return products_array;
  }
};

AbstractProduct.sortByAsc = function(sorted_array, key) {
  return sorted_array.sort(function(a, b){
    if (a[key] > b[key]) return 1;
    if (a[key] < b[key]) return -1;
  });
}

AbstractProduct.sortByDesc = function(sorted_array, key) {
  return sortByAsc(sorted_array, key).reverse();
}

AbstractProduct.prototype.getPriceForQuantiry = function(count) {
  return '$' + this.price * +count;
}

AbstractProduct.prototype.getFullInformation = function() {
  return  '-' + this._id   + '-' + '\n' +
          '-' + this._name + '-' + '\n' +
          '-' + this._description + '-' + '\n' +
          '-' + this._images      + '-' + '\n' + this.resourceFields();
};

AbstractProduct.prototype.addReview = function(args = {}){
  let review = new Review(args);
  this._reviews.push(review);
};

AbstractProduct.prototype.deleteReview = function(review_id) {
  this._reviews.forEach(function(review, i) {
      if(review.id === review_id){
          this._reviews.splice(i, 1);
      }
  });
};

AbstractProduct.prototype.getAverageRating = function() {
  return {
      value:   averageRatingsValue(this.reviews, 'value'),
      service: averageRatingsValue(this.reviews, 'service'),
      price:   averageRatingsValue(this.reviews, 'price'),
      quality: averageRatingsValue(this.reviews, 'quality')
  };
};

AbstractProduct.prototype.averageRatingsValue = function(array = [], rating_type) {
  let sum = 0;

  array.forEach(function(review) {
      sum += review.rating[rating_type];
  });

  return sum === 0 ? sum : (sum / array.length).toFixed(2);
}

AbstractProduct.prototype.getImage = function(image_index = 0) {
  if(image_index > this.images.length || image_index < 0) {
      return this._images[0];
  }

  return this._images[image_index];
};

AbstractProduct.prototype.getReviewById = function(id) {
  let review = function() {
    this._reviews.forEach(function(object) {
      Object.keys(object).forEach(function(key) {
        if(object[key] == id) return object
      });
    });

    return review ? review : 'record not found'
  }
};

AbstractProduct.prototype.attrAccessor = function(args)
  { 
    if(args.value) {
      console.log(this[args.key] + ' ' + args.value)
      this[args.key] = args.value;
    } else {
      return this[args.key];
    }
  }

function Review(args = {}) {
  this._id      = 'id' + (new Date()).getTime();
  this._author  = args.author  || 'incognito';
  this._date    = args.date    || new Date;
  this._comment = args.comment || '';
  this._rating  = args.rating ? new Rating(args.rating) : new Rating;
}

function Rating(args = {}) {
   this._value   = +args.value   || 0;
   this._service = +args.service || 0;
   this._price   = +args.price   || 0;
   this._quality = +args.quality || 0;
}


function Electronics(args = {}) {
  AbstractProduct.apply(this, arguments);

  this._warranty = validateWarranty(this.warranty) || 0;
  this._power    = args.power || 0;

  function validateWarranty(warranty) {
      if(warranty) {
          return (warranty < 0 || warranty === 0) ? false : warranty;
      }
  }
}

_extend(Electronics, AbstractProduct);

function Clothers(args = {}) {
  AbstractProduct.apply(this, arguments);

  const validatesSize = (activeSize) => {
    if (!activeSize) {
        return false;
    } else if (this._sizes.includes(activeSize.toUpperCase())) {
        return activeSize;
      }
    return false;
  };

  this._material    = args.material || 'unknow';
  this._color       = args.color    || 'unknow' 
  this._sizes       = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  this._activeSize  = validatesSize(args.activeSize) || 'undefined size';

  Object.defineProperty(Clothers.prototype, 'sizes', {
    get: () => { return this._sizes; }
  });

  Object.defineProperty(Clothers.prototype, 'activeSize', {
    get: () => { return this._activeSize; },

    set: function(size) {
      if(validatesSize(size)) this._activeSize = size;
    }
  });

  Object.defineProperty(Clothers.prototype, 'color', {
    get: () => { return this._color; },

    set: (color) => { this._color = color; }
  });
}

_extend(Clothers, AbstractProduct);

Clothers.prototype.resourceFields = function() {
  return '-' + this._material + '-' + '\n' +
         '-' + this._color    + '-' + '\n'
}

Clothers.prototype.addSize = function(size) {
  if(this.sizes.includes(size.toUpperCase())) {
      return 'Already exist';
  } else {
      this.sizes.push(sizu.toUpperCase());
  }
};

Clothers.prototype.deleteSize = function(size_index = 0) {
  if(size_index > this._sizes.length || size_index < 0) {
    return 'Invalid value';
  } else {
      this._sizes.forEach(function(){
        if ( this.sizes[i] === size_index) this.sizes.splice(i, 1); 
      });
  }
};

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

let tst = new Clothers()

console.log(tst.attrAccessor({key: 'activeSize', value: 'XS'}));

console.log(tst);
