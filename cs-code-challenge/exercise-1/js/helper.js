const apiUrl = "https://615485ee2473940017efaed3.mockapi.io/assessment";
window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem("userList")) {
        fetch(apiUrl).then(res => res.json()).then(data => {
            localStorage.setItem("userList", JSON.stringify(data))
            implementHandlebars();
        });
    } else {
        implementHandlebars();
    }
});
function implementHandlebars() {
    let userList = localStorage.getItem("userList") ? JSON.parse(localStorage.getItem("userList")) : [];
    let template = $('#basic-template1').html();
    let templateScript = Handlebars.compile(template);
    let context = {
        "userList": userList
    };
    let html = templateScript(context);
    $(document.body).append(html);
}