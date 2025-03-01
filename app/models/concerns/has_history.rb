# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

module HasHistory
  extend ActiveSupport::Concern

  included do
    attr_accessor :history_changes_last_done

    after_create  :history_prefill, :history_create, :history_change_source_clear
    after_update  :history_update, :history_change_source_clear
    after_destroy :history_destroy
  end

  def history_prefill
    return if @history_changes_source.blank?

    @history_changes_source.each do |key, value|
      next if !value.is_a?(PostmasterFilter)

      attribute_name  = history_attribute_name(key)
      attribute_value = history_attribute_changes(key, [nil, self[key]])

      data = {
        history_attribute: attribute_name,
      }.merge(attribute_value)

      history_log('set', created_by_id, data)
    end
  end

=begin

log object create history, if configured - will be executed automatically

  model = Model.find(123)
  model.history_create

=end

  def history_create
    history_log('created', created_by_id)
  end

=begin

log object update history with all updated attributes, if configured - will be executed automatically

  model = Model.find(123)
  model.history_update

=end

  def history_update
    return if !saved_changes?

    # return if it's no update
    return if new_record?

    # new record also triggers update, so ignore new records
    changes = saved_changes
    history_changes_last_done&.each do |key, value|
      if changes.key?(key) && changes[key] == value
        changes.delete(key)
      end
    end
    self.history_changes_last_done = changes
    # logger.info 'updated ' + self.changes.inspect

    return if changes['id'] && !changes['id'][0]

    ignored_attributes  = self.class.instance_variable_get(:@history_attributes_ignored) || []
    ignored_attributes += %i[created_at updated_at created_by_id updated_by_id]

    changes.each do |key, value|

      next if ignored_attributes.include?(key.to_sym)

      # get attribute name
      attribute_name  = history_attribute_name(key)
      attribute_value = history_attribute_changes(key, value)

      data = {
        history_attribute: attribute_name,
      }.merge(attribute_value)

      # logger.info "HIST NEW #{self.class.to_s}.find(#{self.id}) #{data.inspect}"
      history_log('updated', updated_by_id, data)
    end
  end

  def history_attribute_name(key)
    attribute_name = key.to_s
    if attribute_name[-3, 3] == '_id'
      attribute_name = attribute_name[ 0, attribute_name.length - 3 ]
    end
    attribute_name
  end

  def history_attribute_changes(key, value_changes)
    attribute_name  = history_attribute_name(key)
    value_id        = []
    value_str       = [ value_changes[0], value_changes[1] ]

    if key.to_s[-3, 3] == '_id'
      value_id[0] = value_changes[0]
      value_id[1] = value_changes[1]

      if respond_to?(attribute_name) && send(attribute_name)
        relation_class = send(attribute_name).class
        if relation_class && value_id[0]
          relation_model = relation_class.lookup(id: value_id[0])
          if relation_model
            if relation_model['name']
              value_str[0] = relation_model['name']
            elsif relation_model.respond_to?(:fullname)
              value_str[0] = relation_model.send(:fullname)
            end
          end
        end
        if relation_class && value_id[1]
          relation_model = relation_class.lookup(id: value_id[1])
          if relation_model
            if relation_model['name']
              value_str[1] = relation_model['name']
            elsif relation_model.respond_to?(:fullname)
              value_str[1] = relation_model.send(:fullname)
            end
          end
        end
      end
    end

    {
      value_from: value_str[0].to_s,
      value_to:   value_str[1].to_s,
      id_from:    value_id[0],
      id_to:      value_id[1],
    }
  end

=begin

delete object history, will be executed automatically

  model = Model.find(123)
  model.history_destroy

=end

  def history_destroy
    History.remove(self.class.to_s, id)
  end

=begin

create history entry for this object

  organization = Organization.find(123)
  result = organization.history_log('created', user_id)

returns

  result = true # false

=end

  def history_log(type, user_id, attributes = {})
    attributes.merge!(
      o_id:                   self['id'],
      history_type:           type,
      history_object:         self.class.name,
      related_o_id:           nil,
      related_history_object: nil,
      created_by_id:          user_id,
      updated_at:             updated_at,
      created_at:             updated_at,
    ).merge!(history_log_attributes)

    if attributes[:sourceable].blank?
      attributes[:sourceable] = @history_changes_source.try(:delete, attributes[:history_attribute]) || @history_changes_source.try(:delete, "#{attributes[:history_attribute]}_id") || @history_changes_source&.dig(type)
    end

    History.add(attributes)
  end

  # callback function to overwrite
  # default history log attributes
  # gets called from history_log
  def history_log_attributes
    {}
  end

=begin

get history log for this object

  organization = Organization.find(123)
  result = organization.history_get

returns

  result = [
    {
      :type          => 'created',
      :object        => 'Organization',
      :created_by_id => 3,
      :created_at    => "2013-08-19 20:41:33",
    },
    {
      :type          => 'updated',
      :object        => 'Organization',
      :attribute     => 'note',
      :o_id          => 1,
      :id_to         => nil,
      :id_from       => nil,
      :value_from    => "some note",
      :value_to      => "some other note",
      :created_by_id => 3,
      :created_at    => "2013-08-19 20:41:33",
    },
  ]

to get history log for this object with all assets

  organization = Organization.find(123)
  result = organization.history_get(true)

returns

  result = {
    :history => [
      { ... },
      { ... },
    ],
    :assets => {
      ...
    }
  }

=end

  def history_get(fulldata = false)
    relation_object = history_relation_object

    if !fulldata
      return History.list(self.class.name, self['id'], relation_object)
    end

    # get related objects
    history = History.list(self.class.name, self['id'], relation_object, true)
    history[:list].each do |item|
      record = item['object'].constantize.lookup(id: item['o_id'])

      if record.present?
        history[:assets] = record.assets(history[:assets])
      end

      next if !item['related_object']

      record = item['related_object'].constantize.lookup(id: item['related_o_id'])
      if record.present?
        history[:assets] = record.assets(history[:assets])
      end
    end
    {
      history: history[:list],
      assets:  history[:assets],
    }
  end

  def history_relation_object
    @history_relation_object ||= self.class.instance_variable_get(:@history_relation_object) || []
  end

  def history_change_source_clear
    @history_changes_source = nil
    @history_changes_source_last = nil
  end

  def history_change_source_attribute(source, attribute)
    return if source.blank?
    return if [Job, Trigger, PostmasterFilter].exclude?(source.class)
    return if !source.persisted?

    @history_changes_source ||= {}
    @history_changes_source[attribute] = source
    @history_changes_source_last       = source
  end

  # methods defined here are going to extend the class, not the instance of it
  class_methods do
=begin

serve method to ignore model attributes in historization

class Model < ApplicationModel
  include HasHistory
  history_attributes_ignored :create_article_type_id, :preferences
end

=end

    def history_attributes_ignored(*attributes)
      @history_attributes_ignored = attributes
    end

=begin

serve method to ignore model attributes in historization

class Model < ApplicationModel
  include HasHistory
  history_relation_object 'Some::Relation::Object'
end

=end

    def history_relation_object(*attributes)
      @history_relation_object ||= []
      @history_relation_object |= attributes
    end
  end
end
