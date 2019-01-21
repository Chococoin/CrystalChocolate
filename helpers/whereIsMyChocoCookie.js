var thereIsaChocoCookie = function(){
  if (myChocoCookie !== null){
    oauther.style.display = "none";
    var data;
    fetch('https://api.github.com/user?access_token='+ myChocoCookie)
    .then(response => {
      return response.json();
    }).then( dat => {
      data = dat;
      console.log(data);
      var img = document.createElement('IMG');
      img.setAttribute("src", data.avatar_url);
      img.setAttribute("width", "150");
      img.setAttribute("height", "150");
      document.getElementById('start').appendChild(img);
    }).catch(error => console.log(error));
  }
}

module.exports = thereIsaChocoCookie;