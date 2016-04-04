var favorite = {};
var globalFunction = {};
//var adminurl = "http://192.168.0.117:1337/";
var adminurl = "http://104.197.111.152/";
var balance = 0;
var myBalance = 0;
angular.module('starter.controllers', ['ui.bootstrap', 'ngCordova', 'angular-loading-bar'])

.controller('AppCtrl', function($ionicPlatform, $scope, $ionicModal, $timeout, MyServices, $ionicPopup, $location, $filter, $state, $interval) {

    globalFunction.readMoney = function(returnfunc) {
        MyServices.readMoney({
            "consumer": $.jStorage.get("user").consumer_id
        }, function(data) {
            if (data.value) {
                $.jStorage.set("balance", data.comment.balance);
                $scope.myBalance = {};
                $scope.myBalance.balance = data.comment.balance;
                myBalance = data.comment.balance;
                returnfunc(data.comment.balance);
            }
        }, function(err) {});
        MyServices.findUser(MyServices.getUser(), function(data) {
            if (data.value) {
                MyServices.setUser(data);
                $scope.refreshNoti(data);
            }
        }, function(err) {});
    };

    globalFunction.addMoney = function(amt) {
        $scope.amtToAdd = amt;
        MyServices.getListOfCards(MyServices.getUser().consumer_id, function(data) {
            console.log(data);
            $scope.myCards = data.comment.cards;
            $scope.getCard();
        }, function(err) {
            if (err) {
                console.log(err);
            }
        })
    }
    globalFunction.addMoneyNew = function(obj) {
        var currentbal = 0;
        globalFunction.readMoney(function(bal) {
            currentbal = bal;
        })
        MyServices.netBanking(obj, function(data) {
            console.log(data);
            if (data.value == true) {
                // var ref = window.open(data.comment.payment_url);
                var ref = cordova.InAppBrowser.open(data.comment.payment_url, 'target=_system', 'location=no');
                ref.addEventListener('loadstop', function(event) {
                    console.log(event.url);
                    if (event.url == "http://wohlig.co.in/paisoapk/fail.html") {
                        ref.close();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Add Money',
                            template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                        });
                        alertPopup.then(function(res) {
                            alertPopup.close();
                            $state.go('app.home');
                        });
                    } else if (event.url == "http://wohlig.co.in/paisoapk/success.html") {
                        ref.close();
                        callWalletAdd();
                    }
                    // ref.close();
                    // $interval.cancel(callinterval);
                    // callWalletAdd();
                });
                // ref.addEventListener('exit', function(event) {
                //     $interval.cancel(callinterval);
                //     var alertPopup = $ionicPopup.alert({
                //         title: 'Add Money',
                //         template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                //     });
                //     alertPopup.then(function(res) {
                //         alertPopup.close();
                //         $state.go('app.home');
                //     });
                // });
                // var callinterval = $interval(function() {
                //     globalFunction.readMoney(function(bal) {
                //         if (bal > currentbal) {
                //             ref.close();
                //             $interval.cancel(callinterval);
                //             callWalletAdd();
                //         }
                //     })
                // }, 3000);
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });

        function callWalletAdd() {
            MyServices.walletAdd(obj, function(data) {
                console.log(data);
                if (data.value == true) {
                    var alertPopup = $ionicPopup.alert({
                        title: '',
                        template: '<h4 style="text-align:center;">Balance added to your wallet</h4>'
                    });
                    alertPopup.then(function(res) {
                        alertPopup.close();
                        $state.go('app.home');
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: '',
                        template: '<h4 style="text-align:center;">Something went wrong. Please try again later</h4>'
                    });
                    alertPopup.then(function(res) {
                        alertPopup.close();
                    });
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    $scope.addNewCard = function() {
        var cardLength = 0;
        MyServices.getListOfCards(MyServices.getUser().consumer_id, function(data) {
            console.log(data);
            cardLength = data.comment.cards.length;
        }, function(err) {
            if (err) {
                console.log(err);
            }
        })
        MyServices.addNewCard(MyServices.getUser().consumer_id, function(data) {
            console.log(data);
            var ref = cordova.InAppBrowser.open(data.link, 'target=_system', 'location=no');
            // var ref = window.open(data.link);
            var watchInterval = $interval(function() {
                MyServices.getListOfCards(MyServices.getUser().consumer_id, function(data) {
                    console.log(data);
                    if (data.comment.cards.length > cardLength) {
                        $interval.cancel(watchInterval);
                        ref.close();
                        $scope.myCards = data.comment.cards;
                    }
                }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }, 3000);
            ref.addEventListener('exit', function(event) {
                $interval.cancel(watchInterval);
            });
        }, function(err) {
            if (err)
                console.log(err);
        });
    }

    $scope.callAddBalance = function(card) {
        console.log(card);
        $scope.cardDetails = card;
        $scope.cardDetails.amount = $scope.amtToAdd;
        $scope.closeGetCard();
        var myPopup = $ionicPopup.show({
            template: '<p>Card Name : {{cardDetails.card_id_by_consumer}}</p><p>Exp. : {{cardDetails.expiry_month}}/{{cardDetails.expiry_year}}</p><p>Amount : {{cardDetails.amount}}</p><input type="tel" ng-model="cardDetails.cvv" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
            title: 'Enter CVV Code',
            subTitle: 'Enter the 3-digit CVV :',
            scope: $scope,
            buttons: [{
                text: '<h5>Cancel</h5>',
                onTap: function(e) {
                    myPopup.close();
                }
            }, {
                text: '<h5>OK</h5>',
                onTap: function(e) {
                    myPopup.close();
                    console.log($scope.cardDetails);
                    var userDetails = MyServices.getUser();
                    var obj = {};
                    obj.consumer = userDetails.consumer_id;
                    obj.amount = $scope.cardDetails.amount;
                    obj.email = userDetails.email;
                    obj.token = $scope.cardDetails.user_card_unique_token;
                    obj.cvv = $scope.cardDetails.cvv;
                    obj.user = userDetails._id;
                    obj.name = userDetails.name;
                    obj.url = adminurl + "user/responseCheck";
                    if (userDetails.referrer)
                        obj.referrer = userDetails.referrer;
                    else
                        obj.referrer = "";
                    var currentbal = 0;
                    globalFunction.readMoney(function(bal) {
                        currentbal = bal;
                    })
                    MyServices.addToWallet(obj, function(data) {
                        console.log(data);
                        if (data.value == true) {
                            // var ref = window.open(data.comment.payment_url);
                            var ref = cordova.InAppBrowser.open(data.comment.payment_url, 'target=_system', 'location=no');
                            var callinterval = $interval(function() {
                                globalFunction.readMoney(function(bal) {
                                    if (bal > currentbal) {
                                        ref.close();
                                        $interval.cancel(callinterval);
                                        callWalletAdd();
                                    }
                                })
                            }, 3000);
                        }
                    }, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })

                    function callWalletAdd() {
                        MyServices.walletAdd(obj, function(data) {
                            console.log(data);
                            if (data.value == true) {
                                var alertPopup = $ionicPopup.alert({
                                    title: '',
                                    template: '<h4 style="text-align:center;">Balance added to your wallet</h4>'
                                });
                                alertPopup.then(function(res) {
                                    alertPopup.close();
                                    $state.go('app.home');
                                });
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: '',
                                    template: '<h4 style="text-align:center;">Something went wrong. Please try again later</h4>'
                                });
                                alertPopup.then(function(res) {
                                    alertPopup.close();
                                });
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            }]
        })
    }

    $ionicModal.fromTemplateUrl('templates/getcard-modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal5 = modal;
    });
    $scope.closeGetCard = function() {
        $scope.modal5.hide();
    };
    $scope.getCard = function() {
        $scope.modal5.show();
    };
    if ($.jStorage.get("user")) {
        globalFunction.readMoney(function(bal) {});
    }
    $scope.user = {};
    $scope.user = MyServices.getUser();
    $scope.loginData = {};
    $scope.canfavorite = false;
    if ($.jStorage.get("os") === "android") {
        document.addEventListener("offline", onOffline, false);

        function onOffline() {
            console.log("listening");
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: '<h4 style="text-align:center;">Please check your internet connection</h4>'
            });
            alertPopup.then(function(res) {
                alertPopup.close();
            });

        };
    }

    $scope.isIOS = false;
    var IOS = ionic.Platform.isIOS();
    var Android = ionic.Platform.isAndroid();
    if (IOS) {
        $scope.isIOS = true;
    } else if (Android) {
        $scope.isIOS = false;
    }
    $scope.refreshUser = function() {
        if (MyServices.getUser()) {
            $scope.user = MyServices.getUser();
        }
    };

    $scope.refreshUser();
    $scope.refreshUserApply = function() {
        console.log("refreshUserApply");
        $scope.refreshUser();
        console.log($scope.user);
        $scope.$apply();
    };
    $scope.favoritePage = function() {
        $scope.canfavorite = true;
    };
    $scope.activefav = false;
    $scope.nofavoritePage = function() {
        $scope.canfavorite = false;
    };
    $scope.nofavoritePage();

    favorite.brand = {};
    favorite.getBrand = function(data) {
        favorite.brand._id = data;
    };
    favorite.pushFavorite = function() {
        $scope.refreshUser();
        console.log("here");
        if ($scope.activefav === false) {
            $scope.updateData = {
                _id: $scope.user._id,
                favorite: $scope.user.favorite
            };
            $scope.updateData.favorite.unshift(favorite.brand);
            MyServices.updateUser($scope.updateData, function(data) {
                if (data.value == true) {
                    $scope.activefav = true;
                    $scope.refreshUser();
                }
            }, function(err) {

            });
        } else if ($scope.activefav === true) {
            $scope.updateData = {
                _id: $scope.user._id,
                favorite: $scope.user.favorite
            };
            $scope.updateData.favorite = _.dropWhile($scope.updateData.favorite, {
                '_id': favorite.brand._id
            });
            MyServices.updateUser($scope.updateData, function(data) {
                console.log(data);
                if (data.value == true) {
                    $scope.activefav = false;
                    $scope.refreshUser();
                }
            }, function(err) {

            });

        }


    };
    favorite.setActive = function(val) {
        $scope.activefav = val;
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    $scope.login = function() {
        $scope.modal.show();
    };
    if (MyServices.getUser()) {
        $location.url("/app/home");
    } else {
        $location.url("/login");
    }


    $scope.referralBadge = undefined;

    $scope.testCall = function() {
        console.log("in here");
    };
    $scope.count = 0;
    $scope.refreshNoti = function(item) {
        $scope.count = 0;
        _.each(item.notification, function(key) {
            if (key.read === false)
                $scope.count++;
        });
    };
    $scope.refreshNoti($scope.user);
    $scope.menu = [{
        title: 'Home',
        url: '#/app/home',
        state: true,
        icon: "ln-home3"
    }, {
        title: 'Wallet',
        url: '#/app/wallet',
        state: false,
        icon: "ln-cash"
    }, {
        title: 'Send Money',
        url: '#/app/sendmoney',
        state: false,
        icon: "ln-arrow-right2"
    }, {
        title: 'Passbook',
        url: '#/app/passbook',
        state: false,
        icon: "ln-book-closed"
    }, {
        title: 'Transactions',
        url: '#/app/transaction',
        state: false,
        icon: "ln-history"
    }, {
        title: 'Referral',
        url: '#/app/referral',
        state: false,
        badgecount: $scope.referralBadge,
        icon: "ln-users"
    }, {
        title: 'Terms',
        url: '#/app/terms',
        state: false,
        icon: "ln-clipboard"
    }, {
        title: 'Notification',
        url: '#/app/notification',
        state: false,
        icon: "ion-android-notifications-none"
    }, {
        title: 'Contact Us',
        url: '#/app/contact',
        state: false,
        icon: "ln-phone"
    }, {
        title: 'Logout',
        url: '#',
        state: false,
        icon: "ln-exit"
    }];

    $scope.activateMenu = function(index) {
        $scope.refreshUser()
        console.log($scope.menu[index].title);
        if ($scope.menu[index].title === "Logout") {
            MyServices.logoutUser($scope.user, function(data) {
                if (data.value == true) {
                    $scope.user = null;
                    $.jStorage.flush();
                    console.log(MyServices.getUser());
                    $location.path('login');
                }
            }, function(err) {

            });
        }
        for (var i = 0; i < $scope.menu.length; i++) {
            $scope.menu[i].state = false;
        }
        $scope.menu[index].state = true;
    };

    $scope.openNotification = function() {
        $location.path('/app/notification');
    };
    $scope.favoriteIt = function(data) {
        console.log(data);
    };

    //    GLOBAL update user function

    $scope.updateUser = function(user) {
        console.log(user);
        $scope.flag = undefined;
        if (user.balance >= 0)
            MyServices.updateUser(user, function(data2) {
                if (data2) {
                    console.log(data2);
                    if (data2.value === false)
                        $scope.flag = false;
                    else
                        $scope.flag = true;
                }
            }, function(err) {});
        else
            $scope.flag = false;
        console.log($scope.flag);
        if ($scope.flag === false)
            return false;
        else
            return true;
        return $scope.flag;
    };

    //    GLOBAL addTransaction updateTransaction function

    $scope.addTransaction = function(transaction) {
        $scope.flag = undefined;
        MyServices.addTransaction(transaction, function(data2) {
            if (data2) {
                console.log(data2);
                if (data2.value === false)
                    $scope.flag = false;
                else
                    $scope.flag = true;
            }
        }, function(err) {});
        console.log($scope.flag);
        if ($scope.flag === false)
            return false;
        else
            return true;
    };

    $scope.alertUser = function(alertTitle, alertDesc, link) {
        var alertPopup = $ionicPopup.alert({
            title: alertTitle,
            template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
        });
        alertPopup.then(function(res) {
            if (link)
                $location.path(link);
        });
    };

})

.controller('PlaylistsCtrl', function($scope) {})
    .controller('SearchCtrl', function($scope) {})

.controller('LoginCtrl', function($scope, $stateParams, $ionicPlatform, $location, MyServices, $ionicScrollDelegate, $ionicModal, $ionicPopup, $filter, $timeout) {
    $scope.isIOS = false;
    var IOS = ionic.Platform.isIOS();
    var Android = ionic.Platform.isAndroid();
    if (IOS) {
        $scope.isIOS = true;
    } else if (Android) {
        $scope.isIOS = false;
    }

    $scope.phone1 = {};
    $scope.alertUser = function(alertTitle, alertDesc, link) {
        var alertPopup = $ionicPopup.alert({
            title: alertTitle,
            template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
        });
        alertPopup.then(function(res) {
            if (link)
                $location.path(link);
        });
    };
    $ionicPlatform.registerBackButtonAction(function(event) {
        event.preventDefault();
    }, 100);
    $scope.phone = MyServices.getDevice();
    $scope.confirmP = "Confirm Password";
    $scope.hideButtonOnInput = {
        left: false,
        right: false
    };
    $scope.confirmpassword = "";
    if (MyServices.getUser()) {
        $location.url("/app/home");
    }

    $scope.login = {};
    $scope.signup = {};
    $scope.signup.notificationtoken = {};
    $scope.activate = true;
    $scope.tab = {
        left: true,
        right: false
    };

    var options = {
        date: new Date(),
        mode: 'date', // or 'time',
        maxDate: new Date() - 1,
        allowOldDates: true,
        allowFutureDates: false,
        androidTheme: 3
    };

    function onSuccess(date) {
        $scope.signup.date = $filter('date')(date, 'dd/MM/yyyy');
        $scope.$apply();
        console.log($scope.signup.date);
    }

    $scope.openDate = function() {
        datePicker.show(options, onSuccess);
    }

    $scope.sendSMS = function(message) {
        console.log(message);
        $scope.flag = undefined;
        MyServices.sendSMS(message, function(data2) {
            if (data2) {
                console.log(data2);
                if (data2.value === false)
                    $scope.flag = false;
                else
                    $scope.flag = true;
            }
        }, function(err) {});
        if ($scope.flag === false)
            return false;
        else
            return true;
        return $scope.flag;
    };

    $scope.highlight = false;
    $scope.clickTab = function(side) {
        $ionicScrollDelegate.scrollTop();
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
            $scope.hideButtonOnInput.left = false;
            $scope.hideButtonOnInput.right = true;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            $scope.hideButtonOnInput.right = false;
            $scope.hideButtonOnInput.left = true;
        }
    };
    $scope.updateUser = function(user) {
        console.log(user);
        $scope.flag = undefined;
        if (user.balance >= 0)
            MyServices.updateUser(user, function(data2) {
                if (data2) {
                    console.log(data2);
                    if (data2.value === false)
                        $scope.flag = false;
                    else
                        $scope.flag = true;
                }
            }, function(err) {});
        else
            $scope.flag = false;
        console.log($scope.flag);
        if ($scope.flag === false)
            return false;
        else
            return true;
        return $scope.flag;
    };

    $scope.validateIt = {};
    $scope.validateLogin = function() {
        console.log("here");
        $scope.validateIt = {
            mobile: false,
            password: false
        };
        if ($scope.login.mobile === "" || $scope.login.mobile === null || $scope.login.mobile === undefined || $scope.login.mobile < 999999999)
            $scope.validateIt.mobile = true;
        if ($scope.login.password === "" || $scope.login.password === null || $scope.login.password === undefined)
            $scope.validateIt.password = true;
        console.log($scope.validateIt);
        if ($scope.validateIt.mobile === true || $scope.validateIt.password === true)
            return false;
        else
            return true;
    };
    $scope.doLogin = function() {
        console.log($scope.validateLogin());
        if ($scope.validateLogin()) {
            MyServices.loginUser($scope.login, function(data) {
                if (data) {
                    if (data.value === false) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login',
                            template: '<h5 style="text-align:center">Invalid data</h5>'
                        });
                        alertPopup.then(function(res) {

                        });
                    } else {
                        console.log("herer");
                        data.notificationtoken.deviceid = $.jStorage.get("device");
                        data.notificationtoken.os = $.jStorage.get("os");
                        MyServices.setUser(data);
                        var user = {
                            _id: data._id,
                            notificationtoken: data.notificationtoken
                        };
                        MyServices.updateUser(user, function(data2) {
                            if (data2) {
                                console.log(data2);
                                if (data2.value === false) {

                                } else {
                                    $location.url('app/home');
                                    $scope.user = MyServices.getUser();
                                }
                            }
                        }, function(err) {});
                    }
                    console.log(data);
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Login',
                template: '<h5 style="text-align:center">Mobile number or password is incorrect.</h5>'
            });
            alertPopup.then(function(res) {

            });
        }

    };
    $scope.ctrlUser = {};

    $scope.confirmed = undefined;
    $scope.checkPassword = function() {
        console.log("in confirmation");
        console.log($scope.signup.confirmpassword);
        console.log($scope.signup.password);
        if ($scope.signup.password != "" || $scope.signup.password != null || $scope.signup.password != undefined) {
            if ($scope.signup.confirmpassword === $scope.signup.password) {
                $scope.confirmed = true;
                $scope.confirmP = "Password matching";
                return true;
            } else {
                $scope.confirmed = false;
                return false;
            }
        }
    };
    $scope.type = "text";
    $scope.toggleDate = function() {

        if ($scope.type === "text")
            $scope.type = "date";
    };
    $scope.validate = {};
    $scope.referredUser = {};
    $scope.startSignup = function(input, formValidate) {
        if (formValidate.$valid) {
            $scope.checkDeviceID(input);
        } else {
            $scope.alertUser()
        }
    };

    $scope.checkReferral = function() {
        $scope.user = {
            mobile: $scope.signup.referrer
        };
        $scope.flag = undefined;
        MyServices.findUserByMobile($scope.user, function(data) {
            if (data._id) {
                console.log(data);
                $scope.referredUser = data;
                $scope.flag = true;
            } else {
                $scope.flag = false;
            }
        }, function(err) {
            $scope.flag = false;
        });
        if ($scope.flag === false)
            return false;
        else
            return true;
    };
    $scope.data = {};
    $scope.validateMobile = function() {
        $scope.usermobile = {
            mobile: $scope.signup.mobile,
            name: $scope.signup.name
        };
        MyServices.validateMobile($scope.usermobile, function(data) {
            console.log(data);
            if (data.value) {
                var alertPopup = $ionicPopup.alert({
                    template: '<h4 style="text-align:center;">The mobile number is already registered.</h4>'
                });
                alertPopup.then(function(res) {

                });
            } else {
                $scope.input = {};
                // An elaborate, custom popup
                // smsplugin.startReception(function (message) {
                //     console.log(message);
                //     $scope.input.otp = message.substr(message.length - 6);
                //     $scope.$apply();
                // }, function (err) {
                //     console.log(err);
                // });
                var myPopup = $ionicPopup.show({
                    template: '<input type="number" ng-model="input.otp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                    title: 'OTP Verification',
                    subTitle: 'Enter the 6-digit OTP :',
                    scope: $scope,
                    buttons: [{
                        text: '<h5>Cancel</h5>',
                        onTap: function(e) {
                            myPopup.close();
                        }
                    }, {
                        text: '<h5>Retry</h5>',
                        onTap: function(e) {
                            myPopup.close();
                            $scope.validateMobile();
                        }
                    }, {
                        text: '<b>Verify</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.input.otp) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                if ($scope.input.otp === data.otp) {
                                    $scope.checkDeviceID();
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        template: '<h4 style="text-align:center;">Invalid OTP.</h4>'
                                    });
                                    alertPopup.then(function(res) {

                                    });
                                }
                            }
                        }
                    }]
                });
                myPopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            }
        }, function(err) {

        });
    };


    $scope.checkOTP = function() {
        if ($scope.validateThis()) {
            if ($scope.signup.referrer === "" || $scope.signup.referrer === null || $scope.signup.referrer === undefined) {
                $scope.validateMobile();
            } else {
                $scope.item = {
                    mobile: $scope.signup.referrer
                };
                MyServices.findUserByMobile($scope.item, function(data) {
                    if (data._id) {
                        console.log("here1");
                        $scope.validateMobile();
                    } else {

                        var alertPopup = $ionicPopup.alert({
                            template: '<h4 style="text-align:center;">Referral ID does not exist. Invalid.</h4>'
                        });
                        alertPopup.then(function(res) {

                        });

                    }
                }, function(err) {

                });
            }
        } else {
            var alertPopup = $ionicPopup.alert({
                template: '<h4 style="text-align:center;">Invalid Data</h4>'
            });
            alertPopup.then(function(res) {

            });
        }
    };
    $scope.isRegistered = false;
    $scope.checkDeviceID = function(input) {
        $scope.isRegistered = false;
        if ($.jStorage.get("device") == null) {
            console.log("here");
            push = PushNotification.init({
                "android": {
                    "senderID": "965431280304",
                    "icon": "icon"
                },
                "ios": {
                    "alert": "true",
                    "badge": "true",
                    "sound": "true"
                },
                "windows": {}
            });

            push.on('registration', function(data) {

                console.log(data);
                $.jStorage.set("device", data.registrationId);
                $scope.isRegistered = true;
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();
                if (isIOS) {
                    $.jStorage.set("os", "ios");
                } else if (isAndroid) {
                    $.jStorage.set("os", "android");
                }


            });

            push.on('notification', function(data) {
                console.log(data);
            });

            push.on('error', function(e) {
                console.log("ERROR");
                console.log(e);
            });
            if ($scope.isRegistered) {
                $scope.statusSignup(input);
            } else {
                $timeout(function() {
                    $scope.checkDeviceID(input);
                }, 3000);
            }
        } else {
            $scope.statusSignup(input);
        }
    };
    $scope.statusSignup = function(input) {
        MyServices.checkMob({
            mobile: input.mobile
        }, function(data) {
            if (data.value == true) {
                $.jStorage.set("consumer_id", data.comment.consumer_id);
                input.consumer_id = $.jStorage.get("consumer_id");
                input.notificationtoken.deviceid = $.jStorage.get("device");
                input.notificationtoken.os = $.jStorage.get("os");
                $scope.userExistSignup(input);
            } else {
                $scope.doSignup(input);
            }
        }, function(err) {

        })
    };
    $scope.userExistSignup = function(input) {
        MyServices.generateOtpForDebit(input.consumer_id, function(data) {
            $scope.input = {};
            if (data.value) {
                var myPopup = $ionicPopup.show({
                    template: '<input type="tel" ng-model="input.otp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                    title: 'OTP Verification',
                    subTitle: 'Enter the 6-digit OTP :',
                    scope: $scope,
                    buttons: [{
                        text: '<h5>Cancel</h5>',
                        onTap: function(e) {
                            myPopup.close();
                        }
                    }, {
                        text: '<h5>Retry</h5>',
                        onTap: function(e) {

                            myPopup.close();
                            $scope.userExistSignup(input);
                        }
                    }, {
                        text: '<b>Verify</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.input.otp) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                MyServices.validateOTP({
                                    consumer: $.jStorage.get("consumer_id"),
                                    otp: $scope.input.otp
                                }, function(data2) {
                                    if (!data2.value && data2.comment.error_code == "103") {
                                        MyServices.signupUser(input, function(signup) {
                                            if (signup.value == true) {
                                                $location.url('app/home');
                                                $.jStorage.set("user", signup.user);
                                            } else {
                                                $scope.alertUser("signup", "unable to signup");
                                            }
                                        }, function(err) {

                                        })
                                    } else {
                                        $scope.alertUser("incorrect OTP", "please retry");
                                    }
                                }, function(err) {

                                })
                            }
                        }
                    }]
                });
            }
        }, function(err) {

        })
    };
    $scope.checkDeviceIDLogin = function() {
        $scope.isRegistered = false;
        if ($.jStorage.get("device") == null) {
            console.log("here");
            push = PushNotification.init({
                "android": {
                    "senderID": "965431280304",
                    "icon": "icon"
                },
                "ios": {
                    "alert": "true",
                    "badge": "true",
                    "sound": "true"
                },
                "windows": {}
            });

            push.on('registration', function(data) {

                console.log(data);
                $.jStorage.set("device", data.registrationId);
                $scope.isRegistered = true;
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();
                if (isIOS) {
                    $.jStorage.set("os", "ios");
                } else if (isAndroid) {
                    $.jStorage.set("os", "android");
                }


            });

            push.on('notification', function(data) {
                console.log(data);
            });

            push.on('error', function(e) {
                console.log("ERROR");
                console.log(e);
            });
            if ($scope.isRegistered) {
                $scope.doLogin();
            } else {
                $timeout(function() {
                    $scope.checkDeviceIDLogin();
                }, 3000);
            }
        } else {
            $scope.doLogin();
        }
    };
    $scope.referralData = {};
    var attempt = 0;
    // smsplugin.startReception(function (message) {
    //     console.log(message);
    //     $scope.input.otp = message.substr(message.length - 6);
    //     $scope.$apply();
    // }, function (err) {
    //     console.log(err);
    // });
    $scope.doSignup = function(input) {
        delete input.confirmpassword;
        var request = {
            mobile: input.mobile,
            email: input.email,
            referrer: input.referrer,
            name: input.name
        };
        MyServices.register(request, function(data) {
            if (data.value) {
                $.jStorage.set("consumer_id", data.comment.consumer_id);
                $scope.input = {};
                // An elaborate, custom popup
                smsplugin.startReception(function(message) {
                    console.log(message);
                    $scope.input.otp = message.toString().substr((message.length - 25), 6);
                    $scope.$apply();
                    smsplugin.stopReception(function() {}, function() {});
                }, function(err) {
                    console.log(err);
                });
                var myPopup = $ionicPopup.show({
                    template: '<input type="tel" ng-model="input.otp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                    title: 'OTP Verification',
                    subTitle: 'Enter the 6-digit OTP :',
                    scope: $scope,
                    buttons: [{
                        text: '<h5>Cancel</h5>',
                        onTap: function(e) {
                            myPopup.close();
                        }
                    }, {
                        text: '<h5>Retry</h5>',
                        onTap: function(e) {
                            myPopup.close();
                        }
                    }, {
                        text: '<b>Verify</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.input.otp) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                MyServices.validateOTP({
                                    consumer: $.jStorage.get("consumer_id"),
                                    otp: $scope.input.otp
                                }, function(data) {
                                    if (data.value) {
                                        input.consumer_id = $.jStorage.get("consumer_id");
                                        input.notificationtoken.deviceid = $.jStorage.get("device");
                                        input.notificationtoken.os = $.jStorage.get("os");
                                        MyServices.signupUser(input, function(signup) {
                                            if (signup.value == true) {
                                                $location.url('app/home');
                                                $.jStorage.set("user", signup.user);
                                            } else {
                                                $scope.alertUser("signup", "unable to signup");
                                            }
                                        }, function(err) {

                                        })
                                    } else {
                                        $scope.alertUser("incorrect OTP", "please retry");
                                    }
                                }, function(err) {

                                })
                            }
                        }
                    }]
                });
                myPopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            } else {
                if (data.comment.error_code == "104") {
                    $scope.alertUser("create user", "referrer number is not on PAiSO");
                } else if (data.comment.error_code == "101") {
                    $scope.alertUser("create user", "Mobile number alredy exists");
                }
            }
        }, function(err) {
            console.log(err);
            if (err) {

            }
        });
    };
    $scope.forgot = {};
    $ionicModal.fromTemplateUrl('templates/forgotpassword.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal3 = modal;
    });
    $scope.closeForgotPassword = function() {
        $scope.modal3.hide();
    };
    $scope.forgotPassword = function() {
        $scope.modal3.show();
    };
    $scope.forgotPass = function() {
        $scope.validate.mobile = false;
        if ($scope.forgot.mobile == null || $scope.forgot.mobile == undefined || $scope.forgot.mobile == "") {
            $scope.validate.mobile = true;
        } else {
            var param = {
                mobile: $scope.forgot.mobile
            };
            MyServices.forgotPass(param, function(data) {
                console.log(data);
                if (data.value == true) {
                    var alertPopup = $ionicPopup.alert({
                        template: '<h4 style="text-align: center;margin-bottom:0">Login with password provided in email</h4>'
                    });
                    alertPopup.then(function(res) {
                        $scope.closeForgotPassword();
                    });
                }
            }, function(err) {
                console.log(err);
            });
        }
    };
})

.controller('HomeCtrl', function($scope, $stateParams, MyServices, $location, $ionicSlideBoxDelegate, $ionicLoading, $ionicPopup, $timeout) {

    $scope.nofavoritePage();
    $scope.banners = [];
    $scope.user = {};
    $scope.favdata = {};
    $scope.navTitle = '<img class="title-image" src="img/title.png">';
    globalFunction.readMoney(function(bal) {
        $scope.myBalance = {
            balance: bal
        };
    });
    $scope.user = MyServices.getUser();
    $scope.refreshUser = function() {
        MyServices.findUser($scope.user, function(data) {
            if (data.value) {
                MyServices.setUser(data);
                $scope.user = MyServices.getUser();
            }
        }, function(err) {

        });
    };
    $scope.refreshUser();

    $scope.favorites = $scope.user.favorite;
    $scope.chunkedFav = _.chunk($scope.favorites, 2);
    console.log($scope.chunkedFav);
    $scope.refreshNoti($scope.user);
    $scope.category = [];
    $scope.refreshUser();
    $scope.show = function() {
        // $ionicLoading.show({
        //     template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
        // });
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };
    $scope.show();
    $timeout(function() {
        $scope.hide();
    }, 3000);
    MyServices.findCategories(function(data) {
        if (data) {
            $scope.category = _.chunk(data, 2);
            console.log(data);
        }
    }, function(err) {
        if (err) {
            console.log(err);
        }
    });
    MyServices.findBanner(function(data) {
        $scope.hide();
        if (data) {
            $scope.banners = data;
            console.log($scope.banners);
            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.loop(true);
        }
    }, function(err) {
        if (err) {
            console.log(err);
        }
    });
    $scope.slideIsSelected = function(index) {
        console.log($scope.banners[index]);
        $location.path("/app/redeem/" + $scope.banners[index].vendorid);
    };
    $scope.routeCategory = function(object) {
        console.log(object);
        if (object.listview === false) {
            $location.path('app/gridview/' + object._id);
        } else {
            $location.path('app/listview/' + object._id);
        }
    };
    $scope.expandFavorites = function() {
        $scope.refreshUser();
        _.each($scope.favorites, function(key) {
            if (key) {
                $scope.favdata.id = key._id;
                MyServices.findVendor($scope.favdata, function(data) {
                    if (data) {
                        key.name = data.name;
                        key.imgurl = data.logourl;
                    }
                }, function(err) {

                });
            }

        });
    };
    $scope.expandFavorites();

    //popup success
    $scope.showAlert = function() {

        var alertPopup = $ionicPopup.alert({

            template: 'This is alert popup',

        });

        alertPopup.then(function(res) {

            console.log('Thanks');

        });

    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('ReferralCtrl', function($scope, $stateParams, $ionicBackdrop, $timeout, MyServices) {
    $scope.nofavoritePage();
    globalFunction.readMoney(function(bal) {});
    $scope.user = MyServices.getUser();
    $scope.refreshUser = function() {
        MyServices.findUser($scope.user, function(data) {
            if (data.value) {
                console.log(data);
                MyServices.setUser(data);
                $scope.user = MyServices.getUser();
            }
        }, function(err) {

        });
    };
    $scope.refreshUser();
    $scope.refreshNoti($scope.user);
    $scope.friendlist = [];
    $scope.referralmoney = 0;
    $scope.getThisUser = function(id, amountearned) {
        $scope.user = {
            _id: id
        };
        console.log(id);
        MyServices.findUser($scope.user, function(data) {

            if (data) {
                console.log(data);
                data.amountearned = amountearned;
                $scope.referralmoney += data.amountearned;
                $scope.friendlist.unshift(data);
            }
        }, function(err) {});
    };
    var i = 0;
    if ($scope.user.referral != null || $scope.user.referral != undefined)
        _.each($scope.user.referral, function(key) {
            $scope.getThisUser(key._id, key.amountearned);
        });
    console.log($scope.friendlist);
    $scope.sharebutton = false;
    $timeout(function() {
        $scope.sharebutton = true;
    }, 1000);
    $scope.in = $scope.$index;
    $scope.friends = [{
        name: 'Rohan',
        imgurl: 'img/profile.jpg',
        price: 350
    }, {
        name: 'Chirag',
        imgurl: 'img/profile.jpg',
        price: 390
    }, {
        name: 'Tushar',
        imgurl: 'img/profile.jpg',
        price: 500
    }, {
        name: 'Chintan',
        imgurl: 'img/profile.jpg',
        price: 450
    }, {
        name: 'Mahesh',
        imgurl: 'img/profile.jpg',
        price: 390
    }, {
        name: 'Jay',
        imgurl: 'img/profile.jpg',
        price: 450
    }, {
        name: 'Amit',
        imgurl: 'img/profile.jpg',
        price: 450
    }];



    $scope.shareIt = function() {
        $ionicBackdrop.retain();
        $timeout(function() {
            $ionicBackdrop.release();
        }, 1000);
        window.plugins.socialsharing.share('Hey, Check this out! Now get more and more money on your balance, only on PAiSO App! Download the app from playstore and use the following referral code: ' + $scope.user.mobile);
    };
})

.controller('ContactCtrl', function($scope, $stateParams, $ionicScrollDelegate) {
    $scope.nofavoritePage();
    globalFunction.readMoney(function(bal) {});
    $scope.oneAtATime = true;
    $scope.activate = true;
    $scope.tab = {
        left: true,
        right: false
    }
    $scope.highlight = false;
    $scope.clickTab = function(side) {
        $ionicScrollDelegate.scrollTop();
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            console.log("here");
        }
    };
})

.controller('PassbookCtrl', function($scope, $stateParams, $ionicScrollDelegate, MyServices) {
    $scope.nofavoritePage();
    $scope.user = {};
    globalFunction.readMoney(function(bal) {});
    $scope.user = MyServices.getUser();
    $scope.refreshUser = function() {
        MyServices.findUser($scope.user, function(data) {
            if (data.value) {
                console.log(data);
                MyServices.setUser(data);
                $scope.user = MyServices.getUser();
            }
        }, function(err) {

        });
    };
    $scope.refreshUser();
    $scope.refreshNoti($scope.user);

    $scope.availableFlags = {};
    $scope.available = [];
    $scope.used = [];
    $scope.activate = true;
    $scope.tab = {
        left: false,
        center: true,
        right: false
    }
    $scope.passbookAvailable = {
        from: $scope.user._id,
        type: "redeem",
        passbook: "available"
    };
    $scope.moveToUsed = function(transaction) {
        transaction.passbook = "used";
        delete transaction.vendorname;
        transaction.redeemedon = new Date();
        if ($scope.addTransaction(transaction)) {
            $scope.tab.left = false;
            $scope.tab.center = false;
            $scope.tab.right = true;
            $ionicScrollDelegate.scrollTop();
            $scope.loadUsed();
            $scope.openUp(0);
        } else {
            console.log("unable to move");
        }

    };
    $scope.loadUsed = function() {
        $scope.passbookUsed = {
            from: $scope.user._id,
            type: "redeem",
            passbook: "used"
        };
        MyServices.findPassbookEntry($scope.passbookUsed, function(data) {
                if (data) {
                    $scope.used = data;
                    console.log($scope.used);
                    _.each($scope.used, function(key) {
                        $scope.item.id = key.to;
                        MyServices.findVendor($scope.item, function(data) {
                                if (data) {
                                    key.vendorname = data.name;
                                }
                            },
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });
                }
            },
            function(err) {

            });
    };

    $scope.loadPassbook = function() {
        MyServices.findPassbookEntry($scope.passbookAvailable, function(data) {
                if (data) {
                    $scope.available = data;
                    $scope.item = {};
                    console.log($scope.available);
                    _.each($scope.available, function(key) {
                        $scope.item.id = key.to;
                        MyServices.findVendor($scope.item, function(data) {
                                if (data) {
                                    key.vendorname = data.name;
                                }
                            },
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });
                }
            },
            function(err) {

            });
    };
    $scope.loadPassbook();
    $scope.clickTab = function(side) {
        $ionicScrollDelegate.scrollTop();
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
            $scope.tab.center = false;
        } else if (side === "center") {
            $scope.tab.right = false;
            $scope.tab.left = false;
            $scope.tab.center = true;
            $scope.loadPassbook();
            //                $scope.openUp(0);
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            $scope.tab.center = false;
            $scope.loadUsed();
            $scope.openUp(0);
        }
    };
    $scope.openUp = function(index) {
        $scope.highlight = true;
        console.log(index);
        if ($scope.tab.center === true) {
            for (var i = 0; i < $scope.available.length; i++) {
                $scope.availableFlags[i] = false;
            }
        } else if ($scope.tab.right === true) {
            for (var i = 0; i < $scope.used.length; i++) {
                $scope.availableFlags[i] = false;
            }
        }
        //                        _.each($scope.availableFlags, function (n) {
        //                            $scope.availableFlags[n] = false;
        //                            console.log($scope.availableFlags[n]);
        //                        });
        //                        $scope.availableFlags[index]=true;
        //                        console.log($scope.availableFlags[index]);
        $scope.availableFlags[index] = $scope.availableFlags[index] === true ? false : true;
        console.log($scope.availableFlags[index]);
    };

})

.controller('SendMoneyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $location) {
    $scope.nofavoritePage();
    globalFunction.readMoney(function(bal) {
        $scope.myBalance = {
            balance: bal
        }
    })
    $scope.send = {};
    $scope.user = {};
    $scope.user = MyServices.getUser();
    $scope.refreshUser = function() {
        MyServices.findUser($scope.user, function(data) {
            if (data.value) {
                console.log(data);
                MyServices.setUser(data);
                $scope.user = MyServices.getUser();
            }
        }, function(err) {

        });
    };
    $scope.selectContact = function() {
        navigator.contacts.pickContact(function(contact) {
            var selectedContact = contact.phoneNumbers[0].value;
            console.log(selectedContact);
            selectedContact = selectedContact.toString().split(' ').join('');
            selectedContact = selectedContact.split('-').join('');
            selectedContact = selectedContact.split('(').join('');
            selectedContact = selectedContact.split(')').join('');
            console.log("after trimming :" + selectedContact);

            if (selectedContact.substring(0, 3) == "+91") {
                $scope.send.mobile = selectedContact.substring(3);
                console.log("+91 number : " + $scope.send.mobile);
            } else if (selectedContact.substring(0, 2) == "91" && selectedContact.length > 10) {
                $scope.send.mobile = selectedContact.substring(2);
                console.log("91 number : " + $scope.send.mobile);
            } else {
                $scope.send.mobile = selectedContact;
                console.log("as is : " + $scope.send.mobile);
            }
            $scope.$apply();
        }, function(err) {
            console.log('Error: ' + err);
        });
    };
    $scope.ctrlUser = {};
    $scope.refreshUser();
    $scope.refreshNoti($scope.user);

    $scope.alertUser = function(alertTitle, alertDesc, link) {
        var alertPopup = $ionicPopup.alert({
            title: alertTitle,
            template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
        });
        alertPopup.then(function(res) {
            if (link)
                $location.path('app/wallet');
        });
    };
    $scope.sendIt = function() {
        $scope.ctrlUser = $scope.user;
        $scope.dirty = {
            mobile: false,
            amount: false,
            comment: false
        };
        if ($scope.send.mobile === null || $scope.send.mobile === undefined || $scope.send.mobile === "" || $scope.send.mobile === 0) {
            $scope.dirty.mobile = true;
        } else {
            if ($scope.send.amount === null || $scope.send.amount === undefined || $scope.send.amount === "" || $scope.send.amount === 0) {
                $scope.dirty.amount = true;

            } else {
                // MyServices.findUserByMobile($scope.send, function(data) {
                //     if (data._id) {
                //         console.log(data);
                //         $scope.updateU1 = {
                //             _id: data._id,
                //             balance: data.balance + $scope.send.amount,
                //         };
                //         if ($scope.user._id === data._id) {
                //             $scope.alertUser("Send Money", "You cannot send money to yourself");
                //         } else if (($scope.user.balance - $scope.send.amount) <= 0) {
                //             $scope.alertUser("Send Money", "Not enough balance");
                //         } else {
                //
                //             var confirmPopup = $ionicPopup.confirm({
                //                 title: 'Send money',
                //                 template: '<h5 style="text-align: center;margin-bottom:0">Are you sure?</h5>'
                //             });
                //             confirmPopup.then(function(res) {
                //                 if (res) {
                //                     if ($scope.updateUser($scope.updateU1)) {
                //                         $scope.updateU2 = {
                //                             _id: $scope.user._id,
                //                             balance: $scope.ctrlUser.balance - $scope.send.amount
                //                         };
                //                         if ($scope.updateUser($scope.updateU2)) {
                //                             $scope.refreshUser();
                //                             $scope.transaction = {
                //                                 from: $scope.user._id,
                //                                 to: data._id,
                //                                 type: "sendmoney",
                //                                 amount: $scope.send.amount,
                //                                 comment: $scope.send.comment
                //                             };
                //                             if ($scope.addTransaction($scope.transaction)) {
                //                                 $scope.recieverNotify = {
                //                                     type: "sendmoney",
                //                                     deviceid: data.notificationtoken.deviceid,
                //                                     os: data.notificationtoken.os,
                //                                     user: data._id,
                //                                     comment: $scope.send.comment,
                //                                     amount: $scope.send.amount,
                //                                     name: $scope.user.name
                //                                 };
                //                                 var alertPopup = $ionicPopup.alert({
                //                                     template: '<h4 style="text-align: center;margin-bottom:0">Transaction successful.</h4>'
                //                                 });
                //                                 alertPopup.then(function(res) {
                //                                     MyServices.notify($scope.recieverNotify, function(data2) {
                //                                         $location.path('app/home');
                //                                     }, function(err) {
                //
                //                                     });
                //
                //                                 });
                //
                //
                //                             } else {
                //
                //                             }
                //                         } else {
                //                             //revert code for current logged in user
                //                         }
                //                     } else {
                //                         //revert code for reciever
                //                     }
                //                 } else {
                //                     $scope.send.mobile = undefined;
                //                     $scope.send.comment = undefined;
                //                     $scope.send.amount = undefined;
                //                 }
                //             });
                //         }
                //     } else {
                //         $scope.alertUser("Send Money", "The user is not on PAiSO.");
                //     }
                // }, function(err) {
                //
                // });
                globalFunction.readMoney(function(bal) {
                    if (bal >= $scope.send.amount) {
                        console.log("in else -> if");
                        var userDetails = MyServices.getUser();
                        var obj = {};
                        obj.consumer = userDetails.consumer_id;
                        obj.mobile = $scope.send.mobile;
                        obj.email = userDetails.email;
                        obj.amount = $scope.send.amount;
                        obj.message = $scope.send.comment;
                        obj.user = userDetails._id;
                        obj.name = userDetails.name;
                        MyServices.moneySend(obj, function(data) {
                            console.log(data);
                            if (data.value == false && data.comment == "No data found") {
                                $scope.alertUser("Send Money", "The user is not on PAiSO.");
                            }
                            if (data.value == false && data.comment && data.comment.status_code == "257") {
                                $scope.alertUser("Send Money", "You cannot send money to yourself");
                            }
                            if (data.value == true) {
                                var alertPopup = $ionicPopup.alert({
                                    title: "Send Money",
                                    template: '<h5 style="text-align: center;margin-bottom:0">Transaction successful.</h5>'
                                });
                                alertPopup.then(function(res) {
                                    $location.path('app/home');
                                });
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        $scope.alertUser("Send Money", "Not enough balance");
                    }
                })
            }
        }
    }
})

.controller('WalletCtrl', function($scope, $stateParams, $ionicScrollDelegate, MyServices, $ionicPopup, $location, $ionicSlideBoxDelegate, $ionicModal, $cordovaFileTransfer, $ionicLoading) {
    $scope.nofavoritePage();
    $scope.user = {};
    $scope.coupon = {};
    $scope.banners = [];

    $scope.user = MyServices.getUser();
    MyServices.findBanner(function(data) {

        if (data) {
            $scope.banners = data;
            console.log($scope.banners);
            $ionicSlideBoxDelegate.update();
        }
    }, function(err) {
        if (err) {
            console.log(err);
        }
    })
    MyServices.readMoney({
        "consumer": $.jStorage.get("user").consumer_id
    }, function(data) {
        console.log("balance : " + data.comment.balance);
        if (data.value) {
            $.jStorage.set("balance", data.comment.balance);
            $scope.myBalance = {};
            $scope.myBalance.balance = data.comment.balance;
        }
    }, function(err) {});

    $scope.refreshUser = function() {
        MyServices.findUser($scope.user, function(data) {
            if (data.value) {
                console.log(data);
                MyServices.setUser(data);
                $scope.user = MyServices.getUser();
            }
        }, function(err) {

        });
    };
    $scope.refreshUser();
    $scope.refreshNoti($scope.user);

    $scope.indicator = true;
    $scope.ctrlUser = {};
    $scope.refreshUser();
    $scope.wallet = {
        amount: undefined
    };
    if ($scope.user.upgraderequested) {
        $scope.upgradeText = "Request for upgrading monthly limit to Rs. 1,00,000 sent for approval";
    } else {
        $scope.upgradeText = "Upgrade your limit to 1,00,000";
    }
    $scope.monthlyRemaining = undefined;
    $scope.inTheSameMonth = function(d) {
        $scope.now = new Date();
        $scope.nowMonth = $scope.now.getMonth() + 1;
        $scope.checkMonth = d.getMonth() + 1;
        if ($scope.checkMonth === $scope.nowMonth)
            return true;
        else
            return false;
    };
    $scope.tab = {
        left: false,
        center: true,
        right: false
    }
    $scope.clickTab = function(side) {
        $ionicScrollDelegate.scrollTop();
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
            $scope.tab.center = false;
        } else if (side === "center") {
            $scope.tab.right = false;
            $scope.tab.left = false;
            $scope.tab.center = true;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            $scope.tab.center = false;
        }
    };
    $scope.isRemaining = function() {
        $scope.monthlyRemaining = null;
        $scope.transactions = [];
        $scope.today = new Date();
        if ($scope.today.getDay() === 0) {
            if ($scope.updatedKYC === true)
                $scope.user.amoutLimit = 100000;
            else
                $scope.user.amountLimit = 10000;
        }
        $scope.transaction = {
            type: "balance"
        };
        MyServices.findByType($scope.transaction, function(data) {
            if (data) {
                $scope.transactions = data;
            }
        }, function(err) {

        });

        _.each($scope.transactions, function(trans) {
            if (trans != null || trans != undefined)
                if (trans.from === trans.to) { // this means its an add money transaction
                    if (inTheSameMonth(trans.timestamp)) {
                        $scope.monthlyRemaining = $scope.monthlyRemaining + trams.amount;
                    }
                }
        });
        if ($scope.monthlyRemaining) {

        }
    };
    $scope.isRemaining();
    $ionicModal.fromTemplateUrl('templates/upgradekyc.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal2 = modal;
    });

    $scope.closeUpgrade = function() {
        $scope.modal2.hide();
    };

    $scope.upgrade = function() {
        $scope.modal2.show();
    };
    $scope.other = "Passport";
    $scope.panImage = [];
    $scope.uploadedImage = 1;
    $scope.options = {
        maximumImagesCount: 4,
        width: 800,
        height: 800,
        quality: 80
    };
    $scope.addPanImage = function() {
        $scope.panImage = [];

        window.imagePicker.getPictures(
            function(results) {
                _.each(results, function(key) {
                    $scope.panImage.push(key)
                });
                $scope.$apply();
            },
            function(error) {
                console.log('Error: ' + error);
            }, $scope.options
        );
    };
    $scope.otherImage = [];
    $scope.addOtherImage = function() {
        $scope.otherImage = [];

        window.imagePicker.getPictures(
            function(results) {
                _.each(results, function(key) {
                    $scope.otherImage.push(key)
                });
                $scope.$apply();

            },
            function(error) {
                console.log('Error: ' + error);
            }, $scope.options
        );
    };

    $scope.uploadPhoto = function(serverpath, image, callback) {
        $cordovaFileTransfer.upload(serverpath, image, {})
            .then(function(result) {
                $scope.uploadedImage++;
                callback(result);
            }, function(err) {
                console.log(err);
            }, function(progress) {

            });

    };
    $scope.uploadedPan = [];
    $scope.uploadedOther = [];
    $scope.done = false;
    $scope.upgradeIt = function(other) {
        $scope.other = other;
        if ($scope.other == "" || $scope.other == null) {
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: '<h5 style="text-align: center;">Select the other document and upload</h5>'
            });
            alertPopup.then(function(res) {
                if (res) {}
            });
        } else if ($scope.panImage.length == 0 || $scope.otherImage.length == 0) {
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: '<h5 style="text-align: center;">Please upload both the documents</h5>'
            });
            alertPopup.then(function(res) {
                if (res) {}
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: '',
                template: '<h5 style="text-align: center;">Are you sure?</h5>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    // $ionicLoading.show({
                    //     animation: 'fade-in',
                    //     showBackdrop: true,
                    //     maxWidth: 200,
                    //     showDelay: '0'
                    // });
                    console.log($scope.panImage);
                    console.log($scope.otherImage);
                    _.each($scope.panImage, function(key) {
                        $scope.uploadPhoto(adminurl + "uploadfile/uploadfile", key, function(resp) {
                            if (resp) {
                                var parsed = JSON.parse(resp.response);
                                $scope.uploadedPan.push(parsed.fileId);
                                console.log($scope.uploadedPan);

                            }
                        })
                    });

                    var i = 1;
                    _.each($scope.otherImage, function(key) {
                        $scope.uploadPhoto(adminurl + "uploadfile/uploadfile", key, function(resp) {
                            if (resp) {
                                var parsed = JSON.parse(resp.response);
                                $scope.uploadedOther.push(parsed.fileId);
                                console.log($scope.uploadedOther);
                                if (i == $scope.otherImage.length) {
                                    $scope.refreshUser();
                                    $scope.user.panDoc = $scope.uploadedPan;
                                    $scope.user.otherDoc = $scope.uploadedOther;
                                    $scope.user.upgraderequested = true;
                                    $scope.user.other = $scope.other;

                                    $ionicLoading.hide();
                                    if ($scope.updateUser($scope.user)) {
                                        var alertPopup = $ionicPopup.alert({
                                            title: '',
                                            template: '<h5 style="text-align: center;">Upgrade request sent for approval</h5>'
                                        });
                                        alertPopup.then(function(res) {
                                            if (res) {
                                                $scope.upgradeText = "Request for upgrading monthly limit to Rs. 1,00,000 sent for approval";
                                                $scope.closeUpgrade();
                                            }
                                        });
                                    } else {

                                    }
                                }
                                i++;
                            }
                        })
                    });

                } else {

                }
            });
        }


    };

    $scope.transaction = {};
    $scope.walletBalance = 0;
    if ($scope.user.balance === null || $scope.user.balance === undefined)
        $scope.walletBalance = 0;
    else
        $scope.walletBalance = $scope.user.balance;

    $scope.downIndicator = function() {
        $scope.indicator = true;
    };
    $scope.upIndicator = function() {
        $scope.indicator = false;
    };

    $scope.upgradeAlert = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Wallet',
            template: '<h5 style="text-align: center;margin-bottom:0">Amount exceeding monthly limit.Do you want to upgrade KYC?</h5>'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.upgrade();
            } else {}
        });
    };
    $scope.reffererUser = {};
    $scope.updateReferrer = function(user) {
        $scope.flag = undefined;
        MyServices.updateReferrer(user, function(data2) {
            if (data2) {
                $scope.reffererUser = data2;
                console.log(data2);
                $scope.flag = true;
            }
        }, function(err) {});
        console.log($scope.flag);
        if ($scope.flag === false)
            return false;
        else
            return true;
    };

    $scope.addMoneyNew = function(amt) {
        var userDetails = MyServices.getUser();
        var obj = {};
        obj.consumer = userDetails.consumer_id;
        obj.mobile = userDetails.mobile;
        obj.amount = amt;
        obj.email = userDetails.email;
        obj.user = userDetails._id;
        obj.name = userDetails.name;
        obj.url = adminurl + "user/responseCheck";
        if (userDetails.referrer)
            obj.referrer = userDetails.referrer;
        else
            obj.referrer = "";
        globalFunction.addMoneyNew(obj);
        // globalFunction.addMoney(amt);
    }

    $scope.addMoney = function() {

        $scope.transaction = {};
        $scope.refreshUser();
        if ($scope.wallet.amount === 0 || $scope.wallet.amount === undefined || $scope.wallet.amount === null) {
            $scope.alertUser("Wallet", "can not add Rs. 0 to wallet.", 'app/wallet');
        } else if ($scope.wallet.amount < 0) {
            $scope.alertUser("Wallet", "Amount can not be negative.", 'app/wallet');
        } else if ($scope.user.walletLimit <= 0) {
            $scope.alertUser("Wallet", "To add more money upgrade your KYC. The user is given a monthly limit of Rs.10000", 'app/wallet');
        } else if ($scope.wallet.amount > $scope.user.walletLimit) {
            $scope.upgradeAlert();
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Wallet',
                template: '<h5 style="text-align: center;margin-bottom:0">Are you sure you want to add Rs.' + $scope.wallet.amount + ' ? </h5>'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.ctrlUser = {
                        _id: $scope.user._id,
                        balance: $scope.user.balance + ($scope.wallet.amount / 100) * 110,
                        walletLimit: $scope.user.walletLimit - $scope.wallet.amount
                    }; //updates walletLimit,see isRemainging for more on walletLimit
                    console.log($scope.ctrlUser);
                    if ($scope.updateUser($scope.ctrlUser)) {
                        $scope.transaction = {
                            from: $scope.user._id,
                            to: $scope.user._id,
                            type: "balance",
                            currentbalance: $scope.ctrlUser.balance,
                            amount: $scope.wallet.amount,
                            mobile: $scope.user.mobile,
                            name: $scope.user.name
                        };
                        MyServices.setUser($scope.user);
                        if ($scope.addTransaction($scope.transaction)) {
                            $scope.user.balance = $scope.ctrlUser.balance;
                            $scope.user.walletLimit = $scope.ctrlUser.walletLimit;
                            $scope.refreshUser();
                            $scope.alertUser("Success", "Money added to your wallet.", 'app/home');
                            if ($scope.user.referrer) {
                                console.log($scope.user);
                                $scope.updateData = {
                                    deviceid: $scope.user.notificationtoken.deviceid,
                                    os: $scope.user.notificationtoken.os,
                                    type: "referral",
                                    mobile: $scope.user.referrer,
                                    _id: $scope.user._id,
                                    amount: $scope.transaction.amount,
                                    lastreferral: $scope.user.name
                                };
                                console.log($scope.updateData);
                                if ($scope.updateReferrer($scope.updateData)) {

                                    $scope.refreshUser();
                                } else {

                                }
                            }

                            $scope.wallet.amount = undefined;

                        } else {
                            $scope.alertUser("Wallet ", "Failed to add money.", 'app/wallet');
                        }
                    } else {
                        $scope.alertUser("Wallet", "Failed to add money.", 'app/wallet');
                    }
                } else {
                    $scope.wallet.amount = undefined;
                }
            });
        }

    };
    $scope.applyCoupon = function() {
        console.log("inside applyCoupon");
        if ($scope.coupon.code === undefined || $scope.coupon.code === null || $scope.coupon.code === "") {
            $scope.alertUser("", "Invalid coupon", 'app/wallet');
        } else {
            console.log("inside applyCoupon1");
            MyServices.findCoupon($scope.coupon, function(data) {
                console.log("inside applyCoupon2");

                console.log(data);
                if (data._id) {

                    $scope.user.balance = $scope.user.balance + data.amount;
                    console.log($scope.user.balance);
                    if ($scope.updateUser($scope.user)) {
                        var couponData = {
                            _id: data._id,
                            used: true,
                            user: $scope.user._id
                        };
                        MyServices.updateCoupon(couponData, function(data) {
                            if (data.value == true) {
                                $scope.alertUser("", "Coupon Validated", 'app/wallet');
                            }
                        }, function(err) {

                        })

                    } else {
                        $scope.alertUser("", "Unable to add coupon", 'app/wallet');

                    }
                } else {
                    if (data.isUsed) {
                        $scope.alertUser("", "Coupon has already been used");
                    } else if (data.isExpired) {
                        $scope.alertUser("", "Coupon has expired");
                    } else {
                        $scope.alertUser("", "Invalid coupon", 'app/wallet');
                    }
                    $scope.coupon.code = "";
                }
            }, function(err) {

            });
        }

    };
    $scope.getSentMoney = function() {
        console.log("herer");
        $scope.transFilter = {
            type: "sendmoney",
            from: $scope.user._id,
            to: $scope.user._id
        };
        MyServices.findByTypeUser($scope.transFilter, function(data) {
            if (data) {
                $scope.sentmoney = data;
                _.each($scope.sentmoney, function(key) {
                    if ($scope.user._id === key.from) {
                        $scope.reciever = {
                            _id: key.to
                        };
                        MyServices.findUser($scope.reciever, function(data2) {
                            if (data2) {

                                key.username = data2.name;
                                key.profile = data2.profile;
                                key.sent = "sent";
                            }
                        }, function(err) {

                        });
                    } else if ($scope.user._id === key.to) {
                        $scope.sender = {
                            _id: key.from
                        };
                        MyServices.findUser($scope.sender, function(data2) {
                            if (data2) {
                                key.username = data2.name;
                                key.profile = data2.profile;

                                key.sent = "recieved";
                            }
                        }, function(err) {

                        });
                    }
                });
            }
        }, function(err) {});
        $scope.transFilterR = {
            type: "sendmoney",
            to: $scope.user._id
        };

    };
    $ionicModal.fromTemplateUrl('templates/balance-history.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    $scope.closeHistory = function() {
        $scope.modal1.hide();
    };

    $scope.history = function() {
        $scope.modal1.show();
        $scope.getHistory();
        $scope.getSentMoney();
        $scope.getRedeem();
    };
    $scope.redeemed = [];
    $scope.transactionPendingFilter = {
        type: "redeem",
        from: $scope.user._id
    };
    $scope.getRedeem = function() {
        MyServices.findByTypeUser($scope.transactionPendingFilter, function(data) {
                if (data) {
                    $scope.redeemed = data;
                    $scope.item = {};
                    console.log($scope.redeemed);
                    _.each($scope.redeemed, function(key) {
                        $scope.item.id = key.to;
                        MyServices.findVendor($scope.item, function(data) {
                                if (data) {
                                    key.vendorname = data.name;
                                    key.vendoricon = data.logourl;
                                }
                            },
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });
                }
            },
            function(err) {

            });
    };
    $scope.getRedeem();
    $scope.balanceHistory = [];
    $scope.sentmoney = [];
    $scope.transactionFilter = {
        type: "balance",
        from: $scope.user._id
    };
    $scope.getHistory = function() {
        console.log("herer");
        MyServices.findByTypeUser($scope.transactionFilter, function(data) {
            if (data) {
                $scope.balanceHistory = data;
                console.log($scope.balanceHistory);
                console.log($scope.transactionFilter);
            }
        }, function(err) {

        });
    };

    globalFunction.readMoney(function(bal) {});

})

.controller('SpendHistoryCtrl', function($scope, $stateParams) {

    })
    .controller('TermsCtrl', function($scope, $stateParams) {

    })
    .controller('RedeemCtrl', function($scope, $stateParams, $ionicModal, $timeout, $ionicPopup, $location, MyServices, $ionicLoading, $ionicSlideBoxDelegate) {
        $scope.favoritePage();
        favorite.setActive(false);
        $scope.readTNC = false;
        $scope.params = $stateParams;
        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function() {
            MyServices.findUser($scope.user, function(data) {
                if (data.value) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function(err) {

            });
        };
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);

        MyServices.readMoney({
            "consumer": $.jStorage.get("user").consumer_id
        }, function(data) {
            console.log("balance : " + data.comment.balance);
            if (data.value) {
                $.jStorage.set("balance", data.comment.balance);
                $scope.myBalance = {};
                $scope.myBalance.balance = data.comment.balance;
            }
        }, function(err) {

        });

        $scope.fixedinput = false;
        $scope.vendor = {};
        $scope.transaction = {};
        $scope.crossedLimit = false;
        $scope.ctrlUser = {};
        $scope.redeem = {
            amount: undefined
        };
        $scope.show = function() {
            // $ionicLoading.show({
            //     template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
            // });
        };
        $scope.hide = function() {

            $ionicLoading.hide();
        };
        $scope.show();
        $timeout(function() {
            $scope.hide();
        }, 3000);
        MyServices.findVendor($scope.params, function(data) {
            if (data) {
                $scope.hide();
                $scope.vendor = data;

                $ionicSlideBoxDelegate.update();
                favorite.getBrand($scope.vendor._id);
                if ($scope.vendor.length != 0) {
                    $scope.empty = false;
                    $scope.placeholdertext = "Enter Amount";
                    if ($scope.vendor.input === "fixed" || $scope.vendor.input === "multiple") {
                        $scope.fixedinput = true;
                        $scope.placeholdertext = "Select amount to redeem below ..";
                    } else {
                        $scope.fixedinput = false;
                        $scope.placeholdertext = "Enter amount to redeem here ..";
                    }
                } else {
                    $scope.empty = true;
                }
                if (_.result(_.findWhere($scope.user.favorite, {
                        '_id': $scope.vendor._id
                    }), '_id'))
                    favorite.setActive(true);
                else
                    favorite.setActive(false);
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });

        $scope.isInLimit = function(value) {
            if ($scope.vendor.amountlimit === undefined) {
                $scope.crossedLimit = false;
                return true;
            } else {
                if (value > $scope.vendor.amountlimit) {
                    $scope.crossedLimit = true;
                    return true;
                } else {
                    $scope.crossedLimit = false;
                    return false;
                }
            }
        };

        //   TERMS AND CONDITIONS MODAL FUNCTIONS
        $ionicModal.fromTemplateUrl('templates/tNc.html', {
            id: '1',
            scope: $scope
        }).then(function(modal) {
            $scope.oModal1 = modal;
        });

        // Triggered in the tNc modal to close it
        $scope.closeTNC = function() {
            $scope.readTNC = true;
            $scope.oModal1.hide();
        };

        // Open the tNc modal
        $scope.tNc = function() {
            $scope.oModal1.show();
        };
        //    MODAL END

        /* How to Redeem */
        $ionicModal.fromTemplateUrl('templates/modal-howto.html', {
            id: '2',
            scope: $scope
        }).then(function(modal) {
            $scope.oModal2 = modal;
        });
        $scope.hideRedeem = function() {
            $scope.oModal2.hide();
        };
        $scope.showRedeem = function() {
            $scope.oModal2.show();
        };
        /* How to Redeem */

        //   TERMS AND CONDITIONS MODAL FUNCTIONS
        $ionicModal.fromTemplateUrl('templates/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal3 = modal;
        });

        // Triggered in the tNc modal to close it
        $scope.closeDetail = function() {
            $scope.readdetail = true;
            $scope.modal3.hide();
        };

        // Open the detail modal
        $scope.detail = function() {
            $scope.modal3.show();
        };
        //    MODAL END

        //        $scope.quickMoney = [500, 1000, 1500];
        $scope.selectMoney = function(buttonvalue) {
            console.log(buttonvalue);
            $scope.redeem.amount = buttonvalue;
        };
        $scope.addRedeemTransaction = function() {
            $scope.input = {};
            if ($scope.redeem.amount === null || $scope.redeem.amount === 0 || $scope.redeem.amount === undefined || $scope.redeem.amount < 0)
                $scope.zeroAmount();
            else if ($scope.vendor.amountlimit != undefined && $scope.isInLimit($scope.redeem.amount, $scope.vendor.amountlimit))
                $scope.exceedingLimit();
            else {

                $scope.ctrlUser = {
                    _id: $scope.user._id,
                    balance: $scope.myBalance.balance - $scope.redeem.amount
                }; //updates walletLimit,see isRemainging for more on walletLimit
                if ($scope.vendor.hasoffer) {
                    var cashback = ($scope.vendor.offerpercent * $scope.redeem.amount) / 100;
                    $scope.ctrlUser.balance = $scope.ctrlUser.balance + cashback;
                }
                console.log($scope.ctrlUser);
                if ($scope.ctrlUser.balance >= 0) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Make a voucher',
                        template: '<h5 style="text-align: center;margin-bottom:0">Are you sure?</h5>'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            MyServices.generateOtpForDebit(MyServices.getUser().consumer_id, function(data) {
                                console.log(data);
                                if (data.value != false)
                                    openOTP();
                            }, function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        } else
                            $scope.redeem.amount = undefined;
                    });

                    function openOTP() {
                        smsplugin.startReception(function(message) {
                            console.log(message);
                            $scope.redeem.otp = message.toString().substr((message.length - 25), 6);
                            $scope.$apply();
                            smsplugin.stopReception(function() {}, function() {});
                        }, function(err) {
                            console.log(err);
                        });
                        var myPopup = $ionicPopup.show({
                            template: '<input type="tel" ng-model="redeem.otp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                            title: 'OTP Verification',
                            subTitle: 'Enter the 6-digit OTP :',
                            scope: $scope,
                            buttons: [{
                                text: '<h5>Cancel</h5>',
                                onTap: function(e) {
                                    myPopup.close();
                                }
                            }, {
                                text: '<b>Verify</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.redeem.otp) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        //call remove
                                        redeemNow();
                                    }
                                }
                            }]
                        });
                    }

                    function redeemNow() {
                        console.log("redeem called");
                        var userDetails = MyServices.getUser();
                        $scope.transaction = {
                            user: userDetails._id,
                            vendor: $scope.vendor._id,
                            consumer: userDetails.consumer_id,
                            amount: $scope.redeem.amount,
                            email: userDetails.email,
                            username: userDetails.name,
                            vendorname: $scope.vendor.name,
                            mobile: userDetails.mobile,
                            deviceid: userDetails.notificationtoken.deviceid,
                            os: userDetails.notificationtoken.os,
                            otp: $scope.redeem.otp
                                // type: "redeem",
                                // currentbalance: $scope.ctrlUser.balance
                                // user: $scope.user._id
                        };
                        if ($scope.vendor.hasoffer) {
                            $scope.transaction.hasoffer = true;
                            $scope.transaction.offerpercent = $scope.vendor.offerpercent;
                            // $scope.transaction.cashback = cashback;
                        }
                        MyServices.redeem($scope.transaction, function(data) {
                            console.log(data);
                            if (data.value == true) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Make a voucher',
                                    template: '<h5 style="text-align: center;margin-bottom:0">Redeemed Successfully</h5>'
                                });
                                alertPopup.then(function(res) {
                                    $location.path('app/wallet');
                                });
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        })

                        // if ($scope.addTransaction($scope.transaction)) {
                        //     $scope.user.balance = $scope.ctrlUser.balance;
                        //     $scope.proceedAlert();
                        //     $scope.refreshUser();
                        // } else {
                        //     $scope.alertUser("Redeem", "Unable to redeem amount");
                        // }
                    }
                } else {
                    $scope.alertUser("Redeem", "Not enough balance in your wallet");
                }
            }
        };
        $scope.proceedAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem ',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function(res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroBalance = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Make a voucher',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function(res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroAmount = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Make a voucher',
                template: '<h5 style="text-align: center;margin-bottom:0">Please enter a valid amount.</h5>'
            });
            alertPopup.then(function(res) {});
        };
        $scope.exceedingLimit = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Make a voucher',
                template: '<h5 style="text-align: center;margin-bottom:0">The amount redeem limit is ' + $scope.vendor.amountlimit + '.</h5>'
            });
            alertPopup.then(function(res) {});
        };

    })
    .controller('ListViewCtrl', function($scope, $stateParams, MyServices) {
        $scope.params = $stateParams;

        MyServices.findCategory($scope.params, function(data) {
            console.log(data);
            if (data) {
                $scope.category = data;
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });
        $scope.vendors = [];
        MyServices.findVendorByCategory($scope.params, function(data) {
            if (data) {
                $scope.vendors = data;
                console.log($scope.vendors);
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });
    })
    .controller('GridViewCtrl', function($scope, $stateParams, MyServices, $ionicNavBarDelegate, $ionicLoading, $timeout) {
        $scope.params = $stateParams;
        $scope.nofavoritePage();
        $scope.show = function() {
            // $ionicLoading.show({
            //     template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
            // });
        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };
        $scope.show();
        $timeout(function() {
            $scope.hide();
        }, 3000);
        MyServices.findCategory($scope.params, function(data) {
            console.log(data);
            if (data) {
                $scope.category = data;
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });
        $scope.vendors = [];
        MyServices.findVendorByCategory($scope.params, function(data) {
            $scope.hide();
            if (data) {
                $scope.vendors = data;
                if ($scope.vendors.length > 0)
                    $scope.vendors = _.chunk($scope.vendors, 3);
                console.log($scope.vendors);
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });
    })
    .controller('NotificationCtrl', function($scope, $stateParams, MyServices, $location, $ionicPopup) {
        $scope.nofavoritePage();

        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function() {
            MyServices.findUser($scope.user, function(data) {
                if (data.value) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function(err) {

            });
        };
        $scope.markRead = function(item) {
            var timest = moment(item.timestamp);
            item.read = true;
            if ($scope.updateUser($scope.user)) {
                var alertPopup = $ionicPopup.alert({
                    title: item.title,
                    template: '<h5 style="text-align:center;">' + item.body + '</h5><span style="clear:left;float:right;">' + timest.from(new Date()) + '</span>'
                });

                alertPopup.then(function(res) {
                    $scope.refreshUser();
                    alertPopup.close();
                });
            }


        };

    })
    .controller('ProfileCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $cordovaFileTransfer, $ionicLoading, $ionicModal, $ionicPopup) {
        $scope.nofavoritePage();
        $scope.change = {};
        $scope.user = {};
        $scope.edit = true;
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function() {
            MyServices.findUser($scope.user, function(data) {
                if (data.value) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function(err) {

            });
        };
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);

        $scope.toggleEdit = function() {
            $scope.edit = $scope.edit === false ? true : false;
        };
        $scope.alertUser = function(alertTitle, alertDesc, link) {
            var alertPopup = $ionicPopup.alert({
                title: alertTitle,
                template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
            });
            alertPopup.then(function(res) {
                if (link)
                    $location.path(link);
            });
        };
        $scope.options = {
            maximumImagesCount: 1,
            width: 600,
            height: 600,
            quality: 80
        };
        $scope.selectedImage;
        $scope.profilePicChanged = false;
        $scope.addProfileImage = function() {

            window.imagePicker.getPictures(
                function(results) {
                    if (results) {
                        $scope.selectedImage = results[0];
                        console.log($scope.selectedImage);
                        $scope.user.profile = $scope.selectedImage;

                        $scope.profilePicChanged = true;
                        $scope.$apply();
                    }
                },
                function(error) {
                    console.log('Error: ' + error);
                }, $scope.options
            );
        };
        $scope.updated = false;
        $scope.uploadProfilePhoto = function(image, callback) {
            $cordovaFileTransfer.upload(adminurl + "uploadfile/uploadfile", image, {})
                .then(function(result) {

                    $ionicLoading.hide();
                    callback(result);
                }, function(err) {
                    console.log(err);
                }, function(progress) {
                    // $ionicLoading.show({
                    //     template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
                    // });
                });
        };
        $scope.saveUser = function() {
            $scope.updated = false;
            if ($scope.profilePicChanged === true) {
                $scope.uploadProfilePhoto($scope.user.profile, function(resp) {
                    if (resp) {
                        console.log(resp);
                        var parsed = JSON.parse(resp.response);
                        $scope.user.profile = parsed.fileId;
                        console.log($scope.user);
                        delete $scope.user.mobile;
                        MyServices.updateUser($scope.user, function(data2) {
                            console.log("response aage");
                            console.log(data2);
                            if (data2) {
                                console.log(data2);
                                if (data2.value === false)
                                    $scope.alertUser("", "Unable to update profile.");
                                else {
                                    $scope.alertUser("", "Profile updated.");
                                    $scope.refreshUser();
                                }
                            }
                        }, function(err) {});
                    }
                })
            } else {
                console.log("no profile pic change");
                delete $scope.user.profile;
                delete $scope.user.mobile;
                MyServices.updateUser($scope.user, function(data2) {
                    console.log("response aage");
                    console.log(data2);
                    if (data2) {
                        console.log(data2);
                        if (data2.value === false)
                            $scope.alertUser("", "Unable to update profile.");
                        else {
                            $scope.alertUser("", "Profile updated.");
                            $scope.refreshUser();
                        }
                    }
                }, function(err) {});
            }
        };
        $scope.confirmed = false;
        $scope.validate = {};
        $scope.validatePass = function() {
            console.log("here");
            $scope.validate = {
                pass: false,
                editpass: false,
                confirmeditpass: false
            };
            if ($scope.change.pass === "" || $scope.change.pass === null || $scope.change.pass === undefined)
                $scope.validate.pass = true;
            if ($scope.change.editpass === "" || $scope.change.editpass === null || $scope.change.editpass === undefined)
                $scope.validate.editpass = true;
            if ($scope.change.confirmeditpass === "" || $scope.change.confirmeditpass === null || $scope.change.confirmeditpass === undefined)
                $scope.validate.confirmeditpass = true;
            if ($scope.validate.pass === true || $scope.validate.editpass === true || $scope.validate.confirmeditpass === true)
                return false;
            else
                return true;
        };
        $scope.checkPassword = function() {
            if ($scope.change.editpass != "" || $scope.change.editpass != null || $scope.change.editpass != undefined) {
                if ($scope.change.confirmeditpass === $scope.change.editpass) {
                    $scope.confirmed = true;
                    $scope.confirmP = "Password matching";
                    return true;
                } else {
                    $scope.confirmed = false;
                    return false;
                }
            }
        };
        $scope.changePass = function() {
            if ($scope.validatePass()) {
                var param = {
                    _id: $scope.user._id,
                    password: $scope.change.pass,
                    editpassword: $scope.change.editpass
                };
                MyServices.changePass(param, function(data) {
                    if (data.value == true) {
                        var alertPopup = $ionicPopup.alert({
                            template: '<h4 style="text-align: center;margin-bottom:0">Password changed</h4>'
                        });
                        alertPopup.then(function(res) {
                            $scope.closeChangePassword();
                        });

                    } else {
                        if (data.comment == "No data found") {
                            var alertPopup = $ionicPopup.alert({
                                template: '<h4 style="text-align: center;margin-bottom:0">Current password incorrect</h4>'
                            });
                            alertPopup.then(function(res) {

                            });
                        } else if (data.comment == "Same password") {
                            var alertPopup = $ionicPopup.alert({
                                template: '<h4 style="text-align: center;margin-bottom:0">New password is equal to the old one</h4>'
                            });
                            alertPopup.then(function(res) {

                            });
                        }
                    }
                }, function(err) {

                });
            }
        };
        $ionicModal.fromTemplateUrl('templates/changepassword.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal2 = modal;
        });
        $scope.closeChangePassword = function() {
            $scope.modal2.hide();
        };
        $scope.changePassword = function() {
            $scope.modal2.show();
        };

    });
