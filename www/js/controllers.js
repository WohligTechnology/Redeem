angular.module('starter.controllers', ['ui.bootstrap'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, MyServices, $ionicPopup, $location) {

    $scope.user = {};
    $scope.user = MyServices.getUser();
    $scope.loginData = {};
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
    if (!MyServices.getUser()) {
        $location.url("/login");
    }
    $scope.refreshUser = function () {
        if (MyServices.getUser()) {
            $scope.user = MyServices.getUser();
            console.log($scope.user);
        } else {

        }
    };

    $scope.referralBadge = undefined;
    $scope.newReferral = function () {
        MyServices.findUser(MyServices.getUser(), function (data) {
            if (data) {
                if (data.referral.length > $scope.user.referral.length) {
                    MyServices.setUser(data);
                    $scope.referralBadge = data.referral.length - $scope.user.referral.length;
                }
            }
        }, function (err) {

        });
    };
    $scope.testCall = function () {
        console.log("in here");
    };
    $scope.newReferral();
    $scope.refreshUser();
    $scope.menu = [{
        title: 'Home',
        url: '#/app/home',
        state: true
    }, {
        title: 'Wallet',
        url: '#/app/wallet',
        state: false
    }, {
        title: 'Send Money',
        url: '#/app/sendmoney',
        state: false
    }, {
        title: 'Passbook',
        url: '#/app/passbook',
        state: false
    }, {
        title: 'Referral',
        url: '#/app/referral',
        state: false,
        badgecount: $scope.referralBadge
    }, {
        title: 'About Us',
        url: '#/app/aboutus',
        state: false
    }, {
        title: 'Notification',
        url: '#/app/aboutus',
        state: false
    }, {
        title: 'Logout',
        url: '#',
        state: false
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
                $location.path('app/wallet');
        });
    };
})

.controller('PlaylistsCtrl', function ($scope) {})
    .controller('SearchCtrl', function ($scope) {})

.controller('LoginCtrl', function ($scope, $stateParams, $location, MyServices, $ionicScrollDelegate, $ionicModal, $ionicPopup) {
    $scope.focus = [];
    $scope.hideButtonOnInput = {
        left: false,
        right: false
    };
    if (MyServices.getUser()) {
        $location.url("/app/home");
    }
    $scope.isFocused = function (index) {
        $scope.focus[index] = true;
    };
    $scope.login = {};
    $scope.signup = {};
    $scope.activate = true;
    $scope.tab = {
        left: true,
        right: false
    };

    window.addEventListener('native.keyboardshow', function () {
        console.log("here")
        $scope.hideButtonOnInput.left = true;
        $scope.hideButtonOnInput.right = true;
    });
    window.addEventListener('native.keyboardhide', function () {
        if ($scope.tab.left === true)
            $scope.hideButtonOnInput.left = false;
        else
            $scope.hideButtonOnInput.right = false;
    });
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
    $scope.doLogin = function () {
        MyServices.loginUser($scope.login, function (data) {
            if (data) {
                if (data.value === false) {
                    console.log("invalid data");
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
    };
    $scope.otp = 0;
    $scope.ctrlUser = {};
    $scope.generateOTP = function () {
        $scope.otp = Math.floor(100000 + Math.random() * 900000);
        MyServices.setOTP($scope.otp);
        console.log($scope.otp);
    };
    $scope.checkReferral = function () {
        console.log($scope.signup);
        MyServices.findUserByMobile($scope.signup, function (data) {
                if (data) {
                    console.log(data);
                    $scope.ctrlUser = data;
                    return true;
                } else {
                    return false;
                }
            },
            function (err) {
                if (err) {
                    return false;
                }
            });
    };
    $scope.data = {};
    $scope.checkOTP = function () {
        $scope.generateOTP();
        if ($scope.checkReferral()) {
            // referral verified
        } else {
            // referral code validation
        }
        var confirmPopup = $ionicPopup.confirm({
            title: 'Paiso',
            template: '<h5 style="text-align:center">We&apos;ll send an OTP on the following number :</h5><h4 class="text-center">+91 ' + $scope.signup.mobile + '</h4>'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var myPopup = $ionicPopup.show({
                    template: '<input type="number" ng-model="data.inputotp" style="margin: 0px auto;width:100px;text-align:center;font-size:20px">',
                    title: 'Enter the OTP',
                    subTitle: 'please input the 6-digit OTP',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Verify</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                console.log($scope.data.inputotp);
                                if (!$scope.data.inputotp) {
                                    //don't allow the user to close unless he enters otp password
                                    e.preventDefault();
                                } else {
                                    if ($scope.data.inputotp === MyServices.getOTP()) {
                                        console.log("in signup");
                                        $scope.doSignup();
                                        return $scope.data.inputotp;
                                    }
                                }
                            }
                        }]
                });
            } else {

            }
        });
    };
    $scope.referralData = {};
    $scope.doSignup = function () {
        MyServices.signupUser($scope.signup, function (data) {
            if (data) {
                console.log(data);
                $scope.checkReferral();
                $scope.referralData = {
                    _id: data.id,
                    amountearned: 0
                };
                if ($scope.signup.referrer != "" || $scope.signup.referrer != null || $scope.signup.referrer != undefined) {
                    if ($scope.ctrlUser.referral) {
                        $scope.ctrlUser.referral.unshift($scope.referralData);
                    }
                    if ($scope.updateUser($scope.ctrlUser)) {

                    } else {
                        //handle referral not successful here
                    }
                }
                $scope.tab.left = true;
                $scope.tab.right = false;
            }
        }, function (err) {
            if (err)
                console.log(data);
        });
    };
})

.controller('HomeCtrl', function ($scope, $stateParams, MyServices, $location, $ionicLoading, $timeout) {
        $scope.banners = [];
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

    })
    .controller('PlaylistCtrl', function ($scope, $stateParams) {})
    .controller('ReferralCtrl', function ($scope, $stateParams, $ionicBackdrop, $timeout, MyServices) {
        $scope.newReferral();
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
        $scope.friendlist = [];
        $scope.getThisUser = function (id) {
            $scope.user = {
                _id: id
            };
            MyServices.findUser($scope.user, function (data) {

                if (data) {
                    console.log(data);
                    $scope.friendlist.unshift(data);
                }
            }, function (err) {});
        };
        if ($scope.user.referral != null || $scope.user.referral != undefined)
            _.each($scope.user.referral, function (key) {
                $scope.getThisUser(key);
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
        $scope.referralmoney = 0;
        _.each($scope.friends, function (n) {
            $scope.referralmoney += n.price;
        });

        $scope.shareIt = function () {
            $ionicBackdrop.retain();
            $timeout(function () {
                $ionicBackdrop.release();
            }, 1000);
        };
    })
    .controller('AboutUsCtrl', function ($scope, $stateParams, $ionicScrollDelegate) {

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
    .controller('PassbookCtrl', function ($scope, $stateParams, $ionicScrollDelegate) {


        $scope.availableFlags = {};
        $scope.activate = true;
        $scope.tab = {
            left: false,
            center: true,
            right: false
        }
        $scope.moveToUsed = function () {

            //service code to actually move,here!

            $scope.tab.left = false;
            $scope.tab.center = false;
            $scope.tab.right = true;
            $ionicScrollDelegate.scrollTop();

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
        $scope.openUp = function (index) {
            $scope.highlight = true;
            console.log(index);
            for (var i = 0; i < $scope.available.length; i++) {
                $scope.availableFlags[i] = false;
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
        $scope.available = [{
                name: 'BookMyShow',
                price: 500,
                date: '22/10/2015',
                voucher_number: 51,
                validity: '20/01/16',
                expiry_proximity: 'red'
    },
            {
                name: 'Amazon',
                price: 5000,
                date: '23/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'red'
    },
            {
                name: 'Flipkart',
                price: 400,
                date: '30/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'yellow'
    },
            {
                name: 'Amazon',
                price: 5000,
                date: '23/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'red'
    },
            {
                name: 'Flipkart',
                price: 400,
                date: '30/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'yellow'
    },
            {
                name: 'Myntra',
                price: 1200,
                date: '10/11/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'green'
    },
            {
                name: 'Jabong',
                price: 500,
                date: '15/11/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'green'
    },
            {
                name: 'Amazon',
                price: 5000,
                date: '23/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'red'
    },
            {
                name: 'Flipkart',
                price: 400,
                date: '30/10/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'yellow'
    },
            {
                name: 'Myntra',
                price: 1200,
                date: '10/11/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'green'
    }];

        $scope.expired = [
            {
                name: 'BookMyShow',
                price: 500,
                date: '22/10/2015',
                voucher_number: 51,
                validity: '20/01/16',
                expiry_proximity: 'grey'
    },
            {
                name: 'Jabong',
                price: 600,
                date: '15/11/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'grey'
    }];
        $scope.used = [{
                name: 'BookMyShow',
                price: 500,
                date: '22/10/2015',
                voucher_number: 51,
                validity: '20/01/16',
                expiry_proximity: 'grey'
    },
            {
                name: 'Jabong',
                price: 600,
                date: '15/11/2015',
                voucher_number: 500,
                validity: '20/01/16',
                expiry_proximity: 'grey'
    }];
    })
    .controller('SendMoneyCtrl', function ($scope, $stateParams) {})
    .controller('WalletCtrl', function ($scope, $stateParams, $ionicScrollDelegate, MyServices, $ionicPopup, $location, $ionicModal) {
        //Here $scope.user is a global varianble.


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
        $scope.indicator = true;
        $scope.ctrlUser = {};
        $scope.refreshUser();
        $scope.wallet = {
            amount: undefined
        };
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
        $scope.upgradeIt = function () {
            console.log("here");
            var alertPopup = $ionicPopup.alert({
                title: 'Upgrade status.',
                template: '<h5 style="text-align: center;margin-bottom:0">Thank you. Your request for upgrade is in progress.</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/home');
                $scope.closeUpgrade();
            });

        };
        $scope.transaction = {};
        console.log($scope.user);
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
                title: 'Exceeding limit',
                template: '<h5 style="text-align: center;margin-bottom:0">Amount exceeding monthly limit.<br>Do you want to upgrade KYC?</h5>'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.upgrade();
                } else {}
            });
        };
        $scope.reffererUser = {};
        $scope.updateRefferer = function (user) {
            $scope.flag = undefined;
            MyServices.updateRefferer(user, function (data2) {
                if (data2) {
                    $scope.reffererUser = data2;
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
            //change alert texts 
            $scope.transaction = {};
            $scope.refreshUser();
            if ($scope.wallet.amount === 0 || $scope.wallet.amount === undefined || $scope.wallet.amount === null) {
                $scope.alertUser("Invalid Amount", "can not add Rs. 0 to wallet.", 'app/wallet');
            } else if ($scope.wallet.amount < 0) {
                $scope.alertUser("Invalid Amount", "Amount can not be negative.", 'app/wallet');
            } else if ($scope.user.walletLimit <= 0) {
                $scope.alertUser("Monthly limit reached", "To add more money upgrade your KYC. The user is given a monthly limit of Rs.10000", 'app/wallet');
            } else if ($scope.wallet.amount > $scope.user.walletLimit) {
                $scope.upgradeAlert();
            } else {
                $scope.ctrlUser = {
                    _id: $scope.user._id,
                    balance: $scope.user.balance + $scope.wallet.amount,
                    walletLimit: $scope.user.walletLimit - $scope.wallet.amount
                }; //updates walletLimit,see isRemainging for more on walletLimit
                console.log($scope.ctrlUser);
                if ($scope.updateUser($scope.ctrlUser)) {
                    $scope.transaction = {
                        from: $scope.user._id,
                        to: $scope.user._id,
                        type: "balance",
                        currentbalance: $scope.ctrlUser.balance,
                        amount: $scope.wallet.amount
                    };
                    if ($scope.addTransaction($scope.transaction)) {
                        $scope.user.balance = $scope.ctrlUser.balance;
                        $scope.user.walletLimit = $scope.ctrlUser.walletLimit;
                        $scope.alertUser("Success", "Money added to your wallet.", 'app/wallet');
                        if ($scope.user.referrer) {
                            $scope.updateData = {
                                mobile: $scope.user.referrer,
                                _id: $scope.user._id,
                                amount: $scope.transaction.amount
                            };
                            if ($scope.updateRefferer($scope.updateData)) {
                                $scope.alertUser("Refferer updated", "Money added to your wallet.", 'app/wallet');

                            } else {

                            }
                        }
                        MyServices.setUser($scope.user);
                        $scope.wallet.amount = undefined;

                    } else {
                        $scope.alertUser("Transaction status", "Failed", 'app/wallet');
                    }
                } else {
                    $scope.alertUser("Failed", "Failed", 'app/wallet');
                }
            }
        };
        $scope.pendings = [{
            name: 'BookMyShow',
            price: 500,
            date: '22/10/2015',
            voucher_number: 51,
            validity: '20/01/16',
            expiry_proximity: 'red'
    }, {
            name: 'Amazon',
            price: 5000,
            date: '23/10/2015',
            voucher_number: 500,
            validity: '20/01/16',
            expiry_proximity: 'red'
    }, {
            name: 'Flipkart',
            price: 400,
            date: '30/10/2015',
            voucher_number: 500,
            validity: '20/01/16',
            expiry_proximity: 'yellow'
    }];
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
        };
        $scope.requestpending = [];
        $scope.transactionPendingFilter = {
            type: "redeem",
            from: $scope.user._id
        };
        $scope.getRedeem = function () {
            MyServices.findByTypeUser($scope.transactionPendingFilter, function (data) {
                    if (data) {
                        $scope.requestpending = data;
                        $scope.item = {};
                        console.log($scope.requestpending);
                        _.each($scope.requestpending, function (key) {
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
        $scope.getRedeem();
        $scope.balanceHistory = [];
        $scope.transactionFilter = {
            type: "balance",
            from: $scope.user._id
        };
        $scope.getHistory = function () {
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
                if ($scope.vendor.length != 0) {
                    $scope.empty = false;
                    $scope.placeholdertext = "Enter Amount";
                    if ($scope.vendor.input === "fixed" || $scope.vendor.input === "multiple") {
                        $scope.fixedinput = true;
                        $scope.placeholdertext = "Select amount";
                    } else {
                        $scope.fixedinput = false;
                        $scope.placeholdertext = "Enter amount";
                    }
                } else {
                    $scope.empty = true;
                }
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
                console.log($scope.ctrlUser);
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
                        referral: $scope.user.referral
                    };
                    if ($scope.addTransaction($scope.transaction)) {
                        $scope.user.balance = $scope.ctrlUser.balance;
                        $scope.proceedAlert();
                    } else {
                        $scope.alertUser("Redeem Progress", "Redeeming amount FAILED");
                    }
                    MyServices.setUser($scope.user);
                } else {
                    if ($scope.ctrlUser.balance < 0)
                        $scope.alertUser("Redeem Failed", "Not enough balance in your wallet");
                    else
                        $scope.alertUser("Redeem Failed", "Server error. Try again.");

                }
            }
        };
        $scope.proceedAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem Progress',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroBalance = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Warning',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/wallet');
            });
        };
        $scope.zeroAmount = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Invalid amount',
                template: '<h5 style="text-align: center;margin-bottom:0">Please enter a valid amount.</h5>'
            });
            alertPopup.then(function (res) {});
        };
        $scope.exceedingLimit = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Exceeding Limit',
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
    });