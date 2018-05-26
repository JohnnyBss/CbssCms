let jmsg = {};
jmsg.errorMessage = function (el, msg) {
  let alertHtml = '<div class="alert alert-error" role="alert">' + msg + '</div>';
  $(el).next('.alert').remove();
  $(el).after(alertHtml);
};
jmsg.clearAlertMessage = function (el) {
  $(el).next('.alert').remove();
};