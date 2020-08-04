var dd_options = []; // dropdown vm type options

var vm_ram = [];
var vm_prices = [];
var vm_cpu = [];

let getOptionsPromise = new Promise((resolve, reject) => {
    $.getJSON("https://gist.githubusercontent.com/JochemBek/98643e51feccf93dd536bb24fa07e9e2/raw/0067a0d18a4a264b5f74fe6a9093fc803c4d9e88/virtualmachines.json")
    .done(function( data ) {
        $.each( data, function( key, val ) {            
            vm_prices[key] = parseFloat(val['Prijs per uur'].replace("€", "").replace(',', '.'));
            vm_ram[key] = val.RAM;
            vm_cpu[key] = val["vCPU('s)"];

            if(key == "B2S") {
                dd_options.push( "<option value='" + key + "' selected>" + key + "</option>" );
            } else {
                dd_options.push( "<option value='" + key + "'>" + key + "</option>" );
            }
            
        });
        console.log(vm_prices);
        resolve("Success!");
    }).fail(function() {
        reject("Error!");
    });
});

var runningID = 0

function addVM() {
    runningID = runningID + 1;

    var vm_section =    `<div id="vm-`+runningID+`" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="card border-primary vm-instance">
                        <div class="card-header">VM `+runningID+`
                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                            <button class="btn btn-danger" value="`+runningID+`" data-toggle="tooltip" data-placement="left" title="Delete this VM" onclick="deleteVM(this.value)"> <i class="fa fa-trash"></i></button>
                            <button class="btn btn-outline-secondary" value="`+runningID+`" data-toggle="tooltip" data-placement="right" title="Copy this VM configuration" onclick="copyVM(this.value)"> <i class="fa fa-copy"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <label for="vm-`+runningID+`-type">VM Type</label>
                            <div class="input-group mb-3">
                            <select id="vm-`+runningID+`-type" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                            `+dd_options+`
                            </select>
                            </div>
                            <div class="mb-3">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cpu" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                            </svg>
                            <span id="vm-`+runningID+`-Cores"></span>
                            <br>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hdd-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                <path d="M.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z"/>
                            </svg>
                            <span id="vm-`+runningID+`-RAM"></span>
                            </div>
                            <hr>         
                            <label for="vm-`+runningID+`-hours"> Hours/month </label>
                            <div class="input-group mb-3">
                            <input id="vm-`+runningID+`-hours" type="number" max="750" min="1" class="form-control" placeholder="0" aria-describedby="basic-addon2" onchange="setVMCosts(this);setBottomline();">
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
                            <output type="number" id="vm-`+runningID+`-cost" step=0.001 placeholder="0.00" class="form-control piece-cost" readonly></output>
                            </div>
                        </div>
                        </div>
                    </div>`

    $("#vm-deck").append(vm_section);
}

function copyVM(val) {
    runningID = runningID + 1;

    var vm_section = `<div id="vm-`+runningID+`" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="card border-primary vm-instance">
                        <div class="card-header">VM `+runningID+`
                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                            <button class="btn btn-danger" value="`+runningID+`" data-toggle="tooltip" data-placement="left" title="Delete this VM" onclick="deleteVM(this.value)"> <i class="fa fa-trash"></i></button>
                            <button class="btn btn-outline-secondary" value="`+runningID+`" data-toggle="tooltip" data-placement="right" title="Copy this VM configuration" onclick="copyVM(this.value)"> <i class="fa fa-copy"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <label for="vm-`+runningID+`-type">VM Type</label>
                            <div class="input-group mb-3">
                            <select id="vm-`+runningID+`-type" onchange="setVMCosts(this);setVMDetails(this);setBottomline();">
                            `+dd_options+`
                            </select>
                            </div>
                            <div class="mb-3">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cpu" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                            </svg>
                            <span id="vm-`+runningID+`-Cores"></span>
                            <br>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hdd-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                <path d="M.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z"/>
                            </svg>
                            <span id="vm-`+runningID+`-RAM"></span>
                            </div>
                            <hr>         
                            <label for="vm-`+runningID+`-hours"> Hours/month </label>
                            <div class="input-group mb-3">
                            <input id="vm-`+runningID+`-hours" type="number" max="750" min="1" class="form-control" placeholder="0" aria-describedby="basic-addon2" onchange="setVMCosts(this);setBottomline();">
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
                            <output type="number" id="vm-`+runningID+`-cost" step=0.001 placeholder="0.00" class="form-control piece-cost" readonly></output>
                            </div>
                        </div>
                        </div>
                    </div>`

    $("#vm-deck").append(vm_section);
    
    var idVM = val;
    var typeVal = $("#vm-"+idVM+"-type").val();
    var hoursVal = $("#vm-"+idVM+"-hours").val();  

    $("#vm-"+runningID+"-type").val(typeVal);
    $("#vm-"+runningID+"-hours").val(hoursVal); 

    $("#vm-"+runningID+"-type").trigger("change");


}

function deleteVM(val) {
    var toDelete = "#vm-" + val;

    $(toDelete).remove();
}

function setVMDetails(inputObject) {
    var idVM = inputObject.id.split("-")[1];
    var typeVal = $("#vm-"+idVM+"-type").val();

    var nr_cpu = vm_cpu[typeVal];
    var ram_val = vm_ram[typeVal];

    console.log(nr_cpu);
    console.log(ram_val);
    console.log(idVM);

    $("#vm-"+idVM+"-Cores").html(nr_cpu);
    $("#vm-"+idVM+"-RAM").html(ram_val);
}

function setVMCosts(inputObject) {
    var idVM = inputObject.id.split("-")[1];
    var costm = 0;

    var typeVal = $("#vm-"+idVM+"-type").val();
    var hoursVal = $("#vm-"+idVM+"-hours").val();    

    if (typeVal.length !== 0 && hoursVal.length !== 0) {
        costm = vm_prices[typeVal]*hoursVal;

        $("#vm-"+idVM+"-cost").val(costm.toFixed(2));
    }
}

function setBottomline() {
    var sum = 0.00;

    $('.piece-cost').each(function(){
        console.log(this.value);
        if(this.value) {
            console.log(parseFloat(this.value));
            sum += parseFloat(this.value);
        } 
    });

    $("#bottomLine").val(sum.toFixed(2));
}


$(document).ready(function() {

    getOptionsPromise.then((message) => {
        console.log("This is in the then: " + message)
        addVM();
        $("#vm-1-type").trigger("change");
    }).catch((message) => {
        console.log("This is in the catch: " + message)
    });



});
