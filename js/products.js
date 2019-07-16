function AbstractProduct(args = {}) {
  if (this.constructor === AbstractProduct) {
      throw new Error('Cannot instantiate abstractclass');
  }

  let _id          = args.ID || AbstractProduct.id;
  let _name        = args.name        || 'empty';
  let _description = args.description || ' ';
  let _price       = +args.price      || 0.0;
  let _images      = validatesImagesArray(args.images);
  let _brand       = args.brand || 'empty';
  let _quantity    = args.quantity || 0;
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

  Object.defineProperty(this, 'id', {
    get: () => { return _id },

    set: id => _id = id 
  });
  
  Object.defineProperty(this, 'name', {
    get: () => { return _name; }, 
  
    set: (name) => { _name = name; }
  });

  Object.defineProperty(this, 'description', {
    get: () => { return _description; },
  
    set: (description) => { _description = description; }
  });

  Object.defineProperty(this, 'price', {
    get: () => { return _price }, configurable: true,

    set: (price) => { if(!isString(price)) _price = price; }
  });

  Object.defineProperty(this, 'images', { get: () => { return _images; } });

  Object.defineProperty(this, 'brand', {
    get: () => { return _brand; },

    set: (brand) => { _brand = brand; }
  });

  Object.defineProperty(this, 'date', {
    get: () => { return _date; },

    set: (date) => { if (date instanceof Date) _date = date; }
  });
  
  Object.defineProperty(this, 'quantity', {
    get: () => { return _quantity },

    set: () => quantity => _quantity = quantity
  });

  Object.defineProperty(this, 'reviews', { get: () => { return _reviews } });
};

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

AbstractProduct.searchProduct = function(products_array = [], string = '') {
  return products_array.filter(item => (item.name.indexOf(string) !== -1) || item.description.indexOf(string) !== -1);
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
    return 0;
  });
};

AbstractProduct.sortByDesc = (sorted_array, key) => AbstractProduct.sortByAsc(sorted_array, key).reverse();

AbstractProduct.id = () => { 
  if(AbstractProduct.id === undefined) { AbstractProduct.id = 0 };
  AbstractProduct.id++;
  return AbstractProduct.id;
}

AbstractProduct.prototype.getPriceForQuantiry = function(count = 1) { return '$' + this.price * +count } ;

AbstractProduct.prototype.getFullInformation = function() {
  return  'ID> '          + this.id          + '\n' +
          'NAME> '        + this.name        + '\n' +
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
  this.reviews.forEach((review, i) => { if(review.id === review_id) this.reviews.splice(i, 1) });
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
};

AbstractProduct.prototype.getImage = function(image_index = 0) {
  return (image_index > this.images.length || image_index < 0) ? this.images[0] : this.images[image_index];
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

AbstractProduct.prototype.attrAccessor = function(args) { 
  if(args.value) {
    this[args.key] = args.value;
  } else {
    return this[args.key];
  }
};

AbstractProduct.prototype.getProductTileHTML = function() {
  
  let mainDiv = document.createElement('div');
  let cardDiv = document.createElement('div');
  let productImage = document.createElement('img');
  let cardBody = document.createElement('div');
  let productTitle = document.createElement('h5');
  let productDescription = document.createElement('p');
  let priceDiv = document.createElement('div');
  let quickviewArchor = document.createElement('a');
  let containerWrapper = document.createElement('div');
  let rowWrapper = document.createElement('div');

  mainDiv.className = 'col-sm-4 product';
  cardDiv.className = 'card';
  cardDiv.style = 'width: 18rem';
  productImage.src = this.images[0];
  productImage.className = 'card-img-top';
  cardBody.className = 'card-body';
  productTitle.className = 'card-title';
  productDescription.className = 'card-text';
  quickviewArchor.href = '#';
  quickviewArchor.className = 'btn btn-primary col-sm-6'
  priceDiv.className = 'price col-sm-6'
  containerWrapper.className = 'container';
  rowWrapper.className = 'row'

  productTitle.innerText = this.name;
  productDescription.innerText = this.description;
  quickviewArchor.innerText = 'Quickview';
  priceDiv.innerText = this.getPriceForQuantiry();

  mainDiv.appendChild(cardDiv);
  cardDiv.appendChild(productImage);
  cardDiv.appendChild(cardBody);
  cardBody.appendChild(productTitle);
  cardBody.appendChild(productDescription);
  cardBody.appendChild(containerWrapper);
  containerWrapper.appendChild(rowWrapper);
  rowWrapper.appendChild(quickviewArchor);
  rowWrapper.appendChild(priceDiv);


  return mainDiv;
};

function Review(args = {}) {
  let _id      = 'id' + (new Date()).getTime();
  let _author  = args.author  || 'incognito';
  let _date    = args.date    || new Date;
  let _comment = args.comment || '';
  let _rating  = args.rating ? new Rating(args.rating) : new Rating;

  Object.defineProperty(this, 'id',      { get: () => { return _id } });

  Object.defineProperty(this, 'author',  { get: () => { return _author; } });

  Object.defineProperty(this, 'date',    { get: () => { return _date; } });

  Object.defineProperty(this, 'comment', { get: () => { return _comment; } });

  Object.defineProperty(this, 'rating',  { get: () => { return _rating; } });
};

function Rating(args = {}) {
  let _value   = +args.value   || 0;
  let _service = +args.service || 0;
  let _price   = +args.price   || 0;
  let _quality = +args.quality || 0;

  Object.defineProperty(this, 'value',   { get: () => { return _value } });

  Object.defineProperty(this, 'service', { get: () => { return _service; } });

  Object.defineProperty(this, 'price',   { get: () => { return _price; } });

  Object.defineProperty(this, 'quality', { get: () => { return _quality; } });
};

function Electronics(args = {}) {
  AbstractProduct.apply(this, arguments);

  let _warranty = validateWarranty(this.warranty) || 0;
  let _power    = args.power || 0;

  function validateWarranty(warranty) {
      if(warranty) return (warranty < 0 || warranty === 0) ? false : warranty;
  }

  Object.defineProperty(this, 'warranty', { get: () => { return _warranty; } });

  Object.defineProperty(this, 'power',    { get: () => { return _power; } });
};

_extend(Electronics, AbstractProduct);

Electronics.prototype.resourceFields = function() {
  return  'WARRANTY> ' + this.warranty + '-' + '\n' +
          'POWER> '    + this.power    + '-' + '\n'
};

const Validator = {
  validateEmail(email) {
    const validateEmailFormat = email => /(^[A-Za-z\d]{1})([^@]{1,19})@([\w.!$%\&;’*+\/=?\^_-]{1,15})\.([A-Za-z]{1,5}$)/.test(email)

    return isString(email) ? validateEmailFormat(email) : false
  },

  validatePhone(phone) {
    const validatePhoneFormat = phone => { return /^(\+[\d]{2})?(([\s-]*)(\()?([\s-]*)(\d)([\s-]*)(\d)([\s-]*)(\d)(\))?)(([\s-]*[\d][\s-]*){7})$/.test(phone) };

    return isString(phone) ? validatePhoneFormat(phone) : false
  },

  validatePassword(pass) {
    const validatePasswordFormat = pass => { return /^(?=.*\d)(?=.*[!@#\$%\^&\*_-])(?=.*\w)[\d\w\s]{8,24}$/.test(pass) };

    return isString(pass) ? validatePasswordFormat(pass) : false
  }
};

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

  Object.defineProperty(this, 'sizes', { get: () => { return _sizes; } });

  Object.defineProperty(this, 'activeSize', {
    get: () => { return _activeSize; },

    set: function(size) {
      if(validatesSize(size)) _activeSize = size;
    }
  });

  Object.defineProperty(this, 'color', {
    get: () => { return _color; },

    set: (color) => { _color = color; }
  });

  Object.defineProperty(this, 'material', {
    get: () => { return _material; },

    set: (material) => { _material = material; }
  });
};

_extend(Clothers, AbstractProduct);

Clothers.prototype.resourceFields = function() {
  return  'MATERIAL> ' + this.material +  '\n' +
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
};

const plp = (function(my) {

  const url = 'http://localhost:3000/products'

  my.getProductsJSONData = async () => {
    const response = await $.ajax(url);
    const data = JSON.parse(response);

    return data;
  };

  my.renderProducts = (clothersArray = [], parentElement) => { 
      clothersArray.map(clother => { 
        let el = clother.getProductTileHTML()
        parentElement.appendChild(el);
      });
    return clothersArray;
  }

  return my;
}({}));

let render = (arrayProducts, element, sortValue) => {
  let sortedArray;
  if (sortValue) {
    let sortArgs = sortValue.split(" ");
    sortedArray = Clothers.sortProducts(arrayProducts, sortArgs[0], sortArgs[1])
  }
  while (element.firstChild) { element.removeChild(element.firstChild); }
  plp.renderProducts(sortedArray || arrayProducts, element);
}

async function getData() {
  const data = await plp.getProductsJSONData();
  let clothers = [];

  data.forEach(paramsObject => clothers.push(new Clothers(paramsObject)) );

  let searchInput = document.getElementById('search');
  let lineItems = document.getElementById('line-items');
  let searchButton = document.getElementById('search-button');
  let selectItem = document.getElementById('select')
  let selectValue = 'name desc';

  plp.renderProducts(clothers, lineItems);

  let searchInputHelper = () => {
    if (searchInput.value === '') {
      render(clothers, lineItems, selectValue)
    } else {
      render(Clothers.searchProduct(clothers, searchInput.value), lineItems, selectValue);
    }
  }

  selectItem.addEventListener('change', () => { selectValue = selectItem.value; });

  searchInput.addEventListener('keydown', event => { if(event.key === 'Enter' || event.key === 13 ) searchInputHelper() });
  
  searchButton.addEventListener('click', () => searchInputHelper());

  return clothers;
}

getData();