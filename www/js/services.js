//var adminurl = "http://192.168.0.114:1337/";
//var adminurl = "http://wohlig.in:81/";
var adminurl = "http://104.154.90.30/";
//var adminurl = "http://localhost:1337/";
var imgpath = adminurl + "uploadfile/resize?file=";

angular.module('starter.services', [])

.factory('MyServices', function ($http) {

    return {
        loginUser: function (userData, callback, err) {
            $http({
                url: adminurl + 'user/login',
                method: 'POST',
                data: {
                    "mobile": userData.mobile,
                    "password": userData.password
                }
            }).success(callback).error(err);
        },
        signupUser: function (signupData, callback, err) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: signupData
            }).success(callback).error(err);
        },
        findUser: function (signupData, callback, err) {
            $http({
                url: adminurl + 'user/findone',
                method: 'POST',
                data: {
                    "_id": signupData._id
                }
            }).success(callback).error(err);
        },
        updateUser: function (userData, callback, err) {
            console.log(userData);
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: userData
            }).success(callback).error(err);
        },
        findUserByMobile: function (userData, callback, err) {
            console.log(userData);
            $http({
                url: adminurl + 'user/findUserByMobile',
                method: 'POST',
                data: userData
            }).success(callback).error(err);
        },
        updateReferrer: function (userData, callback, err) {
            console.log(userData);
            $http({
                url: adminurl + 'user/updateReferrer',
                method: 'POST',
                data: {
                    "mobile": userData.mobile,
                    "_id": userData._id,
                    "amount": userData.amount
                }
            }).success(callback).error(err);
        },
        addTransaction: function (transactionData, callback, err) {
            $http({
                url: adminurl + 'transaction/save',
                method: 'POST',
                data: transactionData
            }).success(callback).error(err);
        },
        findCategories: function (callback, err) {
            $http({
                url: adminurl + 'category/find',
                method: 'GET'
            }).success(callback).error(err);
        },
        findBanner: function (callback, err) {
            $http({
                url: adminurl + 'banner/find',
                method: 'GET'
            }).success(callback).error(err);
        },
        findVendorByCategory: function (category, callback, err) {
            $http({
                url: adminurl + 'vendors/findVendorByCategoryID',
                method: 'POST',
                data: {
                    "category": category.id
                }
            }).success(callback).error(err);
        },
        findByType: function (transactionType, callback, err) {
            $http({
                url: adminurl + 'transaction/findByType',
                method: 'POST',
                data: {
                    "type": transactionType.type
                }
            }).success(callback).error(err);
        },
        findByTypeUser: function (transactionFilter, callback, err) {
            $http({
                url: adminurl + 'transaction/findByTypeUser',
                method: 'POST',
                data: {
                    "type": transactionFilter.type,
                    "from": transactionFilter.from
                }
            }).success(callback).error(err);
        },
        findPassbookEntry: function (transactionFilter, callback, err) {
            $http({
                url: adminurl + 'transaction/findPassbookEntry',
                method: 'POST',
                data: {
                    "type": transactionFilter.type,
                    "from": transactionFilter.from,
                    "passbook": transactionFilter.passbook
                }
            }).success(callback).error(err);
        },
        findCategory: function (category, callback, err) {
            $http({
                url: adminurl + 'category/findone',
                method: 'POST',
                data: {
                    "_id": category.id
                }
            }).success(callback).error(err);
        },
        findVendor: function (vendor, callback, err) {
            $http({
                url: adminurl + 'vendors/findone',
                method: 'POST',
                data: {
                    "_id": vendor.id
                }
            }).success(callback).error(err);
        },
        sendOTP: function (message, callback, err) {
            $http({
                url: 'http://bulksms.mysmsmantra.com:8080/WebSMS/SMSAPI.jsp?username=Paiso&password=157699462&sendername=PAISOO&mobileno=91' + message.mobile + '&message=Dear User, welcome to PAiSO. Your OTP is ' + message.otp + '.',
                method: 'GET'
            });
        },
        sendRedeem: function (message, callback, err) {
            $http({
                url: 'http://bulksms.mysmsmantra.com:8080/WebSMS/SMSAPI.jsp?username=Paiso&password=157699462&sendername=PAISOO&mobileno=91' + message.mobile + '&message=Voucher No ' + message.vouchernumber + ' for Rs.' + message.amount + ' spent on ' + message.vendor + ' at ' + message.timestamp + '(Current Balance: Rs.' + message.currentbalance + '). Valid Till : ' + message.validtill + '. Paiso.',
                method: 'GET'
            });
        },
        setNotify: function (data) {
            $.jStorage.set("notify", data);
        },
        getNotify: function () {
            return $.jStorage.get("notify");
        },
        setOTP: function (data) {
            $.jStorage.set("otp", data);
        },
        getOTP: function () {
            return $.jStorage.get("otp");
        },
        setUser: function (data) {
            $.jStorage.set("user", data);
        },
        getUser: function () {
            return $.jStorage.get("user");
        },
        setReferrer: function (data) {
            $.jStorage.set("referrer", data);
        },
        getReferrer: function () {
            return $.jStorage.get("referrer");
        }
    };
});