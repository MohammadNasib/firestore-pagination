// ### firestore code ###

const cafeList = document.querySelector("#cafeList");
const form = document.querySelector("#cafeForm");

function append(doc) {
  let li = document.createElement("li");
  let nameVal = document.createElement("h2");
  let cityVal = document.createElement("span");
  let cross = document.createElement("div");

  nameVal.textContent = doc.data().name;
  cityVal.textContent = doc.data().city;
  cross.textContent = "X";

  li.setAttribute("data-id", doc.id);
  li.appendChild(nameVal);
  li.appendChild(cityVal);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // deleting data

  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("Cafes").doc(id).delete();
  });
}

// (not real time) getting and ordering the values

// db.collection("Cafes")
//   .orderBy("name")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((elm) => append(elm));
//   });

//  real time getting and ordering the values

db.collection("Cafes")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();

    changes.forEach((cng) => {
      if (cng.type == "added") {
        append(cng.doc);
      } else if (cng.type == "removed") {
        let li = cafeList.querySelector(`[data-id=${cng.doc.id}]`);

        cafeList.removeChild(li);
      }
    });
  });

// adding data

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("Cafes").add({
    name: form.name.value,
    city: form.city.value,
  });
  form.city.value = null;
  form.name.value = null;
});

// search for special query..such as city == london

// db.collection("Cafes")
//   .where("city", "==", "london")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((elm) => append(elm));
//   });

//update vs set method... update is best

db.collection("Cafes").doc("NRHBsQcUMzYDWV0ac0YH").update({
  city: "New York",
});
