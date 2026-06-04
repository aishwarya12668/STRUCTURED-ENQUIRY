async function login(){

    const role =document.getElementById('role').value;
    const username =document.getElementById('username').value.trim();
    const password =document.getElementById('password').value.trim();
    if(username === '' || password === ''){
        document.getElementById('msg').innerHTML =
        "Please Fill All Fields";
        return;
    }
    const res =await fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ role,username,password})
});

    const data = await res.json();
if(data.success){
if(role === 'student'){
localStorage.setItem('student',JSON.stringify(data.student));
window.location.href ='/student';
}
else{
 window.location.href ='/faculty';
}
}
else{
document.getElementById('msg').innerHTML = data.message;}
}