async function registerFaculty(){

    const username =document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/registerFaculty',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({username,password})
    });

    const msg =await res.text();
    alert(msg);
    if(msg.includes('Successfully')
    ){
        window.location.href='/';
    }
}