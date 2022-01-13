const e = require("express");
const express = require("express");
const RandExp = require("randexp");
const app = express();
const port = 3000;

const input = require("./src/task-main.json");
const config = require("./config.json");
let definitions;

app.get("/", (req, res) => {
  result = main(input);
  res.send(result);
});

function main(input) {
  let result = {};
  let keys = Object.keys(input);

  if (!keys.includes("properties")) {
    return 1;
  }
  if (input.type != "object" || !input.type) {
    return 2;
  }
  if (keys.includes("definitions")) {
    definitions = input.definitions;
  }

  let propertyKeys = Object.keys(input.properties);

  for (let i = 0; i < propertyKeys.length; i++) {
    result[propertyKeys[i]] = property(input.properties[propertyKeys[i]]);
  }

  return result;
}
//рекурсия, которая разбивает обьект на части и получает данные с них
function property(inputObject) {
  let value;

  if (Object.keys(inputObject).includes("anyOf")) {
    value = property(inputObject.anyOf[1]); //конкретно не понял логику выбора из anyOf
  } else {
    if (inputObject.type == "object") {
      let result = {};

      if (!Object.keys(inputObject).includes("properties")) {
        return {};
      }

      let propertyKeys = Object.keys(inputObject.properties);

      for (let i = 0; i < propertyKeys.length; i++) {
        result[propertyKeys[i]] = property(
          inputObject.properties[propertyKeys[i]]
        );
      }

      value = result;
    } else if (inputObject.type == "array") {
      value = [];
      let itemsAmount = 0,
        toAddMore = false; //количество элементов массива

      if (
        !Object.keys(inputObject).includes("items") &&
        !Object.keys(inputObject).includes("prefixItems")
      ) {
        value = []; //неописанный массив
      } else {
        //min-max
        if (inputObject.minItems && inputObject.maxItems) {
          itemsAmount = randomIntegerMinMax(
            inputObject.minItems,
            inputObject.maxItems
          );
        } else if (inputObject.minItems) {
          itemsAmount = randomIntegerMin(inputObject.minItems);
        } else if (inputObject.maxItems) {
          itemsAmount = randomIntegerMax(inputObject.maxItems);
        } else {
          itemsAmount = config.randomStringRange;
        }

        //prefix
        if (Object.keys(inputObject).includes("prefixItems")) {
          if (inputObject.items == false) {
            itemsAmount = inputObject.prefixItems.length;
            toAddMore = false;
          } else if (Object.keys(inputObject.items).includes("type")) {
            itemsAmount = inputObject.prefixItems.length;
            toAddMore = true;
          }
          for (var i = 0; i < itemsAmount; i++) {
            value.push(property(inputObject.prefixItems[i]));
          }
          if (toAddMore) {
            value.push(property(inputObject.items));
          }
          itemsAmount = 0;
        }

        //генерация
        for (var i = 0; i < itemsAmount; i++) {
          value.push(property(inputObject.items));
        }
      }
    } else if (inputObject.type == "integer") {
      value = Math.floor(randomNumberMinMax(inputObject));
    } else if (inputObject.type == "number") {
      let min, max;
      //min-max
      value = randomNumberMinMax(inputObject);
    } else if (inputObject.type == "string") {
      if (inputObject.minLength && inputObject.maxLength) {
        itemsAmount = randomIntegerMinMax(
          inputObject.minLength,
          inputObject.maxLength
        );
      } else if (inputObject.minLength) {
        itemsAmount = randomIntegerMin(inputObject.minLength);
      } else if (inputObject.maxLength) {
        itemsAmount = randomIntegerMax(inputObject.maxLength);
      } else {
        itemsAmount = randomInteger();
      }
      if (Object.keys(inputObject).includes("pattern")) {
        value = new RandExp(inputObject.pattern).gen();
      } else {
        value = randomText(itemsAmount);
      }
    } else if (inputObject.type == "null") {
      value = null;
    } else if (inputObject.type == "boolean") {
      value = randomBoolean();
    } else if (Object.keys(inputObject).includes("enum")) {
      value = inputObject.enum[randomIntegerMinMax(0, inputObject.enum.length)];
    } else if (Object.keys(inputObject).includes("$ref")) {
      value = property(definitions[inputObject.$ref.substr(1)]);
    } else {
      value = "";
    }
  }
  return value;
}

app.listen(port, () => {
  //console.log(`Example app listening at http://localhost:${port}`);

  console.log(main(input));
});

//блок рандома
function randomText(length) {
  var result = "";
  var characters = config.randomStringData;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function randomIntegerMinMax(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}
function randomInteger() {
  return Math.floor(Math.random() * config.randomIntegerRange);
}
function randomIntegerMin(min) {
  return Math.floor(Math.random() * min + min);
}
function randomIntegerMax(max) {
  return Math.floor(Math.random() * max);
}
function randomBoolean() {
  let value = Math.random();
  if (value < 0.5) {
    value = false;
  } else {
    value = true;
  }
  return value;
}

function randomNumberMinMax(inputObject) {
  value = 0;
  fixedRangeMax = config.fixedRangeMax;
  fixedRangeMin = config.fixedRangeMin;

  if (inputObject.minimum && inputObject.maximum) {
    value = min + Math.random() * (max - min);
  } else if (inputObject.minimum && inputObject.exclusiveMaximum) {
    value =
      Math.random() * inputObject.exclusiveMaximum * 0.99 + inputObject.minimum;
  } else if (inputObject.exclusiveMinimum && inputObject.maximum) {
    value =
      Math.random() * inputObject.maximum + inputObject.exclusiveMinimum * 1.01;
  } else if (inputObject.exclusiveMinimum && inputObject.exclusiveMaximum) {
    value =
      Math.random() * inputObject.exclusiveMaximum * 0.99 +
      inputObject.exclusiveMinimum * 1.01;
  } else if (inputObject.minimum) {
    value = Math.random() * inputObject.minimum + inputObject.minimum;
  } else if (inputObject.maximum) {
    value = Math.random() * inputObject.maximum;
  } else if (inputObject.exclusiveMinimum) {
    value =
      Math.random() * inputObject.exclusiveMinimum +
      inputObject.exclusiveMinimum * 1.01;
  } else if (inputObject.exclusiveMaximum) {
    value = Math.random() * inputObject.exclusiveMaximum * 0.99;
  } else {
    value = Math.random() * config.randomIntegerRange;
  }

  return value;
}
//errors code
// 1 - has no properties
// 2 - not object

//integer
//multiple -
//range +

//number
//multiple +
//range +

//string
//pattern+
//format-
//minmax+

//object

//array logic
//contains -
//minmax +
//unique(?)
//items +
//prefix +

//enum +
//null +
