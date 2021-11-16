class InputGroup extends HTMLElement {
    set article(article) {
        this.innerHTML = `
        <div class="input-group">
            <label for="body">Create ${article.name}</label>
            <input type="text" name="${article.name}" onblur="validate(this)" placeholder="${article.placeholder}" />
        </div>`;
    }
    connectedCallback() {
        console.log("hello i am connected");
    }
}
customElements.define('form-control', InputGroup);

function createElement(obj) {
    const main = document.getElementById("add-control");
    const title = document.createElement('form-control');
    title.article = obj;
    main.appendChild(title);
}

createElement({ name: "title", placeholder: "title of the post" })

createElement({ name: "body", placeholder: "body of the post" })



