const express = require("express");
const app = express();
const port = 3000;

const input = require("./task.json");

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

  let propertyKeys = Object.keys(input.properties);

  for (let i = 0; i < propertyKeys.length; i++) {
    result[propertyKeys[i]] = property(input.properties[propertyKeys[i]]);
  }

  return result;
}
function property(inputObject) {
  let value;

  //console.log(inputObject);

  if (Object.keys(inputObject).includes("anyOf")) {
    property(inputObject.anyOf[0]);
  } else {
    if (inputObject.type == "object") {
      let result = {};
      let propertyKeys = Object.keys(inputObject.properties);

      for (let i = 0; i < propertyKeys.length; i++) {
        result[propertyKeys[i]] = property(
          inputObject.properties[propertyKeys[i]]
        );
      }

      value = result;
    } else if (inputObject.type == "array") {
      value = [];
      let itemsAmount = 0;
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
        itemsAmount = randomInteger();
      }

      for (var i = 0; i < itemsAmount; i++) {
        value.push(property(inputObject.items));
      }
    } else if (inputObject.type == "integer") {
      value = Math.floor(Math.random() * 100);
    } else if (inputObject.type == "number") {
      value = (Math.random() * 100).toFixed(3);
    } else if (inputObject.type == "string") {
      value = randomText(10);
    } else if (inputObject.type == "null") {
      value = null;
    } else if (Object.keys(inputObject).includes("enum")) {
      value = inputObject.enum[randomIntegerMinMax(0, inputObject.enum.length)];
    } else {
      value = "";
    }
  }
  return value;
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  //console.log(randomText(10));

  console.log(main(input));
});

function randomText(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function randomIntegerMinMax(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}
function randomInteger() {
  return Math.floor(Math.random() * 100);
}
function randomIntegerMin(min) {
  return Math.floor(Math.random() * min + min);
}
function randomIntegerMax(max) {
  return Math.floor(Math.random() * max);
}

//errors code
// 1 - has no properties
// 2 - not object
