test( "form validation check", function() {

  $('#forms').append('<hr><h1>form params check</h1><form id="form1"></form>')

  var el       = $('#form1')
  var defaults = {}
  var form     = new App.ControllerForm({
    el:    el,
    model: {
      configure_attributes: [
        { name: 'input1', display: 'Input1', tag: 'input', type: 'text', limit: 100, null: false },
        { name: 'password1', display: 'Password1', tag: 'input', type: 'password', limit: 100, null: false },
        { name: 'textarea1', display: 'Textarea1', tag: 'textarea', rows: 6, limit: 100, null: false, upload: true },
        { name: 'select1', display: 'Select1', tag: 'select', null: false, nulloption: true, options: { true: 'internal', false: 'public' } },
        { name: 'selectmulti1', display: 'SelectMulti1', tag: 'select', null: false, nulloption: true, multiple: true, options: { true: 'internal', false: 'public' } },
        { name: 'autocompletion1', display: 'AutoCompletion1', tag: 'autocompletion', null: false, options: { true: 'internal', false: 'public' }, source: [ { label: "Choice1", value: "value1", id: "id1" }, { label: "Choice2", value: "value2", id: "id2" }, ], minLength: 1 },
        { name: 'richtext1', display: 'Richtext1', tag: 'richtext', maxlength: 100, null: false, type: 'richtext', multiline: true, upload: true, default: defaults['richtext1']  },
        { name: 'datetime1', display: 'Datetime1', tag: 'datetime', null: false, default: defaults['datetime1']  },
        { name: 'active1', display: 'Active1',  tag: 'boolean', type: 'boolean', default: defaults['active1'], null: false },
      ],
    },
    params: defaults,
  });
  equal( el.find('[name="input1"]').val(), '', 'check input1 value')
  equal( el.find('[name="input1"]').prop('required'), true, 'check input1 required')
//  equal( el.find('[name="input1"]').is(":focus"), true, 'check input1 focus')

  equal( el.find('[name="password1"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1_confirm"]').val(), '', 'check password1 value')
  equal( el.find('[name="password1"]').prop('required'), true, 'check password1 required')

  equal( el.find('[name="textarea1"]').val(), '', 'check textarea1 value')
  equal( el.find('[name="textarea1"]').prop('required'), true, 'check textarea1 required')

  equal( el.find('[name="select1"]').val(), '', 'check select1 value')
  equal( el.find('[name="select1"]').prop('required'), true, 'check select1 required')

  equal( el.find('[name="selectmulti1"]').val(), null, 'check selectmulti1 value')
  equal( el.find('[name="selectmulti1"]').prop('required'), true, 'check selectmulti1 required')

  equal( el.find('[name="autocompletion1"]').val(), '', 'check autocompletion1 value')
  equal( el.find('[name="autocompletion1"]').prop('required'), true, 'check autocompletion1 required')

  equal( el.find('[data-name="richtext1"]').val(), '', 'check richtext1 value')
  //equal( el.find('[data-name="richtext1"]').prop('required'), true, 'check richtext1 required')



  params = App.ControllerForm.params( el )
  errors = form.validate(params)

  test_errors = {
    input1:          "is required",
    password1:       "is required",
    textarea1:       "is required",
    select1:         "is required",
    selectmulti1:    "is required",
    autocompletion1: "is required",
    richtext1:       "is required",
    datetime1:       "is required",
  }
  deepEqual( errors, test_errors, 'validation errors check' )

  App.ControllerForm.validate( { errors: errors, form: el } )

  equal( el.find('[name="input1"]').closest('.form-group').hasClass('has-error'), true, 'check input1 has-error')
  equal( el.find('[name="input1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check input1 error message')

  equal( el.find('[name="password1"]').closest('.form-group').hasClass('has-error'), true, 'check password1 has-error')
  equal( el.find('[name="password1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check password1 error message')

  equal( el.find('[name="textarea1"]').closest('.form-group').hasClass('has-error'), true, 'check textarea1 has-error')
  equal( el.find('[name="textarea1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check textarea1 error message')

  equal( el.find('[name="select1"]').closest('.form-group').hasClass('has-error'), true, 'check select1 has-error')
  equal( el.find('[name="select1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check select1 error message')

  equal( el.find('[name="selectmulti1"]').closest('.form-group').hasClass('has-error'), true, 'check selectmulti1 has-error')
  equal( el.find('[name="selectmulti1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check selectmulti1 error message')

  equal( el.find('[name="autocompletion1"]').closest('.form-group').hasClass('has-error'), true, 'check autocompletion1 has-error')
  equal( el.find('[name="autocompletion1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check autocompletion1 error message')

  equal( el.find('[data-name="richtext1"]').closest('.form-group').hasClass('has-error'), true, 'check richtext1 has-error')
  equal( el.find('[data-name="richtext1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check richtext1 error message')

  equal( el.find('[data-name="datetime1"]').closest('.form-group').hasClass('has-error'), true, 'check datetime1 has-error')
  equal( el.find('[data-name="datetime1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check datetime1 error message')

});

test( "datetime validation check", function() {

  $('#forms').append('<hr><h1>datetime validation check</h1><form id="form2"></form>')

  var el       = $('#form2')
  var defaults = {}
  var form     = new App.ControllerForm({
    el:    el,
    model: {
      configure_attributes: [
        { name: 'datetime1', display: 'Datetime1', tag: 'datetime', null: false, default: defaults['datetime1']  },
      ],
    },
    params: defaults,
  });

  params = App.ControllerForm.params( el )
  errors = form.validate(params)
  test_errors = {
    datetime1: "is required",
  }
  deepEqual( errors, test_errors, 'validation errors check' )
  App.ControllerForm.validate( { errors: errors, form: el } )

  equal( el.find('[data-name="datetime1"]').closest('.form-group').hasClass('has-error'), true, 'check datetime1 has-error')
  equal( el.find('[data-name="datetime1"]').closest('.form-group').find('.help-inline').text(), 'is required', 'check datetime1 error message')

  el.find('[name="{datetime}datetime1___day"]').val('1')
  el.find('[name="{datetime}datetime1___month"]').val('1')
  el.find('[name="{datetime}datetime1___year"]').val('2015')
  el.find('[name="{datetime}datetime1___hour"]').val('12')
  el.find('[name="{datetime}datetime1___minute"]').val('42')
  params = App.ControllerForm.params( el )
  errors = form.validate(params)
  test_errors = undefined
//    datetime1: "invalid",
//  }
  deepEqual( errors, test_errors, 'validation errors check' )
  App.ControllerForm.validate( { errors: errors, form: el } )
  equal( el.find('[data-name="datetime1"]').closest('.form-group').hasClass('has-error'), false, 'check datetime1 has-error')
  equal( el.find('[data-name="datetime1"]').closest('.form-group').find('.help-inline').text(), '', 'check datetime1 error message')

  el.find('[name="{datetime}datetime1___day"]').val('47')
  el.find('[name="{datetime}datetime1___month"]').val('1')
  el.find('[name="{datetime}datetime1___year"]').val('2015')
  el.find('[name="{datetime}datetime1___hour"]').val('12')
  el.find('[name="{datetime}datetime1___minute"]').val('42')
  params = App.ControllerForm.params( el )
  errors = form.validate(params)
  test_errors = {
    datetime1: "is required",
  }
  deepEqual( errors, test_errors, 'validation errors check' )
  App.ControllerForm.validate( { errors: errors, form: el } )
  equal( el.find('[data-name="datetime1"]').closest('.form-group').hasClass('has-error'), true, 'check datetime1 has-error')
  equal( el.find('[data-name="datetime1"]').closest('.form-group').find('.help-inline').text(), '', 'check datetime1 error message')

});