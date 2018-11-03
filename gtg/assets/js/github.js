var url = window.location.href;

if (url.indexOf('github.io') !== -1){

    var i=0;
    var images = document.getElementsByTagName('img');
    var images_length = images.length;
    for (i=0; i<images_length;i++){
        images[i].src = images[i].src.replace('library','gtg/library');
    }

    var links = document.getElementsByTagName('a');
    var links_length = links.length;
    for (i=0; i<links_length;i++){
        if (links[i].href.indexOf('github.io/gtg') !== -1){
            links[i].href = links[i].href.replace('github.io','github.io/gtg');
        }
    }

}