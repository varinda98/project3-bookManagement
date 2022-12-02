const isValid = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === "undefined" || value === "null") return false
    return true;
}
const isValidnum= (value)=>{
    if(typeof value !== 'string') return false
    return true
}
const regexName = function (name) {
    return (/^[a-zA-Z ]{2,30}$/.test(name))
}

const regexPhone = function (phone) {
    return (/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone))
}


const regexPassword = function (password) {
    return (/^(?=.*[A-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/)
        .test(password)
}
const regexPincode = function (pincode) {
    if(typeof pincode !=='string') return false
    return (/^(\d{4}|\d{6})$/
        .test(pincode))
}
const regexemail = function (email) {
    return ((/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
        .test(email))
}
function checkObject(value) {
    if (typeof value == "undefined" || typeof value == null || typeof value != 'object') {
        return false
    } else {
        return true
    }
}
const validateDate = (value) => { 
    return (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).test(value) 
}
const ValidateISBN =(value)=>{
    return (/[0-9]{13}/).test(value);
}
module.exports={isValid,regexName,regexPassword,regexPhone,regexPincode,regexemail,checkObject,isValidnum,validateDate,ValidateISBN};