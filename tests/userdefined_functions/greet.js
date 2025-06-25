exports.greet = function greet(name) {
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid name provided');
    }
    return `Hello, ${name}!`;
}

exports.greetDefault = function greetWithDefault(name = 'World') {
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid name provided');
    }
    return `Hello, ${name}!`;
}