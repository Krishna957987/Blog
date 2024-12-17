const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");


function sqlstr(s) {
 return "'" + s.replace(/'/g, "''") + "'";
}


let initial_path = path.join(__dirname, "public");


const app = express();
app.use(express.json());
app.use(express.static(initial_path));
app.use(fileupload());


// Set up SQLite database
const dbPath = path.join(__dirname, "database", "blog.db");
const db = new sqlite3.Database(dbPath, (err) => {
 if (err) {
   console.error("Error opening database:", err);
 } else {
   console.log("Connected to SQLite database");


   db.run(`CREATE TABLE IF NOT EXISTS blog_info (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           banner TEXT,
           date TEXT,
           info TEXT,
           title TEXT
       )`);
 }
});


app.get("/recent-post", (req, res) => {
 console.log("getting blog info");
 return db.all("SELECT * FROM blog_info ORDER BY id DESC", (err, row) => {
   if (err) {
     console.error("Error fetching recent post:", err);
     return res.status(500).json({ error: "Internal Server Error" });
   } else if (!row) {
     return res.status(404).json({ error: "No posts found" });
   } else {
     console.log(err, row, "mate");
     return res.status(200).json(row);
   }
 });
});


app.get("/blog/:blogId", (req, res) => {
 return db.get(
   "select * from blog_info where id = ?",
   [req.params.blogId],
   (err, row) => {
     if (err) {
       console.error("Error fetching recent post:", err);
       return res.status(500).json({ error: "Internal Server Error" });
     } else if (!row) {
       return res.status(404).json({ error: "No posts found" });
     } else {
       console.log(err, row, "mate");
       return res.status(200).json(row);
     }
   }
 );
});

app.put("/update-blog/:blogId", (req, res) => {
    return db.run(
      "update blog_info set banner=?, info=?, title=? where id = ?",
      [req.body.banner, req.body.content, req.body.title, req.params.blogId],
      (err, row) => {
        if (err) {
          console.error("Error fetching recent post:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        } else if (!row) {
          return res.status(404).json({ error: "No posts found" });
        } else {
          return res.status(200).json({ message: "updated" });
        }
      }
    );
   });
   
   
   app.delete("/delete-blog/:blogId", (req, res) => {
    return db.run(
      "delete from blog_info where id = ?",
      [req.params.blogId],
      (err, row) => {
        if (err) {
          console.error("Error fetching recent post:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        } else if (!row) {
          return res.status(404).json({ error: "No posts found" });
        } else {
          return res.status(200).json({ message: "updated" });
        }
      }
    );
   })




app.get("/", (req, res) => {
 res.sendFile(path.join(initial_path, "home.html"));
});


app.post("/submit-post", (req, res) => {
 db.run(
   `insert into blog_info(title,banner,date,info) values(?,?,?,?);


       )`,
   [req.body.title, req.body.bannerPath, "hello", req.body.content]
 );
 return res.status(200).json({
   msg: "hello",
 });
});


app.get("/editor", (req, res) => {
 res.sendFile(path.join(initial_path, "editor.html"));
});

app.get("/blog", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
   });

app.post("/public", (req, res) => {
 if (!req.files || !req.files.image) {
   return res.status(400).send("No file uploaded");
 }


 let file = req.files.image;
 let date = new Date();
 let imagename = date.getDate() + date.getTime() + file.name;


 // Correct upload path
 let uploadPath = path.join(initial_path, imagename);


 file.mv(uploadPath, (err) => {
   if (err) {
     return res.status(500).send(err);
   } else {
     res.json(`/${imagename}`);
   }
 });
});


app.use((req, res) => {
 res.json("404");
});

app.get('/recent-post', (req, res) => {
    db.all('SELECT id, title, date FROM blog_info', [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve blog posts' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(3000, () => {
 console.log("Listening on port 3000...");
});



