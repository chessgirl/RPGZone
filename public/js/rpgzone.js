var rpgZone = angular.module('rpgZone', ['ngResource']);

rpgZone.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

rpgZone.factory('CharacterService', function ($resource) {
    return $resource('/characters/:characterId', {characterId: '@_id'}, {update: {method: 'PUT'}});
});

rpgZone.controller('CharacterController', function ($scope, $location, $window, CharacterService) {

    var calculateMod = function (value) {
        if (value) {
            return Math.floor((value - 10) / 2);
        } else {
            return 0;
        }
    };

    function calculateHalfLevel(level) {
        if (level) {
            return Math.floor(level / 2);
        } else {
            return 0;
        }
    }

    var calculateTotalMod = function (value, level) {
        if (level) {
            return calculateMod(value) + calculateHalfLevel(level);
        } else {
            return 0;
        }
    };

    var calculateBloodied = function (maxHp) {
        if (maxHp) {
            return Math.floor(maxHp / 2);
        } else {
            return 0;
        }
    };

    var calculateSurge = function (maxHp) {
        if (maxHp) {
            return Math.floor(maxHp / 4);
        } else {
            return 0;
        }
    };

    var addElementToList = function (list) {
        list.push({});
    };

    var removeElementToList = function (list, element) {
        var index = list.indexOf(element);
        if (index > -1) {
            list.splice(index, 1);
        }
    };

    $scope.calculateMod = calculateMod;
    $scope.calculateTotalMod = calculateTotalMod;
    $scope.calculateBloodied = calculateBloodied;
    $scope.calculateSurge = calculateSurge;
    $scope.calculateHalfLevel = calculateHalfLevel;
    $scope.addElementToList = addElementToList;
    $scope.removeElementToList = removeElementToList;

    $scope.character = {
        notes: [],
        powers: [],
        feats: [],
        equipments: []
    };

    if ($location.search() && $location.search().id) {
        $scope.character = CharacterService.get({characterId: $location.search().id});
    }

    $scope.submit = function () {
        if (!$scope.character._id) {
            $scope.character = new CharacterService($scope.character);
            $scope.character.$save();
        } else {
            $scope.character.$update();
        }
    };

});

rpgZone.controller('CharacterListController', function ($scope, $location, CharacterService) {

    function loadCharacters() {
        $scope.characters = CharacterService.query();
    }

    $scope.suppress = function (id) {
        console.log("Suppress " + id);
        CharacterService.get({characterId: id}, function (result) {
                result.$delete(function () {
                    loadCharacters();
                });
            }
        );

    };

    loadCharacters();

});