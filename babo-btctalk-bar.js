// ==UserScript==
// @name						archive-is
// @namespace				https://bitcointalk.org/
// @description			multi-utility
// @include					https://bitcointalk.org/*
// @require      		https://code.jquery.com/jquery-2.2.4.min.js
// @grant 					window.focus
// ==/UserScript==

var links,thisLink;
const replace = 'https://';
const replaced = 'https://archive.is/?run=1&url=https://';
let loc;

//GM.setValue("foo", "bar");
//console.log(GM.getValue("foo"))

var openAndClose = function(elem) {
  var url = elem.originalTarget.dataset.www;
  let newWindow = window.open(url, '_blank' /*, 'width=300,height=300'*/);
  window.focus();
  console.log('URL', url);

  setTimeout(function(){
    loc = newWindow.location;
    console.log('ARCHIVE', loc);   
    elem.originalTarget.innerText = '✅';
    //newWindow.close();
  }, 2000);
}

function createPageLink() {
  var archivethis     = window.location.href;
	var newHTML         = document.createElement ('div');
	newHTML.innerHTML   = '&nbsp; <span><a data-ref="current" title="archive-is" target="_blank" href="https://archive.is/?run=1&url='+archivethis+'">ARCHIVE 📦</a></span> '+
    ' <span><a data-ref="current" title="short-is" target="_blank" href="https://tinyurl.com/create.php?url='+archivethis+'">SHORT 🔗</a></span>'+
    ' <span id="extraspace">.</span> &nbsp;';
  newHTML.style       = 'position:fixed;top:0;left:0px;border:1px black solid;background:white;font-size:8px;';
  document.body.appendChild(newHTML);
}

function createArchiveLink(archivethis, thisLink, dataattrib) {
	var newHTML         = document.createElement ('span');
	newHTML.innerHTML   = '</a> ['+
    '<a target="_blank" href="https://tinyurl.com/create.php?url='+thisLink+'">🔗</a> '+
    '<a data-ref="'+dataattrib+'" title="archive-is" target="_blank" href="'+archivethis+'">📦</a>'+
    ']';
  thisLink.parentNode.insertBefore(newHTML, thisLink.nextSibling);
}

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

function isBitcointalkLink(thisLink) {
  return thisLink.href.indexOf('bitcointalk') > 0;
}

links = document.evaluate("//a[@href][@class='ul']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i<links.snapshotLength;i++) {
  var thisLink = links.snapshotItem(i);
	if(isBitcointalkLink(thisLink)) {
    var archivethis = thisLink.href.replace(replace, replaced);
    createArchiveLink(archivethis, thisLink, 'one');
  }
}

links = document.evaluate("//div[@class='subject']/a[@href]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i<links.snapshotLength;i++) {
  var thisLink = links.snapshotItem(i);
  if(isBitcointalkLink(thisLink)) {
    var archivethis = thisLink.href.replace(replace, replaced);
    createArchiveLink(archivethis, thisLink, 'two');
  }
}

links = document.evaluate("//a[text()='All']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i<links.snapshotLength;i++) {
  var thisLink = links.snapshotItem(i);
  if(isBitcointalkLink(thisLink)) {
    var archivethis = thisLink.href.replace(replace, replaced);
    createArchiveLink(archivethis, thisLink, 'three');
  }
}

document.querySelectorAll('.new').forEach((elem) => {
  elem.addEventListener('click', openAndClose, false);
});


if(window.location.href.indexOf('action=merit')>-1) {
  setTimeout(function(){
    const sent = document.querySelectorAll("#bodyarea > ul:nth-child(5) > li");
    const received = document.querySelectorAll("#bodyarea > ul:nth-child(7) > li");

    var totalReceived = 0;
    var totalSent = 0;

    received.forEach(receivedTx => {
      const txValue = receivedTx.innerHTML.replace(/^(.*?\: )( for.*)|( from.*)/, "").replace(/(.*: )/, "");
      totalReceived += parseInt(txValue);
    })

    sent.forEach(sentTx => {
      const txValue = sentTx.innerHTML.replace(/^(.*?\: )( for.*)|( to.*)/, "").replace(/(.*: )/, "");
      totalSent += parseInt(txValue);
    })

    const sentH3 = document.querySelector("#bodyarea > h3:nth-child(4)");
    const receivedH3 = document.querySelector("#bodyarea > h3:nth-child(6)");

    var sentNode = document.createTextNode(" (total: " + totalSent + ")");
    var receivedNode = document.createTextNode(" (total: " + totalReceived + ")");
    $('#extraspace').html(' 📊 [MERIT] S:'+totalSent+' R:'+totalReceived);
    sentH3.appendChild(sentNode);
    receivedH3.appendChild(receivedNode);
  }, 500);
}
  
createPageLink();
