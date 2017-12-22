var app = angular.module("mainApp", ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngTagsInput']);
app.controller("mainController", function($anchorScroll, $interpolate, $document, $rootScope, $scope, $http, $timeout, $location, $window, $route, $routeParams) {
    var date = new Date();
    var today = date.toString().substring(0, 24);
    $scope.url = "#";
    $scope.all = [];
    $scope.markup = [];
    $scope.css = [];
    $scope.scripts = [];
    $scope.notes = [];
    $scope.tags = "";

    $(window).resize(function() {
        if ($(window).width() > 768) {
            $(".sidenav").hide();
        }
    });


    //filter for panels, changes on selection
    $scope.filter = "title";
    $scope.filterPanels = { title: '', description: '' };
    $scope.setFilter = function(prop) {
        //reset filterPanels to handle if user changes filter option selection while input is note empty
        $scope.filterPanels = "";
        $scope.filterPanels = { title: '', description: '' };
        $scope.filter = prop;
        $(".filterButton").text(prop);
    }

    //if, on link click, there are no items in the corresponding array, revert user to create new form to add a new item
    $scope.testArray = function(array) {
        if (array in $scope) {
            if ($scope[array].length == 0) {
                $scope.url = "#!appForm?type=create_new";
            } else {
                $scope.url = "#!" + $scope[array][0].type + "?type=" + $scope[array][0].type;
            }
        }
    }

    //clearForm fields after submitting new form or saving edited form
    function clearFormFields() {
        $("#selectType").val("");
        $("#title").val("");
        $("#description").val("");
        $("#body").val("");
        $scope.tags = "";
    }
    $http.get("data/data.json").then(function(response) {
        $scope.panels = response.data.panelData;
    })
    var config = {
        apiKey: "your info",
        authDomain: "your info",
        databaseURL: "your info",
        projectId: "your info",
        storageBucket: "your info",
        messagingSenderId: "your info"
    };
    firebase.initializeApp(config);
    //end firebase config
    var database = firebase.database();
    var markupRef = database.ref("markup/");
    var cssRef = database.ref("css/");
    var scriptRef = database.ref("jscript/");
    var notesRef = database.ref("notes/");
    markupRef.on("child_added", function(snapshot) {
        var data = snapshot.val();
        var key = snapshot.key;
        data.key = key;
        $scope.markup.push(data);
        $scope.all.push(data);
        console.log(data);
        $scope.$apply();
    });
    markupRef.on("child_changed", function(snapshot) {
        $window.location.href = "#!/markup";
        $window.location.reload();
    });
    markupRef.on("child_removed", function(snapshot) {
        var key = snapshot.key;
        for (var i = 0; i < $scope.markup.length; i++) {
            if ($scope.markup[i].key == key) {
                $scope.markup.splice(i, 1);
            }
        }
        $scope.$apply();
    })
    cssRef.on("child_added", function(snapshot) {
        var data = snapshot.val();
        var key = snapshot.key;
        data.key = key;
        $scope.css.push(data);
        $scope.all.push(data);
        console.log(data);
        $scope.$apply();
    });
    cssRef.on("child_changed", function(snapshot) {
        $window.location.href = "#!/css";
        $window.location.reload();
    });
    cssRef.on("child_removed", function(snapshot) {
        var key = snapshot.key;
        for (var i = 0; i < $scope.css.length; i++) {
            if ($scope.css[i].key == key) {
                $scope.css.splice(i, 1);
            }
        }
        $scope.$apply();
    })
    scriptRef.on("child_added", function(snapshot) {
        var data = snapshot.val();
        var key = snapshot.key;
        data.key = key;
        $scope.scripts.push(data);
        $scope.all.push(data);
        console.log(data);
        $scope.$apply();
    });
    scriptRef.on("child_changed", function(snapshot) {
        $window.location.href = "#!/jscript";
        $window.location.reload();
    });
    scriptRef.on("child_removed", function(snapshot) {
        var key = snapshot.key;
        for (var i = 0; i < $scope.scripts.length; i++) {
            if ($scope.scripts[i].key == key) {
                $scope.scripts.splice(i, 1);
            }
        }
        $scope.$apply();
    })
    notesRef.on("child_added", function(snapshot) {
        var data = snapshot.val();
        var key = snapshot.key;
        data.key = key;
        $scope.notes.push(data);
        $scope.all.push(data);
        console.log(data);
        $scope.$apply();
    });
    notesRef.on("child_changed", function(snapshot) {
        $window.location.href = "#!/notes";
        $window.location.reload();
    });

    notesRef.on("child_removed", function(snapshot) {
        var key = snapshot.key;
        for (var i = 0; i < $scope.notes.length; i++) {
            if ($scope.notes[i].key == key) {
                $scope.notes.splice(i, 1);
            }
        }
        $scope.$apply();
    })
    $scope.clearTags = function() {
        this.tags = "";
    }

    $scope.submitPost = function() {
        $(".formTitle").text("Add something new");
        if ($("#selectType").val() == "" || $("#title").val() == "" || $("#description").val() == "") {
            return;
        }
        var postRef = "";
        var postType = $("#selectType").val();
        if (postType == "markup") {
            postRef = markupRef.push();
            postRef.set({
                created: today,
                type: postType,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            })
        } else if (postType == "css") {
            postRef = cssRef.push();
            postRef.set({
                created: today,
                type: postType,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });

        } else if (postType == "jscript") {
            postRef = scriptRef.push();
            postRef.set({
                created: today,
                type: postType,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });

        } else if (postType == "notes") {
            postRef = notesRef.push();
            postRef.set({
                created: today,
                type: postType,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });
        }
        clearFormFields();
        $window.location.href = "#!/" + postType;
        //$route.reload();
    }
    $scope.showBody = function(event) {
        event.preventDefault();
        var id = event.target.id;
        var chevrons = $("#" + id).children(".fa");
        var infoPanelBody = $("#" + id).next(".infoPanelBody");
        infoPanelBody.toggleClass("hide");
        chevrons.toggleClass("hide");
    }
    $scope.deletePost = function(event) {
        event.preventDefault();
        $("#myModal").modal("show");
        var modalYes = $("#modalYes");
        var modalNo = $("#modalNo");
        modalYes.click(function() {
            var ele = event.target;
            var dataType = $(ele).attr("data-type");
            var key = $(ele).attr("data-key");
            database.ref(dataType + "/").child(key).remove();
        })
    }

    $scope.$on('$routeChangeSuccess', function() {
        $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        //take off link highlight if on home screen
        if ($location.path() == "/") {
            $(".rightLinks a").removeClass("activeRightLink");
        }
        //if user clicks homepage panel and not top nav link, higlight nav link with active class
        if ($location.path() == "/markup") {
            $(".rightLinks a").removeClass("activeRightLink");
            $(".markupnavlink").addClass("activeRightLink");
        } else if ($location.path() == "/css") {
            $(".rightLinks a").removeClass("activeRightLink");
            $(".cssnavlink").addClass("activeRightLink");
        } else if ($location.path() == "/jscript") {
            $(".rightLinks a").removeClass("activeRightLink");
            $(".scriptnavlink").addClass("activeRightLink");
        } else if ($location.path() == "/notes") {
            $(".rightLinks a").removeClass("activeRightLink");
            $(".notenavlink").addClass("activeRightLink");
        }
        //define parameters
        var key = $routeParams.id;
        var postType = $routeParams.type;
        var mode = $routeParams.mode;
        //if location is appForm, trigger textarea autosize
        if ($location.path() == "/appForm") {
            $timeout(function() {
                autosize($('textarea'));
            }, 1000)
        }
        //if parameters contain an id, this will be used to edit the information
        if ($routeParams.id) {
            $timeout(function() {
                if (postType == "jscript") {
                    for (var i = 0; i < $scope.scripts.length; i++) {
                        if ($scope.scripts[i].key == key) {
                            $scope.setFormValuesForEdit($scope.scripts[i]);
                        }
                    }
                } else if (postType == "markup") {
                    for (var i = 0; i < $scope.markup.length; i++) {
                        if ($scope.markup[i].key == key) {
                            $scope.setFormValuesForEdit($scope.markup[i]);
                        }
                    }
                } else if (postType == "css") {
                    for (var i = 0; i < $scope.css.length; i++) {
                        if ($scope.css[i].key == key) {
                            $scope.setFormValuesForEdit($scope.css[i]);
                        }
                    }
                } else if (postType == "notes") {
                    for (var i = 0; i < $scope.notes.length; i++) {
                        if ($scope.notes[i].key == key) {
                            $scope.setFormValuesForEdit($scope.notes[i]);
                        }
                    }
                }
            })
        }
    })

    $scope.setFormValuesForEdit = function(obj) {
        $("label[for='select']").removeClass("control-label");
        //dont allow changing of base type
        $('option:not(:selected)').attr('disabled', true);
        //change title from add something new to edit
        $(".formTitle").text("Edit");
        //show edit button
        $("#submitEditPost").removeClass("hide");
        //hide create new submit button
        $("#submitPost").addClass("hide");
        //define obj parameter properties
        var type = obj.type;
        var title = obj.title;
        var description = obj.description;
        var body = obj.body;
        var tags = obj.tags;
        //set form fields to values of define properties
        $("#selectType").val(type);
        $("#title").val(title);
        $("#description").val(description);
        $("#body").val(body);
        //this.tags referes to ng-model tags, as tags are stored as an array of objects
        this.tags = tags
    }

    $scope.editPost = function(event) {
        var ele = event.target;
        var key = $(ele).attr("data-key");
        for (var i = 0; i < $scope.all.length; i++) {
            if ($scope.all[i].key == key) {
                $window.location.href = "#!appForm?mode=edit&id=" + $scope.all[i].key + "&type=" + $scope.all[i].type;
            }
        }
    }
    $scope.submitEditPost = function(event) {
        //set tags to null if empty to prevent firebase from removing property
        if (this.tags == "") {
            this.tags = null
        }
        var key = $routeParams.id;
        var type = $routeParams.type;
        var postRef = "";
        if (type == "markup") {
            database.ref(type + "/" + key).update({
                updated: today,
                type: type,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            })
        } else if (type == "css") {
            database.ref(type + "/" + key).update({
                updated: today,
                type: type,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });

        } else if (type == "jscript") {
            database.ref(type + "/" + key).update({
                updated: today,
                type: type,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });

        } else if (type == "notes") {
            database.ref(type + "/" + key).update({
                updated: today,
                type: type,
                title: $("#title").val(),
                description: $("#description").val(),
                body: $("#body").val(),
                tags: angular.fromJson(angular.toJson(this.tags))
            });
        }
        for (var i = 0; i < $scope.all.length; i++) {
            if ($scope.all[i].key == key) {
                $scope.all.splice(i, 1);
            }
        }
        clearFormFields();
        //$window.location.reload();
        $(".formTitle").text("Add something new");
        $("#selectType").attr("readonly", false);
    }

    $scope.showSidenav = function() {
        $(".sidenav").show();
    }
    $scope.clearActiveLinkColor = function() {
        $(".rightLinks a").removeClass("activeRightLink");
    }

})