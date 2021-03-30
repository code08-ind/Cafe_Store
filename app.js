let cafeList = document.getElementById("cafe-list");
let form = document.getElementById("add-cafe-form");

//! create element and render cafe
const renderCafe = (doc) => {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    let cross = document.createElement("div");
    let icon = document.createElement("i");

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.appendChild(icon);
    icon.innerHTML = '<i class="fas fa-times"/>';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //! deleting data
    icon.addEventListener("click", (e) => {
        //! stop the event propagation
        e.stopPropagation();
        let id = e.target.parentElement;//?i 
        let mainId = id.parentElement;//?div
        let bigId = mainId.parentElement.getAttribute("data-id");//?li
        db.collection("cafe").doc(bigId).delete();
    });
}

//! saving data
form.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("cafe").add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = "";
    form.city.value = "";
});

//! real time listeners
db.collection("cafe").orderBy("name").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        // 
        if (change.type === "added") {
            renderCafe(change.doc);
        }
        else if (change.type === "removed") {
            let li = document.querySelector("[data-id=" + change.doc.id + "]");
            cafeList.removeChild(li);
        }
    });
});