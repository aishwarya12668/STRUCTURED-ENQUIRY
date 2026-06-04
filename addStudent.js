async function addStudent(){

    const usn = document.getElementById('usn').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('pass').value;
    const res = await fetch('/addStudent',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({usn,name,password})
});

    const msg = await res.text();
    alert(msg);
}

function logout(){
 localStorage.clear();
 window.location.href='/';
}