/*eslint-env browser*/

//HELPER FUNCTION
var $ = function (id) {
    "use strict";
    return window.document.getElementById(id);
};

//VARIABLE DECLARATION
var emailMatch, phoneMatch, required = "*required field",
    pizzaSizePrice = 0,
    cheesePrice = 0,
    saucePrice = 0,
    toppingPrice = 0,
    total = 0;

//REGEX FOR EMAIL
emailMatch = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//REGEX FOR PHONE NUMBER
phoneMatch = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

//CREATE AN OBJECT LITERAL FOR THE DOUGH TYPE
var doughType = {
    handTossed: [["Small", 9.99], ["Medium", 12.99], ["Large", 14.99]],
    thinCrust: [["Medium", 11.99], ["Large", 13.99]],
    newYorkStyle: [["Large", 16.99], ["Extra Large", 19.99]],
    gluttenFree: ["Small", 10.99]
};

//FUNCTION FOR PROGRAMATICALLY ADDING OPTION FOR THE PIZZA SIZE WHEN THE USER SELECTS A DOUGH TYPE
function buildPizzaSize(e) {
    "use strict";
    var i, j, checkbox, option, pizzaSize = $("pizzasize");
    j = pizzaSize.getElementsByTagName("option").length;
    checkbox = $("toppings").getElementsByTagName("input");
    //ENABLE ALL THE TOPPING OPTIONS
    $("cheese").disabled = false;
    $("sauce").disabled = false;
    $("pizzasize").disabled = false;
    for (i = 0; i < checkbox.length; i += 1) {
        checkbox[i].removeAttribute("disabled");
    }
    //CHECK IF THERE IS ANY OPTION IN THE DROPDOWN SELECTION
    if (j > 0) {
        //IF YES THEN WE DELETE THEM
        for (i = j; i > 0; i -= 1) {
            pizzaSize.remove(pizzaSize.querySelector("option"));
        }
    }
    //ITERATE THROUGH ALL OF THE KEYS OF THE DOUGHTYPE OBJECT
    Object.keys(doughType).forEach(function (key) {
        //IF THE KEY MATCHES THE SELECTION
        if (key.toLowerCase() === e.target.id) {
            //IF WE HAVE MORE THAN ONE OPTION FOR PIZZA SIZE
            if (doughType[key][0][0].length > 1) {
                pizzaSizePrice = doughType[key][0][1];
                for (i = 0; i < doughType[key].length; i += 1) {
                    //CREATE OPTIONS FOR DIFFERENT PIZZA SIZES
                    option = window.document.createElement("option");
                    option.text = doughType[key][i][0] + " $" + doughType[key][i][1];
                    pizzaSize.add(option);
                }
            //IF WE HAVE ONLY ONE OPTION FOR PIZZA SIZE (GLUTTEN FREE)
            } else {
                pizzaSizePrice = doughType[key][1];
                option = window.document.createElement("option");
                option.text = doughType[key][0] + " $" + doughType[key][1];
                pizzaSize.add(option);
            }
        }
    });
}

//FUNCTION FOR HANDLING THE "FINISHED BUILDING PIZZA" BUTTON
function pizzaDone() {
    "use strict";
    var i, inputs, incorrect, incorrectText, goodToPay = true, addressType = $("addresstype");
    //CREATE THE <SPAN> TO APPEND WHERE THE USER HAS TO REVIEW THE INPUT
    incorrect = window.document.createElement("span");
    incorrectText = window.document.createTextNode(" Please review!");
    incorrect.appendChild(incorrectText);
    //GETTING ALL THE INPUT NODES FROM THE DELIVERYFORM
    inputs = $("deliveryform").getElementsByTagName("input");

    //ADD "REQUIRED" PLACEHOLDER FOR THE EMPTY TEXT FIELDS
    for (i = 0; i < inputs.length; i += 1) {
        //IF THE NODE IS THE OTHERADDRESS AND THE USER CHOSE ADDRESSTYPE: OTHER, MAKE THE TEXT FIELD REQUIRED, OTHERWISE SKIP
        if (inputs[i].id === "otheraddress") {
            if (addressType.options[addressType.selectedIndex].text === "Other") {
                if (inputs[i].value === "") {
                    inputs[i].placeholder = required;
                    inputs[i].classList.add("required");
                    //IF ANY FIELD IS EMPTY SET THE GOODTOPAY VARIABLE TO FALSE
                    goodToPay = false;
                }
            }
        } else {
            //SKIP THE APPARTMENT NUMBER SINCE IT IS OPTIONAL
            if (inputs[i].id !== "aptnumber") {
                if (inputs[i].value === "") {
                    inputs[i].placeholder = required;
                    inputs[i].classList.add("required");
                    //IF ANY FIELD IS EMPTY SET THE GOODTOPAY VARIABLE TO FALSE
                    goodToPay = false;
                }
            }
        }
    }
    //VALIDATING USER INPUT AND ADDING TEXT TO NOTIFY THE USER WHERE HE NEEDS TO REVIEW HIS INPUTS
    if ($("fname").value.trim().match(/[^a-zA-Z]/g) !== null) {
        if ($("fname").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("fname").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
            goodToPay = false;
        }
    } else {
        if ($("fname").previousElementSibling.lastChild.tagName === "SPAN") {
            $("fname").previousElementSibling.removeChild($("fname").previousElementSibling.lastChild);
        }
    }
    if ($("lname").value.trim().match(/[^a-zA-Z]/g) !== null) {
        if ($("lname").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("lname").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
            goodToPay = false;
        }
    } else {
        if ($("lname").previousElementSibling.lastChild.tagName === "SPAN") {
            $("lname").previousElementSibling.removeChild($("lname").previousElementSibling.lastChild);
        }
    }
    if ($("city").value.trim().match(/[^a-zA-Z ]/g) !== null) {
        if ($("city").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("city").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
            goodToPay = false;
        }
    } else {
        if ($("city").previousElementSibling.lastChild.tagName === "SPAN") {
            $("city").previousElementSibling.removeChild($("city").previousElementSibling.lastChild);
        }
    }
    if ($("state").value.match(/[^a-zA-Z]/g) !== null || (($("state").value.length !== 2) && $("state").value !== "")) {
        if ($("state").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("state").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
            goodToPay = false;
        }
    } else {
        if ($("state").previousElementSibling.lastChild.tagName === "SPAN") {
            $("state").previousElementSibling.removeChild($("state").previousElementSibling.lastChild);
        }
    }
    if ($("zip").value.trim().match(/\d{5}/g) === null && $("zip").value !== "") {
        if ($("zip").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("zip").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
            goodToPay = false;
        }
    } else {
        if ($("zip").previousElementSibling.lastChild.tagName === "SPAN") {
            $("zip").previousElementSibling.removeChild($("zip").previousElementSibling.lastChild);
        }
    }
    if ($("email").value.trim().match(emailMatch) !== null) {
        if ($("email").previousElementSibling.lastChild.tagName === "SPAN") {
            $("email").previousElementSibling.removeChild($("email").previousElementSibling.lastChild);
        }
    } else {
        goodToPay = false;
        if ($("email").previousElementSibling.lastChild.tagName !== "SPAN" && $("email").value !== "") {
            $("email").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
        }
    }
    if ($("phonenumber").value.trim().match(phoneMatch) !== null) {
        if ($("phonenumber").previousElementSibling.lastChild.tagName === "SPAN") {
            $("phonenumber").previousElementSibling.removeChild($("phonenumber").previousElementSibling.lastChild);
        }
    } else {
        goodToPay = false;
        if ($("phonenumber").previousElementSibling.lastChild.tagName !== "SPAN" && $("phonenumber").value !== "") {
            $("phonenumber").previousElementSibling.firstChild.parentNode.appendChild(incorrect);
        }
    }
    if ($("total").placeholder === "0.00") {
        goodToPay = false;
    }
    //IF ALL FIELDS ARE COMPLETED WE UNCOVER THE NEXT SECTION
    if (goodToPay === true) {
        $("paymentform").classList.remove("nonedisplay");
    } else {
        //OTHERWISE WE HIDE IT
        $("paymentform").classList.add("nonedisplay");
    }
}

//MAKE THE FIELD FOR TYPE OF ADDRESS VISIBLE IN THE DELIVERY ADDRESS FORM IF USER CHOSE ADDRESS TYPE: OTHER
function invisible() {
    "use strict";
    var addressType = $("addresstype");
    if (addressType.options[addressType.selectedIndex].text === "Other") {
        $("otheraddressform").classList.remove("nonedisplay");
    } else {
        $("otheraddressform").classList.add("nonedisplay");
    }
}

//MAKE THE FIELD FOR TYPE OF ADDRESS VISIBLE IN THE PAYMENT FORM IF USER CHOSE ADDRESS TYPE: OTHER
function invisible2() {
    "use strict";
    var addressType2 = $("addresstype2");
    if (addressType2.options[addressType2.selectedIndex].text === "Other") {
        $("otheraddressform2").classList.remove("nonedisplay");
    } else {
        $("otheraddressform2").classList.add("nonedisplay");
    }
}

//COPY ALL THE USER INFO FROM DELIVERY PART TO THE PAYMENT PART IF THE USER SELECTED THE CHECKBOX
function copyUserInfo() {
    "use strict";
    if ($("sameaddress").checked) {
        $("fname2").value = $("fname").value;
        $("lname2").value = $("lname").value;
        $("addresstype2").selectedIndex = $("addresstype").selectedIndex;
        if ($("addresstype2").selectedIndex === 6) {
            $("otheraddressform2").classList.remove("nonedisplay");
            $("otheraddress2").value = $("otheraddress").value;
        }
        $("address2").value = $("address").value;
        $("aptnumber2").value = $("aptnumber").value;
        $("city2").value = $("city").value;
        $("state2").value = $("state").value;
        $("zip2").value = $("zip").value;
        $("phonenumber2").value = $("phonenumber").value;
        $("state2").value = $("state").value;
        $("email2").value = $("email").value;
    }
}
//GET PRICE OF SELECTED PIZZA SIZE
function getPizzaSize() {
    "use strict";
    var selectedText = $("pizzasize").options[$("pizzasize").selectedIndex].text;
    pizzaSizePrice = parseFloat(selectedText.slice(selectedText.indexOf("$") + 1, selectedText.length));
}
//GET PRICE OF SELECTED CHEESE OPTION
function getCheesePrice() {
    "use strict";
    cheesePrice = parseFloat($("cheese").options[$("cheese").selectedIndex].value);
    //cheesePrice = cheesePrice.toPrecision(3);
}

function getSaucePrice() {
    "use strict";
    saucePrice = parseFloat($("sauce").options[$("sauce").selectedIndex].value);
}
//GET PRICE OF SELECTED SAUCE OPTION
function getToppingPrice() {
    "use strict";
    var numberOfToppings = $("toppings").querySelectorAll('input[type="checkbox"]:checked').length;
    toppingPrice = parseFloat((numberOfToppings * 0.99), 10);
}
//CALCULATE THE TOTAL PRICE OF THE PIZZA AND DISPLAY IT IN THE CORNER
function totalPizzaPrice() {
    "use strict";
    total = pizzaSizePrice + cheesePrice + saucePrice + toppingPrice;
    total = total.toFixed(2);
    $("total").placeholder = "$" + total;
}

//HANDLE THE USER CLICKING THE ORDER BUTTON
function finishOrder() {
    "use strict";
    var i, d, month, inputs2, cardNumberSum, cardType, validation, cardNumber, goodToPay, incorrect2, incorrectText2, incorrectLenght, incorrectNumber, incorrectLenghtText, incorrectNumberText, addressType2;
    addressType2 = $("addresstype2");
    incorrect2 = window.document.createElement("span");
    incorrectText2 = window.document.createTextNode(" Please review!");
    incorrect2.appendChild(incorrectText2);
    incorrectLenght = window.document.createElement("span");
    incorrectNumber = window.document.createElement("span");
    incorrectLenghtText = window.document.createTextNode(" Please check the lenght");
    incorrectNumberText = window.document.createTextNode(" Please enter only numbers");
    incorrectLenght.appendChild(incorrectLenghtText);
    incorrectNumber.appendChild(incorrectNumberText);
    cardNumberSum = 0;
    cardType = "";
    validation = [];
    cardNumber = $("cardnumber").value;
    goodToPay = true;
    
    //GETTING ALL THE INPUT NODES FROM THE DELIVERYFORM
    inputs2 = $("paymentform").getElementsByTagName("input");

    //ADD "REQUIRED" PLACEHOLDER FOR THE EMPTY TEXT FIELDS
    for (i = 0; i < inputs2.length; i += 1) {
        //IF THE NODE IS THE OTHERADDRESS AND THE USER CHOSE ADDRESSTYPE: OTHER, MAKE THE TEXT FIELD REQUIRED, OTHERWISE SKIP
        if (inputs2[i].id === "otheraddress2") {
            if (addressType2.options[addressType2.selectedIndex].text === "Other") {
                if (inputs2[i].value === "") {
                    inputs2[i].placeholder = required;
                    inputs2[i].classList.add("required");
                    //IF ANY FIELD IS EMPTY SET THE GOODTOPAY VARIABLE TO FALSE
                    goodToPay = false;
                }
            }
        } else {
            //SKIP THE APPARTMENT NUMBER SINCE IT IS OPTIONAL
            if (inputs2[i].id !== "aptnumber2") {
                if (inputs2[i].value === "") {
                    inputs2[i].placeholder = required;
                    inputs2[i].classList.add("required");
                    //IF ANY FIELD IS EMPTY SET THE GOODTOPAY VARIABLE TO FALSE
                    goodToPay = false;
                }
            }
        }
    }
    if ($("fname2").value.trim().match(/[^a-zA-Z]/g) !== null) {
        window.console.log("fname2");
        if ($("fname2").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("fname2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("fname2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("fname2").previousElementSibling.removeChild($("fname2").previousElementSibling.lastChild);
        }
    }
    if ($("lname2").value.trim().match(/[^a-zA-Z]/g) !== null) {
        if ($("lname2").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("lname2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("lname2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("lname2").previousElementSibling.removeChild($("lname2").previousElementSibling.lastChild);
        }
    }
    if ($("city2").value.trim().match(/[^a-zA-Z ]/g) !== null) {
        if ($("city2").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("city2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("city2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("city2").previousElementSibling.removeChild($("city2").previousElementSibling.lastChild);
        }
    }
    if (($("state2").value.match(/[^a-zA-Z]/g) !== null) || $("state2").value.length !== 2) {
        if ($("state2").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("state2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("state2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("state2").previousElementSibling.removeChild($("state2").previousElementSibling.lastChild);
        }
    }
    if ($("zip2").value.trim().match(/\d{5}/g) === null && $("zip2").value !== "") {
        if ($("zip2").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("zip2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("zip2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("zip2").previousElementSibling.removeChild($("zip2").previousElementSibling.lastChild);
        }
    }
    if ($("email2").value.trim().match(emailMatch) !== null) {
        if ($("email2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("email2").previousElementSibling.removeChild($("email2").previousElementSibling.lastChild);
        }
    } else {
        goodToPay = false;
        if ($("email2").previousElementSibling.lastChild.tagName !== "SPAN" && $("email2").value !== "") {
            $("email2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
        }
    }
    if ($("phonenumber2").value.trim().match(phoneMatch) !== null) {
        if ($("phonenumber2").previousElementSibling.lastChild.tagName === "SPAN") {
            $("phonenumber2").previousElementSibling.removeChild($("phonenumber2").previousElementSibling.lastChild);
        }
    } else {
        goodToPay = false;
        if ($("phonenumber2").previousElementSibling.lastChild.tagName !== "SPAN" && $("phonenumber2").value !== "") {
            $("phonenumber2").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
        }
    }
    if (($("cvc").value.match(/[^0-9]/g) !== null) || $("cvc").value.length !== 3) {
        if ($("cvc").previousElementSibling.lastChild.tagName !== "SPAN") {
            $("cvc").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            goodToPay = false;
        }
    } else {
        if ($("cvc").previousElementSibling.lastChild.tagName === "SPAN") {
            $("cvc").previousElementSibling.removeChild($("cvc").previousElementSibling.lastChild);
        }
    }

    //CHECKING THE LENGHT OF THE CARD NUMBER
    if (cardNumber.length === 13 || cardNumber.length === 16) {
        //CHECKING IF THE LABEL HAS ANY CHILDS
        if ($("cardnumber").previousElementSibling.hasChildNodes) {
            //IF THE CHILD IS SPAN
            if ($("cardnumber").previousElementSibling.lastChild.tagName === "SPAN") {
                //WE REMOVE THE SPAN
                $("cardnumber").previousElementSibling.removeChild($("cardnumber").previousElementSibling.lastElementChild);
            }
        }
    //IF LENGHT IS DIFFERENT THAN 13 OR 16
    } else {
        //CHECK IF THE CARDNUMBER IS NULL
        if ($("cardnumber").value !== "") {
            //IF THE SPAN WITH THE ERROR IS NOT PRESENT
            if ($("cardnumber").previousElementSibling.lastChild.tagName !== "SPAN") {
                //WE ADD THE SPAN WITH THE LENGHT ERROR
                $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrectLenght);
            //IF THERE IS ALREADY A SPAN WITH AN ERROR
            } else {
                //CHECK IF THE SPAN ERROR IS NOT ABOUT THE LENGHT
                if ($("cardnumber").previousElementSibling.lastChild.textContent !== " Please check the lenght") {
                    //WE REMOVE THE SPAN
                    $("cardnumber").previousElementSibling.removeChild($("cardnumber").previousElementSibling.lastElementChild);
                    //AND ADD THE SPAN ABOUT THE LENGHT ERROR
                    $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrectLenght);
                }
            }
        }
        goodToPay = false;
    }
        
    //CHECKING IF THE CARD NUMBER HAS ANYTHING ELSE THAN NUMBERS
    if ($("cardnumber").value.match(/\D/)) {
        //IF THE SPAN WITH THE ERROR IS NOT PRESENT
        if ($("cardnumber").previousElementSibling.lastChild.tagName !== "SPAN") {
            //WE ADD THE SPAN WITH THE CARD NUMBER ERROR
            $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrectNumber);
        //IF THERE IS ALREADY A SPAN WITH AN ERROR
        } else {
            //IF THE SPAN ERROR IS NOT ABOUT THE CARD NUMBER
            if ($("cardnumber").previousElementSibling.lastChild.textContent !== " Please enter only numbers") {
                //WE REMOVE THE SPAN
                $("cardnumber").previousElementSibling.removeChild($("cardnumber").previousElementSibling.lastElementChild);
                //AND ADD THE SPAN ABOUT THE CARD NUMBER ERROR
                $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrectNumber);
            }
        }
    }

    //CHECKING FOR THE TYPE OF THE CARD
    if (cardNumber[0] === "4" && (cardNumber.length === 13 || cardNumber.length === 16)) {
        cardType = "Visa";
    } else if (cardNumber.length === 16 && cardNumber[0] === "5" && (cardNumber[1] === "1" || cardNumber[1] === "2" || cardNumber[1] === "3" || cardNumber[1] === "4" || cardNumber[1] === "5")) {
        cardType = "MasterCard";
    } else if (cardNumber.length === 16 && ((cardNumber[0] === "3" && cardNumber[1] === "7"))) {
        cardType = "American Express";
    }
   
    //IF THE TYPE OF THE CARD WAS VALID BY LENGHT AND PREFIX THEN WE CHECK IT USING LUHN FORMULA
    if (cardType !== "") {
        validation = cardNumber.split("");
        for (i = 0; i < validation.length; i += 1) {
            validation[i] = parseInt(validation[i], 10);
            if (i % 2 === 0) {
                validation[i] = validation[i] * 2;
            }
            cardNumberSum += validation[i];
        }
    } else {
        goodToPay = false;
    }
    if (cardNumberSum % 10 !== 0) {
        goodToPay = false;
        //IF THE SPAN WITH THE ERROR IS NOT PRESENT
        if ($("cardnumber").previousElementSibling.lastChild.tagName !== "SPAN") {
            //WE ADD THE SPAN SO THE USERS CAN REVIEW THE CARD NUMBER
            $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
        //IF THERE IS ALREADY A SPAN WITH AN ERROR
        } else {
            //IF THE SPAN ERROR IS NOT ABOUT THE CARD NUMBER
            if ($("cardnumber").previousElementSibling.lastChild.textContent !== " Please review!") {
                //WE REMOVE THE SPAN
                $("cardnumber").previousElementSibling.removeChild($("cardnumber").previousElementSibling.lastElementChild);
                //AND ADD THE SPAN ABOUT THE CARD NUMBER ERROR
                $("cardnumber").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
            }
        }
    }
    
    if ($("expyear").options[$("expyear").selectedIndex].text === "2018") {
        d = new Date();
        month = d.getMonth();
        if ($("expmonth").selectedIndex < month) {
            if ($("expmonth").previousElementSibling.lastChild.tagName !== "SPAN") {
                $("expmonth").previousElementSibling.firstChild.parentNode.appendChild(incorrect2);
                goodToPay = false;
            }
        } else {
            if ($("expmonth").previousElementSibling.lastChild.tagName === "SPAN") {
                $("expmonth").previousElementSibling.removeChild($("expmonth").previousElementSibling.lastChild);
            }
        }
    }
    if (goodToPay === true) {
        window.alert("Your Pizza is already being baked. We charged your " + cardType + " card on $" + total);
    } else {
        window.alert("Please review your information");
    }
}

window.addEventListener("load", function () {
    "use strict";
    var i, radios = window.document.getElementsByName("doughtype"),
        checkbox = $("toppings").getElementsByTagName("input");
    //CHECK IF ANY RADIO BUTTON IS SELECTED FOR THE DOUGH TYPE
    radios.forEach(function (radios) {
        if (!radios.checked) {
            //IF NOT, DISABLE CHEESE, SIZE AND SAUCE OPTIONS
            $("cheese").disabled = true;
            $("sauce").disabled = true;
            $("pizzasize").disabled = true;
            //DISABLE TOPPING OPTIONS
            for (i = 0; i < checkbox.length; i += 1) {
                checkbox[i].setAttribute("disabled", true);
            }
        }
    });
    $("doughtypes").addEventListener("change", buildPizzaSize);
    $("sameaddress").addEventListener("change", copyUserInfo);
    $("addresstype").addEventListener("change", invisible);
    $("addresstype2").addEventListener("change", invisible2);
    $("finishbtn").addEventListener("click", pizzaDone);
    $("pizzasize").addEventListener("change", getPizzaSize);
    $("cheese").addEventListener("change", getCheesePrice);
    $("sauce").addEventListener("change", getSaucePrice);
    $("toppings").addEventListener("change", getToppingPrice);
    $("pizzaform").addEventListener("change", totalPizzaPrice);
    $("orderbtn").addEventListener("click", finishOrder);
    $("fname").focus();
});