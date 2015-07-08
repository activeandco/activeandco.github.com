module.exports = function (grunt) {
  grunt.initConfig({

  // define source files and their destinations
  uglify: {
    my_target: {
      files: {
        "jsm/main.min.js" : ['js/jquery-1.11.1.js', 'js/jquery-ui-1.10.4.custom.js', 'js/waypoints.js', 'js/main.js']
      }
    }
  },
  stylus: {
    compile: {
      files: {
        'css/main.css': 'css/main.styl', // 1:1 compile
      }
    }
  },
  watch: {
    js:  { files: 'js/*.js', tasks: [ 'uglify' ] },
    css:  { files: 'css/*.styl', tasks: [ 'stylus' ] },
  }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-stylus');

// register at least this one task
grunt.registerTask('default', [ 'watch' ]);


};

