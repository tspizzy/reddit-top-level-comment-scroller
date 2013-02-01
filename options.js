function save_options() {
  var on = document.getElementById("enable").checked;
  console.log("On: " + on);
  localStorage["RedditCommentScroller_box_enabled"] = on;
}

function restore_options() {
  var value = localStorage["RedditCommentScroller_box_enabled"];
  if (null != value) {
      if (value == 'true')
        document.getElementById("enable").checked = true;
      else
        document.getElementById("enable").checked = false;
  }
  else
    document.getElementById("enable").checked = true;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#saveButton').addEventListener('click', save_options);
