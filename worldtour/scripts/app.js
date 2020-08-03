var APP = APP || {};
APP.counter = 0;
APP.countries = null;
APP.globe = null;
APP.land = null;
APP.borders = null;
APP.keyItems = null;

APP.countryStatus = false;

var width = 960,
      height = 960;

// orthographic() = sphere

//
  var projection = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .scale(width / 2 - 20)
      .clipAngle(90)
      .precision(0.6);

  var canvas = d3.select("#wrapper").append("canvas")
      .attr("width", width)
      .attr("height", height);

  var c = canvas.node().getContext("2d");

var grd = c.createLinearGradient(0,0,0,960);
  grd.addColorStop(0,"#6a82f9");
  // grd.addColorStop(1,"#041774");
  grd.addColorStop(1,"whitesmoke");

  var path = d3.geo.path()
      .projection(projection)
      .context(c);

  var title = d3.select(".map-country-title_main");
  var title2 = d3.select(".map-country-title_secondary");
  var project = d3.select(".map-country-project-description");
  var offeredCourses = d3.select(".map-country-course-boolean");

  function drawMap() {
    queue()
      .defer(d3.json, "https://thehaymaker.github.io/world-tour-d3js-demo/scripts/data/world-110m.json")
      .defer(d3.csv, "https://thehaymaker.github.io/world-tour-d3js-demo/scripts/data/world-country-names-data-data.csv")
      .await(APP.TRANSFORM);
  }

  APP.TRANSFORM = function (error, world, names) {
    if (error) throw error;

        APP.globe = {type: "Sphere"},
        APP.land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        APP.borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,
        n = countries.length;

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) {
          d.name = n.name;
          d.project = n.project;
          d.offered_courses = n.offered_leadership_courses;
          return d;
        }
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    //console.log(countries);
    APP.countries = countries;

    createMapKey( APP.countries );

    createKeyListeners( APP.countries );

    var cLength = APP.countries.length;
    (function transition() {
      if( APP.countries[ (i + 1) % n] ) {
        d3.transition()
            .duration(1750)
            .each("start", function() {
              // console.log( topojson.feature(world, world.objects.countries).features );
              var countryName, countryProject, countryCourseStatus;
               (function(){
                if( countries[ (i + 1) % n] ) {
                  var countryRightNow = countries[i = (i + 1) % n];
                  countryName = countryRightNow.name;
                  // console.log( countryRightNow.project );
                  countryProject = countryRightNow.project;
                  // console.log( countryRightNow.offered_courses );
                  countryCourseStatus = countryRightNow.offered_courses;
                  APP.countryStatus = true;

                  removeActiveClassesFromList();

                  APP.keyItems[ i % n ].classList.add('active');


                  return countryName;

                } else {
                  APP.countryStatus = false;
                }
              })();

              title.text( countryName );
              title2.text( countryName );
              project.text( countryProject );
              if(countryCourseStatus === "TRUE") {
                offeredCourses.text("Offered Mental Action courses.");
              } else {
                offeredCourses.text("No classes have been offered at this location.");
              }



            })
            .tween("rotate", function() {
              if(APP.countryStatus) {
                var p = d3.geo.centroid(countries[i]),
                    r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                return function(t) {
                  projection.rotate(r(t));
                  c.clearRect(0, 0, width, height);
                  c.strokeStyle = grd, c.lineWidth = 1, c.beginPath(), path(APP.globe), c.stroke(), c.fillStyle = grd, c.fill();
                  c.fillStyle = "rgba(9,9,9,0.53)", c.beginPath(), path(APP.land), c.fill();
                  c.fillStyle = "#ebaf06", c.beginPath(), path(countries[i]), c.fill();
                   c.strokeStyle = "rgba(245,245,245,0.53)", c.lineWidth = 1, c.beginPath(), path(APP.borders), c.stroke();
                  // c.strokeStyle = grd, c.lineWidth = 1, c.beginPath(), path(APP.globe), c.stroke();
                }
              };
            })
            .delay(function(){
              // console.log(cLength);
            if( APP.counter >= cLength ) {
              APP.counter = 0;
              return 0;
            } else if(APP.counter === 0) {
              APP.counter++;
              return 0;
            } else if (APP.counter < cLength) {
              APP.counter++;
              // console.log("_____HELL YEAH_____");
              return 3500;
            }
          })
          .transition()

            .each("end", transition);
        } else {
                  APP.countryStatus = false;
                  drawMap();
                }
      })();
  }

  drawMap();





  d3.select(self.frameElement).style("height", height + "px");


  function drawCountry(country) {
  (function transition() {
  d3.transition()
  .duration(1750)
  .each("start", function() {
    // console.log( topojson.feature(world, world.objects.countries).features );
    var countryName, countryProject, countryCourseStatus;

    (function() {

        var countryRightNow = country;
        countryName = countryRightNow.name;
        // console.log( countryRightNow.project );
        countryProject = countryRightNow.project;
        // console.log( countryRightNow.offered_courses );
        countryCourseStatus = countryRightNow.offered_courses;
        APP.countryStatus = true;
        return countryName;

    })();

    title.text(countryName);
    title2.text(countryName);
    project.text(countryProject);
    if (countryCourseStatus === "TRUE") {
      offeredCourses.text("Offered Mental Action courses.");
    } else {
      offeredCourses.text("No classes have been offered at this location.");
    }



  })
  .tween("rotate", function() {

      var p = d3.geo.centroid(country),
        r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
      return function(t) {
        projection.rotate(r(t));
        c.clearRect(0, 0, width, height);
        c.strokeStyle = grd, c.lineWidth = 1, c.beginPath(), path(APP.globe), c.stroke(), c.fillStyle = grd, c.fill();
        c.fillStyle = "rgba(9,9,9,0.53)", c.beginPath(), path(APP.land), c.fill();
        c.fillStyle = "#ebaf06", c.beginPath(), path(country), c.fill();
         c.strokeStyle = "rgba(245,245,245,0.53)", c.lineWidth = 1, c.beginPath(), path(APP.borders), c.stroke();
        // c.strokeStyle = grd, c.lineWidth = 1, c.beginPath(), path(APP.globe), c.stroke();
    };
  })
  .transition()

.each("end", transition);

})();

}


function createMapKey(array) {

  var keyList = document.createElement('ul');
  keyList.classList.add('map-key-list');

  for (var i = 0; i < array.length; i++) {

    var countryItem = document.createElement('li');
    countryItem.classList.add('map-key-list-item');
    countryItem.data

    countryItem.dataset.iterator = i;
    countryItem.dataset.id = array[i].id;
    countryItem.dataset.projectDescription = array[i].project;
    countryItem.dataset.name = array[i].name;
    countryItem.innerHTML = array[i].name;

    keyList.appendChild(countryItem);

  }

  var mapKeyWrapper = document.querySelector('.map-key_wrapper')
  mapKeyWrapper.appendChild( keyList );

}

function createKeyListeners(array) {
  var listItems = document.querySelectorAll('.map-key-list-item');
  APP.keyItems = [];

  // push DOM nodes into Array to take advantage of native Array
  for (var i = 0; i < listItems.length; i++) {
    APP.keyItems.push( listItems[i] );
  }

  APP.keyItems.forEach(function(node){

    node.addEventListener("click", function(e){

      // remove all the .active's
     removeActiveClassesFromList();
      // grab the iterator value and use it
      // to render the appropriate country
      // from the country list global
      var num = this.dataset.iterator;
      this.classList.add('active');
      drawCountry( APP.countries[num] );

    });

  })


};

function removeActiveClassesFromList(){
   var listItems = document.querySelectorAll('.map-key-list-item');

  for (var i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove('active');
  }
}






































