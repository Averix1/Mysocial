import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  addDoc,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// KAYIT
window.register = function () {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Kayıt başarılı"))
    .catch(err => alert(err.message));
};

// GİRİŞ
window.login = function () {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(() => alert("Hatalı giriş"));
};

// ÇIKIŞ
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};

// POST PAYLAŞ
window.sharePost = function () {
  let content = document.getElementById("postInput").value;

  addDoc(collection(db, "posts"), {
    content: content,
    user: auth.currentUser.email,
    time: Date.now()
  });
};

// POSTLARI YÜKLE
function loadPosts() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  onSnapshot(collection(db, "posts"), snapshot => {
    feed.innerHTML = "";

    snapshot.forEach(doc => {
      let post = doc.data();

      feed.innerHTML += `
        <div class="post">
          <b>${post.user}</b>
          <p>${post.content}</p>
        </div>
      `;
    });
  });
}

// KULLANICI TAKİP
onAuthStateChanged(auth, user => {
  if (!user) {
    if (!location.href.includes("auth.html")) {
      window.location.href = "auth.html";
    }
  } else {
    let emailBox = document.getElementById("userEmail");
    if (emailBox) {
      emailBox.innerText = user.email;
    }
    loadPosts();
  }
});
