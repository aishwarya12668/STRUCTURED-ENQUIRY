const student = JSON.parse(
localStorage.getItem('student')
);

async function loadMarks(){

    const res = await fetch('/marks/' + student.id);
    const marks = await res.json();
    let output = '';
    marks.forEach((m)=>{
        output += `
        <tr>
            <td>${m.subject}</td>
            <td>${m.ia1}</td>
            <td>${m.ia2}</td>
        </tr>
        `;
    });
    document.getElementById('marksTable').innerHTML = output;
}
function logout(){
    localStorage.clear();
    window.location.href='/';
}
loadMarks();