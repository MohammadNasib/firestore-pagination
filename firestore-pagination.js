const cafeList = document.querySelector("#cafeList");
const loadBtn = document.querySelector("#loadBtn");
const content = document.querySelector(".content");
const loading = document.querySelector(".loading");

let lastDoc = null;

const getData = async () => {
  loading.classList.add("active");
  const ref = db
    .collection("Cafes")
    .orderBy("name")
    .startAfter(lastDoc || 0)
    .limit(5);

  const data = await ref.get();
  let template = " ";

  data.docs.forEach((doc) => {
    template += `  <li id=${doc.id}>
    <h2>${doc.data().name}</h2>
    <span>${doc.data().city}</span>
    <div>X</div>
  </li>`;
  });

  cafeList.innerHTML += template;

  loading.classList.remove("active");

  lastDoc = data.docs[data.docs.length - 1];

  if (data.empty) {
    loadBtn.removeEventListener("click", handleClick);

    content.removeEventListener("scroll", handleScroll);
  }
};

const handleClick = () => {
  getData();
};

const handleScroll = () => {
  let triggeredHeight = content.scrollTop + content.offsetHeight;

  if (triggeredHeight >= content.scrollHeight) {
    getData();
  }
};

loadBtn.addEventListener("click", handleClick);

content.addEventListener("scroll", handleScroll);

// wait for  loading

window.addEventListener("DOMContentLoaded", () => getData());
