address = ['nasr city', 'giza', 'mohandsen']
userKeys = ['name','age','email','address','office']
users = JSON.parse(localStorage.getItem('users')) || []

addUserForm = document.querySelector('#addUser')
usersTable = document.querySelector('#usersTable')

temp = ""
address.forEach(add=>{
    temp += `<option value="${add}">${add}</option>`
})
document.querySelector('select').innerHTML += temp

document.querySelector('#showHide').addEventListener('click', function(e){
    this.textContent == "show"? this.textContent="hide":this.textContent="show";
    document.querySelector('#formSection').classList.toggle('d-none')
})

addUserForm.addEventListener('submit', function(e){
    e.preventDefault()
    let data = this.elements  
    let user ={
        status: false
    }
    userKeys.forEach( key => { 
        if(key!="office") user[key] = data[key].value 
        else user[key] = data[key].checked
    })
    users.push(user)
    addUserForm.reset()
    console.log(users)
    localStorage.setItem('users', JSON.stringify(users))
    singleShow(user, users.length-1)
})

delUser = function(btn, i){
    btn.addEventListener('click',function(e){
        users.splice(i,1)
        localStorage.setItem('users', JSON.stringify(users))
        showUsers()
    })
}

editUser = function(btn, i){
    btn.addEventListener('click',function(e){
        users[i].office = !users[i].office
        localStorage.setItem('users', JSON.stringify(users))
        showUsers()
    })
}

let addElement = function(elementType, elementTxt, parent,index, eleClass=[]){
    ele = document.createElement(elementType)
    ele.textContent = elementTxt
    eleClass.forEach(c=>{ele.classList.add(c) })
    if(elementType=="button" && elementTxt=="delete") delUser(ele, index)
    if(elementType=="button" && elementTxt=="edit") editUser(ele, index)

    parent.appendChild(ele)
}

let singleShow = function(user, i){
    tr = document.createElement('tr')
    addElement('td', i+1, tr, i)
    userKeys.forEach(key=>{ addElement('td', user[key], tr,i, []) })
    addElement('button', "delete", tr, i, ['btn', 'btn-danger', 'm-2'])
    addElement('button', "edit", tr, i, ['btn', 'btn-info','m-2'])
    usersTable.appendChild(tr)
}
let showUsers = function(){
    usersTable.innerHTML=""
    users.forEach((user, i)=>{
        singleShow(user, i)
    })
}
showUsers()

