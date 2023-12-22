let isRecaptchaValidated = false;



function toggleRecaptchaFormMessage(type = "error", hide = false) {
  isRecaptchaValidated = false;
  document.getElementById(`recaptcha-form-${type}`).style.display = hide
    ? "none"
    : "inherit";
}

function onRecaptchaSuccess() {
  isRecaptchaValidated = true;
}

function onRecaptchaError() {
  isRecaptchaValidated = false;
  toggleRecaptchaFormMessage("error");
  toggleRecaptchaFormMessage("success", true);
}

function onRecaptchaResponseExpiry() {
  onRecaptchaError();
}

$(function () {
    const recaptchaForm = $("#contactForm");

    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {   
            // failure
            if (!isRecaptchaValidated) {
                toggleRecaptchaFormMessage("error");
                toggleRecaptchaFormMessage("success", true);
                return;
            }

            if (window.grecaptcha){
                grecaptcha.reset();
                isRecaptchaValidated = false;
            } 
        },
        submitSuccess: function ($form, event) {
            event.preventDefault();
            // failure
            if (!isRecaptchaValidated) {
                toggleRecaptchaFormMessage("error");
                toggleRecaptchaFormMessage("success", true);
                return;
            }

            // success
            toggleRecaptchaFormMessage("error", true);
            toggleRecaptchaFormMessage("success");

            var name = $("#contactForm input#name").val();
            var email = $("#contactForm input#email").val();
            var message = $("#contactForm textarea#message").val();
            // var subject = $("#contactForm input#subject").val();
            var phone = $("#contactForm input#phoneNumber").val();
            
            // console.log(name, email, message, subject);

            $this = $("#sendMessageButton");
            $this.prop("disabled", true);

            $.ajax({
                url: "/mail/contact.php",
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    message: message,
                    // subject:subject,
                    phone:phone

                },
                cache: false,
                success: function (returnval) {
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                    $('#success > .alert-success')
                            .append("<strong>Thank you for taking the time to fill out our form. We will do our best to get back to you within 24-48 hours.</strong>");
                    $('#success > .alert-success')
                            .append('</div>');
                    // $('#contactForm').trigger("reset");
                },
                error: function (returnval) {
                    if (window.grecaptcha) {
                        isRecaptchaValidated = false;
                        toggleRecaptchaFormMessage("error",true);
                        toggleRecaptchaFormMessage("success",true);
                        grecaptcha.reset();
                        
                    }
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                    $('#success > .alert-danger').append($("<strong>").text("Sorry " + name + ", it seems that our mail server is not responding. Please try again later!"));
                    $('#success > .alert-danger').append('</div>');
                    // $('#contactForm').trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name').focus(function () {
    $('#success').html('');
});
