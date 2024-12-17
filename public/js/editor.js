// selects elements and assigns a new variable for it
let blogTitleField = document.querySelector(".title");
let articleField = document.querySelector(".article");


// banner
const bannerImage = document.querySelector("#banner-upload");
let banner = document.querySelector(".banner");
let bannerPath;


//buttons
const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");


bannerImage.addEventListener("change", () => {
 uploadImage(bannerImage, "banner");
});


uploadInput.addEventListener("change", () => {
 uploadImage(uploadInput, "image");
});
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
   formdata.append("image", file);


   //sending file to the server
   fetch("/public", {
     method: "POST",
     body: formdata,
   })
     .then((res) => res.json())
     .then((data) => {
       console.log("Uploaded image path:", data);
       if (uploadType == "image") {
         addImage(data, file.name);
       } else {
         bannerPath = `${location.origin}${data}`;
         banner.style.backgroundImage = `url("${bannerPath}")`;
       }
     });
 } else {
   alert("upload Image only");
 }


 const addImage = (imagepath, alt) => {
   let curPos = articleFeild.selectionStart;
   let textToInsert = `\r![${alt}](${imagepath})\r`;
   articleFeild.value =
     articleFeild.value.slice(0, curPos) +
     textToInsert +
     articleFeild.value.slice(curPos);
 };
};


const updateBlog = (blogId) => {
 fetch(`/update-blog/${blogId}`, {
   method: "PUT",
   headers: {
     "Content-Type": "application/json", // Indicate that the body is JSON
     // Additional headers if needed (like Authorization)
   },


   body: JSON.stringify({
     title: blogTitleField.value,
     content: articleField.value,
     banner: bannerPath,
   }),
 }).then(() => {
   console.log("redirecting");
   window.location.href = "/blog.html";
 });
};


// Handle publish button click
publishBtn.addEventListener("click", () => {
 const url = new URL(window.location.href);


 const params = new URLSearchParams(url.search);


 const blogIdFromUrl = params.get("blogId");


 if (blogIdFromUrl) updateBlog(blogIdFromUrl);
 else {
   console.log("1. Publish button clicked"); // First log to confirm event listener works


   const title = blogTitleField.value.trim();
   const content = articleField.value.trim();


   // Check if the required fields are filled in
   if (!title || !content || !bannerPath) {
     alert("Please fill in all fields before publishing.");
     return; // Stop the function if fields are missing
   }


   // Log the data for debugging
   console.log("2. All fields validated, preparing to submit:", {
     title,
     content,
     bannerPath,
   });


   // Send blog POST data to the server
   fetch("/submit-post", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       title,
       content,
       bannerPath,
     }),
   })
     .then((res) => {
       console.log("3. Server response received:", res.status); // Log the response status
       if (!res.ok) {
         throw new Error("Network response was not ok");
       }
       console.log("4. About to redirect to blog.html..."); // Last log before redirect
       window.location.href = "/blog.html";
     })
     .catch((err) => {
       console.error("5. Error occurred:", err); // Log any errors
       alert("Failed to save the blog post. Please try again.");
     });
 }
});


const checkIfBlogId = () => {
 const url = new URL(window.location.href);


 const params = new URLSearchParams(url.search);


 const blogIdFromUrl = params.get("blogId");


 console.log(blogIdFromUrl, "url");


 if (blogIdFromUrl) {
   fetch(`/blog/${blogIdFromUrl}`)
     .then((res) => res.json())
     .then((data) => {
       if (data) {
         blogTitleField.value = data.title;
         articleField.value = data.info;
         bannerPath = data.banner;
         banner.style.backgroundImage = `url("${bannerPath}")`;
       }
     });
 }
};


checkIfBlogId();



