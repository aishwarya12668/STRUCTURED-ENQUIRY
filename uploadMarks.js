async function insertSubject(

    student_id,
    subject,
    ia1,
    ia2
){
    if(subject === ''){
        return null;
    }
    const res = await fetch('/marks',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({student_id,subject,ia1,ia2
        })
    });
    return await res.text();
}
async function saveMarks(){
    const student_id =document.getElementById('sid').value;

    if(student_id === ''){
        alert(
            'Enter Student ID '
        );
        return;
    }
    let messages = [];
    /* SUBJECT 1 */
    const msg1 = await insertSubject(
        student_id,
        document.getElementById('sub1').value,
        document.getElementById('s1ia1').value,
        document.getElementById('s1ia2').value);
    if(msg1) messages.push(msg1);
    /* SUBJECT 2 */
    const msg2 = await insertSubject(
        student_id,
        document.getElementById('sub2').value,
        document.getElementById('s2ia1').value,
document.getElementById('s2ia2').value
    );
    if(msg2) messages.push(msg2);
    /* SUBJECT 3 */
    const msg3 = await insertSubject(
        student_id,
        document.getElementById('sub3').value,
        document.getElementById('s3ia1').value,
        document.getElementById('s3ia2').value);
    if(msg3) messages.push(msg3);
    alert(messages.join('\n'));
}
function logout(){
    localStorage.clear();
    window.location.href='/';
}