$(function() {
    if (localStorage.getItem("username")) {
        localStorage.setItem("lastVisit", new Date().toLocaleString());
        window.location.href = "game.html";
        return;
    }

    $.validator.addMethod("pirateAlias", function(value, element) {
        return this.optional(element) || /^[a-z][@#\$%&]{3}[A-Z][0-9]$/.test(value.trim());
    }, "Alias must be: lowercase, 3 symbols (@#$%&), uppercase, 1 digit.");

    $.validator.addMethod("piratePhone", function(value, element) {
        return this.optional(element) || /^1-\d{3}-\d{3}-\d{4}$/.test(value.trim());
    }, "Phone must follow 1-###-###-####.");

    $("#playerForm").validate({
        rules: {
            firstName: { 
                required: true, 
                maxlength: 30 
            },
            lastName: { 
                required: true, 
                maxlength: 40 
            },
            userName: { 
                required: true, 
                pirateAlias: true 
            },
            phone: { 
                required: true, 
                piratePhone: true 
            },
            city: { 
                required: true,
                maxlength: 55
            },
            email: { 
                required: true, 
                email: true 
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo("#" + element.attr("id") + "Err");
        },
        submitHandler: function(form) {
            const fields = ["firstName", "lastName", "userName", "phone", "city", "email"];
            fields.forEach(field => {
                const storageKey = (field === "userName") ? "username" : field;
                localStorage.setItem(storageKey, $("#" + field).val());
            });
            
            localStorage.setItem("lastVisit", new Date().toLocaleString());
            window.location.href = "game.html";
        }
    });
});