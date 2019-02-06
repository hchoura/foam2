/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'com.foamdev.demos.switch',
  name: 'Controller',
  extends: 'foam.u2.Controller',// it will automatically exports: ['this as data']
  //extends: 'foam.u2.Element',
  //you can avoid extending any model to get the default model presentation

  //exports: [ 'as data' ],

  properties: [
    {
      name: 'names',
      value: 'option 1', //default
      view: {
        class: 'foam.u2.view.ChoiceView',
        choices: [
          'option 1',
          'option 2',
          'option 3'
        ]

        //other manner to present the data.
        /*choices: [
          ['selOpt1','option 1' ] ,
          ['selOpt2','option 2' ],
          ['selOpt3','option 3' ]
        ]*/
      },
    },
    {
      name: 'setNameHere',
      //visibility: 'hidden',
      view: function(_, X) {
        return X.data.slot(function(names) {
          console.log(X.data.names);
          return X.data.names;
        })
      }
    },
  ],

  methods: [
    function initE() {
      this.start('div').add('switch :').end().
        start('div').add(this.NAMES).end().
        start('div').add(this.SET_NAME_HERE).end();
    }
  ],
});
