$('#submit-record').on('submit', function(e) {
e.preventDefault();
    // console.log($("#Frm_Company").val());
    // console.log($("#Frm_Payee").val());
    // Validate Header
    var arrHeader = [
        'Frm_Email',
        'Frm_Company',
        'Frm_Payee',
        'Frm_PurDis',
        'Frm_Expense',
    ];
    var msgHeader = [
        'Please select your Email Address from the dropdown list',
        'Please select Company from the dropdown list',
        'Please select/key-in Payee/Vendor from the inputfield',
        'Please key-in Purpose of Disbursement',
        'Please select Type of Expense from the dropdown list',
    ];
    var headlen = arrHeader.length;
    try {
        var count = 1;
        arrHeader.forEach((val, index) => {
            var itemVal = $("#" + val).val();
            var hinddenpayee = $("#Frm_PayeeHide").val();
            if(val == 'Frm_Payee'){
                if(itemVal == undefined || itemVal == ""){
                    if(hinddenpayee == '' || hinddenpayee == undefined){
                        itemVal = itemVal;
                    }else{
                        itemVal = hinddenpayee;
                    }
                }else{
                    itemVal = itemVal;
                }
            }
            var ErroMsg = msgHeader[index];
            if (itemVal == undefined || itemVal == "") {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: ErroMsg
                });
                throw new Error("Exit loop");
            } else {
                count = count + 1;
            }
        });
    } catch (e) {
        if (e.message !== "Exit loop") {
            throw e;
        }
    }

    // Validate Details
    var arrDetails = [
        'Frm_Project',
        'Frm_Capopex',
        'Frm_CostCenter',
        'billref',
        'amount',
    ];
    //var itemLen = $("select[name='costcenter[]']").length;
    
    var msgDetail = [
        'Please select Project from the dropdownlist at line ',
        'Please select CAPEX/OPEX from the dropdownlist at line ',
        'Please select Profit/Cost Center from the dropdownlist at line ',
        'Please key-in Billing Ref. Number at line ',
        'Please key-in valid Amount at line ',
    ];
    var dtlLen = arrDetails.length;
    var nullval = 0;
    var errorDtl;
    var arrApprv = [
        'Frm_Head',
        'Hddn_payterms',
    ];
    var msgApprv = [
        'Please select Requesting Group / Department / Section from the dropdown list',
        'Please select Payment Terms',
    ];
    var apprvlen = arrApprv.length;
    var errmsg = [];

    if (count > headlen) {

        var results = $('input[name="counter[]"]').map(function() {
            if ($(this).val() === 'visible') {
                var container = $(this).closest('.form-inline');
                var proj = container.find('select[name="proj[]"]').val();
                var capex = container.find('select[name="capex[]"]').val();
                var costcenter = container.find('select[name="costcenter[]"]').val();
                var billref = container.find('input[name="billref[]"]').val();
                var amount = container.find('input[name="amount[]"]').val();
                return {
                    Frm_Project: proj,
                    Frm_Capopex: capex,
                    Frm_CostCenter: costcenter,
                    billref: billref,
                    amount: amount
                };
            }
        }).get().filter(function(item) {
            return item !== undefined;
        });
                
        var loopCompleted = true; // Initialize the flag

        $.each(results, function(index, value) {
            $.each(arrDetails, function(indx, val) {
                var valdel = value[val];
                if (valdel == undefined || valdel == "") {
                    nullval = nullval + 1;
                    let line = index + 1;
                    errorDtl = msgDetail[indx] + line;
                    errmsg.push(errorDtl);
                    loopCompleted = false; // Set the flag to false
                    return false; // Exit the inner loop
                }
            });
            if (!loopCompleted) {
                return false; // Exit the outer loop if the inner loop exited early
            }
        });
        
        if (loopCompleted) {
            for (var k = 0; k < apprvlen; k++) {
                var val = $("#" + arrApprv[k]).val();
                if (val == undefined || val == "") {
                    var errmsg = msgApprv[k];
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "error",
                        title: errmsg
                    });
                    break;
                }
            }
            if (k == apprvlen) {
                $('#submitBtn').css('display', 'none');
                $('#overlaydisclk').css('display', 'block');
                $('#subanother').css('display', 'block');
                Swal.fire({
                    title: "Sending Request",
                    html: "Please wait...",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    position: "top-end",
                    /* timer: 4000,
                    timerProgressBar: true, */
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Collect form data including attachments
                var formDatas = new FormData($('#submit-record')[0]);
        
                //Remove row 1
                var elementsToDelete = ['proj[]', 'capex[]','costcenter[]','billref[]','amount[]','intref[]','remarks[]'];
        
                elementsToDelete.forEach(function(element) {
                formDatas.delete(element);
                });
                $("select[name='capex[]']").eq(1).val();
                var x = 0;
                $("select[name='proj[]']").each(function() {
                    var id = $(this).attr('id');
                    const isWordIncluded = id.includes("mod");
                    if(isWordIncluded==false){
                        var tempProj = $(this).val();
                        if(tempProj !== null){
                            var tempCapex = $("select[name='capex[]']").eq(x).val();
                            var tempCostcenter = $("select[name='costcenter[]']").eq(x).val();
                            var tempBillref = $("input[name='billref[]']").eq(x).val();
                            var tempAmount = $("input[name='amount[]']").eq(x).val();
                            var tempIntref= $("input[name='intref[]']").eq(x).val();
                            var tempRemarks= $("input[name='remarks[]']").eq(x).val();
                            formDatas.append('proj[]',tempProj);
                            formDatas.append('capex[]',tempCapex);
                            formDatas.append('costcenter[]',tempCostcenter);
                            formDatas.append('billref[]',tempBillref);
                            formDatas.append('amount[]',tempAmount);
                            formDatas.append('intref[]',tempIntref);
                            formDatas.append('remarks[]',tempRemarks);
                        }
                    }
                    x=x+1;
                });
        
                /* for (var pair of formDatas.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]); 
                } */

                // var formeralco = $("#Frm_Payee").val();
                // if (formeralco=="V0000551"){
                //     var router = '/mer676574';
                // }else{
                //     var router = '/676574';
                // }
        
                $.ajax({
                    url: '/676574',
                    type: 'POST',

                    data: formDatas,
                    processData: false,
                    contentType: false,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(response) {
                        console.log(response);
                        if (response.success) {
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Your request has been submitted",
                                showConfirmButton: false,
                                timer: 5000
                            });
                        } else {
                            //console.error('failed');
                            Swal.fire({
                                position: "top-end",
                                icon: "error",
                                title: "Failed to submit your request. Please try again.",
                                showConfirmButton: false,
                                timer: 5000
                            });
                            reAuthenticate();
                            $('#submitBtn').css('display', 'block');
                            $('#subanother').css('display', 'none');
                            $('#overlaydisclk').css('display', 'none');
                        }
                    },
                    error: function(error) {
                        console.error(error);
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Failed to submit your request. Please try again.",
                            showConfirmButton: false,
                            timer: 5000
                        });
                        reAuthenticate();
                        $('#submitBtn').css('display', 'block');
                        $('#subanother').css('display', 'none');
                        $('#overlaydisclk').css('display', 'none');
                    }
                });
            }
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: errmsg[0]
            });
            reAuthenticate();
        }   
    }
});