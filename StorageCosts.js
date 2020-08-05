/*
* Logic to compute and set storage cost components in DRE Cost estimator
* Written by Jochem Bek, UMC Utrecht
* Last updated: 4-9-2020
*/

var raw_cost_per_gb = 0.0510; // cost per gb per month before taxes ! preferably from MS API call
var surf_discount_perc = 5; // discount in % from SURF-MS contract
var surf_admin_perc = 5; // administration costs in % from SURF contract
var btw_perc = 21; // Dutch VAT taxes in %

// initally set cost components in readonly inputs
function setCostComponents() {
    $("#rawCost").val(raw_cost_per_gb);
    $("#surfDiscount").val(surf_discount_perc);
    $("#surfAdmin").val(surf_admin_perc);
    $("#btw").val(btw_perc);
}

// compute and set costs of storage on gb input
function computeStorageCosts(val) {
    var nr_gbs = val; // number of gbs input 

    if(nr_gbs < 0) { // give error alert and set storage cost to 0 
        alert("There is a negative number of Gbs! Please fill in a positive number."); 
        $("#storageCost").val(0);
    } else { // compute and set storage cost
        var total_cost = nr_gbs*raw_cost_per_gb*((100-surf_discount_perc)/100)*((100+surf_admin_perc)/100)*((100+21)/100); // product of cost components
        $("#storageCost").val(total_cost.toFixed(2));
    }
}

$(document).ready(function() {
    setCostComponents();
});