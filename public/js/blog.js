window.addEventListener('load', () => {
    loadinfo();
      });

      function loadinfo() {
        fetch('/recent-post',{method:'GET'})
        .then(res => res.json())
        .then(data => {
            console.log(data,"hello")
            const info=document.getElementById("Info")
            info.innerHTML = ''; // Clear the existing list
            data.forEach(session => {
                const studyItem = document.createElement('div');
                studyItem.className = 'study-item';
                studyItem.innerHTML = `
                    <div class="study-banner">
                        <img src="${session.banner}" alt="Banner Image" class="banner-img">
                    </div>
                    <h3 class="study-title">${session.title}</h3>
                    <p class="study-date">Date: ${session.date}</p>
                    <p class="study-notes">${session.info}</p>
                `;
                info.appendChild(studyItem);
            });

            banner.style.backgroundImage = `url(${data.bannerImage})`;
        })
        .catch(error => {
            console.error('Error fetching blog post:', error);
        });
    }

