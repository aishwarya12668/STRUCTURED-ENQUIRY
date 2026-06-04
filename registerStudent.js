async function registerStudent(){

    const usn = document.getElementById('usn').value;
    const name = document.getElementById('name').value;
    const password =document.getElementById('password').value;
    const res =await fetch('/registerStudent',{
    method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({usn,name,password})
    });

    const msg =await res.text();
    alert(msg);

    if( msg.includes('Successfully')
    ){
        window.location.href='/';
    }
}