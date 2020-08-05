/*
* Logic to recommend and display VM types on user input
* Written by Jochem Bek, UMC Utrecht
* Last updated: 5-9-2020
*/

let getOptionsPromise = new Promise((resolve, reject) => {
    $.getJSON("https://gist.githubusercontent.com/JochemBek/98643e51feccf93dd536bb24fa07e9e2/raw/0067a0d18a4a264b5f74fe6a9093fc803c4d9e88/virtualmachines.json")
    .done(function( data ) {
        $.each( data, function( key, val ) { // for each of the VM types in the json data
            
            
        });
        resolve("Success!");
    }).fail(function() {
        reject("Error!");
    });
});

function findTypes() {
    var nr_cores = $("#nrCores").val();
    var nr_ram = $("#nrGb").val();


}

$(document).ready(function() {
    getOptionsPromise.then((message) => {
        addVM();
    }).catch((message) => {
    });
});