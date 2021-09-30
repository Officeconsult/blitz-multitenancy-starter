import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { enforceSuperAdminIfNotCurrentOrganization, setDefaultOrganizationId } from "app/core/utils"

const CreateProject = z.object({
  name: z.string(),
  organizationId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateProject), // Ensure user is logged in
  resolver.authorize(),
  // Set input.organizationId to the current organization if one is not set
  // This allows SUPERADMINs to pass in a specific organizationId
  setDefaultOrganizationId,
  // But now we need to enforce input.organizationId matches
  // session.orgId unless user is a SUPERADMIN
  enforceSuperAdminIfNotCurrentOrganization,
  async ({ name, organizationId }) => {
    const project = await db.project.create({ data: { name, organizationId } })

    return project
  }
)
