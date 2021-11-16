const getId = (_id) => document.getElementById(_id);
const data = {};


const displayModal = (heading, body) => {
    getId("modal").style.display = "grid";
    getId("modal-heading").innerHTML = heading;
    getId("modal-body").innerHTML = body;
}

const hideModal = () => {
    getId("modal").style.display = "none";
}



const getUsers = async (url) => {
    try {
        const result = await fetch(url);

        const response = await result.json();
        data.resArr = response;
        response.forEach((item) => {
            getId("username").innerHTML += `<option value="${item.id}">${item.name}</option>`
        })
    }
    catch (err) {
        console.log(err);
    }
}
function validate(e) {
    if (!e.value.trim()) {
        displayModal(`${e.name} Error`, `please provide a ${e.name} for your post`);
        e.style.borderColor = "red";
        return false;
    }
    else {
        e.style.borderColor = "lightgreen";
        return true;
    }
}

getId("username").onchange = (e) => {
    console.log(e.target.value)
    data.selected = e.target.value;
    if (!e.target.value) {
        e.target.style.borderColor = "red";
        getId("map").innerHTML = `<img src="//286832-886580-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2017/04/foundergif.gif" class="map" alt="gif"/>`;

    }
    else {
        e.target.style.borderColor = "lightgreen";
        const { lat, lng } = data.resArr[data.selected].address.geo;
        getId("map").innerHTML = "";
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([lng, lat]),
                zoom: 4
            })
        });

    }
}

getUsers("https://jsonplaceholder.typicode.com/users")

getId("userpost").onsubmit = async (e) => {
    e.preventDefault();
    const selectID = e.target.elements.username;
    if (!selectID.value) {
        displayModal("No Username", "Please select a user!");
        selectID.style.borderColor = "red";
        return;
    }
    if (!validate(e.target.elements.title))
        return;
    if (!validate(e.target.elements.body))
        return;

    getId("submit-butn").setAttribute("disabled", "disabled");
    getId("submit-butn").textContent = "...Please Wait...";
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            data: { title: e.target.elements.title.value, body: e.target.elements.body.value, userId: data.selected }
        });

        if (res) {
            getId("submit-butn").removeAttribute("disabled");
            getId("submit-butn").textContent = "Submit";
            if (res.status === 201) {
                const result = await res.json();
                displayModal("Post Submitted", `<pre>${JSON.stringify(result)}</pre>`);
            }

            else if (res.status === 404)
                displayModal("Invalid User", "User doesn't have permission to add post.");

            else if (res.status === 500)
                displayModal("Server Error", "Operation failed due to server error!<br/> Try again later.");

            else
                displayModal("Operation Failed");

            e.target.elements.title.style.borderColor = "";
            e.target.elements.body.style.borderColor = "";
            e.target.elements.username.style.borderColor = "black";
            e.target.elements.title.value = "";
            e.target.elements.body.value = "";
            e.target.elements.username.value = "";
            getId("map").innerHTML = `<img src="//286832-886580-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2017/04/foundergif.gif" class="map" alt="gif"/>`
        }
    }
    catch (err) {
        console.log(err);
    }
}
