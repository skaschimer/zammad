
// form
test( "form elements check", function() {
//    deepEqual( item, test.value, 'group set/get tests' );
  $('#forms').append('<hr><h1>form elements check</h1><form id="form1"></form>')
  var el = $('#form1')
  var defaults = {
    input2: '123abc',
    password2: 'pw1234<l>',
    textarea2: 'lalu <l> lalu',
    select1: false,
    select2: true,
    selectmulti1: false,
    selectmulti2: [ false, true ],
    selectmultioption1: false,
    selectmultioption2: [ false, true ],
    richtext2: 'lalu <l> lalu',
    datetime1: Date.parse('2015-01-11T12:40:00Z'),
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: defaults['input1'] },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: false, default: defaults['input2'] },
        { name: 'password1', display: 'Password1', tag: 'input', type: 'password', limit: 100, null: true, default: defaults['password1'] },
        { name: 'password2', display: 'Password2', tag: 'input', type: 'password', limit: 100, null: false, default: defaults['password2'] },
        { name: 'textarea1', display: 'Textarea1', tag: 'textarea', rows: 6, limit: 100, null: true, upload: true, default: defaults['textarea1']  },
        { name: 'textarea2', display: 'Textarea2', tag: 'textarea', rows: 6, limit: 100, null: false, upload: true, default: defaults['textarea2']  },
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { true: 'internal', false: 'public' }, default: defaults['select1'] },
        { name: 'select2', display: 'Select2', tag: 'select', null: false, options: { true: 'internal', false: 'public' }, default: defaults['select2'] },
        { name: 'selectmulti1', display: 'SelectMulti1', tag: 'select', null: true, multiple: true, options: { true: 'internal', false: 'public' }, default: defaults['selectmulti1'] },
        { name: 'selectmulti2', display: 'SelectMulti2', tag: 'select', null: false, multiple: true, options: { true: 'internal', false: 'public' }, default: defaults['selectmulti2'] },
        { name: 'selectmultioption1', display: 'SelectMultiOption1', tag: 'select', null: true, multiple: true, options: [{ value: true, name: 'internal' }, { value: false, name: 'public' }], default: defaults['selectmultioption1'] },
        { name: 'selectmultioption2', display: 'SelectMultiOption2', tag: 'select', null: false, multiple: true, options: [{ value: true, name: 'A' }, { value: 1, name: 'B'}, { value: false, name: 'C' }], default: defaults['selectmultioption2'] },
        { name: 'richtext1', display: 'Richtext1', tag: 'richtext', limit: 100, null: true, upload: true, default: defaults['richtext1']  },
        { name: 'richtext2', display: 'Richtext2', tag: 'richtext', limit: 100, null: true, upload: true, default: defaults['richtext2']  },
        { name: 'datetime1', display: 'Datetime1', tag: 'datetime', null: true, default: defaults['datetime1']  },
        { name: 'datetime2', display: 'Datetime2', tag: 'datetime', null: true, default: defaults['datetime2']  },
      ]
    },
    autofocus: true
  });
  equal( el.find('[name="input1"]').val(), '', 'check input1 value')
  equal( el.find('[name="input1"]').prop('required'), false, 'check input1 required')
//  equal( el.find('[name="input1"]').is(":focus"), true, 'check input1 focus')

  equal( el.find('[name="input2"]').val(), '123abc', 'check input2 value')
  equal( el.find('[name="input2"]').prop('required'), true, 'check input2 required')
  equal( el.find('[name="input2"]').is(":focus"), false, 'check input2 focus')

  equal( el.find('[name="password1"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1_confirm"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1"]').prop('required'), false, 'check password1 required')
  equal( el.find('[name="password1"]').is(":focus"), false, 'check password1 focus')

  equal( el.find('[name="password2"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2_confirm"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2"]').prop('required'), true, 'check password2 required')
  equal( el.find('[name="password2"]').is(":focus"), false, 'check password2 focus')

  equal( el.find('[name="textarea1"]').val(), '', 'check textarea1 value')
  equal( el.find('[name="textarea1"]').prop('required'), false, 'check textarea1 required')
  equal( el.find('[name="textarea1"]').is(":focus"), false, 'check textarea1 focus')

  equal( el.find('[name="textarea2"]').val(), 'lalu <l> lalu', 'check textarea2 value')
  equal( el.find('[name="textarea2"]').prop('required'), true, 'check textarea2 required')
  equal( el.find('[name="textarea2"]').is(":focus"), false, 'check textarea2 focus')

  equal( el.find('[name="select1"]').val(), 'false', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')
  equal( el.find('[name="select1"]').is(":focus"), false, 'check select1 focus')

  equal( el.find('[name="select2"]').val(), 'true', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), true, 'check select2 required')
  equal( el.find('[name="select2"]').is(":focus"), false, 'check select2 focus')

  equal( el.find('[name="selectmulti1"]').val(), 'false', 'check selectmulti1 value')
  equal( el.find('[name="selectmulti1"]').prop('required'), false, 'check selectmulti1 required')
  equal( el.find('[name="selectmulti1"]').is(":focus"), false, 'check selectmulti1 focus')

  equal( el.find('[name="selectmulti2"]').val()[0], 'true', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').val()[1], 'false', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').prop('required'), true, 'check selectmulti2 required')
  equal( el.find('[name="selectmulti2"]').is(":focus"), false, 'check selectmulti2 focus')

  //equal( el.find('[name="richtext1"]').val(), '', 'check textarea1 value')
  //equal( el.find('[name="richtext1"]').prop('required'), false, 'check textarea1 required')
  equal( el.find('[name="richtext1"]').is(":focus"), false, 'check textarea1 focus')

  //equal( el.find('[name="richtext2"]').val(), 'lalu <l> lalu', 'check textarea2 value')
  //equal( el.find('[name="richtext2"]').prop('required'), true, 'check textarea2 required')
  equal( el.find('[name="richtext2"]').is(":focus"), false, 'check textarea2 focus')

});

test( "form params check", function() {
//    deepEqual( item, test.value, 'group set/get tests' );

  $('#forms').append('<hr><h1>form params check</h1><form id="form2"></form>')
  var el = $('#form2')
  var defaults = {
    input2: '123abc',
    password2: 'pw1234<l>',
    textarea2: 'lalu <l> lalu',
    select1: false,
    select2: true,
    selectmulti1: false,
    selectmulti2: [ false, true ],
    selectmultioption1: false,
    selectmultioption2: [ false, true ],
    autocompletion2: 'id2',
    autocompletion2_autocompletion_value_shown: 'value2',
    richtext2: '<div>lalu <b>b</b> lalu</div>',
    richtext3: '<div></div>',
    richtext4: '<div>lalu <i>b</i> lalu</div>',
    richtext5: '<div></div>',
    richtext6: '<div>lalu <b>b</b> lalu</div>',
    richtext7: "<div>&nbsp;<div>&nbsp;\n</div>  \n</div>",
    richtext8: '<div>lalu <i>b</i> lalu</div>',
    datetime1: new Date( Date.parse('2015-01-11T12:40:00Z') ),
    active1: true,
    active2: false,
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: false },
        { name: 'password1', display: 'Password1', tag: 'input', type: 'password', limit: 100, null: true },
        { name: 'password2', display: 'Password2', tag: 'input', type: 'password', limit: 100, null: false },
        { name: 'textarea1', display: 'Textarea1', tag: 'textarea', rows: 6, limit: 100, null: true, upload: true },
        { name: 'textarea2', display: 'Textarea2', tag: 'textarea', rows: 6, limit: 100, null: false, upload: true },
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { true: 'internal', false: 'public' } },
        { name: 'select2', display: 'Select2', tag: 'select', null: false, options: { true: 'internal', false: 'public' } },
        { name: 'selectmulti1', display: 'SelectMulti1', tag: 'select', null: true, multiple: true, options: { true: 'internal', false: 'public' } },
        { name: 'selectmulti2', display: 'SelectMulti2', tag: 'select', null: false, multiple: true, options: { true: 'internal', false: 'public' } },
        { name: 'selectmultioption1', display: 'SelectMultiOption1', tag: 'select', null: true, multiple: true, options: [{ value: true, name: 'internal' }, { value: false, name: 'public' }] },
        { name: 'selectmultioption2', display: 'SelectMultiOption2', tag: 'select', null: false, multiple: true, options: [{ value: true, name: 'A' }, { value: 1, name: 'B'}, { value: false, name: 'C' }] },
        { name: 'autocompletion1', display: 'AutoCompletion1', tag: 'autocompletion', null: false, options: { true: 'internal', false: 'public' }, source: [ { label: "Choice1", value: "value1", id: "id1" }, { label: "Choice2", value: "value2", id: "id2" }, ], minLength: 1 },
        { name: 'autocompletion2', display: 'AutoCompletion2', tag: 'autocompletion', null: false, options: { true: 'internal', false: 'public' }, source: [ { label: "Choice1", value: "value1", id: "id1" }, { label: "Choice2", value: "value2", id: "id2" }, ], minLength: 1 },
        { name: 'richtext1', display: 'Richtext1', tag: 'richtext', maxlength: 100, null: true, type: 'richtext', multiline: true, upload: true, default: defaults['richtext1']  },
        { name: 'richtext2', display: 'Richtext2', tag: 'richtext', maxlength: 100, null: true, type: 'richtext', multiline: true, upload: true, default: defaults['richtext2']  },
        { name: 'richtext3', display: 'Richtext3', tag: 'richtext', maxlength: 100, null: true, type: 'richtext', multiline: false, default: defaults['richtext3']  },
        { name: 'richtext4', display: 'Richtext4', tag: 'richtext', maxlength: 100, null: true, type: 'richtext', multiline: false, default: defaults['richtext4']  },
        { name: 'richtext5', display: 'Richtext5', tag: 'richtext', maxlength: 100, null: true, type: 'textonly', multiline: true, upload: true, default: defaults['richtext5']  },
        { name: 'richtext6', display: 'Richtext6', tag: 'richtext', maxlength: 100, null: true, type: 'textonly', multiline: true, upload: true, default: defaults['richtext6']  },
        { name: 'richtext7', display: 'Richtext7', tag: 'richtext', maxlength: 100, null: true, type: 'textonly', multiline: false, default: defaults['richtext7']  },
        { name: 'richtext8', display: 'Richtext8', tag: 'richtext', maxlength: 100, null: true, type: 'textonly', multiline: false, default: defaults['richtext8']  },
        { name: 'datetime1', display: 'Datetime1', tag: 'datetime', null: true, default: defaults['datetime1']  },
        { name: 'datetime2', display: 'Datetime2', tag: 'datetime', null: true, default: defaults['datetime2']  },
        { name: 'active1', display: 'Active1',  tag: 'boolean', type: 'boolean', default: defaults['active1'], null: false },
        { name: 'active2', display: 'Active2',  tag: 'boolean', type: 'boolean', default: defaults['active2'], null: false },
      ],
    },
    params: defaults,
    autofocus: true
  });
  equal( el.find('[name="input1"]').val(), '', 'check input1 value')
  equal( el.find('[name="input1"]').prop('required'), false, 'check input1 required')
//  equal( el.find('[name="input1"]').is(":focus"), true, 'check input1 focus')

  equal( el.find('[name="input2"]').val(), '123abc', 'check input2 value')
  equal( el.find('[name="input2"]').prop('required'), true, 'check input2 required')
  equal( el.find('[name="input2"]').is(":focus"), false, 'check input2 focus')

  equal( el.find('[name="password1"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1_confirm"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1"]').prop('required'), false, 'check password1 required')
  equal( el.find('[name="password1"]').is(":focus"), false, 'check password1 focus')

  equal( el.find('[name="password2"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2_confirm"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2"]').prop('required'), true, 'check password2 required')
  equal( el.find('[name="password2"]').is(":focus"), false, 'check password2 focus')

  equal( el.find('[name="textarea1"]').val(), '', 'check textarea1 value')
  equal( el.find('[name="textarea1"]').prop('required'), false, 'check textarea1 required')
  equal( el.find('[name="textarea1"]').is(":focus"), false, 'check textarea1 focus')

  equal( el.find('[name="textarea2"]').val(), 'lalu <l> lalu', 'check textarea2 value')
  equal( el.find('[name="textarea2"]').prop('required'), true, 'check textarea2 required')
  equal( el.find('[name="textarea2"]').is(":focus"), false, 'check textarea2 focus')

  equal( el.find('[name="select1"]').val(), 'false', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')
  equal( el.find('[name="select1"]').is(":focus"), false, 'check select1 focus')

  equal( el.find('[name="select2"]').val(), 'true', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), true, 'check select2 required')
  equal( el.find('[name="select2"]').is(":focus"), false, 'check select2 focus')

  equal( el.find('[name="selectmulti1"]').val(), 'false', 'check selectmulti1 value')
  equal( el.find('[name="selectmulti1"]').prop('required'), false, 'check selectmulti1 required')
  equal( el.find('[name="selectmulti1"]').is(":focus"), false, 'check selectmulti1 focus')

  equal( el.find('[name="selectmulti2"]').val()[0], 'true', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').val()[1], 'false', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').prop('required'), true, 'check selectmulti2 required')
  equal( el.find('[name="selectmulti2"]').is(":focus"), false, 'check selectmulti2 focus')

  params = App.ControllerForm.params( el )
  test_params = {
    input1: '',
    input2: '123abc',
    password1: '',
    password1_confirm: '',
    password2: 'pw1234<l>',
    password2_confirm: 'pw1234<l>',
    textarea1: '',
    textarea2: 'lalu <l> lalu',
    select1: 'false',
    select2: 'true',
    selectmulti1: 'false',
    selectmulti2: [ 'true', 'false' ],
    selectmultioption1: 'false',
    selectmultioption2: [ 'true', 'false' ],
    autocompletion1: '',
    autocompletion1_autocompletion: '',
    autocompletion1_autocompletion_value_shown: '',
    autocompletion2: 'id2',
    autocompletion2_autocompletion: 'value2',
    autocompletion2_autocompletion_value_shown: 'value2',
    richtext1: '',
    richtext2: '<div>lalu <b>b</b> lalu</div>',
    richtext3: '',
    richtext4: '<div>lalu <i>b</i> lalu</div>',
    richtext5: '',
    richtext6: '<div>lalu <b>b</b> lalu</div>',
    richtext7: '',
    richtext8: '<div>lalu <i>b</i> lalu</div>',
    datetime1: '2015-01-11T12:40:00.000Z',
    active1: true,
    active2: false,
  }
  deepEqual( params, test_params, 'form param check' );

});

test( "form defaults + params check", function() {
//    deepEqual( item, test.value, 'group set/get tests' );

// mix default and params -> check it -> add note
// test auto completion
// show/hide fields base on field values -> bind changed event
// form validation
// form params check

// add signature only if form_state is empty
  $('#forms').append('<hr><h1>form defaults + params check</h1><form id="form3"></form>')
  var el = $('#form3')
  var defaults = {
    input1: '',
    password2: 'pw1234<l>',
    textarea2: 'lalu <l> lalu',
    select2: false,
    selectmulti2: [ false, true ],
    selectmultioption1: false,
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: 'some not used default' },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default' },
        { name: 'password1', display: 'Password1', tag: 'input', type: 'password', limit: 100, null: false, default: 'some used pass' },
        { name: 'password2', display: 'Password2', tag: 'input', type: 'password', limit: 100, null: false, default: 'some not used pass' },
        { name: 'textarea1', display: 'Textarea1', tag: 'textarea', rows: 6, limit: 100, null: false, upload: true, default: 'some used text' },
        { name: 'textarea2', display: 'Textarea2', tag: 'textarea', rows: 6, limit: 100, null: false, upload: true, default: 'some not used text' },
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { true: 'internal', false: 'public' }, default: false},
        { name: 'select2', display: 'Select2', tag: 'select', null: true, options: { true: 'internal', false: 'public' }, default: true },
        { name: 'selectmulti2', display: 'SelectMulti2', tag: 'select', null: false, multiple: true, options: { true: 'internal', false: 'public' }, default: [] },
        { name: 'selectmultioption1', display: 'SelectMultiOption1', tag: 'select', null: true, multiple: true, options: [{ value: true, name: 'internal' }, { value: false, name: 'public' }], default: true },
      ],
    },
    params: defaults,
    autofocus: true
  });
  equal( el.find('[name="input1"]').val(), '', 'check input1 value')
  equal( el.find('[name="input1"]').prop('required'), false, 'check input1 required')
//  equal( el.find('[name="input1"]').is(":focus"), true, 'check input1 focus')
  equal( el.find('[name="input2"]').val(), 'some used default', 'check input2 value')
  equal( el.find('[name="input2"]').prop('required'), false, 'check input2 required')

  equal( el.find('[name="password1"]').val(), 'some used pass', 'check password1 value')
  equal( el.find('[name="password1_confirm"]').val(), 'some used pass', 'check password1 value')
  equal( el.find('[name="password1"]').prop('required'), true, 'check password1 required')
  equal( el.find('[name="password1"]').is(":focus"), false, 'check password1 focus')

  equal( el.find('[name="password2"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2_confirm"]').val(), 'pw1234<l>', 'check password2 value')
  equal( el.find('[name="password2"]').prop('required'), true, 'check password2 required')
  equal( el.find('[name="password2"]').is(":focus"), false, 'check password2 focus')

  equal( el.find('[name="textarea1"]').val(), 'some used text', 'check textarea1 value')
  equal( el.find('[name="textarea1"]').prop('required'), true, 'check textarea1 required')
  equal( el.find('[name="textarea1"]').is(":focus"), false, 'check textarea1 focus')

  equal( el.find('[name="textarea2"]').val(), 'lalu <l> lalu', 'check textarea2 value')
  equal( el.find('[name="textarea2"]').prop('required'), true, 'check textarea2 required')
  equal( el.find('[name="textarea2"]').is(":focus"), false, 'check textarea2 focus')

  equal( el.find('[name="select1"]').val(), 'false', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')
  equal( el.find('[name="select1"]').is(":focus"), false, 'check select1 focus')

  equal( el.find('[name="select2"]').val(), 'false', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), false, 'check select2 required')
  equal( el.find('[name="select2"]').is(":focus"), false, 'check select2 focus')

  equal( el.find('[name="selectmulti2"]').val()[0], 'true', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').val()[1], 'false', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').prop('required'), true, 'check selectmulti2 required')
  equal( el.find('[name="selectmulti2"]').is(":focus"), false, 'check selectmulti2 focus')

});

test( "form dependend fields check", function() {
//    deepEqual( item, test.value, 'group set/get tests' );

// mix default and params -> check it -> add note
// test auto completion
// show/hide fields base on field values -> bind changed event
// form validation
// form params check

// add signature only if form_state is empty
  $('#forms').append('<hr><h1>form dependend fields check</h1><form id="form4"></form>')
  var el = $('#form4')
  var defaults = {
    input1: '',
    select2: false,
    selectmulti2: [ false, true ],
    selectmultioption1: false,
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: 'some not used default' },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default' },
        { name: 'input3', display: 'Input3', tag: 'input', type: 'text', limit: 100, null: true, hide: true, default: 'some used default' },
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { true: 'internal', false: 'public' }, default: false},
        { name: 'select2', display: 'Select2', tag: 'select', null: true, options: { true: 'internal', false: 'public' }, default: true },
        { name: 'selectmulti2', display: 'SelectMulti2', tag: 'select', null: false, multiple: true, options: { true: 'internal', false: 'public' }, default: [] },
        { name: 'selectmultioption1', display: 'SelectMultiOption1', tag: 'select', null: true, multiple: true, options: [{ value: true, name: 'internal' }, { value: false, name: 'public' }], default: true },
      ],
    },
    params: defaults,
    dependency: [
      {
        bind: {
          name: 'select1',
          value: ["true"]
        },
        change: {
          name: 'input2',
          action: 'hide'
        },
      },
      {
        bind: {
          name: 'select1',
          value: ["false"]
        },
        change: {
          name: 'input2',
          action: 'show'
        },
      },
      {
        bind: {
          name: 'select1',
          value: ["true"]
        },
        change: {
          name: 'input3',
          action: 'show'
        },
      },
      {
        bind: {
          name: 'select1',
          value: ["false"]
        },
        change: {
          name: 'input3',
          action: 'hide'
        },
      }
    ],
    autofocus: true
  });
  equal( el.find('[name="input1"]').val(), '', 'check input1 value')
  equal( el.find('[name="input1"]').prop('required'), false, 'check input1 required')
//  equal( el.find('[name="input1"]').is(":focus"), true, 'check input1 focus')
  equal( el.find('[name="input2"]').val(), 'some used default', 'check input2 value')
  equal( el.find('[name="input2"]').prop('required'), false, 'check input2 required')

  equal( el.find('[name="input3"]').val(), 'some used default', 'check input3 value')
  equal( el.find('[name="input3"]').prop('required'), false, 'check input3 required')

  equal( el.find('[name="select1"]').val(), 'false', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')
  equal( el.find('[name="select1"]').is(":focus"), false, 'check select1 focus')

  equal( el.find('[name="select2"]').val(), 'false', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), false, 'check select2 required')
  equal( el.find('[name="select2"]').is(":focus"), false, 'check select2 focus')

  equal( el.find('[name="selectmulti2"]').val()[0], 'true', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').val()[1], 'false', 'check selectmulti2 value')
  equal( el.find('[name="selectmulti2"]').prop('required'), true, 'check selectmulti2 required')
  equal( el.find('[name="selectmulti2"]').is(":focus"), false, 'check selectmulti2 focus')

  var params = App.ControllerForm.params( el )
  var test_params = {
    input1: "",
    input2: "some used default",
    input3: undefined,
    select1: "false",
    select2: "false",
    selectmulti2: [ "true", "false" ],
    selectmultioption1: "false"
  }
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="select1"]').val('true')
  el.find('[name="select1"]').trigger('change')
  params = App.ControllerForm.params( el )
  test_params = {
    input1: "",
    input2: undefined,
    input3: "some used default",
    select1: "true",
    select2: "false",
    selectmulti2: [ "true", "false" ],
    selectmultioption1: "false"
  }
  deepEqual( params, test_params, 'form param check' );
});

test( "form handler check with and without fieldset", function() {
//    deepEqual( item, test.value, 'group set/get tests' );

// mix default and params -> check it -> add note
// test auto completion
// show/hide fields base on field values -> bind changed event
// form validation
// form params check

// add signature only if form_state is empty
  $('#forms').append('<hr><h1>form handler check with and without fieldset</h1><form id="form5"></form>')
  var el = $('#form5')
  var defaults = {
    select1: 'a',
    select2: '',
  }

  var formChanges = function(params, attribute, attributes, classname, form, ui) {
    console.log('FROM', form)
    if (params['select1'] === 'b') {
      console.log('lala', params)
      var item = {
        name:    'select2',
        display: 'Select2',
        tag:     'select',
        null:    true,
        options: { 1:'1', 2:'2', 3:'3' },
        default: 3,
      };
      var newElement = ui.formGenItem( item, classname, form )
      form.find('[name="select2"]').closest('.form-group').replaceWith( newElement )
    }
    if (params['select1'] === 'a') {
      console.log('lala', params)
      var item = {
        name:    'select2',
        display: 'Select2',
        tag:     'select',
        null:    true,
        options: { 1:'1', 2:'2', 3:'3' },
        default: 1,
      };
      var newElement = ui.formGenItem( item, classname, form )
      form.find('[name="select2"]').closest('.form-group').replaceWith( newElement )
    }
  }

  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { a: 'a', b: 'b' }, default: 'b'},
        { name: 'select2', display: 'Select2', tag: 'select', null: true, options: { 1:'1', 2:'2', 3:'3' }, default: 2 },
      ],
    },
    params: defaults,
    handlers: [
      formChanges,
    ],
    //noFieldset: true,
  });
  equal( el.find('[name="select1"]').val(), 'a', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')

  equal( el.find('[name="select2"]').val(), '1', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), false, 'check select2 required')

  var params = App.ControllerForm.params( el )
  var test_params = {
    select1: 'a',
    select2: '1',
  }
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="select1"]').val('b')
  el.find('[name="select1"]').trigger('change')
  params = App.ControllerForm.params( el )
  test_params = {
    select1: 'b',
    select2: '3',
  }
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="select1"]').val('a')
  el.find('[name="select1"]').trigger('change')
  params = App.ControllerForm.params( el )
  test_params = {
    select1: 'a',
    select2: '1',
  }
  deepEqual( params, test_params, 'form param check' );

  // test with noFieldset
  el.empty()
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'select1', display: 'Select1', tag: 'select', null: true, options: { a: 'a', b: 'b' }, default: 'b'},
        { name: 'select2', display: 'Select2', tag: 'select', null: true, options: { 1:'1', 2:'2', 3:'3' }, default: 2 },
      ],
    },
    params: defaults,
    handlers: [
      formChanges,
    ],
    noFieldset: true,
  });
  equal( el.find('[name="select1"]').val(), 'a', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), false, 'check select1 required')

  equal( el.find('[name="select2"]').val(), '1', 'check select2 value')
  equal( el.find('[name="select2"]').prop('required'), false, 'check select2 required')

  var params = App.ControllerForm.params( el )
  var test_params = {
    select1: 'a',
    select2: '1',
  }
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="select1"]').val('b')
  el.find('[name="select1"]').trigger('change')
  params = App.ControllerForm.params( el )
  test_params = {
    select1: 'b',
    select2: '3',
  }
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="select1"]').val('a')
  el.find('[name="select1"]').trigger('change')
  params = App.ControllerForm.params( el )
  test_params = {
    select1: 'a',
    select2: '1',
  }
  deepEqual( params, test_params, 'form param check' );

});

test( "form postmaster filter", function() {

// check match area

// check set area

// add match rule

// add set rule
  App.TicketPriority.refresh( [
    {
      id:   1,
      name: 'prio 1',
    },
    {
      id:   2,
      name: 'prio 2',
    },
  ] )
  App.Group.refresh( [
    {
      id:   1,
      name: 'group 1',
    },
    {
      id:   2,
      name: 'group 2',
    },
  ] )

  $('#forms').append('<hr><h1>form postmaster filter</h1><form id="form6"></form>')
  var el = $('#form6')
  var defaults = {
    input2: 'some name',
    match: {
      from: 'some@address',
      subject: 'some subject',
    },
    set: {
      'x-zammad-ticket-owner': 'owner',
      'x-zammad-ticket-customer': 'customer',
      'x-zammad-ticket-priority_id': 2,
      'x-zammad-ticket-group_id': 1,
    },
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: 'some not used default' },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default' },
        { name: 'match',  display: 'Match',  tag: 'postmaster_match', null: false, default: false},
        { name: 'set',    display: 'Set',    tag: 'postmaster_set', null: false, default: false},
      ],
    },
    params: defaults,
  });
  params = App.ControllerForm.params( el )
  test_params = {
    input1: "some not used default",
    input2: "some name",
    match: {
      from: 'some@address',
      subject: 'some subject',
    },
    set: {
      'x-zammad-ticket-owner': 'owner',
      'x-zammad-ticket-customer': 'customer',
      'x-zammad-ticket-priority_id': '2',
      'x-zammad-ticket-group_id': '1',
    },
  };
  deepEqual( params, test_params, 'form param check' );
  el.find('[name="set::x-zammad-ticket-priority_id"]').closest('.form-group').find('.remove').click()
  el.find('[name="set::x-zammad-ticket-customer"]').closest('.form-group').find('.remove').click()
  App.Delay.set( function() {
      test( "form param check after remove click", function() {
        params = App.ControllerForm.params( el )
        test_params = {
          input1: "some not used default",
          input2: "some name",
          match: {
            from: 'some@address',
            subject: 'some subject',
          },
          set: {
            'x-zammad-ticket-owner': 'owner',
            'x-zammad-ticket-group_id': '1',
          },
        };
        deepEqual( params, test_params, 'form param check' );
      });
    },
    1000
  );

});

test( "form selector", function() {
  $('#forms').append('<hr><h1>form selector</h1><div><form id="form7"></form></div>')
  var el = $('#form7')
  var defaults = {
    input2: 'some name66',
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: 'some not used default33' },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default' },
      ],
    },
    params: defaults,
  });
  test_params = {
    input1: "some not used default33",
    input2: "some name66",
  };
  params = App.ControllerForm.params( el )
  deepEqual( params, test_params, 'form param check via $("#form")' );

  params = App.ControllerForm.params( el.find('input') )
  deepEqual( params, test_params, 'form param check via $("#form").find("input")' );

  params = App.ControllerForm.params( el.parent() )
  deepEqual( params, test_params, 'form param check via $("#form").parent()' );

});

test( "form required_if + shown_if", function() {
  $('#forms').append('<hr><h1>form required_if + shown_if</h1><div><form id="form8"></form></div>')
  var el = $('#form8')
  var defaults = {
    input2: 'some name66',
    input3: 'some name77',
    input4: 'some name88',
  }
  new App.ControllerForm({
    el:        el,
    model:     {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: true, default: 'some not used default33' },
        { name: 'input2', display: 'Input2', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default', required_if: { active: true }, shown_if: { active: true } },
        { name: 'input3', display: 'Input3', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default', required_if: { active: [true,false] }, shown_if: { active: [true,false] } },
        { name: 'input4', display: 'Input4', tag: 'input', type: 'text', limit: 100, null: true, default: 'some used default', required_if: { active: [55,66] }, shown_if: { active: [55,66] } },
        { name: 'active', display: 'Active',  tag: 'boolean', type: 'boolean', 'default': true, null: false },
      ],
    },
    params: defaults,
  });
  test_params = {
    input1: "some not used default33",
    input2: "some name66",
    input3: "some name77",
    input4: undefined,
    active: true,
  };
  params = App.ControllerForm.params( el )
  deepEqual( params, test_params, 'form param check via $("#form")' );
  equal( el.find('[name="input2"]').attr('required'), 'required', 'check required attribute of input2 ')
  equal( el.find('[name="input2"]').is(":visible"), true, 'check visible attribute of input2 ')
  equal( el.find('[name="input3"]').attr('required'), 'required', 'check required attribute of input3 ')
  equal( el.find('[name="input3"]').is(":visible"), true, 'check visible attribute of input3 ')
  equal( el.find('[name="input4"]').is(":visible"), false, 'check visible attribute of input4 ')


  el.find('[name="{boolean}active"]').val('false').trigger('change')
  test_params = {
    input1: "some not used default33",
    input2: undefined,
    input3: undefined,
    input4: undefined,
    active: false,
  };
  params = App.ControllerForm.params( el )
  deepEqual( params, test_params, 'form param check via $("#form")' );
  equal( el.find('[name="input2"]').attr('required'), undefined, 'check required attribute of input2 ')
  equal( el.find('[name="input2"]').is(":visible"), false, 'check visible attribute of input2 ')
  equal( el.find('[name="input3"]').is(":visible"), false, 'check visible attribute of input3 ')
  equal( el.find('[name="input4"]').is(":visible"), false, 'check visible attribute of input4 ')


  el.find('[name="{boolean}active"]').val('true').trigger('change')
  test_params = {
    input1: "some not used default33",
    input2: "some name66",
    input3: "some name77",
    input4: undefined,
    active: true,
  };
  params = App.ControllerForm.params( el )
  deepEqual( params, test_params, 'form param check via $("#form")' );
  equal( el.find('[name="input2"]').attr('required'), 'required', 'check required attribute of input2 ')
  equal( el.find('[name="input2"]').is(":visible"), true, 'check visible attribute of input2 ')
  equal( el.find('[name="input3"]').attr('required'), 'required', 'check required attribute of input3 ')
  equal( el.find('[name="input3"]').is(":visible"), true, 'check visible attribute of input3 ')
  equal( el.find('[name="input4"]').is(":visible"), false, 'check visible attribute of input4 ')

});