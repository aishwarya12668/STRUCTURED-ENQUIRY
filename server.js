const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:''
});
db.connect((err)=>{if(err){console.log(err);}
    else{
        console.log("MySQL Connected");}
});
db.query(`CREATE DATABASE IF NOT EXISTS marks_portal`);
db.query(`USE marks_portal`);
db.query(`CREATE TABLE IF NOT EXISTS faculty(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(100))`);
db.query(`
CREATE TABLE IF NOT EXISTS students(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usn VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    password VARCHAR(100))`);
db.query(`
CREATE TABLE IF NOT EXISTS marks(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    subject VARCHAR(100),
    ia1 INT,
    ia2 INT,
    ia3 INT,
    UNIQUE(student_id,subject),FOREIGN KEY(student_id)REFERENCES students(id) ON DELETE CASCADE)`);

app.get('/',(req,res)=>{res.sendFile(
        path.join(
            __dirname,
            'views',
            'index.html'
        )
    );
});
app.get('/faculty',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'faculty.html'
        )
    );
});
app.get('/student',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'student.html'
        )
    );
});
app.get('/addStudentPage',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'addStudent.html'
        )
    );
});
app.get('/uploadMarksPage',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'uploadMarks.html'
        )
    );
});
app.get('/registerFaculty',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'registerFaculty.html'
        )
    );
});
app.get('/registerStudent',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'registerStudent.html'
        )
    );
});
app.post('/registerFaculty',(req,res)=>{
    const {username,password} = req.body;
    db.query(` INSERT INTO faculty(username,password) VALUES (?,?)`,
        [username, password],
        (err)=>{
            if(err){
                return res.send('Faculty Already Exists ');
            }
            res.send('Faculty Registered Successfully');
        }
    );
});
app.post('/registerStudent',(req,res)=>{
    const {usn,name,password} = req.body;
    db.query(`INSERT INTO students (usn,name,password) VALUES (?,?,?)`,
        [usn,name,password],
        (err)=>{
            if(err){
                return res.send('Student Already Exists');}
            res.send(
                'Student Registered Successfully ✅'
            );
        }
    );
});
app.post('/login',(req,res)=>{
    const {role,username,password} = req.body;
    if(role === 'faculty'){
        db.query(`SELECT * FROM faculty WHERE username=? AND password=? `,
            [username, password],
            (err,result)=>{
                if(result.length > 0){
                    return res.json({
                        success:true,
                        role:'faculty'
                    });
                }
                res.json({  success:false,
                    message:'Invalid Faculty Login '
                });
           }
        );
    }
    else{
        db.query(` SELECT * FROM students WHERE usn=? AND password=?`,
            [username,password],
            (err,result)=>{
                if(result.length > 0){
                    return res.json({
                        success:true,
                        role:'student',
                        student:result[0]
                    });
                }
                res.json({
                    success:false,
                    message:'Invalid Student Login ❌'
                });
            }
        );
    }
});
app.post('/addStudent',(req,res)=>{
    const {usn,name,password} = req.body;

    db.query(`
        INSERT INTO students (usn,name,password) VALUES (?,?,?)
        `,
        [usn,name,password],
        (err)=>{
            if(err){
                return res.send('Student Already Exists');
            }
            res.send('Student Added Successfully');
        }
    );
});

app.post('/marks',(req,res)=>{
    const { student_id,subject,ia1,ia2} = req.body;

    /* EMPTY CHECK */

    if(student_id === '' || subject === ''){
        return res.send('Fill All Fields ');
    }

    /* CHECK STUDENT EXISTS */

    db.query(`SELECT * FROM students WHERE id=?`,[student_id], (err,studentResult)=>{
            if(err){
                return res.send('Database Error');
            }
            if(studentResult.length === 0){
                return res.send('Student ID Not Registered');
            }
        
            if( Number(ia1) > 20 || Number(ia2) > 20)
                {return res.send('Marks Cannot Be Greater Than 20 ');}

            db.query(`SELECT * FROM marks WHERE student_id=? AND subject=?`,
                [student_id,subject],
                (err,result)=>{
                    if(result.length > 0){
                        db.query(`
                            UPDATE marks SET ia1=?, ia2=? WHERE student_id=? AND subject=?`,
                            [ia1,ia2,student_id,subject],
                            ()=>{res.send('Marks Updated Successfully');
                            }
                        );
}
                    else{
                        db.query(`INSERT INTO marks(student_id,subject,ia1,ia2)VALUES (?,?,?,?)`,
                            [student_id,subject,ia1,ia2],()=>{
                                res.send('Marks Uploaded Successfully');
                            }
                        );
                    }
                }
            );
        }
    );
});
app.get('/marks/:id',(req,res)=>{
    db.query(`SELECT * FROM marks WHERE student_id=? `,
        [req.params.id],
        (err,result)=>{
            res.json(result);
        }
    );
});
app.get('/allStudents',(req,res)=>{
    db.query(` SELECT * FROM students `,
        (err,result)=>{
            res.json(result);
        }
    );
});
app.delete('/deleteStudent/:id',(req,res)=>{
    const id = req.params.id;
    db.query(`
        DELETE FROM students
        WHERE id= ?`,
        [id],
        (err)=>{
            if(err){
                return res.send('Error Deleting Student');
            }
            res.send('Student Deleted Successfully');
        }
    );
});
app.get('/updateMarksPage',(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'updateMarks.html'
        )
    );
});

app.get('/checkStudent/:id',(req,res)=>{
    const id = req.params.id;
    db.query(
        `
        SELECT *
        FROM students
        WHERE id=?
        `,
        [id],
        
        (err,result)=>{
            if(result.length > 0){
                res.json({
                    exists:true
                });
            }
            else{
                res.json({
                    exists:false
                });

            }

        }

    );

});

/* =========================
   GET OLD MARKS
========================= */

app.get('/studentMarks/:id', (req, res) => {
    const id = req.params.id;
    db.query(

        `
        SELECT *
        FROM marks
        WHERE student_id=?
        `,

        [id],

        (err, result) => {res.json(result);}
);

});
app.listen(3000,()=>{console.log('Server Running On Port 3000');});