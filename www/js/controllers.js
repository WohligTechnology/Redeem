var favorite = {};
var adminurl = "http://192.168.0.109:1337/";
//var adminurl = "http://104.154.90.30/";
angular.module('starter.controllers', ['ui.bootstrap', 'ngCordova'])

.controller('AppCtrl', function ($ionicPlatform, $scope, $ionicModal, $timeout, MyServices, $ionicPopup, $location, $filter, $state) {


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
                template: '<h4 style="text-align:center;">Please check your internet connection.</h4>'
            });
            alertPopup.then(function (res) {
                alertPopup.close();
            });

        };
        document.addEventListener("online", onOnline, false);

        function onOnline() {
            console.log("isonline");
            $state.go($state.current, {}, {
                reload: true
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
    $scope.refreshUser = function () {
        if (MyServices.getUser()) {
            $scope.user = MyServices.getUser();
            console.log($scope.user);
        } else {

        }
    };

    $scope.refreshUser();
    $scope.favoritePage = function () {
        $scope.canfavorite = true;
    };
    $scope.activefav = false;
    $scope.nofavoritePage = function () {
        $scope.canfavorite = false;
    };
    $scope.nofavoritePage();

    favorite.brand = {};
    favorite.getBrand = function (data) {
        favorite.brand._id = data;
    };
    favorite.pushFavorite = function () {
        $scope.refreshUser();
        console.log("here");
        if ($scope.activefav === false) {
            $scope.updateData = {
                _id: $scope.user._id,
                favorite: $scope.user.favorite
            };
            $scope.updateData.favorite.unshift(favorite.brand);
            MyServices.updateUser($scope.updateData, function (data) {
                if (data.value) {
                    $scope.activefav = true;
                    $scope.refreshUser();
                }
            }, function (err) {

            });
        } else if ($scope.activefav === true) {
            $scope.updateData = {
                _id: $scope.user._id,
                favorite: $scope.user.favorite
            };
            $scope.updateData.favorite = _.dropWhile($scope.updateData.favorite, {
                '_id': favorite.brand._id
            });
            MyServices.updateUser($scope.updateData, function (data) {
                console.log(data);
                if (data.value) {
                    $scope.activefav = false;
                    $scope.refreshUser();
                }
            }, function (err) {

            });

        }


    };
    favorite.setActive = function (val) {
        $scope.activefav = val;
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };
    $scope.login = function () {
        $scope.modal.show();
    };
    if (MyServices.getUser()) {
        $location.url("/app/home");
    } else {
        $location.url("/login");
    }


    $scope.referralBadge = undefined;

    $scope.testCall = function () {
        console.log("in here");
    };
    $scope.count = 0;;
    $scope.refreshNoti = function (item) {
        $scope.count = 0;
        _.each(item.notification, function (key) {
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
        title: 'Referral',
        url: '#/app/referral',
        state: false,
        badgecount: $scope.referralBadge,
        icon: "ln-users"
  }, {
        title: 'About Us',
        url: '#/app/aboutus',
        state: false,
        icon: "ion-ios-information-outline"
  }, {
        title: 'Notification',
        url: '#/app/notification',
        state: false,
        icon: "ion-android-notifications-none"
  }, {
        title: 'Logout',
        url: '#',
        state: false,
        icon: "ln-exit"
  }];

    $scope.activateMenu = function (index) {
        console.log($scope.menu[index].title);
        if ($scope.menu[index].title === "Logout") {
            $scope.user = null;
            $.jStorage.flush();
            console.log(MyServices.getUser());
            $location.path('login');
        }
        for (var i = 0; i < $scope.menu.length; i++) {
            $scope.menu[i].state = false;
        }
        $scope.menu[index].state = true;
    };

    $scope.openNotification = function () {
        $location.path('/app/notification');
    };
    $scope.favoriteIt = function (data) {
        console.log(data);
    };

    //    GLOBAL update user function

    $scope.updateUser = function (user) {
        console.log(user);
        $scope.flag = undefined;
        if (user.balance >= 0)
            MyServices.updateUser(user, function (data2) {
                if (data2) {
                    console.log(data2);
                    if (data2.value === false)
                        $scope.flag = false;
                    else
                        $scope.flag = true;
                }
            }, function (err) {});
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

    $scope.addTransaction = function (transaction) {
        $scope.flag = undefined;
        MyServices.addTransaction(transaction, function (data2) {
            if (data2) {
                console.log(data2);
                if (data2.value === false)
                    $scope.flag = false;
                else
                    $scope.flag = true;
            }
        }, function (err) {});
        console.log($scope.flag);
        if ($scope.flag === false)
            return false;
        else
            return true;
    };

    $scope.alertUser = function (alertTitle, alertDesc, link) {
        var alertPopup = $ionicPopup.alert({
            title: alertTitle,
            template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
        });
        alertPopup.then(function (res) {
            if (link)
                $location.path(link);
        });
    };

})

.controller('PlaylistsCtrl', function ($scope) {})
    .controller('SearchCtrl', function ($scope) {})

.controller('LoginCtrl', function ($scope, $stateParams, $ionicPlatform, $location, MyServices, $ionicScrollDelegate, $ionicModal, $ionicPopup, $filter, $timeout) {
    $scope.isIOS = false;
    var IOS = ionic.Platform.isIOS();
    var Android = ionic.Platform.isAndroid();
    if (IOS) {
        $scope.isIOS = true;
    } else if (Android) {
        $scope.isIOS = false;
    }
    $scope.phone1 = {};
    $ionicPlatform.registerBackButtonAction(function (event) {
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

    $scope.openDate = function () {
        datePicker.show(options, onSuccess);
    }

    $scope.sendSMS = function (message) {
        console.log(message);
        $scope.flag = undefined;
        MyServices.sendSMS(message, function (data2) {
            if (data2) {
                console.log(data2);
                if (data2.value === false)
                    $scope.flag = false;
                else
                    $scope.flag = true;
            }
        }, function (err) {});
        if ($scope.flag === false)
            return false;
        else
            return true;
        return $scope.flag;
    };

    $scope.highlight = false;
    $scope.clickTab = function (side) {
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
    $scope.updateUser = function (user) {
        console.log(user);
        $scope.flag = undefined;
        if (user.balance >= 0)
            MyServices.updateUser(user, function (data2) {
                if (data2) {
                    console.log(data2);
                    if (data2.value === false)
                        $scope.flag = false;
                    else
                        $scope.flag = true;
                }
            }, function (err) {});
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
    $scope.validateLogin = function () {
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
    $scope.doLogin = function () {
        console.log($scope.validateLogin());
        if ($scope.validateLogin()) {
            MyServices.loginUser($scope.login, function (data) {
                if (data) {
                    if (data.value === false) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login',
                            template: '<h5 style="text-align:center">Invalid data</h5>'
                        });
                        alertPopup.then(function (res) {

                        });
                    } else {
                        console.log("herer");
                        MyServices.setUser(data);
                        $location.url('app/home');
                        $scope.user = MyServices.getUser();
                        console.log($scope.user);
                    }
                    console.log(data);
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Login',
                template: '<h5 style="text-align:center">Mobile number or password is incorrect.</h5>'
            });
            alertPopup.then(function (res) {

            });
        }

    };
    $scope.ctrlUser = {};

    $scope.confirmed = undefined;
    $scope.checkPassword = function () {
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
    $scope.toggleDate = function () {
        if ($scope.type === "text")
            $scope.type = "date";
    };
    $scope.validate = {};
    $scope.validateThis = function () {
        $scope.validate = {
            name: false,
            mobile: false,
            email: false,
            password: false,
            date: false,
            gender: false,
            confirmpassword: false
        };
        if ($scope.signup.name === "" || $scope.signup.name === null || $scope.signup.name === undefined)
            $scope.validate.name = true;
        if ($scope.signup.mobile === "" || $scope.signup.mobile === null || $scope.signup.mobile === undefined || $scope.signup.mobile < 1000000000 || $scope.signup.mobile > 9999999999)
            $scope.validate.mobile = true;
        if ($scope.signup.email === "" || $scope.signup.email === null || $scope.signup.email === undefined || $scope.signup.email.indexOf('@') === -1)
            $scope.validate.email = true;
        if ($scope.signup.password === "" || $scope.signup.password === null || $scope.signup.password === undefined)
            $scope.validate.password = true;
        if ($scope.signup.confirmpassword === "" || $scope.signup.confirmpassword === null || $scope.signup.confirmpassword === undefined || $scope.checkPassword() === false)
            $scope.validate.confirmpassword = true;
        if ($scope.signup.gender === "" || $scope.signup.gender === null || $scope.signup.gender === undefined)
            $scope.validate.gender = true;
        if ($scope.signup.date === "" || $scope.signup.date === null || $scope.signup.date === undefined)
            $scope.validate.date = true;
        if ($scope.validate.name === true || $scope.validate.mobile === true || $scope.validate.email === true || $scope.validate.password == true || $scope.validate.gender == true || $scope.validate.date == true || $scope.validate.confirmpassword === true)
            return false;
        else
            return true;
    };
    $scope.referredUser = {};
    $scope.checkReferral = function () {
        $scope.user = {
            mobile: $scope.signup.referrer
        };
        $scope.flag = undefined;
        MyServices.findUserByMobile($scope.user, function (data) {
            if (data._id) {
                console.log(data);
                $scope.referredUser = data;
                $scope.flag = true;
            } else {
                $scope.flag = false;
            }
        }, function (err) {
            $scope.flag = false;
        });
        if ($scope.flag === false)
            return false;
        else
            return true;
    };
    $scope.data = {};
    $scope.validateMobile = function () {
        $scope.usermobile = {
            mobile: $scope.signup.mobile,
            name: $scope.signup.name
        };
        MyServices.validateMobile($scope.usermobile, function (data) {
            console.log(data);
            if (data.value) {
                var alertPopup = $ionicPopup.alert({
                    template: '<h4 style="text-align:center;">The mobile number is already registered.</h4>'
                });
                alertPopup.then(function (res) {

                });
            } else {
                $scope.input = {};
                // An elaborate, custom popup
                smsplugin.startReception(function (message) {
                    console.log(message);
                    $scope.input.otp = message.substr(message.length - 6);
                    $scope.$apply();
                }, function (err) {
                    console.log(err);
                });
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="input.otp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                    title: 'OTP Verification',
                    subTitle: 'Enter the 6-digit OTP :',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<h5>Cancel</h5>',
                            onTap: function (e) {
                                myPopup.close();
                            }
                        },
                        {
                            text: '<h5>Retry</h5>',
                            onTap: function (e) {
                                myPopup.close();
                                $scope.validateMobile();
                            }
                        },
                        {
                            text: '<b>Verify</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.input.otp) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    if (parseInt($scope.input.otp) === data.otp) {
                                        $scope.checkDeviceID();
                                    } else {
                                        var alertPopup = $ionicPopup.alert({
                                            template: '<h4 style="text-align:center;">Invalid OTP.</h4>'
                                        });
                                        alertPopup.then(function (res) {

                                        });
                                    }
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                });
            }
        }, function (err) {

        });
    };


    $scope.checkOTP = function () {
        if ($scope.validateThis()) {
            if ($scope.signup.referrer === "" || $scope.signup.referrer === null || $scope.signup.referrer === undefined) {
                $scope.validateMobile();
            } else {
                $scope.item = {
                    mobile: $scope.signup.referrer
                };
                MyServices.findUserByMobile($scope.item, function (data) {
                    if (data._id) {
                        console.log("here1");
                        $scope.validateMobile();
                    } else {

                        var alertPopup = $ionicPopup.alert({
                            template: '<h4 style="text-align:center;">Referral ID does not exist. Invalid.</h4>'
                        });
                        alertPopup.then(function (res) {

                        });

                    }
                }, function (err) {

                });
            }
        } else {
            var alertPopup = $ionicPopup.alert({
                template: '<h4 style="text-align:center;">Invalid Data</h4>'
            });
            alertPopup.then(function (res) {

            });
        }
    };
    $scope.isRegistered = false;
    $scope.checkDeviceID = function () {
        $scope.isRegistered = false;
        if ($.jStorage.get("device") == null) {
            console.log("here");
            push = PushNotification.init({
                "android": {
                    "senderID": "965431280304",
                    "icon": "www/img/icon.png"
                },
                "ios": {
                    "alert": "true",
                    "badge": "true",
                    "sound": "true"
                },
                "windows": {}
            });

            push.on('registration', function (data) {

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

            push.on('notification', function (data) {
                console.log(data);
            });

            push.on('error', function (e) {
                conosle.log("ERROR");
                console.log(e);
            });
            if ($scope.isRegistered) {
                $scope.doSignup();
            } else {
                $timeout(function () {
                    $scope.checkDeviceID();
                }, 3000);
            }
        } else {
            $scope.doSignup();
        }
    };
    $scope.referralData = {};
    var attempt = 0;
    $scope.doSignup = function () {
        delete $scope.signup.confirmpassword;
        console.log("here it is " + $.jStorage.get("device"));
        $scope.signup.notificationtoken.deviceid = $.jStorage.get("device");
        $scope.signup.notificationtoken.os = $.jStorage.get("os");
        MyServices.signupUser($scope.signup, function (data) {
            if (data.value) {
                MyServices.setUser(data.user);
                if ($scope.signup.referrer === "" || $scope.signup.referrer === null || $scope.signup.referrer === undefined) {
                    $scope.user = MyServices.getUser();
                    if ($scope.user)
                        $location.path('app/home');
                } else {
                    $scope.referrerData = {
                        _id: data._id,
                        amountearned: 0
                    };
                    $scope.item = {
                        mobile: $scope.signup.referrer
                    };
                    MyServices.findUserByMobile($scope.item, function (data2) {
                        if (data2._id) {
                            if (data2.referral)
                                data2.referral.unshift($scope.referrerData);
                            console.log($scope.referredUser);
                            if ($scope.updateUser(data2)) {
                                console.log("in notify referral");
                                $scope.notifydata = {
                                    deviceid: data2.notificationtoken.deviceid,
                                    os: data2.notificationtoken.os,
                                    user: data2._id,
                                    type: "referral",
                                    new: true,
                                    name: data.user.name
                                };
                                MyServices.notify($scope.notifydata, function (data3) {
                                    if (data3.value === true) {
                                        $scope.user = MyServices.getUser();
                                        if ($scope.user)
                                            $location.path('app/home');
                                    } else {

                                    }
                                }, function (err) {

                                });
                            } else {

                            }
                        } else {

                            var alertPopup = $ionicPopup.alert({
                                template: '<h4 style="text-align:center;">Referral ID does not exist. Invalid.</h4>'
                            });
                            alertPopup.then(function (res) {

                            });

                        }
                    }, function (err) {

                    });
                    $scope.user = MyServices.getUser();
                    if ($scope.user)
                        $location.path('app/home');
                }
            } else {

            }
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                template: '<h4 style="text-align:center;">Server error,  try again later</h4>'
            });
            alertPopup.then(function (res) {

            });
        });
    };
})

.controller('HomeCtrl', function ($scope, $stateParams, MyServices, $location, $ionicSlideBoxDelegate, $ionicLoading, $timeout) {
        $scope.nofavoritePage();
        $scope.banners = [];
        $scope.user = {};
        $scope.favdata = {};
        $scope.navTitle = '<img class="title-image" src="img/title.png">';
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.refreshUser();

        $scope.favorites = $scope.user.favorite;
        $scope.refreshNoti($scope.user);
        $scope.category = [];
        $scope.refreshUser();
        $scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        $timeout(function () {
            $scope.hide();
        }, 3000);
        MyServices.findCategories(function (data) {
            if (data) {
                $scope.category = data;
                console.log(data);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        MyServices.findBanner(function (data) {
            $scope.hide();
            if (data) {
                $scope.banners = data;
                console.log($scope.banners);
                $ionicSlideBoxDelegate.update();
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        })
        $scope.slideIsSelected = function (index) {
            console.log($scope.banners[index]);
            $location.path("/app/redeem/" + $scope.banners[index].vendorid);
        };
        $scope.routeCategory = function (object) {
            console.log(object);
            if (object.listview == false) {
                $location.path('app/gridview/' + object._id);
            } else {
                $location.path('app/listview/' + object._id);
            }
        };
        $scope.expandFavorites = function () {
            $scope.refreshUser();
            _.each($scope.favorites, function (key) {
                if (key) {
                    $scope.favdata.id = key._id;
                    MyServices.findVendor($scope.favdata, function (data) {
                        if (data) {
                            key.name = data.name;
                            key.imgurl = data.logourl;
                        }
                    }, function (err) {

                    });
                }

            })
        };
        $scope.expandFavorites();
    })
    .controller('PlaylistCtrl', function ($scope, $stateParams) {})
    .controller('ReferralCtrl', function ($scope, $stateParams, $ionicBackdrop, $timeout, MyServices) {
        $scope.nofavoritePage();
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);
        $scope.friendlist = [];
        $scope.referralmoney = 0;
        $scope.getThisUser = function (id, amountearned) {
            $scope.user = {
                _id: id
            };
            console.log(id);
            MyServices.findUser($scope.user, function (data) {

                if (data) {
                    console.log(data);
                    data.amountearned = amountearned;
                    $scope.referralmoney += data.amountearned;
                    $scope.friendlist.unshift(data);
                }
            }, function (err) {});
        };
        var i = 0;
        if ($scope.user.referral != null || $scope.user.referral != undefined)
            _.each($scope.user.referral, function (key) {
                $scope.getThisUser(key._id, key.amountearned);
            });
        console.log($scope.friendlist);
        $scope.sharebutton = false;
        $timeout(function () {
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



        $scope.shareIt = function () {
            $ionicBackdrop.retain();
            $timeout(function () {
                $ionicBackdrop.release();
            }, 1000);
            window.plugins.socialsharing.share('Hey!Check this out!<br> Now get more and more money on your balance! only on PAiSO App! Download the app from Playstore and use the following Referral code : ' + $scope.user.mobile + ' . <br> - ' + $scope.user.name);
        };
    })
    .controller('AboutUsCtrl', function ($scope, $stateParams, $ionicScrollDelegate) {
        $scope.nofavoritePage();
        $scope.oneAtATime = true;
        $scope.activate = true;
        $scope.tab = {
            left: true,
            right: false
        }
        $scope.highlight = false;
        $scope.clickTab = function (side) {
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
    .controller('PassbookCtrl', function ($scope, $stateParams, $ionicScrollDelegate, MyServices) {
        $scope.nofavoritePage();
        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

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
        $scope.moveToUsed = function (transaction) {
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
        $scope.loadUsed = function () {
            $scope.passbookUsed = {
                from: $scope.user._id,
                type: "redeem",
                passbook: "used"
            };
            MyServices.findPassbookEntry($scope.passbookUsed, function (data) {
                    if (data) {
                        $scope.used = data;
                        console.log($scope.used);
                        _.each($scope.used, function (key) {
                            $scope.item.id = key.to;
                            MyServices.findVendor($scope.item, function (data) {
                                    if (data) {
                                        key.vendorname = data.name;
                                    }
                                },
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        });
                    }
                },
                function (err) {

                });
        };

        $scope.loadPassbook = function () {
            MyServices.findPassbookEntry($scope.passbookAvailable, function (data) {
                    if (data) {
                        $scope.available = data;
                        $scope.item = {};
                        console.log($scope.available);
                        _.each($scope.available, function (key) {
                            $scope.item.id = key.to;
                            MyServices.findVendor($scope.item, function (data) {
                                    if (data) {
                                        key.vendorname = data.name;
                                    }
                                },
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        });
                    }
                },
                function (err) {

                });
        };
        $scope.loadPassbook();
        $scope.clickTab = function (side) {
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
        $scope.openUp = function (index) {
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
    .controller('SendMoneyCtrl', function ($scope, $stateParams, MyServices, $ionicPopup) {
        $scope.nofavoritePage();
        $scope.send = {};
        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.selectContact = function () {
            console.log("here in selectContact");
            navigator.contacts.pickContact(function (contact) {
                console.log(contact);
                var selected = JSON.stringify(contact);
                console.log(selected);
                $scope.send.mobile = contact.phoneNumbers[0].value;
            }, function (err) {
                console.log('Error: ' + err);
            });
        };
        $scope.ctrlUser = {};
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);

        $scope.alertUser = function (alertTitle, alertDesc, link) {
            var alertPopup = $ionicPopup.alert({
                title: alertTitle,
                template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
            });
            alertPopup.then(function (res) {
                if (link)
                    $location.path('app/wallet');
            });
        };
        $scope.sendIt = function () {
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
                    MyServices.findUserByMobile($scope.send, function (data) {
                        if (data._id) {
                            console.log(data);
                            $scope.updateU1 = {
                                _id: data._id,
                                balance: data.balance + $scope.send.amount,
                            };
                            if ($scope.user._id === data._id) {
                                $scope.alertUser("Send Money", "You cannot send money to yourself");
                            } else if (($scope.user.balance - $scope.send.amount) <= 0) {
                                $scope.alertUser("Send Money", "Not enough balance");
                            } else {

                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Send money',
                                    template: '<h5 style="text-align: center;margin-bottom:0">Are you sure?</h5>'
                                });
                                confirmPopup.then(function (res) {
                                    if (res) {
                                        if ($scope.updateUser($scope.updateU1)) {
                                            $scope.updateU2 = {
                                                _id: $scope.user._id,
                                                balance: $scope.ctrlUser.balance - $scope.send.amount
                                            };
                                            if ($scope.updateUser($scope.updateU2)) {
                                                $scope.refreshUser();
                                                $scope.transaction = {
                                                    from: $scope.user._id,
                                                    to: data._id,
                                                    type: "sendmoney",
                                                    amount: $scope.send.amount,
                                                    comment: $scope.send.comment
                                                };
                                                if ($scope.addTransaction($scope.transaction)) {
                                                    $scope.recieverNotify = {
                                                        type: "sendmoney",
                                                        deviceid: data.notificationtoken.deviceid,
                                                        os: data.notificationtoken.os,
                                                        user: data._id,
                                                        comment: $scope.send.comment,
                                                        amount: $scope.send.amount,
                                                        name: $scope.user.name
                                                    };
                                                    var alertPopup = $ionicPopup.alert({
                                                        template: '<h4 style="text-align: center;margin-bottom:0">Transaction successful.</h4>'
                                                    });
                                                    alertPopup.then(function (res) {
                                                        MyServices.notify($scope.recieverNotify, function (data2) {
                                                            console.log(data2);
                                                            if (data2.value === true) {
                                                                $location.path('app/home');
                                                            }
                                                        }, function (err) {

                                                        })
                                                    });


                                                } else {

                                                }
                                            } else {
                                                //revert code for current logged in user
                                            }
                                        } else {
                                            //revert code for reciever
                                        }
                                    } else {
                                        $scope.send.mobile = undefined;
                                        $scope.send.comment = undefined;
                                        $scope.send.amount = undefined;
                                    }
                                });
                            }
                        } else {
                            $scope.alertUser("Send Money", "The user is not on PAiSO.");
                        }
                    }, function (err) {

                    });

                }
            }
        }
    })
    .controller('WalletCtrl', function ($scope, $stateParams, $ionicScrollDelegate, MyServices, $ionicPopup, $location, $ionicModal, $cordovaFileTransfer, $ionicLoading) {
        $scope.nofavoritePage();
        $scope.user = {};
        $scope.coupon = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

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
        $scope.inTheSameMonth = function (d) {
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
        $scope.clickTab = function (side) {
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
        $scope.isRemaining = function () {
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
            MyServices.findByType($scope.transaction, function (data) {
                if (data) {
                    $scope.transactions = data;
                }
            }, function (err) {

            });

            _.each($scope.transactions, function (trans) {
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
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

        $scope.closeUpgrade = function () {
            $scope.modal2.hide();
        };

        $scope.upgrade = function () {
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
        $scope.addPanImage = function () {
            $scope.panImage = [];

            window.imagePicker.getPictures(
                function (results) {
                    _.each(results, function (key) {
                        $scope.panImage.push(key)
                    });
                    $scope.$apply();
                },
                function (error) {
                    console.log('Error: ' + error);
                }, $scope.options
            );
        };
        $scope.otherImage = [];
        $scope.addOtherImage = function () {
            $scope.otherImage = [];

            window.imagePicker.getPictures(
                function (results) {
                    _.each(results, function (key) {
                        $scope.otherImage.push(key)
                    });
                    $scope.$apply();

                },
                function (error) {
                    console.log('Error: ' + error);
                }, $scope.options
            );
        };

        $scope.uploadPhoto = function (serverpath, image, callback) {
            $cordovaFileTransfer.upload(serverpath, image, {})
                .then(function (result) {
                    $scope.uploadedImage++;
                    callback(result);
                }, function (err) {
                    console.log(err);
                }, function (progress) {

                });

        };
        $scope.uploadedPan = [];
        $scope.uploadedOther = [];
        $scope.done = false;
        $scope.upgradeIt = function (other) {
            $scope.other = other;
            if ($scope.other == "" || $scope.other == null) {
                var alertPopup = $ionicPopup.alert({
                    title: '',
                    template: '<h5 style="text-align: center;">Select the other document and upload</h5>'
                });
                alertPopup.then(function (res) {
                    if (res) {}
                });
            } else if ($scope.panImage.length == 0 || $scope.otherImage.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: '',
                    template: '<h5 style="text-align: center;">Please upload both the documents</h5>'
                });
                alertPopup.then(function (res) {
                    if (res) {}
                });
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '',
                    template: '<h5 style="text-align: center;">Are you sure?</h5>'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicLoading.show({
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: '0'
                        });
                        console.log($scope.panImage);
                        console.log($scope.otherImage);
                        _.each($scope.panImage, function (key) {
                            $scope.uploadPhoto(adminurl + "uploadfile/uploadfile", key, function (resp) {
                                if (resp) {
                                    var parsed = JSON.parse(resp.response);
                                    $scope.uploadedPan.push(parsed.fileId);
                                    console.log($scope.uploadedPan);

                                }
                            })
                        });

                        var i = 1;
                        _.each($scope.otherImage, function (key) {
                            $scope.uploadPhoto(adminurl + "uploadfile/uploadfile", key, function (resp) {
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
                                            alertPopup.then(function (res) {
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

        $scope.downIndicator = function () {
            $scope.indicator = true;
        };
        $scope.upIndicator = function () {
            $scope.indicator = false;
        };

        $scope.upgradeAlert = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Wallet',
                template: '<h5 style="text-align: center;margin-bottom:0">Amount exceeding monthly limit.<br>Do you want to upgrade KYC?</h5>'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.upgrade();
                } else {}
            });
        };
        $scope.reffererUser = {};
        $scope.updateReferrer = function (user) {
            $scope.flag = undefined;
            MyServices.updateReferrer(user, function (data2) {
                if (data2) {
                    $scope.reffererUser = data2;
                    console.log(data2);
                    $scope.flag = true;
                }
            }, function (err) {});
            console.log($scope.flag);
            if ($scope.flag === false)
                return false;
            else
                return true;
        };
        $scope.addMoney = function () {

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
                confirmPopup.then(function (res) {
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
        $scope.applyCoupon = function () {
            console.log("inside applyCoupon");
            if ($scope.coupon.code === undefined || $scope.coupon.code === null || $scope.coupon.code === "") {
                $scope.alertUser("", "Invalid coupon", 'app/wallet');
            } else {
                console.log("inside applyCoupon1");
                MyServices.findCoupon($scope.coupon, function (data) {
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
                            MyServices.updateCoupon(couponData, function (data) {
                                if (data.value) {
                                    $scope.alertUser("", "Coupon Validated", 'app/wallet');
                                }
                            }, function (err) {

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
                }, function (err) {

                });
            }

        };
        $scope.getSentMoney = function () {
            console.log("herer");
            $scope.transFilter = {
                type: "sendmoney",
                from: $scope.user._id,
                to: $scope.user._id
            };
            MyServices.findByTypeUser($scope.transFilter, function (data) {
                if (data) {
                    $scope.sentmoney = data;
                    _.each($scope.sentmoney, function (key) {
                        if ($scope.user._id === key.from) {
                            $scope.reciever = {
                                _id: key.to
                            };
                            MyServices.findUser($scope.reciever, function (data2) {
                                if (data2) {
                                    key.username = data2.name;
                                    key.sent = "sent";
                                }
                            }, function (err) {

                            });
                        } else if ($scope.user._id === key.to) {
                            $scope.sender = {
                                _id: key.from
                            };
                            MyServices.findUser($scope.sender, function (data2) {
                                if (data2) {
                                    key.username = data2.name;
                                    key.sent = "recieved";
                                }
                            }, function (err) {

                            });
                        }
                    });
                }
            });
            $scope.transFilterR = {
                type: "sendmoney",
                to: $scope.user._id
            };

        };
        $ionicModal.fromTemplateUrl('templates/balance-history.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal1 = modal;
        });

        $scope.closeHistory = function () {
            $scope.modal1.hide();
        };

        $scope.history = function () {
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
        $scope.getRedeem = function () {
            MyServices.findByTypeUser($scope.transactionPendingFilter, function (data) {
                    if (data) {
                        $scope.redeemed = data;
                        $scope.item = {};
                        console.log($scope.redeemed);
                        _.each($scope.redeemed, function (key) {
                            $scope.item.id = key.to;
                            MyServices.findVendor($scope.item, function (data) {
                                    if (data) {
                                        key.vendorname = data.name;
                                        key.vendoricon = data.logourl;
                                    }
                                },
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        });
                    }
                },
                function (err) {

                });
        };
        $scope.getRedeem();
        $scope.balanceHistory = [];
        $scope.sentmoney = [];
        $scope.transactionFilter = {
            type: "balance",
            from: $scope.user._id
        };
        $scope.getHistory = function () {
            console.log("herer");
            MyServices.findByTypeUser($scope.transactionFilter, function (data) {
                if (data) {
                    $scope.balanceHistory = data;
                    console.log($scope.balanceHistory);
                    console.log($scope.transactionFilter);
                }
            }, function (err) {

            });
        };



    })
    .controller('SpendHistoryCtrl', function ($scope, $stateParams) {

    })
    .controller('RedeemCtrl', function ($scope, $stateParams, $ionicModal, $timeout, $ionicPopup, $location, MyServices, $ionicLoading) {
        $scope.favoritePage();

        favorite.setActive(false);
        $scope.readTNC = false;
        $scope.params = $stateParams;
        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);

        $scope.fixedinput = false;
        $scope.vendor = {};
        $scope.transaction = {};
        $scope.crossedLimit = false;
        $scope.ctrlUser = {};
        $scope.redeem = {
            amount: undefined
        };
        $scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
            });
        };
        $scope.hide = function () {

            $ionicLoading.hide();
        };
        $scope.show();
        $timeout(function () {
            $scope.hide();
        }, 3000);
        MyServices.findVendor($scope.params, function (data) {
            if (data) {
                $scope.hide();
                $scope.vendor = data;
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
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });

        $scope.isInLimit = function (value) {
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
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the tNc modal to close it
        $scope.closeTNC = function () {
            $scope.readTNC = true;
            $scope.modal.hide();
        };

        // Open the tNc modal
        $scope.tNc = function () {
            $scope.modal.show();
        };
        //    MODAL END

        //   TERMS AND CONDITIONS MODAL FUNCTIONS
        $ionicModal.fromTemplateUrl('templates/detail.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal3 = modal;
        });

        // Triggered in the tNc modal to close it
        $scope.closeDetail = function () {
            $scope.readdetail = true;
            $scope.modal3.hide();
        };

        // Open the detail modal
        $scope.detail = function () {
            $scope.modal3.show();
        };
        //    MODAL END

        //        $scope.quickMoney = [500, 1000, 1500];
        $scope.selectMoney = function (buttonvalue) {
            console.log(buttonvalue);
            $scope.redeem.amount = buttonvalue;
        };
        $scope.addRedeemTransaction = function () {

            if ($scope.redeem.amount === null || $scope.redeem.amount === 0 || $scope.redeem.amount === undefined || $scope.redeem.amount < 0)
                $scope.zeroAmount();
            else if ($scope.vendor.amountlimit != undefined && $scope.isInLimit($scope.redeem.amount, $scope.vendor.amountlimit))
                $scope.exceedingLimit();
            else {

                $scope.ctrlUser = {
                    _id: $scope.user._id,
                    balance: $scope.user.balance - $scope.redeem.amount
                }; //updates walletLimit,see isRemainging for more on walletLimit
                if ($scope.vendor.hasoffer) {
                    var cashback = ($scope.vendor.offerpercent * $scope.redeem.amount) / 100;
                    $scope.ctrlUser.balance = $scope.ctrlUser.balance + cashback;
                }
                console.log($scope.ctrlUser);
                if ($scope.ctrlUser.balance >= 0) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Redeem',
                        template: '<h5 style="text-align: center;margin-bottom:0">Are you sure?</h5>'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            if ($scope.updateUser($scope.ctrlUser) == true) {
                                $scope.transaction = {
                                    from: $scope.user._id,
                                    to: $scope.vendor._id,
                                    type: "redeem",
                                    currentbalance: $scope.ctrlUser.balance,
                                    amount: $scope.redeem.amount,
                                    name: $scope.user.name,
                                    email: $scope.user.email,
                                    vendor: $scope.vendor.name,
                                    mobile: $scope.user.mobile,
                                    deviceid: $scope.user.notificationtoken.deviceid,
                                    os: $scope.user.notificationtoken.os,
                                    user: $scope.user._id
                                };
                                if ($scope.vendor.hasoffer) {
                                    $scope.transaction.hasoffer = true;
                                    $scope.transaction.cashback = cashback;
                                }
                                if ($scope.addTransaction($scope.transaction)) {
                                    $scope.user.balance = $scope.ctrlUser.balance;
                                    $scope.proceedAlert();
                                    $scope.refreshUser();
                                } else {
                                    $scope.alertUser("Redeem", "Unable to redeem amount");
                                }
                                MyServices.setUser($scope.user);
                            } else
                                $scope.alertUser("Redeem", "Server error. Try again.");
                        } else
                            $scope.redeem.amount = undefined;
                    });
                } else {
                    $scope.alertUser("Redeem", "Not enough balance in your wallet");
                }

            }


        };
        $scope.proceedAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem ',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroBalance = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroAmount = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem',
                template: '<h5 style="text-align: center;margin-bottom:0">Please enter a valid amount.</h5>'
            });
            alertPopup.then(function (res) {});
        };
        $scope.exceedingLimit = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem',
                template: '<h5 style="text-align: center;margin-bottom:0">The amount redeem limit is ' + $scope.vendor.amountlimit + '.</h5>'
            });
            alertPopup.then(function (res) {});
        };

    })
    .controller('ListViewCtrl', function ($scope, $stateParams, MyServices) {
        $scope.params = $stateParams;

        MyServices.findCategory($scope.params, function (data) {
            console.log(data);
            if (data) {
                $scope.category = data;
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        $scope.vendors = [];
        MyServices.findVendorByCategory($scope.params, function (data) {
            if (data) {
                $scope.vendors = data;
                console.log($scope.vendors);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    })
    .controller('GridViewCtrl', function ($scope, $stateParams, MyServices, $ionicNavBarDelegate, $ionicLoading, $timeout) {
        $scope.params = $stateParams;
        $scope.nofavoritePage();
        $scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        $timeout(function () {
            $scope.hide();
        }, 3000);
        MyServices.findCategory($scope.params, function (data) {
            console.log(data);
            if (data) {
                $scope.category = data;
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        $scope.vendors = [];
        MyServices.findVendorByCategory($scope.params, function (data) {
            $scope.hide();
            if (data) {
                $scope.vendors = data;
                if ($scope.vendors.length > 0)
                    $scope.vendors = _.chunk($scope.vendors, 3);
                console.log($scope.vendors);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    })
    .controller('NotificationCtrl', function ($scope, $stateParams, MyServices, $location) {
        $scope.nofavoritePage();

        $scope.user = {};
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.markRead = function (item) {
            item.read = true;
            if ($scope.updateUser($scope.user))
                $location.url(item.link);
        };
        $scope.refreshUser();
    })
    .controller('ProfileCtrl', function ($scope, $stateParams, MyServices, $ionicPopup, $cordovaFileTransfer) {
        $scope.nofavoritePage();

        $scope.user = {};
        $scope.edit = true;
        $scope.user = MyServices.getUser();
        $scope.refreshUser = function () {
            MyServices.findUser($scope.user, function (data) {
                if (data) {
                    console.log(data);
                    MyServices.setUser(data);
                    $scope.user = MyServices.getUser();
                }
            }, function (err) {

            });
        };
        $scope.refreshUser();
        $scope.refreshNoti($scope.user);

        $scope.toggleEdit = function () {
            $scope.edit = $scope.edit === false ? true : false;
        };
        $scope.alertUser = function (alertTitle, alertDesc, link) {
            var alertPopup = $ionicPopup.alert({
                title: alertTitle,
                template: '<h5 style="text-align: center;margin-bottom:0">' + alertDesc + '</h5>'
            });
            alertPopup.then(function (res) {
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
        $scope.addProfileImage = function () {

            window.imagePicker.getPictures(
                function (results) {
                    if (results) {
                        $scope.selectedImage = results[0];
                        console.log($scope.selectedImage);
                        $scope.user.profile = $scope.selectedImage;
                        $scope.$apply();
                        $scope.profilePicChanged = true;
                    }
                },
                function (error) {
                    console.log('Error: ' + error);
                }, $scope.options
            );
        };

        function changeUser(user) {
            if ($scope.profilePicChanged == true) {
                $cordovaFileTransfer.upload(adminurl + "uploadfile/uploadfile", $scope.user.profile, {})
                    .then(function (result) {
                        console.log(result);
                        var parsed = JSON.parse(result.response);
                        user.profile = parsed.fileId;
                        console.log(user);
                        $ionicLoading.hide();
                        user.mobile;
                        return user;
                    }, function (err) {
                        console.log(err);
                    }, function (progress) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>'
                        });
                    });
            } else {
                delete user.profile;
                delete user.mobile;
                return user;
            }

        }
        $scope.saveUser = function () {
            MyServices.updateUser(changeUser($scope.user), function (data2) {
                if (data2) {
                    console.log(data2);
                    if (data2.value === false)
                        $scope.alertUser("", "Unable to update profile.");
                    else
                        $scope.alertUser("", "Profile updated.");
                }
            }, function (err) {});
        };
        if ($.jStorage.get("os") === "android") {
            var options = {
                date: new Date(),
                mode: 'date', // or 'time',
                maxDate: new Date() - 1,
                allowOldDates: true,
                allowFutureDates: false,
                androidTheme: 3
            };
        } else if ($.jStorage.get("os") === "ios") {
            var options = {
                date: new Date(),
                mode: 'datetime', // or 'time',
                maxDate: new Date() - 1,
                allowOldDates: true,
                allowFutureDates: false,
                androidTheme: 3
            };
        }

        function onSuccess(date) {
            $scope.user.date = $filter('date')(date, 'dd/MM/yyyy');
            $scope.$apply();
            console.log($scope.signup.date);
        }

        $scope.openDate = function () {
            datePicker.show(options, onSuccess);
        }

    });