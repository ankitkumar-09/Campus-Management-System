const express=require("express");
const app=express();
const mysql=require("mysql");
const dotenv=require('dotenv');
const connDB=require('./db/db.conn');
const cors = require('cors');
dotenv.config();
// const privateRoutes=require('./private/admin.create');
const adminRoutes=require('./routes/admin.routes');
const facultyRoutes=require('./routes/faculty.routes');
const studentRoutes=require('./routes/students.routes');
const allUserRoutes=require('./routes/allusers.routes');
connDB.connect((err) => {
    if (err) {
        console.error('Database connection failed:',err);
    } else {
        console.log('Connected to the database');
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cors());

// app.use("/private",privateRoutes);
app.use('/public',allUserRoutes);
app.use('/admin',adminRoutes);
app.use('/faculty',facultyRoutes);
app.use('/student',studentRoutes);


app.get("/check",(req,res)=>{
    res.send("All okay");
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`);
});