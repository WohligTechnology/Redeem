angular.module('starter.controllers', ['ui.bootstrap'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, MyServices) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/balance-history.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal1 = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeHistory = function () {
        $scope.modal1.hide();
    };

    // Open the login modal
    $scope.history = function () {
        $scope.modal1.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
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
    },
//                   {
//        title: 'Spend History',
//        url: '#/app/spendhistory',
//        state: false
//    }, 
        {
            title: 'Referral',
            url: '#/app/referral',
            state: false
    }, {
            title: 'About Us',
            url: '#/app/aboutus',
            state: false
    }, {
            title: 'Logout',
            url: '#/login',
            state: false
    }];
    $scope.activateMenu = function (index) {
        console.log(index);
        for (var i = 0; i < $scope.menu.length; i++) {
            $scope.menu[i].state = false;
            console.log($scope.menu[i].state)
        }
        $scope.menu[index].state = true;
        console.log($scope.menu[index]);
    };
})

.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
        {
            title: 'Reggae',
            id: 1
        },
        {
            title: 'Chill',
            id: 2
        },
        {
            title: 'Dubstep',
            id: 3
        },
        {
            title: 'Indie',
            id: 4
        },
        {
            title: 'Rap',
            id: 5
        },
        {
            title: 'Cowbell',
            id: 6
        }
  ];
})

.controller('LoginCtrl', function ($scope, $stateParams, $location, MyServices) {

    $scope.user = {};
    $scope.activate = true;
    $scope.tab = {
        left: true,
        right: false
    }
    $scope.highlight = false;
    $scope.clickTab = function (side) {
        //            $ionicScrollDelegate.scrollTop();
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            console.log("here");
        }
    };
    $scope.doLogin = function () {
        console.log($scope.user);
        MyServices.loginUser($scope.user, function (data) {
            if (data) {
                console.log(data);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });

        console.log("herer");
        $location.path('app/home');
    };


})

.controller('HomeCtrl', function ($scope, $stateParams, MyServices, $location) {
        $scope.banners = []
        $scope.category = [];
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
    .controller('ReferralCtrl', function ($scope, $stateParams, $ionicBackdrop, $timeout) {
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
    .controller('AboutUsCtrl', function ($scope, $stateParams) {
        $scope.oneAtATime = true;
        $scope.activate = true;
        $scope.tab = {
            left: true,
            right: false
        }
        $scope.highlight = false;
        $scope.clickTab = function (side) {
            //            $ionicScrollDelegate.scrollTop();
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
            //            $ionicScrollDelegate.scrollTop();
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
    .controller('WalletCtrl', function ($scope, $stateParams, $ionicScrollDelegate) {
        $scope.indicator = true;
        $scope.downIndicator = function () {
            $scope.indicator = true;
        };
        $scope.upIndicator = function () {
            $scope.indicator = false;
        };
        $scope.pendings = [{
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
    }];
    })
    .controller('SpendHistoryCtrl', function ($scope, $stateParams) {

        $scope.spendhistory = [{
            category: 'E-Commerce',
            name: 'Amazon',
            date: '21/10/2015',
            success: true,
            amount: '2000'
    }, {
            category: 'Movie Bookings',
            name: 'BookMyShow',
            date: '20/10/2015',
            success: false,
            amount: '200'
    }, {
            category: 'E-Commerce',
            name: 'Flipkart',
            date: '19/10/2015',
            success: false,
            amount: '1000'
    }, {
            category: 'E-Commerce',
            name: 'Myntra',
            date: '15/10/2015',
            success: true,
            amount: '800'
    }, {
            category: 'E-Commerce',
            name: 'Amazon',
            date: '21/10/2015',
            success: true,
            amount: '2000'
    }];

    })
    .controller('RedeemCtrl', function ($scope, $stateParams, $ionicModal, $timeout, $ionicPopup, $location, MyServices) {
        $scope.readTNC = false;
        $scope.params = $stateParams;
        $scope.fixedinput = false;
        $scope.vendor = [];
        $scope.crossedLimit = false;
        MyServices.findVendor($scope.params, function (data) {
            console.log(data);
            if (data) {
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
            console.log(value + " " + $scope.vendor.amountlimit);
            if ($scope.vendor.amountlimit === undefined)
                $scope.crossedLimit = false;

            else
            if (value > $scope.vendor.amountlimit)
                $scope.crossedLimit = true;
            else
                $scope.crossedLimit = false;

        }
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Redeem Progress',
                template: '<div style="text-align: center;"><img src="img/pending.png" style="width: 25%;"></div><h5 style="text-align: center;margin-bottom:0">Request pending approval</h5>'
            });
            alertPopup.then(function (res) {
                $location.path('app/wallet');
            });
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
        $scope.AddMoney = function () {

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
    .controller('GridViewCtrl', function ($scope, $stateParams, MyServices, $ionicNavBarDelegate) {
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
                if ($scope.vendors.length > 0)
                    $scope.vendors = _.chunk($scope.vendors, 3);
                console.log($scope.vendors);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        $scope.ecommerce = [
            {
                company: 'Amazon',
                imgurl: 'img/categories/amazon.jpg'
            }, {
                company: 'Flipkart',
                imgurl: 'img/categories/flipkart.png'
            }, {
                company: 'Jabong',
                imgurl: 'img/categories/jabong-logo.jpg'
            }, {
                company: 'Myntra',
                imgurl: 'img/categories/myntra.png'
            }, {
                company: 'Big Basket',
                imgurl: 'img/categories/bigbasket.png'
            }, {
                company: 'Snapdeal',
                imgurl: 'img/categories/snapdeal.png'
            }
    ];
        $scope.ecommerce = _.chunk($scope.ecommerce, 3);

    });