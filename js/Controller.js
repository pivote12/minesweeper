
  var app = angular.module('BuscMinas', []);

  app.controller('size',['$scope',function($scope){
    this.Maintab = 1;
    this.lastSpot="";
    $scope.minesCount=0;
    this.selectTab = function(setTab){
        this.Maintab = setTab;
    }
    this.isSelected = function(checkTab){
        return this.Maintab === checkTab;
    }
    this.MakeGame = function(){
      level = $scope.level;
      name = $scope.name;
      $scope.isLose = false;
      $scope.hasWon = false;
      
      switch (level) {
        case undefined:
        return;
        break
        case "beginner":
        $scope.minefield = this.MinesweeperController($scope,4);
        $scope.minesCount = 4;
          break;
        case "intermidate":
        $scope.minefield = this.MinesweeperController($scope,8);
        $scope.minesCount = 8;
          break;
        case "advance":
        $scope.minefield = this.MinesweeperController($scope,12);
        $scope.minesCount = 12;

          break;
        case "expert":
        $scope.minefield = this.MinesweeperController($scope,16);
        $scope.minesCount = 16;
          break;
      }

      this.selectTab(2);


    }
    this.getPosition = function(minefield,row,column){
      return minefield.rows[row].spots[column];
    }
    this.placeMine = function(minefield,count){

      var row = Math.round(Math.random()* count);
      var column = Math.round(Math.random() * count);
      minesCount = count;
      if (row==minefield.rows.length) {
        row -= 1;
      }
      if (column==minefield.rows.length) {
        column -= 1;
      }
      var spot = this.getPosition(minefield,row,column);
      if (spot.content =="mine") {
          this.placeMine(minefield,count);
      }
      spot.content = "mine";
    }
    this.placeManyRandomMines = function(minefield,count){
      for(var i = 0; i < count; i++) {
        this.placeMine(minefield,count);
      }
    }
    this.createMinefield= function(count){

          var minefield = {};
          minefield.rows = [];

          for(var i = 0; i < count; i++) {
              var row = {};
              row.spots = [];

              for(var j = 0; j < count; j++) {
                  var spot = {};
                  spot.isCovered = true;
                  spot.content = "empty";
                  spot.positionX = i;
                  spot.positionY = j;
                  spot.isReviewed = false;
                  spot.isFLag = false;
                  row.spots.push(spot);
              }

              minefield.rows.push(row);
          }


          this.placeManyRandomMines(minefield,count);
          this.calculateAllNumbers(minefield,count);



          return minefield;

    }
    this.calculateNumber = function(minefield, row, column) {
      var thisSpot = this.getPosition(minefield, row, column);

      // if this spot contains a mine then we can't place a number here
      if(thisSpot.content == "mine") {
          return;
      }

      var mineCount = 0;

      // check row above if this is not the first row
      if(row > 0) {
          // check column to the left if this is not the first column
          if(column > 0) {
              // get the spot above and to the left
              var spot = this.getPosition(minefield, row - 1, column - 1);
              if(spot.content == "mine") {
                  mineCount++;
              }
          }

          // get the spot right above
          var spot = this.getPosition(minefield, row - 1, column);
          if(spot.content == "mine") {
              mineCount++;
          }

          // check column to the right if this is not the last column
          if(column < minefield.rows.length -1) {
              // get the spot above and to the right
              var spot = this.getPosition(minefield, row - 1, column + 1);
              if(spot.content == "mine") {
                  mineCount++;
              }
          }
      }

      // check column to the left if this is not the first column
      if(column > 0) {
          // get the spot to the left
          var spot = this.getPosition(minefield, row, column - 1);
          if(spot.content == "mine") {
              mineCount++;
          }
      }

      // check column to the right if this is not the last column
      if(column < minefield.rows.length -1) {
          // get the spot to the right
          var spot = this.getPosition(minefield, row, column + 1);
          if(spot.content == "mine") {
              mineCount++;
          }
      }

      // check row below if this is not the last row
      if(row < minefield.rows.length -1) {
          // check column to the left if this is not the first column
          if(column > 0) {
              // get the spot below and to the left
              var spot = this.getPosition(minefield, row + 1, column - 1);
              if(spot.content == "mine") {
                  mineCount++;
              }
          }

          // get the spot right below
          var spot = this.getPosition(minefield, row + 1, column);
          if(spot.content == "mine") {
              mineCount++;
          }

          // check column to the right if this is not the last column
          if(column < minefield.rows.length -1) {
              // get the spot below and to the right
              var spot = this.getPosition(minefield, row + 1, column + 1);
              if(spot.content == "mine") {
                  mineCount++;
              }
          }
      }

      if(mineCount > 0) {
          thisSpot.content = mineCount;
      }
    }
    this.calculateAllNumbers = function(minefield,count) {
        for(var y = 0; y < count; y++) {
            for(var x = 0; x < count; x++) {
                this.calculateNumber(minefield, y, x);
            }
        }
    }
    this.showAllMines = function(minefield,count,CurrentP){
      for(var y = 0; y < count; y++) {
        for(var x = 0; x < count; x++) {

            var spot = this.getPosition(minefield, y, x);
            if(spot.content == "mine") {
              if (CurrentP.positionX == x && CurrentP.positionY == y) {
                CurrentP.content = 'explote';
              }
              spot.isCovered = false;
            }
        }
      }
    }

    this.expandAll = function(spot,minefield){

      if (spot.content != 'empty')  {
          return;
      }
      var row = spot.positionX;
      var column = spot.positionY;
      var mineCount = 0;
      var thisSpot = spot;
      if (thisSpot.isReviewed ==true) {
        return
      }

      thisSpot.isReviewed = true;

      if(row > 0) {
          // check column to the left if this is not the first column
          if(column > 0) {
              // get the spot above and to the left
              var spot = this.getPosition(minefield, row - 1, column - 1);
              if(spot.content == "empty") {
                spot.isCovered = false;
                this.expandAll(spot,minefield);
              }else if (spot.content != "mine") {
                spot.isCovered = false;
              }
          }

          // get the spot right above
          var spot = this.getPosition(minefield, row - 1, column);
          if(spot.content == "empty") {
            spot.isCovered = false;
            this.expandAll(spot,minefield);
          }else if (spot.content != "mine") {
            spot.isCovered = false;
          }

          // check column to the right if this is not the last column
          if(column < minefield.rows.length -1) {
              // get the spot above and to the right
              var spot = this.getPosition(minefield, row - 1, column + 1);
              if(spot.content == "empty") {
                spot.isCovered = false;
                this.expandAll(spot,minefield);
              }else if (spot.content != "mine") {
                spot.isCovered = false;
              }
          }
      }

      // check column to the left if this is not the first column
      if(column > 0) {
          // get the spot to the left
          var spot = this.getPosition(minefield, row, column - 1);
          if(spot.content == "empty") {
            spot.isCovered = false;
            this.expandAll(spot,minefield);
          }else if (spot.content != "mine") {
            spot.isCovered = false;
          }
      }

      // check column to the right if this is not the last column
      if(column < minefield.rows.length -1) {
          // get the spot to the right
          var spot = this.getPosition(minefield, row, column + 1);
          if(spot.content == "empty") {
            spot.isCovered = false;
            this.expandAll(spot,minefield);
          }else if (spot.content != "mine") {
             spot.isCovered = false;
          }
      }

      // check row below if this is not the last row
      if(row < minefield.rows.length -1) {
          // check column to the left if this is not the first column
          if(column > 0) {
              // get the spot below and to the left
              var spot = this.getPosition(minefield, row + 1, column - 1);
              if(spot.content == "empty") {
                spot.isCovered = false;
                this.expandAll(spot,minefield);
              }else if (spot.content != "mine") {
                spot.isCovered = false;
              }
          }

          // get the spot right below
          var spot = this.getPosition(minefield, row + 1, column);
          if(spot.content == "empty") {
            spot.isCovered = false;
            this.expandAll(spot,minefield);
          }else if (spot.content != "mine") {
            spot.isCovered = false;
          }

          // check column to the right if this is not the last column
          if(column < minefield.rows.length -1) {
              // get the spot below and to the right
              var spot = this.getPosition(minefield, row + 1, column + 1);
              if(spot.content == "empty") {
                spot.isCovered = false;
                this.expandAll(spot,minefield);
              }else if (spot.content != "mine") {
                spot.isCovered = false;
              }
          }
      }

      thisSpot.isCovered = false;

    }
    this.MinesweeperController = function($scope,count) {

        var me = this;
        $scope.uncoverSpot = function(spot,flag) {

          if (spot.content == "mine") {
            $scope.isLose =true;
          }
          if ($scope.isLose == true || $scope.hasWon == true) {
            if ($scope.isLose == true) {
              me.showAllMines($scope.minefield,count,spot);
            }
            return;
          }
            me.haswon($scope.minefield,count);
          if (flag == 'flag') {
            spot.isFLag = true;
          }else{
            me.expandAll(spot,$scope.minefield);
            spot.isCovered = false;
          }


        };
        return minefield = this.createMinefield(count);
    }
    $scope.flagPlace = function(spot){
      if ($scope.isLose == true || $scope.hasWon == true) {
        return;
      }
      if (spot.content == "flag") {
        spot.content = lastSpot;
        spot.isCovered = true;
      }else{
        lastSpot = spot.content;
        spot.content ="flag";
        spot.isCovered=false;
      }

    }
    this.haswon = function(minefield,count){
      var countForWin=0;
      var countTotal = count * count;
      var countToWin = countTotal - count;
      for(var y = 0; y < count; y++) {
        for(var x = 0; x < count; x++) {

            var spot = this.getPosition(minefield, y, x);
            if(!spot.isCovered && spot.content != "mine") {
                countForWin++;
            }
        }
      }
      if (countToWin == countForWin+1) {
          $scope.hasWon = true;
      }
    }
  }]);
  app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {

        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {

            scope.$apply(function() {

                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
