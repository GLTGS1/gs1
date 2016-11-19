$(document).ready(function(){
                  //alert (window.sessionStorage.uuid);
                  // checkBarCodeFromServer("47869121");
                  });

var currentDate;

var pref1 = false;
var pref2 = false;

var barcode1 = "";
var barcode2 = "";

$("#scan").click(function(){
                 
                 
                 
                 });

function afterScan(code){
    
    //alert ("after scan");
    
    
    code = encodeURIComponent(code);
    
    //alert (typeof code);
    
    var temp = code.split("%1D");
    var tempCode = "";
    
    for (var i=0;i<temp.length; i++){
        
        if (i == (temp.length-1)){
            tempCode += temp[i];
        } else {
            tempCode += temp[i] + "<GS>";
        }
        
    }
    
    
    var temp1 = tempCode.split("<");
    var tBarcode = "";
    
    for (var j=0;j<temp1.length; j++){
        
        if (j == (temp1.length-1)){
            tBarcode += temp1[j];
        } else {
            tBarcode += temp1[j] + "&lt;";
        }
        
        
    }
    
    $("#scanResult").html(tBarcode);
    
    barcode1 = tempCode;
    
}


$("#verify").click(function(){
                   
                   //alert (window.sessionStorage.code);
                   //return false;
                   //alert (barcode1 + " - " + barcode2);
                   
                   if (barcode1 == ""){
                   navigator.notification.alert ("Material code not scanned.", null, window.sessionStorage.alertTitle);
                   return false;
                   }
                   
                   //                   if (barcode2 == ""){
                   //                        navigator.notification.alert ("Lot code not scanned.", null, window.sessionStorage.alertTitle);
                   //                        return false;
                   //                   }
                   
                   //alert (barcode1 + " - " + barcode2);
                   
                   getLocation();
                   
                   });

var lat = "0";
var lng = "0";

function getLocation(){
    
    startLoader();
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 5000, enableHighAccuracy: true  });
    
    
    function onSuccess(position) {
        
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        
        //alert(position.coords.latitude +"\n"+ position.coords.longitude );
        
        stopLoader();
        
        checkBarCodeFromServer();
        
    }
    
    function onError(error) {
        
        stopLoader();
        //uploadImages();
        
        //navigator.notification.alert ("Please check mobile location settings.", null, window.sessionStorage.alertTitle);
        
        checkBarCodeFromServer();
        
    }
    
}


function checkBarCodeFromServer(){
    
    //alert ("Check Bar code from server");
    
    //alert (barcode1);
    
    
    var url = window.sessionStorage.serviceUrl + "CheckUDI";
    startLoader();
    
    console.log(url + "?Barcode=" + barcode1 + "&Lotcode=&IMEIcode="+ window.sessionStorage.uuid + "&Lat=0&Long=0&Details=");
    
    $.ajax({
           type : "GET",
           cache: false,
           url : url,
           data : {
           Barcode : barcode1,
           Lotcode : "",
           IMEIcode : window.sessionStorage.uuid,
           Lat : lat,
           Long : lng,
           Details : ""
           },
           success : function(response) {
           //alert (response);
           stopLoader();
           
           var result = eval('(' + response + ')');
           //alert (result.data[0].result);
           
           //$("#resultsTbl").html("");
           
           var tStatusImgSrc = "";
           var tLotNo = "";
           
           if ((result.data[0].result).toLowerCase() == "yes"){
           //tStatusImgSrc = "img/yes.png";
           //tLotNo = result.data[1].lotcode;
           
           $("#verifyStatus").attr("src", "img/yes.png");
           $("#scanResultText").html("Compliance");
           $("#verifyStatus").show();
           $("#scanResultText").show();
           
           } else if ((result.data[0].result).toLowerCase() == "no"){
           //tStatusImgSrc = "img/no.png";
           //tLotNo = result.data[1].lotcode;
           
           $("#verifyStatus").attr("src", "img/no.png");
           $("#scanResultText").html("Not Compliant");
           $("#verifyStatus").show();
           $("#scanResultText").show();
           } else {
           //tStatusImgSrc = "img/notfound.png";
           //tLotNo = "-";
           
           $("#verifyStatus").attr("src", "img/notfound.png");
           $("#scanResultText").html("Invalid");
           $("#verifyStatus").show();
           $("#scanResultText").show();
           }
           
           },
           error: function (error){
           stopLoader();
           navigator.notification.alert ("There is a trouble, try again", null, window.sessionStorage.alertTitle);
           }
           });
    
}

$("#reset").click(function(){
                  
                  $("#scanResult").html("<br>");
                  $("#scan1Result").html("<br>");
                  
                  barcode1 = "";
                  barcode2 = "";
                  
                  $("#verifyStatus").hide();
                  
                  });

$("#log").click(function(){
                window.location.href = "reports.html";
                });
