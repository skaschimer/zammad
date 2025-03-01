# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

class RemoveLastLoginFromHistory722 < ActiveRecord::Migration[4.2]
  def up

    # return if it's a new setup
    return if !Setting.exists?(name: 'system_init_done')

    history_object = History.object_lookup('User')
    return if !history_object

    history_attribute = History.attribute_lookup('last_login')
    return if !history_attribute

    History.where(history_object_id: history_object.id, history_attribute_id: history_attribute.id).delete_all
  end
end
