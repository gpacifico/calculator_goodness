//the stuff you put into the calculator
var valueArray = [''];
//partial operand
var operatorAndLastNumberArray = [];
//current position
var arrayPosition = 0;
//if operator were last button clicked, then true
var operatorLastClicked = false;
//if no numbers in array, then true
var noNumbers = true;
//if equals sign was last button clicked, then true
var equalSignLastClicked = false;

$(document).ready(function () {
    $('button').click(buttonClicked);
});

//function that adds a number to the valueArray
function addNumber(number) {
    if (equalSignLastClicked) {
        //starts over valueArray with the number param
        valueArray[0] = number;
    }
    else if (valueArray[2] === '0') {
        //prevents a number starting with multiple 0's from displaying
        valueArray[2] = number;
    }
    else if (valueArray[arrayPosition][0] === '0') {
        //prevents a number starting with multiple 0's from displaying
        valueArray[0] = number;
    }
    else if (operatorLastClicked) {
        //starts the next item in array with number param
        valueArray[++arrayPosition] = number;
    }
    else {
        //adds the number param to the item at current array index
        valueArray[arrayPosition] += number;
    }
    //show value at current array index
    displayValues(valueArray[arrayPosition]);
    operatorLastClicked = false;
    equalSignLastClicked = false;
    noNumbers = false;
}

//add operator to valueArray, but does not show operator on calculator display
function addOperator(operator) {
    //if no number in array, operator not added
    if (noNumbers) {
        return;
    }
    //if operator is last clicked, replace previous operator with new
    else if (operatorLastClicked) {
        valueArray[arrayPosition] = operator;
        return;
    }
    //if array is a number, operator, and number
    else if (valueArray.length == 3) {
        turnArrayIntoOneNumberAndUpdateDisplay();
    }
    //add operator param to next index in array
    valueArray[++arrayPosition] = operator;
    operatorLastClicked = true;
    equalSignLastClicked = false;
}

//function that adds decimal to number at current array index
function addDecimal(decimal) {
    //if there is a decimal already, do not need another one
    if (valueArray[arrayPosition].indexOf('.') != -1) {
        return;
    }
    //no decimal yet, so add decimal to number
    else {
        addNumber(decimal);
    }
}

function buttonClicked(buttonClickEvent) {
    //if error
    if (valueArray.indexOf('error') != -1) {
        //make array empty string again
        valueArray = [''];
        noNumbers = true;
    }
    //local variable for text of clicked button
    var value = $(buttonClickEvent.target).text();
    //if number button clicked, then add number
    if ($(buttonClickEvent.target).hasClass('number')) {
        addNumber(value);
    //if operator button clicked, add operator
    } else if ($(buttonClickEvent.target).hasClass('operator')) {
        addOperator(value);
    //if decimal button clicked, add decimal
    } else if ($(buttonClickEvent.target).hasClass('decimal')) {
        addDecimal(value);
    //if one of the clear buttons is clicked
    } else if ($(buttonClickEvent.target).hasClass('clear')) {
        if (value === 'DEL') {
            //in the string, start at index zero and take out the last index in the string
            valueArray[arrayPosition] = valueArray[arrayPosition].substr(0, valueArray[arrayPosition].length-1);
            //if first item in array, reset noNumbers
            if (arrayPosition == 0) {
                noNumbers = true;
            }
            displayValues(valueArray[arrayPosition]);
        }
        if (value === 'CE') {
            //make item at current array index an empty string
            valueArray[arrayPosition] = '';
            //if first item in array, reset noNumbers
            if (arrayPosition == 0) {
                noNumbers = true;
            }
            displayValues(valueArray[arrayPosition]);
        }
        else if (value === 'C') {
            //reset valueArray, arrayPosition, display, and noNumbers
            valueArray = [''];
            arrayPosition = 0;
            displayValues(valueArray[arrayPosition]);
            noNumbers = true;
        }
    //if equal sign button clicked, call equalSignButtonClicked function
    } else if ($(buttonClickEvent.target).hasClass('equalSign')) {
        equalSignButtonClicked();
    }
}

//number with operator and number again will become one because of math and show up on the calculator screen
function turnArrayIntoOneNumberAndUpdateDisplay() {
    valueArray = [doMath(valueArray[0], valueArray[1], valueArray[2])];
    arrayPosition = 0;
    displayValues(valueArray[arrayPosition]);
}

//make stuff show up on the calculator screen
function displayValues(value) {
    $('.screen').text(value);
}

//function that does math on number, operator, number and returns the answer
function doMath(num1, operator, num2) {
    if (operator === '+') {
        return parseFloat(num1) + parseFloat(num2);
    }
    else if (operator === '-') {
        return num1 - num2;
    }
    else if (operator === '/') {
        //can't divide by zero because math teachers say so
        if (num2 === '0') {
            return "Sorry Error";
        }
        else {
            return num1 / num2;
        }
    }
    else if (operator === '*') {
            return num1 * num2;
    }
}

//function for equal sign button click
function equalSignButtonClicked() {
    if (equalSignLastClicked && !noNumbers) {
        if (operatorAndLastNumberArray.length > 0) {
            //put values in operatorAndLastNumberArray into valueArray
            valueArray.push(operatorAndLastNumberArray[0], operatorAndLastNumberArray[1]);
            turnArrayIntoOneNumberAndUpdateDisplay();
        }
    }
    //if only one number in valueArray
    else if (valueArray.length == 1 && noNumbers == false) {
        operatorAndLastNumberArray = [];
        displayValues(valueArray[arrayPosition]);
    }
    //if one number and one operator in valueArray
    else if (valueArray.length == 2) {
        //puts the number at the first index in valueArray to the end of valueArray
        valueArray.push(valueArray[0]);
        //sets operatorAndLastNumberArray to the operator and last number
        operatorAndLastNumberArray = [valueArray[1], valueArray[2]];
        turnArrayIntoOneNumberAndUpdateDisplay();
    }
    //if number, operator, and number in valueArray
    else if (valueArray.length == 3) {
        //sets operatorAndLastNumberArray to the operator and last number
        operatorAndLastNumberArray = [valueArray[1], valueArray[2]];
        turnArrayIntoOneNumberAndUpdateDisplay();

    }
    equalSignLastClicked = true;
    operatorLastClicked = false;
}