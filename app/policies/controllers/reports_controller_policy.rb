# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

class Controllers::ReportsControllerPolicy < Controllers::ApplicationControllerPolicy
  default_permit!('report')
end
