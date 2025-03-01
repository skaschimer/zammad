# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

class Role < ApplicationModel
  include HasDefaultModelUserRelations

  include CanBeImported
  include HasActivityStreamLog
  include ChecksClientNotification
  include ChecksHtmlSanitized
  include HasGroups
  include HasCollectionUpdate
  include HasSearchIndexBackend
  include CanSelector
  include CanSearch

  include Role::Assets

  has_and_belongs_to_many :users, after_add: :cache_update, after_remove: :cache_update
  has_and_belongs_to_many :permissions,
                          before_add:    %i[validate_agent_limit_by_permission validate_permissions],
                          after_add:     %i[cache_update cache_add_kb_permission],
                          before_remove: :last_admin_check_by_permission,
                          after_remove:  %i[cache_update cache_remove_kb_permission]
  validates               :name, presence: true, uniqueness: { case_sensitive: false }
  store                   :preferences
  has_many                :knowledge_base_permissions, class_name: 'KnowledgeBase::Permission', dependent: :destroy

  before_save    :cleanup_groups_if_not_agent
  before_create  :check_default_at_signup_permissions
  before_update  :last_admin_check_by_attribute, :validate_agent_limit_by_attributes, :check_default_at_signup_permissions

  # workflow checks should run after before_create and before_update callbacks
  include ChecksCoreWorkflow

  core_workflow_screens 'create', 'edit'

  # ignore Users because this will lead to huge
  # results for e.g. the Customer role
  association_attributes_ignored :users

  activity_stream_permission 'admin.role'

  validates :note, length: { maximum: 250 }
  sanitized_html :note

=begin

grant permission to role

  role.permission_grant('permission.key')

=end

  def permission_grant(key)
    permission = Permission.lookup(name: key)
    raise "Invalid permission #{key}" if !permission
    return true if permission_ids.include?(permission.id)

    self.permission_ids = permission_ids.push permission.id
    true
  end

=begin

revoke permission of role

  role.permission_revoke('permission.key')

=end

  def permission_revoke(key)
    permission = Permission.lookup(name: key)
    raise "Invalid permission #{key}" if !permission
    return true if permission_ids.exclude?(permission.id)

    self.permission_ids = self.permission_ids -= [permission.id]
    true
  end

=begin

get signup roles

  Role.signup_roles

returns

  [role1, role2, ...]

=end

  def self.signup_roles
    Role.where(active: true, default_at_signup: true)
  end

=begin

get signup role ids

  Role.signup_role_ids

returns

  [role1, role2, ...]

=end

  def self.signup_role_ids
    signup_roles.map(&:id)
  end

=begin

get all roles with permission

  roles = Role.with_permissions('admin.session')

get all roles with permission "admin.session" or "ticket.agent"

  roles = Role.with_permissions(['admin.session', 'ticket.agent'])

returns

  [role1, role2, ...]

=end

  def self.with_permissions(keys)
    permission_ids = Role.permission_ids_by_name(keys)
    Role.joins(:permissions_roles).joins(:permissions).where(
      'permissions_roles.permission_id IN (?) AND roles.active = ? AND permissions.active = ?', permission_ids, true, true
    ).distinct
  end

=begin

check if roles is with permission

  role = Role.find(123)
  role.with_permission?('admin.session')

get if role has permission of "admin.session" or "ticket.agent"

  role.with_permission?(['admin.session', 'ticket.agent'])

returns

  true | false

=end

  def with_permission?(keys)
    permission_ids = Role.permission_ids_by_name(keys)
    return true if Role.joins(:permissions_roles).joins(:permissions).where(
      'roles.id = ? AND permissions_roles.permission_id IN (?) AND permissions.active = ?', id, permission_ids, true
    ).distinct.count.nonzero?

    false
  end

  def self.permission_ids_by_name(keys)
    Array(keys).each_with_object([]) do |key, result|
      ::Permission.with_parents(key).each do |local_key|
        permission = ::Permission.lookup(name: local_key)
        next if !permission

        result.push permission.id
      end
    end
  end

  private

  def validate_permissions(permission)
    Rails.logger.debug { "self permission: #{permission.id}" }

    raise "Permission #{permission.name} is disabled" if permission.preferences[:disabled]

    permission.preferences[:not]
              &.find { |name| name.in?(permissions.map(&:name)) }
              &.tap { |conflict| raise "Permission #{permission} conflicts with #{conflict}" }

    permissions.find { |p| p.preferences[:not]&.include?(permission.name) }
               &.tap { |conflict| raise "Permission #{permission} conflicts with #{conflict}" }
  end

  def last_admin_check_by_attribute
    return true if !will_save_change_to_attribute?('active')
    return true if active != false
    return true if !with_permission?(['admin', 'admin.user'])
    raise Exceptions::UnprocessableEntity, __('At least one user needs to have admin permissions.') if last_admin_check_admin_count < 1

    true
  end

  def last_admin_check_by_permission(permission)
    return true if Setting.get('import_mode')
    return true if permission.name != 'admin' && permission.name != 'admin.user'
    raise Exceptions::UnprocessableEntity, __('At least one user needs to have admin permissions.') if last_admin_check_admin_count < 1

    true
  end

  def last_admin_check_admin_count
    admin_role_ids = Role.joins(:permissions).where(permissions: { name: ['admin', 'admin.user'], active: true }, roles: { active: true }).where.not(id: id).pluck(:id)
    User.joins(:roles).where(roles: { id: admin_role_ids }, users: { active: true }).distinct.count
  end

  def validate_agent_limit_by_attributes
    return true if Setting.get('system_agent_limit').blank?
    return true if !will_save_change_to_attribute?('active')
    return true if active != true
    return true if !with_permission?('ticket.agent')

    ticket_agent_role_ids = Role.joins(:permissions).where(permissions: { name: 'ticket.agent', active: true }, roles: { active: true }).pluck(:id)
    currents = User.joins(:roles).where(roles: { id: ticket_agent_role_ids }, users: { active: true }).distinct.pluck(:id)
    news = User.joins(:roles).where(roles: { id: id }, users: { active: true }).distinct.pluck(:id)
    count = currents.concat(news).uniq.count
    raise Exceptions::UnprocessableEntity, __('Agent limit exceeded, please check your account settings.') if count > Setting.get('system_agent_limit').to_i

    true
  end

  def validate_agent_limit_by_permission(permission)
    return true if Setting.get('system_agent_limit').blank?
    return true if active != true
    return true if permission.active != true
    return true if permission.name != 'ticket.agent'

    ticket_agent_role_ids = Role.joins(:permissions).where(permissions: { name: 'ticket.agent' }, roles: { active: true }).pluck(:id)
    ticket_agent_role_ids.push(id)
    count = User.joins(:roles).where(roles: { id: ticket_agent_role_ids }, users: { active: true }).distinct.count
    raise Exceptions::UnprocessableEntity, __('Agent limit exceeded, please check your account settings.') if count > Setting.get('system_agent_limit').to_i

    true
  end

  def check_default_at_signup_permissions
    return true if !default_at_signup

    forbidden_permissions = permissions.reject(&:allow_signup)
    return true if forbidden_permissions.blank?

    raise Exceptions::UnprocessableEntity, "Cannot set default at signup when role has #{forbidden_permissions.join(', ')} permissions."
  end

  def cache_add_kb_permission(permission)
    return if !permission.name.starts_with? 'knowledge_base.'
    return if !KnowledgeBase.granular_permissions?

    KnowledgeBase::Category.all.each(&:touch)
  end

  def cache_remove_kb_permission(permission)
    return if !permission.name.starts_with? 'knowledge_base.'
    return if !KnowledgeBase.granular_permissions?

    has_editor = permissions.where(name: 'knowledge_base.editor').any?
    has_reader = permissions.where(name: 'knowledge_base.reader').any?

    KnowledgeBase::Permission
      .where(role: self)
      .each do |elem|
        if !has_editor && !has_reader
          elem.destroy!
        elsif !has_editor && has_reader
          elem.update!(access: 'reader') if elem.access == 'editor'
        end

      end

    KnowledgeBase::Category.all.each(&:touch)
  end

  def cleanup_groups_if_not_agent
    # #with_permissions? SQL-based check does not work on to-be-saved permissions
    # using application-side check instead
    return if permissions.any? { |elem| elem.name == 'ticket.agent' }

    groups.clear
  end
end
