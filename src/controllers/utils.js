function generateCode() {
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var code = '';

    for (var i = 0; i < 11; i++) {
        if (i === 3 || i === 7) {
            code += '-';
        } else {
            var randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
    }

    return code;
}


module.exports = { generateCode }