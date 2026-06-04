async function updateSubject(
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
        body:JSON.stringify({student_id,subject,ia1,ia2})
    });
    return await res.text();
}

/* =========================
   AUTO FETCH OLD MARKS
========================= */

document.getElementById('sid').addEventListener(
    'keyup',
    async function () {

        const student_id = this.value;

        if(student_id === ''){
            return;
        }

        const res = await fetch(
            '/studentMarks/' + student_id
        );

        const marks = await res.json();

        /* CLEAR OLD VALUES */

        document.getElementById('sub1').value = '';
        document.getElementById('s1ia1').value = '';
        document.getElementById('s1ia2').value = '';

        document.getElementById('sub2').value = '';
        document.getElementById('s2ia1').value = '';
        document.getElementById('s2ia2').value = '';

        document.getElementById('sub3').value = '';
        document.getElementById('s3ia1').value = '';
        document.getElementById('s3ia2').value = '';

        /* AUTO FILL */

        if(marks.length > 0){

            if(marks[0]){

                document.getElementById('sub1').value =
                    marks[0].subject;

                document.getElementById('s1ia1').value =
                    marks[0].ia1;

                document.getElementById('s1ia2').value =
                    marks[0].ia2;
            }

            if(marks[1]){

                document.getElementById('sub2').value =
                    marks[1].subject;

                document.getElementById('s2ia1').value =
                    marks[1].ia1;

                document.getElementById('s2ia2').value =
                    marks[1].ia2;
            }

            if(marks[2]){

                document.getElementById('sub3').value =
                    marks[2].subject;

                document.getElementById('s3ia1').value =
                    marks[2].ia1;

                document.getElementById('s3ia2').value =
                    marks[2].ia2;
            }

        }

    }
);
async function updateMarks(){
    const student_id =document.getElementById('sid').value;
    if(student_id === ''){
        alert(
            'Enter Student ID ❌'
        );
        return;
    }
  
    const res =
await fetch(

    '/checkStudent/' + student_id

);

const data =
await res.json();

if(!data.exists){

    alert(
        'Student ID Not Registered ❌'
    );

    return;

}

    let atleastOneSubject = false;
    let messages = [];
    /* SUBJECT 1 */
    const sub1 =document.getElementById('sub1').value;

    if(sub1 !== ''){atleastOneSubject = true;
        const msg1 = await updateSubject(
            student_id,
            sub1,
            document.getElementById('s1ia1').value,
            document.getElementById('s1ia2').value
        );
        messages.push(msg1);
    }
    /* SUBJECT 2 */
    const sub2 =document.getElementById('sub2').value;
    if(sub2 !== ''){
        atleastOneSubject = true;
        const msg2 = await updateSubject(
            student_id,
            sub2,
            document.getElementById('s2ia1').value,
            document.getElementById('s2ia2').value
        );
        messages.push(msg2);
    }
    /* SUBJECT 3 */
    const sub3 =document.getElementById('sub3').value;
    if(sub3 !== ''){
        atleastOneSubject = true;
        const msg3 = await updateSubject(
            student_id,
            sub3,
            document.getElementById('s3ia1').value,
            document.getElementById('s3ia2').value
        );
        messages.push(msg3);
    }
    /* NO SUBJECT */
    if(!atleastOneSubject){
        alert('Select Atleast One Subject');
        return;
    }
    if(messages.length > 0){
        alert(messages[0]);
    }
}

function logout(){
    localStorage.clear();
    window.location.href='/';
}