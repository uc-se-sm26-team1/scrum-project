/* =============================================================================
 * EECE/CS 3093C Software Engineering — Lab 1
 * client.js — code skeleton provided by Dr. Phu Phung
 * Code complete implementation by [Your Name]
 * ===============================================================================
 */
var socket = io(); //connect to the Socket.io Server
socket.on("connect", () => {
  //connected to the server
  console.log(`Connected to Socket.io server: 
    ${socket.io.opts.hostname}, port: ${socket.io.opts.port}`);
});

/**
 * code blocks below have been implemented in Lecture 8
 */
// UI DOM references
var sendBtnElm = document.getElementById("send-button");
if (!sendBtnElm) {
  console.log("Error in getting 'send-button' button");
}
// AC-01.2 (UI): Send button click triggers sendMessage()

sendBtnElm.addEventListener("click", sendMessage);
var linkBtnElm = document.getElementById("link-button");
linkBtnElm.addEventListener("click", openLinkPopup);

var chatMessageInput = document.getElementById("chat-message");
if (!chatMessageInput) {
  console.log('Error in getting "chat-message" input');
}
// AC-01.2 (UI): pressing Enter also triggers sendMessage()
chatMessageInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

var linkifyTimer;
var savedLinkRange = null;

var linkPopup = document.getElementById("link-popup");
var linkTextInput = document.getElementById("link-text-input");
var linkAddressInput = document.getElementById("link-address-input");
var cancelLinkButton = document.getElementById("cancel-link-button");
var insertLinkButton = document.getElementById("insert-link-button");
var loggedInUser = "";
setupLinkTools();

// =============================================================================
// Use-Case-01: Send Message
// =============================================================================

function sendMessage() {
  var messageText = chatMessageInput.innerText.trim();
  if (!messageText) return; // AC-02.2: empty messages are ignored

  clearTimeout(linkifyTimer);
  linkifyComposer(false);

  var message = chatMessageInput.innerHTML.trim();
  console.log(`Debug>Chat message: ${message}`); //for UI testing only
  socket.emit("message", message); // other AC will be implemented
  socket.emit("public-stop-typing"); // F1.8: stop typing what message is sent
  chatMessageInput.innerHTML = ""; // AC-01.5: clear input after sending
  chatMessageInput.focus();
}

// =============================================================================
// Use-Case-02: Receive message
// =============================================================================

//TODO: code to implement AC-02.1: display incoming chat messages without page refresh

//TODO: code to implement AC-02.1: display system status events (join/leave) in the status area
// AC-02.2: shows timestamp for each message
socket.on("message", displayMessage);
function displayMessage(data) {
  var d = document.createElement("div");
  d.className = 'message'
  d.id = data._id.toString();
  //AC-02.2: shows timestamp for each message
  var timeStamp = new Date().toLocaleTimeString();
  
  d.innerHTML = "[" + timeStamp + "] "+ data.sender + ' says: ' + data.message;
  if(data.sender === loggedInUser && !data.deleted){
    const button = document.createElement("button");
    button.innerText = "x";
    button.onclick = function(){
      socket.emit("delete-message", data._id.toString());
    }
    d.appendChild(button)
  }
  document.getElementById("responses").appendChild(d);
  //AC-02.3 UI: auto scroll to the latest message
  document.getElementById("responses").scrollTop =
    document.getElementById("responses").scrollHeight;
}
socket.on("message-delete", function(data){
  id_as_str = data._id.toString();
  const msg = document.getElementById(id_as_str)
  var timeStamp = new Date().toLocaleTimeString();
  msg.innerHTML = "[" + timeStamp + "] "+ data.sender + ' says: ' + "This message was deleted";
})

//AC-02.1: display system status events join/leave in the status area
socket.on("status", function (data) {
  var statusElm = document.getElementById("status");
  //AC-02.2 shows timestamp for each message
  var timeStamp = new Date().toLocaleTimeString();
  statusElm.innerHTML = statusElm.innerHTML + "<br>[" + timeStamp + "] " + data;
  //AC-02.3 UI: auto scroll to the latest message
  statusElm.scrollTop = statusElm.scrollHeight;
});

socket.on("chat_history", function (chat_history) {
  if (chat_history && chat_history.length > 0) {
    var responsesElm = document.getElementById("responses");

    chat_history.forEach(function (data) {
      var d = document.createElement("div");
      d.id = data._id.toString()
      d.className = 'message'
      var timeStamp = new Date(data.timestamp).toLocaleTimeString();
      
      d.innerHTML = "[" + timeStamp + "] "+ data.sender + ' says: ' + data.message;
      if(data.sender === loggedInUser && !data.deleted){
        const button = document.createElement("button");
        button.innerText = "x";
        button.onclick = function(){
          socket.emit("delete-message", data._id.toString());
        }
        d.appendChild(button)
      }
      
      responsesElm.appendChild(d);
    });

    responsesElm.scrollTop = responsesElm.scrollHeight;
  }
});

var joinedChat = false;
var loginUI = document.getElementById("loginUI");
var registerUI = document.getElementById("registerUI");
var chatUI = document.getElementById("chatUI");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var joinBtnElm = document.getElementById("join-button");
var loginErrorElm = document.getElementById("login-error");
var registerErrorElm = document.getElementById("register-error");

document.getElementById("showRegisterBtn").addEventListener("click", function () {
  loginUI.style.display = "none";
  registerUI.style.display = "";
  loginErrorElm.textContent = "";
});

document.getElementById("showLoginBtn").addEventListener("click", function () {
  registerUI.style.display = "none";
  loginUI.style.display = "";
  registerErrorElm.textContent = "";
});

document.getElementById("registerBtn").addEventListener("click", registerAccount);

function registerAccount() {
  const username = document.getElementById("reg-username").value;
  const pattern = /^\w{3,20}$/;

  if (!username || !pattern.test(username)) {
    registerErrorElm.textContent =
      "Username cannot be empty and must be between 3-20 characters!";
    return;
  }

  const password = document.getElementById("reg-password").value;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (!password || !passwordPattern.test(password)) {
    registerErrorElm.textContent =
      "Password must be at least 6 characters long and contain both letters and numbers.";
    return;
  }

  registerErrorElm.textContent = "";
  socket.emit("register", { username: username, password: password });
}

socket.on("register-success", function (username) {
  registerUI.style.display = "none";
  loginUI.style.display = "";
  registerErrorElm.textContent = "";
  loginErrorElm.textContent =
    "Account '" + username + "' created! You can now log in.";
});

socket.on("register-error", function (message) {
  registerErrorElm.textContent = message;
});

if (!joinBtnElm) {
  console.log("Error in getting 'join-button' button");
}
joinBtnElm.addEventListener("click", joinChat);

passwordInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") joinChat();
});

function joinChat() {
  var username = usernameInput.value.trim();
  var password = passwordInput.value;
  var pattern = /^\w{3,20}$/;

  if (!username || !pattern.test(username)) {
    showJoinError("Username cannot be empty and must be between 3-20 characters long");
    return;
  }

  if (!password) {
    showJoinError("Password is required");
    return;
  }

  socket.emit("join-chat", { username: username, password: password });
}

function showJoinError(message) {
  loginErrorElm.textContent = message;
}

socket.on("join-success", function (username) {
  loggedInUser = username;
  joinedChat = true;
  loginErrorElm.textContent = "";
  loginUI.style.display = "none";
  registerUI.style.display = "none";
  chatUI.style.display = "";
  console.log("Debug> Joined chat as " + username);
  chatMessageInput.focus();
});

socket.on("join-error", function (message) {
  showJoinError(message);
});

socket.on("not-authorized", function () {
  joinedChat = false;
  chatUI.style.display = "none";
  loginUI.style.display = "";
  showJoinError("Please join the chat before sending messages");
});

//when user joins/leave update list
socket.on("user-list", function (data) {
  var userlist = document.getElementById("user-list");
  //clear
  userlist.innerHTML = "";
  //iterate through array of users and append
  data.forEach((user) => {
    var list = document.createElement("div");
    list.innerHTML = user;
    userlist.appendChild(list);
  });
});

//helper functions for links

function refreshComposerLinks(e) {
  //converts pasted links instantly but waits for typed out links
  var isDelete = e && e.inputType && e.inputType.indexOf("delete") === 0;
  var isPaste = e && e.inputType === "insertFromPaste";
  var delay = isPaste || isDelete ? 0 : 500;

  clearTimeout(linkifyTimer);

  linkifyTimer = setTimeout(function () {
    linkifyComposer(isDelete, isPaste);
  }, delay);
}

function linkifyComposer(isDelete, allowEndOfText) {
  //convert to link (but deleting characters doesnt change link/href)
  if (!isDelete) {
    updateExistingLinkHrefs(chatMessageInput);
  }

  var oldHtml = chatMessageInput.innerHTML;
  var newHtml = linkifyHtml(oldHtml, allowEndOfText);

  if (oldHtml !== newHtml) {
    chatMessageInput.innerHTML = newHtml;
    placeCursorAtEnd(chatMessageInput);
  }
}

function linkifyHtml(html, allowEndOfText) {
  //make text not in <a> links w/o changing existing <a> tags
  var urlPattern = allowEndOfText
    ? /https?:\/\/(?=[^\s<]*\.)[^\s<]+(?=\s|&nbsp;|<|$)/g
    : /https?:\/\/(?=[^\s<]*\.)[^\s<]*?(?=\s|&nbsp;)/g;

  return html
    .split(/(<a\b[^>]*>.*?<\/a>)/gi)
    .map(function (part) {
      if (part.indexOf("<a") === 0) {
        return part;
      }

      return part.replace(urlPattern, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
    })
    .join("");
}

function openComposerLink(e) {
  //open in new tab
  var link = e.target.closest("a");

  if (link && chatMessageInput.contains(link)) {
    e.preventDefault();
    window.open(link.href, "_blank");
  }
}

function updateExistingLinkHrefs(root) {
  var links = root.querySelectorAll("a");

  links.forEach(function (link) {
    var visibleText = link.innerText.trim();

    if (/^https?:\/\/(?=[^\s<]*\.)[^\s<]+$/.test(visibleText)) {
      link.href = visibleText;
    }
  });
}

function openLinkPopup(e) {
  e.preventDefault();
  saveComposerSelection();

  var selectedText = savedLinkRange ? savedLinkRange.toString() : "";
  linkTextInput.value = selectedText;
  linkAddressInput.value = "";
  updateInsertLinkButton();
  linkPopup.showModal();

  if (selectedText) {
    linkAddressInput.focus();
  } else {
    linkTextInput.focus();
  }
}

function closeLinkPopup(e) {
  e.preventDefault();
  linkPopup.close();
}

function insertLinkFromPopup(e) {
  e.preventDefault();

  var href = linkAddressInput.value.trim();
  var text = linkTextInput.value.trim() || href;

  if (!isValidLinkAddress(href)) return;

  var link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.innerText = text;

  var range = getLinkInsertRange();
  range.deleteContents();
  range.insertNode(link);
  range.setStartAfter(link);
  range.collapse(true);

  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  savedLinkRange = range.cloneRange();

  linkPopup.close();
}

function getLinkInsertRange() {
  if (
    savedLinkRange &&
    chatMessageInput.contains(savedLinkRange.commonAncestorContainer)
  ) {
    return savedLinkRange;
  }

  var range = document.createRange();
  range.selectNodeContents(chatMessageInput);
  range.collapse(false);
  return range;
}

function saveComposerSelection() {
  var selection = window.getSelection();

  if (!selection.rangeCount) return;

  var range = selection.getRangeAt(0);

  if (chatMessageInput.contains(range.commonAncestorContainer)) {
    savedLinkRange = range.cloneRange();
  }
}

function updateInsertLinkButton() {
  insertLinkButton.disabled = !isValidLinkAddress(
    linkAddressInput.value.trim(),
  );
}

function isValidLinkAddress(address) {
  return /^https?:\/\//.test(address);
}

function placeCursorAtEnd(element) {
  var range = document.createRange();
  var selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);
}

function setupLinkTools() {
  chatMessageInput.addEventListener("input", refreshComposerLinks);
  chatMessageInput.addEventListener("click", openComposerLink);
  chatMessageInput.addEventListener("keyup", saveComposerSelection);
  chatMessageInput.addEventListener("mouseup", saveComposerSelection);

  cancelLinkButton.addEventListener("click", closeLinkPopup);
  insertLinkButton.addEventListener("click", insertLinkFromPopup);
  linkAddressInput.addEventListener("input", updateInsertLinkButton);
  linkPopup.addEventListener("close", function () {
    chatMessageInput.focus();
  });
}

//Use Case F1.5
var privateToInput = document.getElementById("private-to");
var privateMsgInput = document.getElementById("private-message");
var privateSendBtn = document.getElementById("private-send-button");
var privateResponses = document.getElementById("private-responses");

if (
  !privateSendBtn ||
  !privateToInput ||
  !privateMsgInput ||
  !privateResponses
) {
  console.log("Error getting private chat elements");
}

privateSendBtn.addEventListener("click", sendPrivateMessage);

privateMsgInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendPrivateMessage();
  }
});

function sendPrivateMessage() {
  var to = privateToInput.value.trim();
  var text = privateMsgInput.innerText.trim();
  if (!to || !text) return;

  console.log(`Debug>Private message to ${to}: ${text}`);
  socket.emit("private-message", { to: to, text: text });

  privateMsgInput.innerHTML = "";
  privateMsgInput.focus();
}

socket.on("private-message", function (data) {
  var d = document.createElement("div");
  var timeStamp = new Date(data.timestamp).toLocaleTimeString();
  var direction =
    data.from === document.getElementById("username").value
      ? "to " + data.to
      : "from " + data.from;
  d.innerHTML = "[" + timeStamp + "] (" + direction + "): " + data.text;
  privateResponses.appendChild(d);
  privateResponses.scrollTop = privateResponses.scrollHeight;
});

socket.on("private-message-error", function (errMsg) {
  var d = document.createElement("div");
  var timeStamp = new Date().toLocaleTimeString();
  d.innerHTML = "[" + timeStamp + "] Error: " + errMsg;
  privateResponses.appendChild(d);
  privateResponses.scrollTop = privateResponses.scrollHeight;
});

// (F1.8) Typing Status Indicator - Public and Private Chat
var publicTypingStatus = document.getElementById("public-typing-status");
var privateTypingStatus = document.getElementById("private-typing-status");

var publicTypingTimer;
var privateTypingTimer;

// Public chat typing
chatMessageInput.addEventListener("input", function () {
  socket.emit("public-typing");

  clearTimeout(publicTypingTimer);
  publicTypingTimer = setTimeout(function () {
    socket.emit("public-stop-typing");
  }, 1000);
});

socket.on("public-typing", function (username) {
  publicTypingStatus.innerText = username + " is typing...";
});

socket.on("public-stop-typing", function (username) {
  if (
    publicTypingStatus.innerText ===
    username + " is typing..."
  ) {
    publicTypingStatus.innerText = "";
  }
});

// Private chat typing
privateMsgInput.addEventListener("input", function () {
  var to = privateToInput.value.trim();

  if (!to) {
    return;
  }

  socket.emit("private-typing", { to: to });

  clearTimeout(privateTypingTimer);
  privateTypingTimer = setTimeout(function () {
    socket.emit("private-stop-typing", { to: to });
  }, 1000);

  socket.on("private-typing", function (username) {
    privateTypingStatus.innerText =
      username + " is typing...";
  });

  socket.on("private-stop-typing", function (username) {
    if (
      privateTypingStatus.innerText ===
      username + " is typing..."
    ) {
      privateTypingStatus.innerText = "";
    }
  });
});

//Show Account Management Page
document.getElementById("ChangeAccountInfo").addEventListener("click", function(){
  $('#chatUI').hide();
  $('#AccountManagement').show();
});

//Go back to chatUI

document.getElementById('goto-chat').addEventListener('click', function(){
  $('#chatUI').show();
  $('#AccountManagement').hide();
});

var currentPasswordInput = document.getElementById("current-password");
var editNewPasswordInput = document.getElementById("edit-new-password");
var editProfileButton = document.getElementById("edit-profile-button");
var editProfileMessage = document.getElementById("edit-profile-message");

editProfileButton.addEventListener("click", function (e) {
  e.preventDefault();

  var oldPassword = currentPasswordInput.value;
  var newPassword = editNewPasswordInput.value;

  if (!oldPassword || !newPassword) {
    editProfileMessage.style.color = "red";
    editProfileMessage.textContent = "Please fill in both fields.";
    return;
  }

  socket.emit("edit-profile", { oldPassword: oldPassword, newPassword: newPassword });
});

socket.on("edit-profile-success", function () {
  editProfileMessage.style.color = "green";
  editProfileMessage.textContent = "Password changed successfully.";
  currentPasswordInput.value = "";
  editNewPasswordInput.value = "";
});

socket.on("edit-profile-error", function (message) {
  editProfileMessage.style.color = "red";
  editProfileMessage.textContent = message;
});