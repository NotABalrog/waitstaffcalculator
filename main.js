/**
 * Created by b on 10/23/2014.
 */
angular.module('main', [])
    .controller('mealController', function ($scope) {

        $scope.submitAMeal = function () {
            console.log($scope);
            if ($scope.mealDetailForm.$valid) {
                $scope.submitted = false;
                var allTotals = calculateTotals();
                $scope.$broadcast('totalsCalculated', allTotals);
            }

            else {
                $scope.mealDetailForm.submitted = true;
            }
        };

        $scope.reset = function () {
            $scope.setPristineAndClear();
            $scope.$broadcast('reset');
        };

        $scope.setPristineAndClear = function () {

            $scope.mealDetailForm.$setPristine();

            $scope.mealPrice = 0;
            $scope.taxRate = 0;
            $scope.tipRate = 0;

            $scope.$broadcast('clear');

        };

        function calculateTotals() {
            var customerCharges = {};

            var mealPrice = $scope.mealPrice;
            var taxRate = $scope.taxRate / 100;
            var tipRate = $scope.tipRate / 100;

            customerCharges.tax = mealPrice * taxRate;
            customerCharges.subTotal = mealPrice + customerCharges.tax;
            customerCharges.tip = mealPrice * tipRate;
            customerCharges.total = customerCharges.subTotal + customerCharges.tax + customerCharges.tip;

            return customerCharges;
        }
    })

    .controller('customerChargesController', function ($scope) {

        $scope.$on('totalsCalculated', function (event, data) {
            $scope.data = angular.copy(data);
        })

        $scope.$on('reset', function (event) {
            $scope.data = {};
        });

        $scope.$on('clear', function (event) {
            $scope.data = {};
        });
    })

    .controller('earningsController', function ($scope) {

        reset();

        $scope.$on('totalsCalculated', function (event, allTotals) {

            $scope.mealCount++;
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
            reset();
        });

        function reset() {
            $scope.mealCount = "";
            $scope.tips = [];
            $scope.averageTip = "";
            $scope.totalTips = "";
        }

    })


