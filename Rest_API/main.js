let idUpdateForm = null;


async function getPosts() {
  const res = await fetch("http://localhost/api_Rest_API/posts")
  const posts = await res.json()

  const postList = document.querySelector(".posts")
  postList.innerHTML = ""

  posts.forEach(post => {
    postList.innerHTML += `
      <div class="post">
        <h2 class="post__title">${post.title}</h2>
        <p class="post__description">${post.body}</p>
        <a href='#' class="post__description post-delete" id=${post.id}>delete</a>
        <a href='#' class="post__description post-update" data-value="${post.id}">update</a>
      </div>
    `
  })

  limitPostString()

  // delete post
  const deletePost = document.querySelectorAll(".post-delete");
  deletePost.forEach(delPost => {
    delPost.addEventListener("click", async (event) => {
      const id = event.target.id

      const res = await fetch(`http://localhost/api_Rest_API/posts/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      console.log(data)
      if(data.status === true) {
        getPosts()
      }
    })
  })

  // add data in update form
  const updatePost = document.querySelectorAll(".post-update");
  updatePost.forEach(upPost => {
    upPost.addEventListener("click", async (event) => {
      const id = event.target.dataset.value

      const res = await fetch(`http://localhost/api_Rest_API/posts/${id}`)
      const data = await res.json()

      document.querySelector("#title-edit").value = data.title
      document.querySelector("#body-edit").value = data.body
      idUpdateForm = id
    })
  })

}

getPosts()


const form = document.querySelector(".form")

form.addEventListener("submit", async (event) => {
  event.preventDefault()

  const title = document.querySelector("#title").value
  const body = document.querySelector("#body").value

  let formData = new FormData();
  formData.append('title', title)
  formData.append('body', body)

  const res = await fetch("http://localhost/api_Rest_API/posts", {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  if(data.status === true) {
    await getPosts()
  }
})


const formUpdate = document.querySelector(".form-edit")

formUpdate.addEventListener("submit", async (event) => {
  event.preventDefault()

  const title = document.querySelector("#title-edit").value
  const body = document.querySelector("#body-edit").value

  const data = {
    "title": title,
    "body": body,
  }

  const res = await fetch(`http://localhost/api_Rest_API/posts/${idUpdateForm}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  let resData = await res.json()

  if(resData.status === true) {
    await getPosts()
  }
})




// лимит строк
function limitPostString() {
  const postTitles = document.querySelectorAll(".post__title")
  const postDescriptions = document.querySelectorAll(".post__description")

  postTitles.forEach((item, index) => {
    if(postTitles[index].textContent.length > 15) {
      postTitles[index].textContent = postTitles[index].textContent.slice(0, 15)
    }

    if(postDescriptions[index].textContent.length > 127) {
      postDescriptions[index].textContent = postDescriptions[index].textContent.slice(0, 127)
    }
  })
}