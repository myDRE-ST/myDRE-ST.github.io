/*
 * Logic to add/del/copy Virtual Machines (VM) and compute their costs in DRE Cost estimator
 * Written by Jochem Bek, UMC Utrecht
 * Last updated: 30-1-2022
 */

var surf_discount_perc = 3; // discount in % from SURF-MS contract
var surf_admin_perc = 5; // administration costs in % from SURF contract
var btw_perc = 21; // Dutch VAT taxes in %

// vars occupied in getOptionsPromise
var dd_options = []; // html string of option elements for VM types to be added to select element in VM cards
var vm_prices = []; // prices per hour with VM type as key
var vm_ram = []; // RAM size with VM type as key
var vm_cpu = []; // number of cpu cores with VM type as key

// vars occupied in getOsDiskPromise
var osdisk_options = []; // html string of option elements for OS disk types to be added to select element in VM cards
var osdisk_prices = []; // prices per month for os disk
var osdisk_sizes = []; // disk size in GiB

// promise to get VM types 
let getOptionsPromise = new Promise((resolve, reject) => {
  $.getJSON(
    "https://gist.githubusercontent.com/JochemBek/8bb12bdeaeba29e634f234344d541b75/raw/6004472b9494e6948aa15222292d23643fe996de/virtualmachinesnew.json"
  )
    .done(function (data) {
      $.each(data, function (k, val) {

        var key = val["name"];
        // for each of the VM types in the json data
        vm_prices[key] = parseFloat(
          val["windowsPrice"]
        ); // set price for VM type key
        vm_ram[key] = val["memoryInMB"]; // set RAM size for VM type key (MBs)
        vm_cpu[key] = val["numberOfCores"]; // set number of cpu cores for VM type key

        if (key == "Standard_B2s") {
          // add B2S type as selected default option to html string
          dd_options.push(
            "<option value='" + key + "' selected>" + key + "</option>"
          );
        } else {
          // add other VM types as options to html string
          dd_options.push("<option value='" + key + "'>" + key + "</option>");
        }
      });
      resolve("Success!");
    })
    .fail(function () {
      reject("Error!");
    });
});

// promise to get os disk types
let getOsDiskPromise = new Promise((resolve, reject) => {
  $.getJSON(
    "https://gist.githubusercontent.com/myDRE-ST/f0cd39d726fde77902f8a9f2f35673e4/raw/1dd1434fcd4784feeafc119959be1130fa82b54f/osdisk.json"
  )
    .done(function (data) {
      $.each(data, function (key, val) {
        // for each of the os disks in the json data
        osdisk_prices[key] = parseFloat(
          val["Prijs per maand"].replace("€", "").replace(",", ".")
        ); // set price for os disk
        osdisk_sizes[key] = val["Schijfgrootte"]; // set number of cpu cores for VM type key

        if (key == "E10") {
          // add E10 type as selected default option to html string
          osdisk_options.push(
            "<option value='" + key + "' selected>" + key + "</option>"
          );
        } else {
          // add other VM types as options to html string
          osdisk_options.push("<option value='" + key + "'>" + key + "</option>");
        }
      });
      resolve("Success!");
    })
    .fail(function () {
      reject("Error!");
    });
});

var running_id = 0; // running numeric id of VMs

// add a VM on +-button click
function addVM() {
  running_id = running_id + 1;

  // html string for VM card, each element where necessary gets VM id added to id-tag or value-tag
  var vm_section =
    `<div id="vm-` +
    running_id +
    `" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="card border-primary vm-instance">
                        <div class="card-header">VM ` +
    running_id +
    `
                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                            <button class="btn btn-danger" value="` +
    running_id +
    `" data-toggle="tooltip" data-placement="left" title="Delete this VM" onclick="deleteVM(this.value);"> <i class="fa fa-trash"></i></button>
                            <button class="btn btn-outline-secondary" value="` +
    running_id +
    `" data-toggle="tooltip" data-placement="right" title="Copy this VM configuration" onclick="copyVM(this.value)"> <i class="fa fa-copy"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <label for="vm-` +
    running_id +
    `-type">VM Type</label>
                            <div class="input-group mb-3">
                            <select id="vm-` +
    running_id +
    `-type" class="custom-select vm-input" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                            ` +
    dd_options +
    `
                            </select>
                            </div>
          
                            <div class="mb-3">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cpu" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                            </svg>
                            <span id="vm-` +
    running_id +
    `-Cores"></span> CPU cores
                            <br>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hdd-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                <path d="M.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z"/>
                            </svg>
                            <span id="vm-` +
    running_id +
    `-RAM"></span> MB RAM
                            </div>

                            <label for="osdisk-` +
                            running_id +
                                `-type">OS disk</label>
                                                        <div class="input-group mb-3">
                                                        <select id="osdisk-` +
                                running_id +
                                `-type" class="custom-select vm-input" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                                                        ` +
                                osdisk_options +
                                `
                            </select>
                            </div>

                            <hr>
                            <label for="vm-` +
    running_id +
    `-hours"> Hours/month </label>
                            <a id="popoverCostComponents" class="float-right" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="Not so sure?" data-content="We recommend 180 hours. Your VM is then running 9-5 on all weekdays. Should the VM be always-on? Then fill in 750 hours.">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                                    <circle cx="8" cy="4.5" r="1"/>
                                </svg>
                            </a>
                            <div class="input-group mb-3">
                            <input id="vm-` +
    running_id +
    `-hours" type="number" max="750" min="0" step="5" class="form-control vm-input" pattern="\d+" placeholder="0" aria-describedby="basic-addon2" onchange="setVMCosts(this);setBottomline();">
                            <div class="input-group-append">
                                <span class="input-group-text" id="basic-addon2">h</span>
                            </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="input-group mb-0">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">€</span>
                            </div>
                            <output type="number" id="vm-` +
    running_id +
    `-cost" step=0.001 placeholder="0.00" class="form-control piece-cost" readonly></output>
                            </div>
                        </div>
                        </div>
                    </div>`;

  $("#vmDeck").append(vm_section); // append VM card to VM deck

  $("#vm-" + running_id + "-type").trigger("change"); // trigger onchange so that cpu cores and RAM are updated

  toggleTooltips();
  togglePopovers();
}

// copy a VM on copy-button click
function copyVM(val) {
  running_id = running_id + 1;

  // html string for VM card, each element where necessary gets VM id added to id-tag or value-tag
  var vm_section =
    `<div id="vm-` +
    running_id +
    `" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="card border-primary vm-instance">
                        <div class="card-header">VM ` +
    running_id +
    `
                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                            <button class="btn btn-danger" value="` +
    running_id +
    `" tabindex="0" data-toggle="tooltip" data-placement="left" title="Delete this VM" onclick="deleteVM(this.value)"> <i class="fa fa-trash"></i></button>
                            <button class="btn btn-outline-secondary" value="` +
    running_id +
    `" tabindex="0" data-toggle="tooltip" data-placement="right" title="Copy this VM configuration" onclick="copyVM(this.value)"> <i class="fa fa-copy"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <label for="vm-` +
    running_id +
    `-type">VM Type</label>
                            <div class="input-group mb-3">
                            <select id="vm-` +
    running_id +
    `-type" class="custom-select vm-input" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                            ` +
    dd_options +
    `
                            </select>
                            </div>
                            <div class="mb-3">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cpu" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                            </svg>
                            <span id="vm-` +
    running_id +
    `-Cores"></span> CPU cores
                            <br>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hdd-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                <path d="M.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z"/>
                            </svg>
                            <span id="vm-` +
    running_id +
    `-RAM"></span> MB RAM
                            </div>

                            <label for="osdisk-` +
                            running_id +
                                `-type">OS disk</label>
                                                        <div class="input-group mb-3">
                                                        <select id="osdisk-` +
                                running_id +
                                `-type" class="custom-select vm-input" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                                                        ` +
                                osdisk_options +
                                `
                            </select>
                            </div>

                            <hr>         
                            <label for="vm-` +
    running_id +
    `-hours"> Hours/month </label>
                            <a id="popoverCostComponents" class="float-right" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="Not so sure?" data-content="We recommend 180 hours. Your VM is then running 9-5 on all weekdays. Should the VM be always-on? Then fill in 750 hours.">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                                    <circle cx="8" cy="4.5" r="1"/>
                                </svg>
                            </a>
                            <div class="input-group mb-3">
                            <input id="vm-` +
    running_id +
    `-hours" type="number" max="750" min="0" step="5" class="form-control vm-input" placeholder="0" aria-describedby="basic-addon2" onchange="setVMCosts(this);setBottomline();">
                            <div class="input-group-append">
                                <span class="input-group-text" id="basic-addon2">h</span>
                            </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="input-group mb-0">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">€</span>
                            </div>
                            <output type="number" id="vm-` +
    running_id +
    `-cost" step=0.001 placeholder="0.00" class="form-control piece-cost" readonly></output>
                            </div>
                        </div>
                        </div>
                    </div>`;

  $("#vmDeck").append(vm_section); // append VM card to VM deck

  // duplicate settings of copied card
  var idVM = val; // with VM id of copied card
  var typeVal = $("#vm-" + idVM + "-type").val();
  var hoursVal = $("#vm-" + idVM + "-hours").val();

  $("#vm-" + running_id + "-type").val(typeVal); // set type
  $("#vm-" + running_id + "-hours").val(hoursVal); // set hours/month

  $("#vm-" + running_id + "-type").trigger("change"); // trigger onchange so that cpu cores, RAM and VM + total costs are updated

  toggleTooltips();
  togglePopovers();
}

// delete VM on delete-button click
function deleteVM(val) {
  var toDelete = "#vm-" + val; // id-tag of to-be-deleted VM card
  $(".tooltip").tooltip("hide");
  $(toDelete).remove();
  setBottomline();
}

// set cpu cores and RAM  in VM card
function setVMDetails(inputObject) {
  var idVM = inputObject.id.split("-")[1]; // get VM id
  var typeVal = $("#vm-" + idVM + "-type").val(); // get type of VM

  var nr_cpu = vm_cpu[typeVal]; // get cpu cores for type
  var ram_val = vm_ram[typeVal]; // get RAM for type

  $("#vm-" + idVM + "-Cores").html(nr_cpu); // set cpu cores
  $("#vm-" + idVM + "-RAM").html(ram_val); // set RAM
}

function setSurfVM() {
  $(".vm-input").trigger("change");
}

// compute and set VM cost per piece
function setVMCosts(inputObject) {
  var idVM = inputObject.id.split("-")[1]; // get VM id
  var costm = 0; // default cost/month is 0

  var typeVal = $("#vm-" + idVM + "-type").val(); // get type of VM
  var hoursVal = $("#vm-" + idVM + "-hours").val(); // get hours per month of VM

  var osdiskTypeVal = $("#osdisk-" + idVM + "-type").val(); // get type of OS disk

  if (typeVal.length !== 0 && hoursVal.length !== 0 && hoursVal >= 0) {
    // if neither input is empty and hours is positive
    // compute cost per month
    var surf_toggle = $("#surfcumulus").is(":checked");

    //console.log("Calculating VM cost, surf-toggle is " + surf_toggle);

    if (surf_toggle) {
      // if on surfcumulus, include surf discount + admin costs, and apply btw (Dutch VAT)
      costm =
        vm_prices[typeVal] *
        ((100 + surf_discount_perc) / 100) *
        ((100 + surf_admin_perc) / 100) *
        ((100 + btw_perc) / 100) *
        hoursVal +
        osdisk_prices[osdiskTypeVal] *
        ((100 + surf_discount_perc) / 100) *
        ((100 + surf_admin_perc) / 100) *
        ((100 + btw_perc) / 100);
    } else {
      // if not on surfcumulus, just apply btw (Dutch VAT)
      costm = vm_prices[typeVal] * ((100 + btw_perc) / 100) * hoursVal +
      osdisk_prices[osdiskTypeVal] * ((100 + btw_perc) / 100);
    }
    $("#vm-" + idVM + "-cost").val(costm.toFixed(2)); // set cost per month with 2 decimals
  } else if (typeVal.length !== 0 && hoursVal.length !== 0 && hoursVal < 0) {
    $("#vm-" + idVM + "-hours").addClass("is-invalid");
    $("#vm-" + idVM + "-cost").val(0);
  }
}

// compute and set bottomline costs
function setBottomline() {
  var sum = 0.0; // start with 0

  // for all per-piece costs
  $(".piece-cost").each(function () {
    if (this.value) {
      //console.log(parseFloat(this.value));
      sum += parseFloat(this.value); // add per-piece cost
    }
  });

  var sum_excl = sum / (1 + (btw_perc/100));

  $("#bottomLine").val(sum.toFixed(2)); // set bottomline cost
  $("#bottomLineExcl").val(sum_excl.toFixed(2)); // set bottomline cost
}

function toggleTooltips() {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: "hover",
    container: "body",
  });
}

$(document).ready(function () {
  getOptionsPromise
    .then(() => getOsDiskPromise)
    .then((message) => {
      addVM();
    })
    .catch((message) => {});

  toggleTooltips();
});
