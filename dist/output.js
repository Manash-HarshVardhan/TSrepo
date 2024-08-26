"use strict";
//left section 
let inuputTitle = document.querySelector('.inputtitle');
let taskDescription = document.querySelector('.taskdescription');
let addBtn = document.querySelector('.addbutton');
let date = document.querySelector('.date');
let selectpriority = document.querySelector('.selectpriority');
let selectCategory = document.querySelector('.selectCategory');
let chipContainer = document.querySelector('.chipContainer');
let selectedOptions = [];
let time = new Date();
let hr = time.getHours();
let min = time.getMinutes();
let greet = '';
if (hr < 12) {
    greet = 'morning';
}
else if (hr >= 12 && hr < 16) {
    greet = 'afternoon';
}
else if (hr >= 16 && hr < 20) {
    greet = 'evening';
}
else {
    greet = 'night';
}
selectCategory.addEventListener('change', function () {
    const selectedValue = this.value;
    const selectedText = this.options[this.selectedIndex].text;
    if (!selectedOptions.includes(selectedValue)) {
        selectedOptions.push(selectedValue);
        const chip = document.createElement('div');
        chip.id = selectedValue;
        chip.className = 'chip flex items-center mr-2 bg-gray-200 p-2 rounded-md';
        const chipText = document.createElement('span');
        chipText.textContent = selectedText;
        chip.appendChild(chipText);
        const chipClose = document.createElement('span');
        chipClose.className = 'ml-2 cursor-pointer text-red-500';
        chipClose.textContent = 'x';
        chipClose.addEventListener('click', function () {
            removeChip(selectedValue);
        });
        chip.appendChild(chipClose);
        chipContainer.appendChild(chip);
        this.options[this.selectedIndex].disabled = true;
        this.value = '';
    }
    console.log(selectedOptions);
});
function removeChip(chipId) {
    const chip = document.getElementById(chipId);
    if (chip && chipContainer.contains(chip)) {
        chipContainer.removeChild(chip);
        selectedOptions = selectedOptions.filter(option => option !== chipId);
    }
    const optionToEnable = Array.from(selectCategory.options).find(option => option.value === chipId);
    if (optionToEnable) {
        optionToEnable.disabled = false;
    }
}
// Right section
let cardcontainer = document.querySelector('.cardcontainer');
let inputsearch = document.querySelector('.inputsearch');
let filtertask = document.querySelector('.filtertask');
let sortOptions = document.querySelector('.sortoption');
let cardArray = [];
// Fetch data from localStorage
function loadCardArray() {
    cardArray = JSON.parse(localStorage.getItem('data') || '[]');
}
// Create card
function createCard(cardArray) {
    cardcontainer.innerHTML = '';
    cardArray.forEach(field => {
        const outerContainer = document.createElement('div');
        outerContainer.className = 'p-2 border-2 rounded-md flex justify-between mb-2';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'w-6 h-6 mt-1';
        checkbox.checked = field.finished;
        outerContainer.appendChild(checkbox);
        const innerContainer = document.createElement('div');
        innerContainer.className = 'w-[85%] flex flex-col gap-4 mt-1 mb-4';
        const heading = document.createElement('h4');
        heading.className = 'text-xl font-bold';
        heading.textContent = `${field.title}`;
        if (field.finished) {
            heading.classList.add('line-through');
            heading.classList.add('text-gray-500');
        }
        innerContainer.appendChild(heading);
        checkbox.addEventListener('click', () => {
            heading.classList.toggle('line-through');
            heading.classList.toggle('text-gray-500');
            field.finished = !field.finished;
            localStorage.setItem('data', JSON.stringify(cardArray));
        });
        const dateParagraph = document.createElement('p');
        let selectpriorityTxt = field.priority;
        if (selectpriorityTxt === 'Low') {
            dateParagraph.className = 'text-green-600';
        }
        else if (selectpriorityTxt === 'Medium') {
            dateParagraph.className = 'text-yellow-400';
        }
        else {
            dateParagraph.className = 'text-red-600';
        }
        dateParagraph.textContent = field.date;
        innerContainer.appendChild(dateParagraph);
        //creating tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'flex gap-3';
        if (field.work === true) {
            const workTag = document.createElement('div');
            workTag.className = 'bg-[#9BE2DB] p-2 rounded-full';
            workTag.textContent = 'Work';
            tagsContainer.appendChild(workTag);
        }
        if (field.personal === true) {
            const personalTag = document.createElement('div');
            personalTag.className = 'bg-[#9BE2DB] p-2 rounded-full';
            personalTag.textContent = 'Personal';
            tagsContainer.appendChild(personalTag);
        }
        if (field.home === true) {
            const homeTag = document.createElement('div');
            homeTag.className = 'bg-[#9BE2DB] p-2 rounded-full';
            homeTag.textContent = 'Home';
            tagsContainer.appendChild(homeTag);
        }
        innerContainer.appendChild(tagsContainer);
        const additionalParagraph = document.createElement('p');
        additionalParagraph.className = 'w-[80%] text-[15px] font-normal';
        additionalParagraph.textContent = field.descr;
        innerContainer.appendChild(additionalParagraph);
        outerContainer.appendChild(innerContainer);
        const deleteIcon = document.createElement('img');
        deleteIcon.src = '/images/Trash.png';
        deleteIcon.alt = 'delicon';
        deleteIcon.className = 'w-6 h-6 m-1';
        outerContainer.appendChild(deleteIcon);
        deleteIcon.addEventListener('click', () => {
            outerContainer.remove();
            cardArray = cardArray.filter(card => card.id !== field.id);
            localStorage.setItem('data', JSON.stringify(cardArray));
        });
        cardcontainer.appendChild(outerContainer);
    });
}
// Searching
inputsearch.addEventListener('input', () => {
    cardcontainer.innerHTML = '';
    const searchValue = inputsearch.value.toLowerCase();
    loadCardArray();
    if (searchValue) {
        const filterItem = cardArray.filter(field => field.title.toLowerCase().startsWith(searchValue) ||
            field.descr.toLowerCase().startsWith(searchValue));
        if (filterItem.length !== 0) {
            createCard(filterItem);
        }
        else {
            let p1 = document.createElement('p');
            p1.classList.add('mt-2', 'mb-2', 'font-bold');
            p1.textContent = 'Sorry no item match your search😕';
            cardcontainer.appendChild(p1);
        }
    }
    else {
        createCard(cardArray);
    }
});
// Adding new card
addBtn.addEventListener('click', () => {
    loadCardArray();
    if (!inuputTitle.value || !taskDescription.value || !date.value) {
        alert('Please fill mandatory fields');
        inuputTitle.focus();
        return;
    }
    let cardDetail = {
        id: Date.now(),
        title: inuputTitle.value,
        descr: taskDescription.value,
        date: `${date.value} | ${new Date().getHours()}:${new Date().getMinutes()} in the ${(new Date().getHours() >= 12 ? 'PM' : 'AM')} | ${selectpriority.options[selectpriority.selectedIndex].text}`,
        priority: selectpriority.options[selectpriority.selectedIndex].text,
        finished: false,
        work: false,
        personal: false,
        home: false
    };
    if (selectedOptions.includes('Work')) {
        cardDetail.work = true;
    }
    if (selectedOptions.includes('Home')) {
        cardDetail.home = true;
    }
    if (selectedOptions.includes('Personal')) {
        cardDetail.personal = true;
    }
    cardArray.push(cardDetail);
    localStorage.setItem('data', JSON.stringify(cardArray));
    createCard(cardArray);
    inuputTitle.value = '';
    taskDescription.value = '';
    date.value = '';
});
// Filtering tasks
filtertask.addEventListener('change', () => {
    const filterValue = filtertask.value;
    loadCardArray();
    let filteredCards = cardArray;
    if (filterValue === 'option1') {
        filteredCards = cardArray.filter(card => card.finished);
    }
    else if (filterValue === 'option2') {
        filteredCards = cardArray.filter(card => !card.finished);
    }
    createCard(filteredCards);
});
// Sorting options
sortOptions.addEventListener('change', () => {
    const sortValue = sortOptions.value;
    loadCardArray();
    let sortedCards = [...cardArray];
    if (sortValue === 'option1') {
        // Sort by priority Low to High
        sortedCards.sort((a, b) => {
            const priorities = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return priorities[a.priority] - priorities[b.priority];
        });
    }
    else if (sortValue === 'option3') {
        // Sort by priority High to Low
        sortedCards.sort((a, b) => {
            const priorities = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return priorities[b.priority] - priorities[a.priority];
        });
    }
    createCard(sortedCards);
});
loadCardArray();
createCard(cardArray);
