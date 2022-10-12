var data = [
  {"interaction" : 1,
  "etape" : 1,
  "center_ini" : [2.349435,48.8547601],//Long,lat
  "center_f" :  [2.349435,48.8547601],//Long,lat
  "action" : "zoom",
  "time" : 2000,
  "zoom_ini" :19,
  "zoom_f" :  12,
  "enquete" : 1,
  "fdc": "google"},
  {"interaction" : 2,
  "etape" : 1,
  "center_ini" : [6.7986539,45.6372829],
  "center_f" :  [6.7986539,45.6372829],
  "action" : "zoom",
  "time" : 8000,
  "zoom_ini" :11,
  "zoom_f" :  15,
  "enquete" : 2,
  "fdc": "google"},
  {"interaction" : 3,
  "etape" : 1,
  "center_ini" :  [6.7986539,45.6372829],
  "center_f" :  [6.7986539,45.6372829],
  "action" : "zoom",
  "time" : 8000,
  "zoom_ini" :11,
  "zoom_f" :  15,
  "enquete" : 3,
  "fdc": "google"},
  {"interaction" : 4,
  "etape" : 1,
  "center_ini" : [-3.207949,57.3236793],
  "center_f" :  [-3.207949,57.3236793],
  "action" : "zoom",
  "time" : 8000,
  "zoom_ini" :11,
  "zoom_f" :  14,
  "enquete" : 4,
  "fdc": "google"},
  {"interaction" : 5,
  "etape" : 2,
  "center_ini" : [2.349435,48.8547601],
  "center_f" :  [2.349435,48.8547601],
  "action" : "dezoom",
  "time" : 8000,
  "zoom_ini" :19,
  "zoom_f" :  12,
  "enquete" : 1,
  "fdc": "geoportail"},
  {"interaction" : 6,
  "etape" : 2,
  "center_ini" : [6.7986539,45.6372829],
  "center_f" :  [6.7986539,45.6372829],
  "action" : "dezoom",
  "time" : 8000,
  "zoom_ini" :8,
  "zoom_f" :  6,
  "enquete" : 2,
  "fdc": "OSM"},
  {"interaction" : 7,
  "etape" : 2,
  "center_ini" : [-1.5557424,53.8067656],
  "center_f" :  [-1.5557424,53.8067656],
  "action" : "dezoom",
  "time" : 8000,
  "zoom_ini" :19,
  "zoom_f" :  14,
  "enquete" : 3,
  "fdc": "OSM"},
  {"interaction" :8,
  "etape" : 2,
  "center_ini" : [-2.1544301,47.2595307],
  "center_f" :  [-2.1544301,47.2595307],
  "action" : "dezoom",
  "time" : 8000,
  "zoom_ini" :15,
  "zoom_f" :  11,
  "enquete" : 4,
  "fdc": "OSM"},
  {"interaction" : 9,
  "etape" : 3,
  "center_ini" : [-1.5552045,53.8067512],
  "center_f" :  [-1.5475042,53.7945202],
  "action" : "pan",
  "time" : 8000,
  "zoom_ini" :8,
  "zoom_f" :  8,
  "enquete" : 1,
  "fdc": "geoportail"},
  {"interaction" : 10,
  "etape" : 3,
  "center_ini" : [-1.5552045,53.8067512],
  "center_f" :  [-1.5475042,53.7945202],
  "action" : "pan",
  "time" : 2000,
  "zoom_ini" :18,
  "zoom_f" :  8,
  "enquete" : 2,
  "fdc": "google"},
  {"interaction" : 11,
  "etape" : 3,
  "center_ini" : [-73.9863273,40.7055154],
  "center_f" :  [-118.109545,34.0278971],
  "action" : "pan",
  "time" : 8000,
  "zoom_ini" :8,
  "zoom_f" :  8,
  "enquete" : 3,
  "fdc": "geoportail"},
  {"interaction" : 12,
  "etape" : 3,
  "center_ini" : [-73.9863273,40.7055154],
  "center_f" :  [-118.109545,34.0278971],
  "action" : "pan",
  "time" : 8000,
  "zoom_ini" :8,
  "zoom_f" :  8,
  "enquete" : 4,
  "fdc": "geoportail"}
];

var tab= [];
var tab_desorientation = [];
var centre_ini;
var centre_f;
var zoom_ini;
var zoom_f;
var vitesse;
var action;
var etape_suiv;
var interval;
var interval_ajout;
var fdc;
var centre_f_g;
var centre_ini_g
var numero_enquete;
var etape;
var iteratin_max = data.length/4;
// récupération des élèment HTML
var but = document.getElementById("but");
var slider = document.getElementById("myRange");
var valeur_slider = document.getElementById("valeur_slider");
// permet de mettre à jour la valeur du slider
slider.oninput = function() {
  valeur_slider.innerHTML = this.value;
}

var map;
var map_g; 
// initialisation des fond de carte OSM et géoportail 
var raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
  // visible: false
});
var ignlayer = new ol.layer.Tile({
  // Preload infinity c'est pour éviter d'avoir des espaces blancs quand tu navigues sur la carte,
  // À la place, tu as des images pixelisés des données (à voir ce que tu préfères, tu peux l'enlever sinon)
  //preload: "Infinity",
  source: new ol.source.WMTS({
      url: "https://wxs.ign.fr/decouverte/geoportail/wmts",
      layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
      matrixSet: "PM",
      format: "image/png",
      style: "normal",
      dimensions: [256, 256],
      requestEncoding: "KVP",
      tileGrid: new ol.tilegrid.WMTS({
          origin: [-20037508, 20037508],
          resolutions: [
              156543.03392804103, 78271.5169640205, 39135.75848201024, 19567.879241005125, 9783.939620502562,
              4891.969810251281, 2445.9849051256406, 1222.9924525628203, 611.4962262814101, 305.74811314070485,
              152.87405657035254, 76.43702828517625, 38.218514142588134, 19.109257071294063, 9.554628535647034,
              4.777314267823517, 2.3886571339117584, 1.1943285669558792, 0.5971642834779396, 0.29858214173896974,
              0.14929107086948493, 0.07464553543474241
          ],
          matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
      })
  }),
  visible:false
})

/* Déclaration des couches*/
var couches = [raster,ignlayer]; 

/*
fonction toogle : permet de changer le fond de carte (dans le cadre OSM et géoportail) ou de changer la carte visible (google)
*/
function toggle() {
  if (fdc == "geoportail"){
    //réinitialise les visibilites des div
    document.getElementById("map").style.display = "block";
    document.getElementById("map_g").style.display = "none";
    // visibilité du raster geoportail 
    raster.setVisible(false);
    ignlayer.setVisible(true);

  }else if(fdc == "OSM"){
    //réinitialise les visibilites des div
    document.getElementById("map").style.display = "block";
    document.getElementById("map_g").style.display = "none";
    // visibilité du raster OSM     
    raster.setVisible(true);
    ignlayer.setVisible(false);
  }
  else{
    //réinitialise les visibilites des div
    document.getElementById("map").style.display = "none";
    document.getElementById("map_g").style.display = "block";
  }
};



/*
fonction ajout : permet connaitre les coordonnées de la carte 
*/
function ajout(){
  let date = Date.now()
  let zoom;
  let coord;
  if(fdc == "google"){
    zoom = map_g.getZoom();
    let so = [map_g.getBounds().getSouthWest().lat(),map_g.getBounds().getSouthWest().lng()];
    let ne =  [map_g.getBounds().getNorthEast().lat(),map_g.getBounds().getNorthEast().lng()];
    let so_t = ol.proj.transform(so,  'EPSG:4326','EPSG:3857');
    let ne_t = ol.proj.transform(ne, 'EPSG:4326','EPSG:3857');
    coord = [so_t[0],so_t[0],ne_t[1],ne_t[1]];

  }else{
    zoom = map.getView().getZoom();
    coord = map.getView().calculateExtent(map.getSize()); 
  }

  tab.push([date,zoom,coord,etape])
}

/*
fonction animation : permet de créer une animation de la carte (zoom ou pan )
*/
function animation(){
  if(fdc == "google"){
    map_g.setCenter({lat: centre_ini_g[1], lng: centre_ini_g[0]}); 
    map_g.setZoom(zoom_ini);
    // création d'une vue OL 
    const view_g = new ol.View({
      center: centre_ini,
      zoom: zoom_ini
    });
    //synchronisation de la vue avec la cart google
    function sync() {
      const center = ol.proj.transform(view_g.getCenter(), 'EPSG:3857', 'EPSG:4326');
      const cameraOptions = {
        center: new google.maps.LatLng(center[1], center[0]),
        zoom: view_g.getZoom()
      };
      map_g.moveCamera(cameraOptions);
    }
    
    view_g.on(['change:center', 'change:resolution'], sync);
    if( action == "pan"){
      view_g.animate({
        duration: vitesse,
        center: centre_f
      });
    }else{
      view_g.animate({
        duration: vitesse,
        zoom: zoom_f
      });
    }
  }else{
    map.getView().setCenter(centre_ini);
    map.getView().setZoom(zoom_ini);
    if( action == "pan"){
      map.getView().animate({
        duration: vitesse,
        center: centre_f
      });
    }else{
      map.getView().animate({
        duration: vitesse,
        zoom: zoom_f
      });
    }
  }


}
/*
fonction fin : création des fichiers d'export 
*/
function fin(){
  clearInterval(interval);
  clearInterval(interval_ajout);
  let csvContent = "data:text/csv;charset=utf-8," +"time,zoom,xmin,ymin,xmax,ymax,etape\n"
    + tab.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  let nom = "resultat_carte_" + numero_enquete +".csv"
  link.setAttribute("download", nom);
  document.body.appendChild(link); 
  link.click();
  document.getElementById('etape_suivante').removeEventListener('click',etape_suivante);
  console.log(tab_desorientation)
}

/*
fonction etape_suivante : fonction récursive, récupère les donnée de l'etape suivante et met à jour la carte 
*/
function etape_suivante(){
  tab_desorientation.push(slider.value);
  console.log(slider.value)
  slider.value = 2;
  valeur_slider.innerHTML = 2;
  if(etape < iteratin_max ){
    etape +=1;
    clearInterval(interval);
    var id = (etape-1)*4+numero_enquete-1;
    centre_ini = ol.proj.fromLonLat(data[id]["center_ini"]);
    zoom_ini = data[id]["zoom_ini"];
    centre_f = ol.proj.fromLonLat(data[id]["center_f"]);
    zoom_f = data[id]["zoom_f"];
    vitesse = data[id]["time"];
    action = data[id]["action"];
    fdc = data[id]["fdc"];
    centre_f_g = ol.proj.transform(centre_f, 'EPSG:3857', 'EPSG:4326');
    centre_ini_g = ol.proj.transform(centre_ini, 'EPSG:3857', 'EPSG:4326');
    if(fdc == "google"){
      map_g.setCenter({lat: centre_ini_g[1], lng: centre_ini_g[0]}); 
      map_g.setZoom(zoom_ini);
    }else{
      map.getView().setCenter(centre_ini);
      map.getView().setZoom(zoom_ini);
    }
    toggle();
    // animation();
    interval = setInterval(animation,  vitesse+1000) ;    
  }else{
    fin()
  }
}

function debut(value) {
  but.removeChild(document.getElementById("E1"));
  but.removeChild(document.getElementById("E2"));
  but.removeChild(document.getElementById("E3"));
  but.removeChild(document.getElementById("E4"));
  valeur_slider.innerHTML = 2;
  document.getElementById("slidecontainer").style.display = "block";
  numero_enquete = parseInt(value);
  centre_ini = ol.proj.fromLonLat(data[value-1]["center_ini"]);
  zoom_ini = data[value-1]["zoom_ini"];
  centre_f = ol.proj.fromLonLat(data[value-1]["center_f"]);
  zoom_f = data[value-1]["zoom_f"];
  vitesse = data[value-1]["time"];
  action = data[value-1]["action"];
  fdc = data[value-1]["fdc"];
  etape = 1;
  centre_f_g = ol.proj.transform(centre_f, 'EPSG:3857', 'EPSG:4326');
  centre_ini_g = ol.proj.transform(centre_ini, 'EPSG:3857', 'EPSG:4326');
  map_g = new google.maps.Map(document.getElementById("map_g"), {
    center: { lat: centre_ini_g[1], lng: centre_ini_g[0] },
    zoom: zoom_ini
  });
  map = new ol.Map({
    /* Appel des couches de la carte */
    // interactions: olgm.interaction.defaults(),
    layers: couches,
    /* Cible de la div map */
    target: 'map',
    /* Caractéristiques de la vue de la carte */
    view: new ol.View({
        center: centre_ini,
        zoom: zoom_ini
    })
  });
  document.getElementById("map").style.display = "none";

  var r='<button id="etape_suivante" name="envoie">Etape suivante</button>';
  $("#but").append(r);
  document.getElementById('etape_suivante').addEventListener('click',etape_suivante);
  interval = setInterval(animation, vitesse+1000) ;
  interval_ajout = setInterval(ajout, 100) ;
}



  



 
 