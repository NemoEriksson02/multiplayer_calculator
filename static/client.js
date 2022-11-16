let socket = io();

let displayElement = document.getElementById('display');
let valueInput = document.getElementById('value');
let operator = null;

function addText(type, text){
    switch (type){
        case 'number':
            if(valueInput.value.length < 16) { valueInput.value += text; }
            break;
        case 'operator':
            if (operator == null) { valueInput.value += text; operator = text }
            break;
        case 'comma':
            if(!valueInput.value.includes('.')) { valueInput.value += text }
            break;
    }
}


function erase(){
    if(valueInput.value.length > 0){
        valueInput.value = valueInput.value.slice(0,valueInput.value.length-1);
        operator = null;
        ['+','-','*','/'].forEach(op=>{
            if (valueInput.value.includes(op)){
                operator = op;
            }
        });
    }
}

function send(type){
    if (type=='equals'){
        let nums = valueInput.value.split(operator);
        let res = parseFloat(nums[0]);
        if (nums[0]!=''){
            switch(operator){
                case '+':
                    res += parseFloat(nums[1]);
                    break;
                case '-':
                    res -= parseFloat(nums[1]);
                    break;
                case '*':
                    res *= parseFloat(nums[1]);
                    break;
                case '/':
                    res /= parseFloat(nums[1]);
                    break;
            }
            socket.emit('update', [res]);
        }else{
            socket.emit('update', [nums[1], operator]);
        }
        valueInput.placeholder = valueInput.value;
        valueInput.value = '';
        operator = null;
    }
    else if(type='CLS'){
        socket.emit('clear');
    }
}

socket.on('response', (data)=>{
    displayElement.value = data;
    if ([undefined,NaN,null,''].includes(data))displayElement.value = 0;
});

socket.on('server_ip', (data)=>{
    document.getElementById('joinLink').innerText = `${data}:3024`;
});
