function AbstractProduct(args = {}) {
  if (this.constructor === AbstractProduct) {
      throw new Error('Cannot instantiate abstractclass');
  }

  let _id          = (new Date()).getTime();
  let _name        = args.name        || 'empty';
  let _description = args.description || ' ';
  let _price       = +args.price      || 0.0;
  let _images      = validatesImagesArray(args.images);
  let _brand       = args.brand || 'empty';
  let _quantity    = AbstractProduct.quantity;
  let _reviews     = [];
  let _date        = args.date || new Date;
  
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
    get: () => { return _id }
  });
  
  Object.defineProperty(AbstractProduct.prototype, 'name', {
    get: () => { return _name; },
  
    set: (name) => { _name = name; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'description', {
    get: () => { return _description; },
  
    set: (description) => { _description = description; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'price', {
    get: () => { return _price },

    set: (price) => { if(!isString(price)) _price = price; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'images', {
    get: () => { return _images; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'brand', {
    get: () => { return _brand; },

    set: (brand) => { _brand = brand; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'date', {
    get: () => { return _date; },

    set: (date) => { if (date instanceof Date) _date = date; }
  });
  
  Object.defineProperty(AbstractProduct.prototype, 'quantity', {
    get: () => { return _quantity }
  });

  Object.defineProperty(AbstractProduct.prototype, 'reviews', {
    get: () => { return _reviews }
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
  return  'ID> '          + this.id   + '\n' +
          'NAME> '        + this.name + '\n' +
          'DESCRIPTION> ' + this.description + '\n' +
          'PRICE> '       + this.price       + '\n' +
          'IMAGES> '      + this.images      + '\n' +
          'BRAND> '       + this.brand       + '\n' +
          'QUANTITY> '    + this.quantity    + '\n' +
          'REVIEWS> '     + this.reviews     + '\n' +
          'DATE> '        + this.date        + '\n' + this.resourceFields();
};

AbstractProduct.prototype.addReview = function(args = {}){
  let review = new Review(args);
  this.reviews.push(review);
};

AbstractProduct.prototype.deleteReview = function(review_id) {
  this.reviews.forEach(function(review, i) {
      if(review.id === review_id){
          this.reviews.splice(i, 1);
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
      return this.images[0];
  }

  return this.images[image_index];
};

AbstractProduct.prototype.getReviewById = function(id) {
  let review = function() {
    this.reviews.forEach(function(object) {
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
      this[args.key] = args.value;
    } else {
      return this[args.key];
    }
  }

function Review(args = {}) {
  let _id      = 'id' + (new Date()).getTime();
  let _author  = args.author  || 'incognito';
  let _date    = args.date    || new Date;
  let _comment = args.comment || '';
  let _rating  = args.rating ? new Rating(args.rating) : new Rating;

  Object.defineProperty(AbstractProduct.prototype, 'id', {
    get: () => { return _id }
  });

  Object.defineProperty(AbstractProduct.prototype, 'author', {
    get: () => { return _author; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'date', {
    get: () => { return _date; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'comment', {
    get: () => { return _comment; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'rating', {
    get: () => { return _rating; }
  });
}

function Rating(args = {}) {
   let _value   = +args.value   || 0;
   let _service = +args.service || 0;
   let _price   = +args.price   || 0;
   let _quality = +args.quality || 0;

   Object.defineProperty(AbstractProduct.prototype, 'value', {
    get: () => { return _value }
  });

  Object.defineProperty(AbstractProduct.prototype, 'service', {
    get: () => { return _service; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'price', {
    get: () => { return _price; }
  });

  Object.defineProperty(AbstractProduct.prototype, 'quality', {
    get: () => { return _quality; }
  });
}

function Electronics(args = {}) {
  AbstractProduct.apply(this, arguments);

  let _warranty = validateWarranty(this.warranty) || 0;
  let _power    = args.power || 0;

  function validateWarranty(warranty) {
      if(warranty) {
          return (warranty < 0 || warranty === 0) ? false : warranty;
      }
  }

  Object.defineProperty(Clothers.prototype, 'warranty', {
    get: () => { return _warranty; }
  });

  Object.defineProperty(Clothers.prototype, 'power', {
    get: () => { return _power; }
  });
}

_extend(Electronics, AbstractProduct);

Electronics.prototype.resourceFields = function() {
  return 'WARRANTY> ' + this.warranty + '-' + '\n' +
         'POWER> '    + this.power    + '-' + '\n'
}

function Clothers(args = {}) {
  AbstractProduct.apply(this, arguments);

  const validatesSize = (activeSize) => {
    if (!activeSize) {
        return false;
    } else if (_sizes.includes(activeSize.toUpperCase())) {
        return activeSize;
      }
    return false;
  };

  let _material    = args.material || 'unknow';
  let _color       = args.color    || 'unknow' 
  let _sizes       = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  let _activeSize  = validatesSize(args.activeSize) || 'undefined size';

  Object.defineProperty(Clothers.prototype, 'sizes', {
    get: () => { return _sizes; }
  });

  Object.defineProperty(Clothers.prototype, 'material', {
    get: () => { return _material; }
  });

  Object.defineProperty(Clothers.prototype, 'activeSize', {
    get: () => { return _activeSize; },

    set: function(size) {
      if(validatesSize(size)) _activeSize = size;
    }
  });

  Object.defineProperty(Clothers.prototype, 'color', {
    get: () => { return _color; },

    set: (color) => { _color = color; }
  });

  Object.defineProperty(Clothers.prototype, 'material', {
    get: () => { return _material; },

    set: (material) => { _material = material; }
  });
}

_extend(Clothers, AbstractProduct);

Clothers.prototype.resourceFields = function() {
  return 'MATERIAL> ' + this.material +  '\n' +
         'COLOR> '    + this.color    +  '\n' +
         'ACTIVESIZE> ' + this.activeSize + '\n'
}

Clothers.prototype.addSize = function(size) {
  if(this.sizes.includes(size.toUpperCase())) {
      return 'Already exist';
  } else {
      this.sizes.push(size.toUpperCase());
  }
};

Clothers.prototype.deleteSize = function(size_index = 0) {
  if(size_index > this.sizes.length || size_index < 0) {
    return 'Invalid value';
  } else {
      this.sizes.forEach(function(){
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
