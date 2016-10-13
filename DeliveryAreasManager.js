/*****************************************************************************************


    Delivery Areas Manager
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/



/**
    Main
**/

if(true){

options={
    areasNoAreaDisallowed:                                  false,
    mapLocationAlertChangeOnNoRepeat:                       true,
    mapShapesPolygonDraggable:                              false,
    mapLocationChangesMovePolygonsWhenNotDraggable:         false,
    resourcesFolderPath:                                    'resources/',
    localeParams:{
        decimalSeparator:',',
        texts:{
            s1:     "Édition localisation et aires de livraison",
            s2:     "code, nom...",
            s3:     "Adresse, Ville, Code Postal, Code Région...",
        
            m1a:    "Adresse non trouvée !",
            m1b:    "Vous allez être centré sur '",
            m2a:    "Changement de localisation !",
            m2b:    "L'information commerciale ne sera pas changée, seulement la localisation géographique",
            m3a:    "Impossible de trouver l'adresse de la localisation !",
            m3b:    "Retour à la localisation précédente.",
            m4a:    "Nouvelle adresse : ",
            m5a:    "Addresse non trouvée !",
            m5b:    "Essayez en étendant la recherche avec un code postal, le département, la région...",
            }
    }
}

var x=-0.5791799999999512;
var y=44.837789;
//var DAM=new DeliveryAreasManClass({x:x,y:y},null,options);
var DAM=new DeliveryAreasManClass("58, rue des Futaies, Carbon-Blanc",null,options);


// Unic Pentagon
//    var DAM=new DeliveryAreasManClass({x:-0.5791799999999512,y:44.837789},null,options);
    
//    DAM.addArea({charges:[{extra:0,minimum:0},{extra:1,minimum:1},{extra:2,minimum:2}],circle:{origin:{x:-0.5791799999999512,y:44.83778891247021},radius:500.0030110789},polygon:[{x:-0.5791799999999512,y:44.8422805764206},{x:-0.5731557288139584,y:44.839176815097524},{x:-0.5754571201014187,y:44.83415517786771},{x:-0.5829028798984837,y:44.83415517786771},{x:-0.585204271185944,y:44.839176815097524}]});
    
    
//    var DAM=new DeliveryAreasManClass({x:-0.5022179000000051,y:44.9098934},null,options);
//    DAM.addArea({charges:[{extra:0,minimum:0},{extra:0,minimum:0},{extra:0,minimum:0}],circle:{origin:{x:-0.5022179000000051,y:44.9098934},radius:500},polygon:null});
//    DAM.addArea({charges:[{extra:0,minimum:0},{extra:0,minimum:0},{extra:0,minimum:0}],circle:{origin:{x:-0.5022179000000051,y:44.9098934},radius:1000},polygon:null});


}

