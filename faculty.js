async function loadStudents(){

    const res = await fetch('/allStudents');
    const students = await res.json();
    let output = '';
    students.forEach((s)=>{ output += `
        <tr>
            <td>${s.id}</td>
            <td>${s.usn}</td>
            <td>${s.name}</td>
            <td>
               <button
                onclick="deleteStudent(${s.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById('studentTable').innerHTML = output;

}

async function deleteStudent(id){

    const confirmDelete = confirm("Delete Student ?");
    if(!confirmDelete){
        return;
    }

    const res = await fetch('/deleteStudent/' + id,
        {
            method:'DELETE'
        }
    );

    const msg = await res.text();
    alert(msg);
    loadStudents();
}

function logout(){
    localStorage.clear();
    window.location.href='/';
}
loadStudents();