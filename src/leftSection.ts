//left section 
let inuputTitle=document.querySelector('.inputtitle') as HTMLInputElement ;

let taskDescription=document.querySelector('.taskdescription') as HTMLTextAreaElement;

let addBtn=document.querySelector('.addbutton') as HTMLButtonElement;

let date=document.querySelector('.date') as  HTMLInputElement;

let selectpriority=document.querySelector('.selectpriority') as HTMLSelectElement;

let selectCategory = document.querySelector('.selectCategory') as HTMLSelectElement;
let  chipContainer = document.querySelector('.chipContainer') as HTMLDivElement;
let selectedOptions: string[] = [];

let time= new Date();
let hr:number=time.getHours();
let min:number=time.getMinutes();

let greet='';
if(hr<12){
    greet='morning'
}else if(hr>=12 && hr<16){
    greet='afternoon'
}else if(hr>=16 && hr<20){
    greet='evening'
}else{
    greet='night'
}

selectCategory.addEventListener('change', function() {
    const selectedValue = (this as HTMLSelectElement).value;
    const selectedText = (this as HTMLSelectElement).options[this.selectedIndex].text;

    if (!selectedOptions.includes(selectedValue))  {
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
        chipClose.addEventListener('click', function() {
            removeChip(selectedValue);
        });
        chip.appendChild(chipClose);

        chipContainer.appendChild(chip);

        (this as HTMLSelectElement).options[this.selectedIndex].disabled = true;
        (this as HTMLSelectElement).value = '';
    }
    console.log(selectedOptions);
});

function removeChip(chipId: string): void {
    const chip = document.getElementById(chipId) as HTMLDivElement;
    if (chip && chipContainer.contains(chip)) {
        chipContainer.removeChild(chip);
        selectedOptions = selectedOptions.filter(option => option !== chipId);
    }

    const optionToEnable = Array.from(selectCategory.options).find(option => option.value === chipId);
    if (optionToEnable) {
        optionToEnable.disabled = false;
    }
}
