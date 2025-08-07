const inputField = document.querySelector("#dataInput");
const scoreField = document.querySelector("#scoreInput");
const outputField = document.querySelector('#dataOutput');
const rankField = document.querySelector('#rankOutput');
const submitButton = document.querySelector('#submit');
const readButton = document.querySelector('#readData');
const clearButton = document.querySelector('#clearData');

function output(x)
{
    rankField.innerText += `${x.name} - ${x.score}\n`;
}

function setData() {
    newData = {'name': inputField.value, 'score': scoreField.value}; // No need for an extra array
    let savedData = localStorage.getItem('save');

    if (savedData == null) {
        console.log('null value, initializing empty list');
        savedData = []; // Initialize as an empty array
    } else {
        savedData = JSON.parse(savedData); // Parse the string back to an array
    }

    savedData.push(newData); // Push new data into the array

    
    savedData.sort((a, b) => a.score - b.score);

    // Keep only the first 5 elements
    if (savedData.length > 5) {
        savedData = savedData.slice(0, 5);
    }
    // Save the sorted array back to localStorage
    localStorage.setItem('save', JSON.stringify(savedData)); // Save back as a string
    console.log(savedData);
    outputField.innerText = `${newData.name} - ${newData.score}`;
    rankField.innerText = '';
    savedData.forEach(output);

}

function getData()
{
    readData = localStorage.getItem('save');
    console.log(readData);
}

function clearData()
{
    localStorage.removeItem('save');
    console.log(localStorage.getItem('save'));
    rankField.innerText = '';
}

function init()
{
    submitButton.addEventListener('click', setData);
    readButton.addEventListener('click', getData);
    clearButton.addEventListener('click', clearData);
}

window.addEventListener('load', init);