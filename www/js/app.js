// Ionic Starter App
var phone = {};
var push = {};
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        try {
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

            push.on('registration', function (data) {

                console.log(data);
                $.jStorage.set("device", data.registrationId);
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
        } catch (e) {
            console.log(e)
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('login', {
                url: '/login',


                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.gridview', {
                url: '/gridview/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gridview.html',
                        controller: 'GridViewCtrl'
                    }
                }
            })
            .state('app.redeem', {
                url: '/redeem/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/redeem.html',
                        controller: 'RedeemCtrl'
                    }
                }
            })
            .state('app.passbook', {
                url: '/passbook',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/passbook.html',
                        controller: 'PassbookCtrl'
                    }
                }
            })

        .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/browse.html'
                    }
                }
            })
            .state('app.spendhistory', {
                url: '/spendhistory',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/spendhistory.html',
                        controller: 'SpendHistoryCtrl'
                    }
                }
            })
            .state('app.sendmoney', {
                url: '/sendmoney',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/sendmoney.html',
                        controller: 'SendMoneyCtrl'
                    }
                }
            })
            .state('app.wallet', {
                url: '/wallet',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wallet.html',
                        controller: 'WalletCtrl'
                    }
                }
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })
            .state('app.referral', {
                url: '/referral',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/referral.html',
                        controller: 'ReferralCtrl'
                    }
                }
            })
            .state('app.listview', {
                url: '/listview/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/listview.html',
                        controller: 'ListViewCtrl'
                    }
                }
            })
            .state('app.notification', {
                url: '/notification',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification.html',
                        controller: 'NotificationCtrl'
                    }
                }
            })
            .state('app.aboutus', {
                url: '/aboutus',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/faqNaboutus.html',
                        controller: 'AboutUsCtrl'
                    }
                }
            })
            .state('app.playlists', {
                url: '/playlists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlists.html',
                        controller: 'PlaylistsCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

        .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlist.html',
                    controller: 'PlaylistCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        if ($.jStorage.get("user")) {
            $urlRouterProvider.otherwise('/app/home');
        } else {
            $urlRouterProvider.otherwise('/login');
        }
    })
    .filter('serverimage', function () {
        return function (image) {
            if (image == undefined) {
                return 'img/user.png'
            } else if (image.substr(0, 1) == "f") {
                return image;
            } else {
                return imgpath + image;
            }
        };
    });
