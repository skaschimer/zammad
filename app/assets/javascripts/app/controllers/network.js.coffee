$ = jQuery.sub()
Note = App.Note

$.fn.item = ->
  elementID   = $(@).data('id')
  elementID or= $(@).parents('[data-id]').data('id')
  Note.find(elementID)

class Index extends App.Controller
  events:
    'click [data-type=network-new]':              'network_new'
    'click [data-type=network-edit]':             'network_edit'
    'click [data-type=network-destroy]':          'network_destory'
    'click [data-type=network-category-new]':     'network_category_new'
    'click [data-type=network-category-edit]':    'network_category_edit'
    'click [data-type=network-category-destroy]': 'network_category_destroy'

  constructor: ->
    super
    
    # set title
    @title 'Network'
    @render()
    @navupdate '#network'
    
  render: ->
    networks = App.Network.all()
    network_categories = App.NetworkCategory.all()
    for network in networks
      @log 'f', network    for network in networks

    for network_category in network_categories
      @log 'fc', network_category
      
    @html App.view('network')(
      networks: App.Network.all(),
    )
    
  network_new: (e) ->
    e.preventDefault()
    new App.ControllerGenericNewWindow(
      pageData: {
        object: 'Network',
      },
      genericObject: App.Network,
      success: =>
        @render()
    )
        
  network_edit: (e) ->
    e.preventDefault()
    @id = $(e.target).parents('[data-id]').data('id')
    new App.ControllerGenericEditWindow(
      id: @id,
      pageData: {
        object: 'Network',
      },
      genericObject: App.Network,
      success: =>
        @render()
    )
    
  network_destory: (e) ->
    e.preventDefault()
    id = $(e.target).parents('[data-id]').data('id')
    item = App.Network.find(id)
    item.destroy() if confirm('Sure?')
    @render()


Config.Routes['network'] = Index
