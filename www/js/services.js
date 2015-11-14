var adminurl = "http://192.168.0.106:1337/";
//var adminurl = "http://wohlig.in:81/";
//var adminurl = "http://130.211.164.146:81/";
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
        updateUser: function (userData, callback, err) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: userData
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
        findVendorByCategory: function (category,callback, err) {
            $http({
                url: adminurl + 'vendors/findVendorByCategoryID',
                method: 'POST',
                data: {
                    "category": category.id
                }
            }).success(callback).error(err);
        },
        findByType: function (transactionType,callback, err) {
            $http({
                url: adminurl + 'transaction/findByType',
                method: 'POST',
                data: {
                    "type": transactionType.type
                }
            }).success(callback).error(err);
        },
        findByTypeUser: function (transactionFilter,callback, err) {
            $http({
                url: adminurl + 'transaction/findByTypeUser',
                method: 'POST',
                data: {
                    "type": transactionFilter.type,
                    "from": transactionFilter.from
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
        }
    };
});