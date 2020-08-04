var raw_cost_per_gb = 0.0510;
var surf_discount_perc = 5;
var surf_admin_perc = 5;
var btw_perc = 21;

function computeStorage(val) {
    var nrGbs = val;

    if(nrGbs < 0) {
        alert("There is a negative number of Gbs! Please fill in a positive number.");
        $("#storage-cost").val(0);
    } else {
        var totalCost = nrGbs*raw_cost_per_gb*((100-surf_discount_perc)/100)*((100+surf_admin_perc)/100)*((100+21)/100);

        $("#storage-cost").val(totalCost.toFixed(2));
    }
}


function setCosts() {
    $("#rawCost").val(raw_cost_per_gb);
    $("#surfDiscount").val(surf_discount_perc);
    $("#surfAdmin").val(surf_admin_perc);
    $("#btw").val(btw_perc);
}


$(document).ready(function() {
    setCosts();
});