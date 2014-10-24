/**
 * Created by b on 10/23/2014.
 */
angular.module('main', [])
    .controller('mealController', function ($scope) {
        $scope.data = {};

        $scope.submitAMeal = function (user) {
            $scope.data = angular.copy(user);
            var allTotals = CalculateTotals();
            $scope.$broadcast('totalsCalculated', allTotals);
        };

        $scope.reset = function (user) {
            $scope.$broadcast('reset');
            $scope.user.mealPrice = 0;
            $scope.user.taxRate = 0;
            $scope.user.tipRate = 0;
        };

        function CalculateTotals() {
            var customerCharges = {};

            var mealPrice = $scope.data.mealPrice;
            var taxRate = $scope.data.taxRate / 100;
            var tipRate = $scope.data.tipRate / 100;

            var tax = mealPrice * taxRate;
            var subTotal = mealPrice + tax;
            var tip = mealPrice * tipRate;
            var total = subTotal + tax + tip;

            customerCharges.tax = mealPrice * taxRate;
            customerCharges.subTotal = mealPrice + tax;
            customerCharges.tip = mealPrice * tipRate;
            customerCharges.total = subTotal + tax + tip;

            return customerCharges;

        }
    })

    .controller('customerChargesController', function ($scope) {
        $scope.data = {};

        $scope.$on('totalsCalculated', function (event, data) {
            $scope.data = angular.copy(data);
        })

        $scope.$on('reset', function (event) {
            $scope.data = {};
        });
    })

    .controller('earningsController', function ($scope) {
        $scope.mealCount = 0;
        $scope.tips = [];
        $scope.averageTip = 0;
        $scope.totalTips = 0;

        $scope.$on('totalsCalculated', function (event, allTotals) {

            $scope.mealCount++;
            //use this later for average
            $scope.tips.push(allTotals);

            calculateTotalTips(allTotals);
            calculateAverageTip(allTotals)
        });

        function calculateTotalTips(allTotals) {
            $scope.totalTips += allTotals.tip;
        }

        function calculateAverageTip(allTotals) {
            $scope.averageTip = $scope.totalTips / $scope.mealCount;
        }

        $scope.$on('reset', function (event) {
            $scope.mealCount = 0;
            $scope.tips = [];
            $scope.averageTip = 0;
            $scope.totalTips = 0;
        });

    })


