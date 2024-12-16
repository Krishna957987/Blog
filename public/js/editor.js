// selects elements and assigns a new variable for it
const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article'); 

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

//buttons
const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})
//declaring function
const uploadImage = (uploadFile, uploadType) => {
    if (!uploadFile.files.length) {
        alert("Please select a file to upload.");
        return;
    }
    //selecting files
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        //sending file to the server
        fetch('/public', {
            method: 'POST',
            body: formdata
        })
        .then(res => res.json())
        .then(data => {
            console.log('Uploaded image path:', data);
            if (uploadType == "image") {
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })


        const express = require('express');
        const path = require('path');
        const fileupload = require('express-fileupload');
        const db = require('./database'); // require SQLite connection
        
        const app = express();
        const initial_path = path.join(__dirname, 'public');
        
        app.use(express.static(initial_path));
        app.use(express.json()); // For parsing JSON request bodies
        app.use(fileupload());
        
        // Route to handle image uploads
        app.POST('/upload', (req, res) => {
            if (!req.files || !req.files.image) {
                return res.status(400).send('No image file uploaded.');
            }
        
            let file = req.files.image;
            let imageName = Date.now() + '-' + file.name;
            let uploadPath = path.join(__dirname, 'public/uploads', imageName);
        
            file.mv(uploadPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('File upload failed.');
                }
                res.json({ path: `/uploads/${imageName}` });
            });
        });
        
    

        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
        
            } else{
                alert("upload Image only");
            }


const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
}


}


// Handle publish button click
publishBtn.addEventListener('click', () => {
    console.log('1. Publish button clicked'); // First log to confirm event listener works

    const title = blogTitleField.value.trim();
    const content = articleField.value.trim();

    // Check if the required fields are filled in
    if (!title || !content || !bannerPath) {
        alert('Please fill in all fields before publishing.');
        return; // Stop the function if fields are missing
    }

    // Log the data for debugging
    console.log('2. All fields validated, preparing to submit:', { title, content, bannerPath });
    
    // Send blog POST data to the server
    fetch('/submit-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            content,
            bannerPath
        })
    })
    .then(res => {
        console.log('3. Server response received:', res.status); // Log the response status
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('4. About to redirect to blog.html...'); // Last log before redirect
        window.location.href = '/blog.html';
    })
    .catch(err => {
        console.error('5. Error occurred:', err); // Log any errors
        alert('Failed to save the blog post. Please try again.');
    });
});

