const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: "geoplaylist-1544820108234",
  keyFilename: './geoPlaylist-f9f132b6aca8.json',
});

const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

var LoggedInData = {
  'logInCond' : boolean,
  'display_name': '',
};


doc.get().then(function(doc) {
  if (doc.exists) {
      console.log("Document data:", doc.data());
      amIloggedIn = doc.data().loggedIn
      console.log()
      LoggedInData.logInCond = amIloggedIn;
  } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
  }
}).catch(function(error) {
    console.log("Error getting document:", error);
});


document.getElementById('syncAccount').addEventListener('click', function () {
    var source = document.getElementById('whichSidebar').innerHTML;
    var template = Handlebars.compile(source);
    var html = template(LoggedInData);
    document.getElementById('content').innerHTML = html;
});

