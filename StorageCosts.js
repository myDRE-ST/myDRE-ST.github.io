/*
 * Logic to compute and set storage cost components in DRE Cost estimator
 * Written by Jochem Bek, UMC Utrecht
 * Last updated: 4-9-2020
 */

var raw_cost_per_gb = 0.051; // cost per gb per month before taxes ! preferably from MS API call
var surf_discount_perc = 3; // discount in % from SURF-MS contract
var surf_admin_perc = 7; // administration costs in % from SURF contract
var btw_perc = 21; // Dutch VAT taxes in %

var cost_per_gb;

// initally set cost components in readonly inputs
function setCostComponents(val) {
  if (val.checked) {
    // if on surfcumulus contract

    $("#surfComp").show();
    cost_per_gb =
      raw_cost_per_gb *
      ((100 - surf_discount_perc) / 100) *
      ((100 + surf_admin_perc) / 100) *
      ((100 + btw_perc) / 100);

    $("#rawCost").val(raw_cost_per_gb);
    $("#surfDiscount").val(surf_discount_perc);
    $("#surfAdmin").val(surf_admin_perc);
    $("#btw").val(btw_perc);
    $("#netCost").val(cost_per_gb.toFixed(3));
  } else {
    $("#surfComp").hide();
    // if not on surfcumulus contract
    cost_per_gb = raw_cost_per_gb * ((100 + btw_perc) / 100);
    $("#rawCost").val(raw_cost_per_gb);
    $("#btw").val(btw_perc);
    $("#netCost").val(cost_per_gb.toFixed(3));
  }

  console.log($("#popover-content").html());
  showComponentInfo();

  $("#numberGbs").trigger("change");
}

// set contents of popover
function showComponentInfo() {
  $("#popoverCostComponents").popover({
    html: true,
    sanitize: false,
    title: function () {
      return $("#popover-head").html();
    },
    content: function () {
      return $("#popover-content").html();
    },
  });

  togglePopovers();
}

// activate popover functionality
function togglePopovers() {
  $('[data-toggle="popover"]').popover();
}

// compute and set costs of storage on gb input
function computeStorageCosts(val) {
  var nr_gbs = val; // number of gbs input

  if (nr_gbs < 0) {
    // give error alert and set storage cost to 0
    $("#numberGbs").addClass("is-invalid");
    $("#storageCost").val(0);
  } else {
    // compute and set storage cost
    var total_cost = nr_gbs * cost_per_gb;
    $("#storageCost").val(total_cost.toFixed(2));
  }
}

$(document).ready(function () {
  $("#surfcumulus").trigger("click");
});
