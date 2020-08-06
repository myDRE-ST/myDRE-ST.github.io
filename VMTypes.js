/*
* Logic to recommend and display VM types on user input
* Written by Jochem Bek, UMC Utrecht
* Last updated: 5-9-2020
*/


function getDetails() {
    /* MS Azure Rate Card API doesn't have CORS header configured, which will result in browsers stopping direct request
    * therefore, use the herokuapp below to add proxy server that adds CORS header. Read more here: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
    * Unfortunately, this creates quite a bit of 
    */
    var cors_anywhere_url = "https://cors-anywhere.herokuapp.com/";

    $.ajax({

        


        //url: `${cors_anywhere_url}https://ratecard.azure-api.net/ratecards/V1/27d96b24-db2f-4847-b3a0-d556072000f6/MS-AZR-0003P/USD/en/False/V20160831Preview/2020-08-01.json?sv=2018-03-28&sr=b&sig=fWOnzaNQDGz2jjg8ZxbBmIuCjDPAlVQk25E8pSvg52U%3D&se=2020-08-05T10%3A21%3A34Z&sp=r`,
        url: `https://management.azure.com/subscriptions/78240be1-b35a-4b11-a390-c408e3100d28/providers/Microsoft.Compute/skus?api-version=2019-04-01$filter=location%20eq%20'ukwest'`,            
        type: 'GET',
        beforeSend: function(xhr) { 
          xhr.setRequestHeader("Authorization",)},
        success: function (data) {
            console.log(data.value);
        },
        error: function(err){
          alert("Cannot get data");
          //console.log(err);
        }
    });

};

function findTypes() {
    var nr_cores = $("#nrCores").val();
    var nr_ram = $("#nrGb").val();


}

$(document).ready(function() {
    getDetails();
});