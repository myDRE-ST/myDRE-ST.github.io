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
          xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kYzkxYWNhYS01NDUxLTQzNTktOGJiNS1iMmIyMTk4NzdlYmYvIiwiaWF0IjoxNTk2NjQyMDYyLCJuYmYiOjE1OTY2NDIwNjIsImV4cCI6MTU5NjY0NTk2MiwiYWlvIjoiRTJCZ1lEQm83YzJlZnRmdmtZcEd2bU9kN0I5TkFBPT0iLCJhcHBpZCI6IjIyNTEwZDYyLWM3N2ItNDEyZC1iNzE3LWJkNjhkNjkxNjE5MiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2RjOTFhY2FhLTU0NTEtNDM1OS04YmI1LWIyYjIxOTg3N2ViZi8iLCJvaWQiOiI1OWQyZTQ3My1kZDU5LTQ0N2QtOGRjNS02OTdlMWZiNTY4MzYiLCJzdWIiOiI1OWQyZTQ3My1kZDU5LTQ0N2QtOGRjNS02OTdlMWZiNTY4MzYiLCJ0aWQiOiJkYzkxYWNhYS01NDUxLTQzNTktOGJiNS1iMmIyMTk4NzdlYmYiLCJ1dGkiOiJTaXdqOXBtbWdVbUJSYnhwNWhrX0FBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1OTY2MTE2OTJ9.J2HbcvGQTY_duxCl7bj7A4igjJDv2qyXcr6o46RtXqlNubliSbkQyM2odkW3ZKR1ACOSc4mZGEVGRwHZoVuD0NX7T5l6czK7sqwPGMjhvTBg0OWjMjiiZJFm-Y5bAxKVrzA3rVXOe2DxAbrI-yOiqTc1hzywopjUfkLv2k7BxwmEZMYyNLUMG5aqUgBSJx2ghjLU2kLqFUdHBDu-IsN0YRirDNeE6Q6NUPBIW_WmnVYbvtU8Rkho0AHPTOGUIHMdNnX-haNOGPYkv3lVdsCa9B5_4RLM_2-xUEEuT17tbcpcb7q8HNMtpvNUqTN8OBDJv8q93ei57YBIES6sMYTDxw"); 
        },
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