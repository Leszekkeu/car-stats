var firebaseConfig = {
    apiKey: "AIzaSyBvvkfXmOi6aN6EZ1Q1wlkiuO6QoIrL-54",
    authDomain: "webaily.firebaseapp.com",
    databaseURL: "https://webaily.firebaseio.com",
    projectId: "webaily",
    storageBucket: "webaily.appspot.com",
    messagingSenderId: "9902598182",
    appId: "1:9902598182:web:caba56c535ea060a7cdee7"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
var readytotable = false;
var select = false;
var logged = false;
var prevkmdb;
$(function(){
    $(".progress").hide();
    $("select").formSelect();
    $(".modal").modal();
    checkToEnable();
    $(".sidenav").sidenav();
    $(".show-appinfo").click(function(){
        $(".sidenav").sidenav("close");
        $("#modal-appinfo").modal("open");
    })
    $(".timepicker-start").timepicker();
    $(".timepicker-start").timepicker({
        autoClose: true,
        twelveHour: false
    });
    $(".timepicker-end").timepicker();
    $(".timepicker-end").timepicker({
        autoClose: true,
        twelveHour: false
    });
    $(".collapsible").collapsible();
    $(".fixed-action-btn").floatingActionButton();
    function save(){
        if(logged === true){
            var elements = localStorage.getItem("csb-table");
            var kmdb = localStorage.getItem("csb-prevkmcount");
            db.collection("users").doc(firebase.auth().currentUser.uid).update({
                task: elements,
                prevkm: kmdb
            });
            console.log("saved");
        }
    }
    function setLang(){
        if(localStorage.getItem("lang") === "pl"){
            // menu
            $(".menu-text-stats").text("Statystyki");
            $(".menu-text-edtinf").text("Edytuj Informacje");
            $(".menu-text-logout").text("Wyloguj");
            // start
            $(".start-text-title").text("Rozpocznij trasę!");
            $(".start-text-connectbtn").text("Połącz z bazą danych");
            $(".start-text-1").text("Stan Licznika");
            $(".start-text-2").text("Cel");
            $(".start-text-3").text("Aktualne Miejsce");
            $(".start-text-4").text("Godzina");
            $(".start-text-5").text("Imię i Nazwisko");
            //continue
            $(".ce-text-title").text("W trakcie...");
            $(".ce-text-1").text("Stan Licznika");
            $(".ce-text-2").text("Czas Zakończenia");
            $(".ce-text-3").text("Droga w Dwie Strony");
            $(".ce-text-4").text("Tankowanie");
            $(".ce-text-5").text("Koszt");
            $(".ce-text-6").text("Ile Zatankowano");
            $(".ce-text-7").text("Stan Licznika");
            //stats
            $(".st-text-title").text("Statystyki");
            //edit info modal
            $(".meinfo-text-title").text("Edytuj Informacje");
            $(".meinfo-text-1").text("Domyślne Imię i Nazwisko");
            $(".meinfo-text-2").text("ID Samochodu");
            $(".meinfo-text-3").text("Domyślne Miejsce Rozpoczęcia");
            $(".meinfo-text-4").text("Podpowiadaj Poprzednie KM");
            $(".meinfo-text-5").text("Usuń Trasę");
            $(".meinfo-text-7").text("Zamknij");
        }else{
            // menu
            $(".menu-text-stats").text("Stats");
            $(".menu-text-edtinf").text("Edit Informations");
            $(".menu-text-logout").text("Logout");
            // start
            $(".start-text-title").text("Start your way!");
            $(".start-text-connectbtn").text("connect to database");
            $(".start-text-1").text("Meter Reading");
            $(".start-text-2").text("Destination");
            $(".start-text-3").text("Starting Place");
            $(".start-text-4").text("Start Time");
            $(".start-text-5").text("Your Name");
            //continue
            $(".ce-text-title").text("Driving...");
            $(".ce-text-1").text("Meter Reading");
            $(".ce-text-2").text("End Time");
            $(".ce-text-3").text("Round-Trip");
            $(".ce-text-4").text("Refueling");
            $(".ce-text-5").text("Fuel Expense");
            $(".ce-text-6").text("Amount of Fuel");
            $(".ce-text-7").text("Meter Reading");
            //stats
            $(".st-text-title").text("Stats");
            //edit info modal
            $(".meinfo-text-title").text("Edit Informations");
            $(".meinfo-text-1").text("Default name");
            $(".meinfo-text-2").text("Car ID");
            $(".meinfo-text-3").text("Default Starting Place");
            $(".meinfo-text-4").text("Prompt previous kilometers");
            $(".meinfo-text-5").text("Remove Table");
            $(".meinfo-text-7").text("Close");
        }
    }
    if(localStorage.getItem("lang")){
        setLang(localStorage.getItem("lang"));
    }
    $(".logout").click(function(){
        firebase.auth().signOut().then(function() {
            console.log("logout")
        }).catch(function(error) {
            console.log("error")
        });
        $(".info-email").text("");
        localStorage.removeItem("csb-table");
        localStorage.removeItem("csb-prevkmcount")
    })
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
        let deferredPrompt;
        window.addEventListener("beforeinstallprompt", (e) => {
            deferredPrompt = e;
            $(".installprompt").slideDown();
            $(".ip-btn").click(function(){
                deferredPrompt.prompt();
                deferredPrompt.userChoice
                .then((choiceResult) => {
                    if (choiceResult.outcome === "accepted") {
                        $(".installprompt").slideUp();
                    }
                    deferredPrompt = null;
                });
            })
        });
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        }
        const isInStandaloneMode = () => ("standalone" in window.navigator) && (window.navigator.standalone);
        if (isIos() && !isInStandaloneMode()) {
            if(localStorage.getItem("ios-ip-notagain") == "true" || localStorage.getItem("ios-ip-notagain") == undefined){
                $(".installprompt").slideDown();
            }
        }
        $(".ip-close").click(function(){
            $(".installprompt").slideUp();
        })
        $(".ip-btn").click(function(){
            if(isIos()){
                $("#modal-iospwainstall").modal("open");
            }
        })
        $(".hide-ip").click(function(){
            $(".installprompt").slideUp();
        })
        $(".notagainios").click(function(){
            localStorage.setItem("ios-ip-notagain", true);
        })
    }
    $(".show-edit-reg").click(function(){
        if($("select").val() === "pl"){
            localStorage.setItem("lang", "pl")
        }else{
            localStorage.setItem("lang", "en");
        }
        if(!localStorage.getItem("csb-id")){
            setLang();
        }
        $("#edit-name-inpt").val(localStorage.getItem("csb-name"));
        $("#edit-id-inpt").val(localStorage.getItem("csb-id"));
        $("#edit-dloc-inpt").val(localStorage.getItem("csb-dloc"));
        M.updateTextFields();
        $(".error-modal-editinfo").hide();
        $(".sidenav").sidenav("close");
        $("#modal-editinfo").modal("open");
        if(localStorage.getItem("csb-prevkm") == "false"){
            $("#prevkm-checkbox").prop("checked", false);
        }
    })

    //edit info modal
    $(".update-info-btn").click(function(){
        var name = $("#edit-name-inpt").val();
        var id = $("#edit-id-inpt").val();
        var dloc = $("#edit-dloc-inpt").val();
        var prevkm = document.getElementById("prevkm-checkbox").checked;
        if(id !== "" && id !== null){
            $(".stats").hide();
            localStorage.setItem("csb-name", name);
            localStorage.setItem("csb-id", id);
            localStorage.setItem("csb-dloc", dloc);
            localStorage.setItem("csb-prevkm", prevkm);
            $("#modal-editinfo").modal("close");
            checkToEnable();
        }else{
            $(".error-modal-editinfo").show();
        }

    })
    //delete info modal
    $(".delete-info-btn").click(function(){
        localStorage.removeItem("csb-name");
        localStorage.removeItem("csb-id");
        localStorage.removeItem("csb-dloc");
        localStorage.removeItem("csb-prevkm");
        localStorage.removeItem("csb-prevkmcount");
        localStorage.removeItem("csb-table");
        localStorage.removeItem("lang");
        $("#modal-editinfo").modal("close");
        checkToEnable();
        save();
    })
    //enable all functions
    function checkToEnable(){
        var id = localStorage.getItem("csb-id");
        if(id !== "" && id !== null){
            if(localStorage.getItem("csb-c-count") !== undefined && localStorage.getItem("csb-c-count") !== null){
                started();
            }else{
                $(".conf").hide();
                $(".start").fadeIn();
                $(".sidenav-trigger").fadeIn("fast");
                home();
            }

        }else{
            $(".start").hide();
            $(".conf").fadeIn();
            $(".sidenav-trigger").fadeOut("fast");
            $(".stats").hide();
        }
    }
    function home(){
        $("#start-startplace-inpt").val(localStorage.getItem("csb-dloc"));
        $("#start-name-inpt").val(localStorage.getItem("csb-name"));
        if(localStorage.getItem("csb-prevkm") == "true" && localStorage.getItem("csb-prevkmcount") !== undefined){
            $("#start-count-inpt").val(localStorage.getItem("csb-prevkmcount"));
        }else{
            $("#start-count-inpt").val("");
        }
        $("#start-time-inpt").val("");
        $("#start-destination-inpt").val("");
        $("#stop-rmoney-inpt").val("");
        $("#stop-rcount-inpt").val("");
        $("#stop-rcountfuel-inpt").val("");
        $("#stop-time-inpt").val("");
        $("#stop-count-inpt").val("");
        M.updateTextFields();
        $(".error-start").hide();
        $(".error-continue").hide();
        if(localStorage.getItem("logged") == "true"){
            $(".login-btn").hide();
        }
    }
    //start
    $(".start-road-btn").click(function(){
        var count = $("#start-count-inpt").val();
        var destination = $("#start-destination-inpt").val();
        var startplace = $("#start-startplace-inpt").val();
        var name = $("#start-name-inpt").val();
        var time = $("#start-time-inpt").val();
        if(count.length > 2 && startplace.length > 2 && name.length > 2){
            $(".error-start").hide();
            localStorage.setItem("csb-c-count", count);
            localStorage.setItem("csb-c-destination", destination);
            localStorage.setItem("csb-c-startplace", startplace);
            localStorage.setItem("csb-c-name", name);
            if(time.length > 0){
                localStorage.setItem("csb-c-time", time);
            }
            started();
        }else{
            $(".error-start").show();
        }
    })
    function started(){
        var count = localStorage.getItem("csb-c-count");
        var destination = localStorage.getItem("csb-c-destination");
        var startplace = localStorage.getItem("csb-c-startplace");
        var name = localStorage.getItem("csb-c-name");
        var time = localStorage.getItem("csb-c-time");
        if(count !== undefined && destination !== undefined && startplace !== undefined && name !== undefined){
            $(".conf").hide();
            $(".start").hide();
            $(".continue").fadeIn();
            $(".sidenav-trigger").fadeOut("fast");
            readytotable = true;
        }
    }
    $(".stop-road-btn").click(function(){
        if(readytotable == true){
            var fuel = false;
            var scount = $("#stop-count-inpt").val();
            var stime = $("#stop-time-inpt").val();
            var smoney = $("#stop-rmoney-inpt").val();
            var scountmoney = $("#stop-rcount-inpt").val();
            if(scount.length > 0){
                if(smoney.length > 0 && scountmoney.length >0){
                    fuel = true;
                }
                var d = new Date();
                var month = d.getMonth()+1;
                var day = d.getDate();
                //to table data
                var datet = d.getFullYear() + "/" +(month<10 ? "0" : "") + month + "/" +(day<10 ? "0" : "") + day;
                var namet = localStorage.getItem("csb-c-name");
                var regt = localStorage.getItem("csb-id");
                var counteratfueling = $("#stop-rcountfuel-inpt").val();
                if(counteratfueling.length < 1){
                    counteratfueling = "";
                }else{
                    counteratfueling = counteratfueling + " km";
                }
                if(localStorage.getItem("csb-c-destination") === ""){
                    if(document.getElementById("roundtrip-checkbox").checked){
                        var roadt = localStorage.getItem("csb-c-startplace");
                    }else{
                        var roadt = localStorage.getItem("csb-c-startplace");
                    }
                }else{
                    if(document.getElementById("roundtrip-checkbox").checked){
                        var roadt = localStorage.getItem("csb-c-startplace") + " -> " + localStorage.getItem("csb-c-destination") + " -> " + localStorage.getItem("csb-c-startplace");
                    }else{
                        var roadt = localStorage.getItem("csb-c-startplace") + " -> " + localStorage.getItem("csb-c-destination");
                    }
                }

                if(localStorage.getItem("csb-c-time") !== undefined && localStorage.getItem("csb-c-time") !== null){
                    var timest = localStorage.getItem("csb-c-time");
                }else{
                    var timest = "-";
                }
                
                var countst = localStorage.getItem("csb-c-count");
                if(stime !== undefined && stime !== ""){
                    var timeendt = stime;
                }else{
                    var timeendt = "-";
                }
                var countendt = scount;

                var course = countendt - countst;

                var fmoneyt = smoney;
                var fcountt = scountmoney;
                
                if(localStorage.getItem("csb-table") == undefined || localStorage.getItem("csb-table") == null){
                    localStorage.setItem("csb-table", `<table><tr><th>Date</th><th>User (${regt})</th><th>Route</th><th>Hour of Departure</th><th>Counter Before Departure</th><th>Hour of Arrival</th><th>Counter After Arrival</th><th>Course (km)</th><th>Refueling (L)</th><th>Refueling (Cost)</th><th>Refueling (Counter)</th></tr></table>`);
                }
                if(fuel == false){
                    $(".hiddentable").html(localStorage.getItem("csb-table"));
                    $(".hiddentable tr:last").after(`<tr><td>${datet}</td><td>${namet}</td><td>${roadt}</td><td>${timest}</td><td>${countst}</td><td>${timeendt}</td><td>${countendt}</td><td>${course}</td><td>-</td><td>-</td><td>-</td></tr>`);
                    localStorage.setItem("csb-table", $(".hiddentable").html());
                }else{
                    $(".hiddentable").html(localStorage.getItem("csb-table"));
                    $(".hiddentable tr:last").after(`<tr><td>${datet}</td><td>${namet}</td><td>${roadt}</td><td>${timest}</td><td>${countst}</td><td>${timeendt}</td><td>${countendt}</td><td>${course}</td><td>${fcountt}</td><td>${fmoneyt}</td><td>${counteratfueling}</td></tr>`);
                    localStorage.setItem("csb-table", $(".hiddentable").html());
                }
                localStorage.setItem("csb-prevkmcount", countendt);
                save();
                localStorage.removeItem("csb-c-destination");
                localStorage.removeItem("csb-c-startplace");
                localStorage.removeItem("csb-c-name");
                localStorage.removeItem("csb-c-time");
                localStorage.removeItem("csb-c-count");    
                $(".continue").hide();
                checkToEnable();
                
            }else{
                $(".error-continue").show();
            }
        }
    })
    $(".show-stats").click(function(){
        $(".sidenav").sidenav("close");
        $(".start").slideUp();
        $(".stats").delay(350).fadeIn();
        if(logged !== true){
            $(".showtable").html("<p class='flow-text'>Nothing to see.</p>");
            if(localStorage.getItem("csb-table") !== undefined && localStorage.getItem("csb-table") !== null){
                $(".exportoptions").show();
                $(".showtable").html(localStorage.getItem("csb-table"));
                $(".edittools").show();
            }else{
                $(".exportoptions").hide();
                $(".edittools").hide();
            }
        }else{
            if($(".showtable").text() !== "" ){
                $(".edittools").show();
                $(".exportoptions").show();
            }else{
                $(".edittools").hide();
                $(".exportoptions").hide();
            }
        }
        //translate table
        if(localStorage.getItem("lang") === "pl" && $(".showtable").text().length > 20){
            $("th:nth-child(1)").html("Data");
            $("th:nth-child(2)").html($("th:nth-child(2)").html().replace("User", "Użytkownik"));
            $("th:nth-child(3)").html("Trasa");
            $("th:nth-child(4)").html("Godzina Wyjazdu");
            $("th:nth-child(5)").html("Licznik Przed Wyjazdem");
            $("th:nth-child(6)").html("Godzina Przyjazdu");
            $("th:nth-child(7)").html("Licznik Po Przyjeździe");
            $("th:nth-child(8)").html("Kurs (km)");
            $("th:nth-child(9)").html("Tankowanie (L)");
            $("th:nth-child(10)").html("Tankowanie (Koszt)");
            $("th:nth-child(11)").html("Tankowanie (Licznik)");
        }

    })
    $(".login-btn").click(function(){
        $("#modal-login").modal("open");
    })
    $(".registermodalbtn").click(function(){
        $("#modal-register").modal("open");
    })
    $(".show-start").click(function(){
        $(".sidenav").sidenav("close");
        $(".stats").slideUp();
        $(".start").delay(350).fadeIn();
        $("tr").removeClass("cursor");
        $("tr").removeClass("selected");
        select = false;
    })
    $(".delete-table-btn").click(function(){
        localStorage.removeItem("csb-table");
        save();
        $(".stats").hide();
        checkToEnable();
    })
    $(".removeselectedtable").click(function(){
        $("tr").last().remove();
        if($(".showtable").html() == "<table><tbody></tbody></table>"){
            localStorage.removeItem("csb-table");
            save();
        }else{
            localStorage.setItem("csb-table", $(".showtable").html());
            save();
        }
    })
    $(".print").click(function(){
        window.print();
    })
    $(".exporttable").click(function(){
        var reg = localStorage.getItem("csb-id");
        var wb = XLSX.utils.table_to_book(document.getElementById("tabletoprint"), {sheet:reg});
        var wbout = XLSX.write(wb, {bookType:"xlsx", bookSST:true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `CSB - ${reg}.xlsx`);
    })
    $(".lk-logo").click(function(){
        window.open("https://leszekk.eu")
    })
    $(".logingoogle").click(function(){
        var provider = new firebase.auth.GoogleAuthProvider();
        $(".progress").fadeIn();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log(result.additionalUserInfo.isNewUser);
            $(".progress").slideUp();
            if(result.additionalUserInfo.isNewUser === true){
                return db.collection("users").doc(result.user.uid).set({
                    task: null
                });
            }
        }).catch(function(error) {
            $(".progress").slideUp();
            var errorMessage = error.message;
            console.log(errorMessage);
            $("#login-err").text(errorMessage);
        });
    })
    $(".loginpass").click(function(){
        var emailinpt = $("#email-login").val();
        var passinpt = $("#password-login").val();
        $(".progress").fadeIn();
        firebase.auth().signInWithEmailAndPassword(emailinpt, passinpt).catch(function(error) {
            var errorMessage = error.message;
            console.log(errorMessage);
            $("#login-err").text(errorMessage);
            $(".progress").slideUp();
        });
    })
    $("#register-btn").click(function(){
        var email = document.getElementById("email-register").value;
        var password = document.getElementById("password-register").value;
        var password2 = document.getElementById("password2-register").value;
        if(password === password2){
            $(".progress").fadeIn();
            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {      
                var errorMessageReg = error.message;
                document.getElementById("register-err").innerHTML = errorMessageReg;  
                $(".progress").slideUp();
            }).then(cred => {
                return db.collection("users").doc(cred.user.uid).set({
                    task: null
                });
                
            }).then(() => {
                $("#modal-register").modal("close");
                document.getElementById("email-register").value = "";
                document.getElementById("password-register").value = "";
                document.getElementById("password2-register").value = "";
                $(".progress").slideUp();
            });
        }
        else{
            document.getElementById("register-err").innerHTML = "Passwords are not identical!";
        }
    
    })
    auth.onAuthStateChanged(user => {
        if (user) {
            $(".progress").slideUp();
            $("#modal-login").modal("close");
            $("#login-err").text("");
            $("#email-login").val("");
            $("#password-login").val("");
            console.log("logged");
            $(".login-btn").hide();
            $(".info-email").text(user.email)
            logged = true;
            db.collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
                var data = snapshot.data();
                if(snapshot.exists){
                    $(".showtable").html(data["task"]);
                    if(data["task"] !== null){
                        localStorage.setItem("csb-table", data["task"]);
                        console.log("snap to local");
                        localStorage.setItem("csb-prevkmcount", data["prevkm"]);
                        prevkmdb = data["prevkm"];
                    }
                }
            }, err => console.log(err.message));
            $(".logout").show();
        }else{
            logged = false;
            $(".logout").hide();
        }
    });
});